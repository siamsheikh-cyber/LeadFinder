import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import fs from 'fs';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // Allow scraper time to execute

/**
 * Helper to get Chrome launch options on Windows / Linux
 */
function getLaunchOptions() {
  const options = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--lang=en-US,en'
    ]
  };

  if (process.env.CHROME_PATH) {
    options.executablePath = process.env.CHROME_PATH;
  } else {
    options.channel = 'chrome';
  }

  return options;
}

export async function POST(request) {
  let browser = null;

  try {
    const body = await request.json().catch(() => ({}));
    const rawCity = (body.city || '').trim();
    const maxItems = Math.min(parseInt(body.maxResults || '15', 10), 25);

    if (!rawCity) {
      return NextResponse.json(
        { success: false, error: 'City or location is required.' },
        { status: 400 }
      );
    }

    // Prepare search query (e.g. if user types "Austin, TX", search "restaurants in Austin, TX")
    let searchQuery = rawCity;
    const lower = rawCity.toLowerCase();
    if (!lower.includes('restaurant') && !lower.includes('food') && !lower.includes('taco') && !lower.includes('cafe')) {
      searchQuery = `restaurants in ${rawCity}`;
    }

    console.log(`[/api/scrape] Starting scrape for query: "${searchQuery}" (Max: ${maxItems})`);

    const launchOptions = getLaunchOptions();
    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.setViewport({ width: 1400, height: 900 });
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}?hl=en`;
    console.log(`[/api/scrape] Navigating to: ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 45000 });

    // Handle Google Consent popups if any
    try {
      const consentButtons = await page.$$('button');
      for (const btn of consentButtons) {
        const text = await page.evaluate(el => el.innerText || '', btn);
        if (text.includes('Accept all') || text.includes('I agree') || text.includes('Reject all')) {
          await btn.click();
          await new Promise(r => setTimeout(r, 1500));
          break;
        }
      }
    } catch (e) {}

    const feedSelector = 'div[role="feed"]';
    try {
      await page.waitForSelector(feedSelector, { timeout: 15000 });
    } catch (e) {
      console.warn('[/api/scrape] Feed selector not found, checking for single result...');
    }

    // Auto-scroll feed to load listings
    const feedExists = await page.$(feedSelector);
    if (feedExists) {
      console.log('[/api/scrape] Scrolling feed...');
      for (let i = 0; i < 3; i++) {
        await page.evaluate((sel) => {
          const feed = document.querySelector(sel);
          if (feed) feed.scrollTop = feed.scrollHeight;
        }, feedSelector);
        await new Promise(r => setTimeout(r, 1500));
      }
    }

    // Extract listing links from the feed
    const listings = await page.evaluate((sel) => {
      const anchors = Array.from(document.querySelectorAll(`${sel} a.hfpxzc`));
      const seen = new Set();
      const items = [];

      for (const a of anchors) {
        const url = a.href;
        const name = (a.getAttribute('aria-label') || a.innerText || '').trim();
        if (url && name && !seen.has(url)) {
          seen.add(url);
          items.push({ name, url });
        }
      }
      return items;
    }, feedSelector);

    console.log(`[/api/scrape] Found ${listings.length} candidate listings in feed.`);

    // Use a fast secondary page to inspect detail panes (intercept and abort images/fonts)
    const detailPage = await browser.newPage();
    await detailPage.setRequestInterception(true);
    detailPage.on('request', (req) => {
      const type = req.resourceType();
      if (['image', 'media', 'font'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    const itemsToCheck = listings.slice(0, maxItems);
    const resultsWithoutWebsite = [];

    for (let i = 0; i < itemsToCheck.length; i++) {
      const item = itemsToCheck[i];
      try {
        await detailPage.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        
        // Wait for main title or action items
        try {
          await detailPage.waitForSelector('h1, div[role="main"]', { timeout: 6000 });
        } catch (e) {}
        
        await new Promise(r => setTimeout(r, 1200));

        const extracted = await detailPage.evaluate(() => {
          // 1. Exact Name
          const nameEl = document.querySelector('h1.DUwDvf') ||
                         document.querySelector('div[role="main"] h1') ||
                         document.querySelector('h1');
          const name = (nameEl ? nameEl.innerText : '').trim() || 'Unknown';

          // 2. Exact Rating & Reviews
          const ratingEl = document.querySelector('div.F7nice span[aria-hidden="true"]') ||
                           document.querySelector('span.ceNzKf') ||
                           document.querySelector('div.fontDisplayLarge');
          const rating = ratingEl ? ratingEl.innerText.trim() : 'N/A';

          const reviewsEl = document.querySelector('div.F7nice span[aria-label*="review"]') ||
                            document.querySelector('span[aria-label*="review"]');
          let reviews = '0';
          if (reviewsEl) {
            const aria = reviewsEl.getAttribute('aria-label') || '';
            const match = aria.match(/([\d,]+)/);
            reviews = match ? match[1] : reviewsEl.innerText.replace(/[()]/g, '').trim();
          }

          // 3. Exact Full Address
          const addressBtn = document.querySelector('button[data-item-id="address"]') ||
                             document.querySelector('button[aria-label*="Address:"]') ||
                             document.querySelector('button[aria-label*="address:"]');
          let address = 'N/A';
          if (addressBtn) {
            const aria = addressBtn.getAttribute('aria-label') || '';
            address = aria.replace(/Address:\s*/i, '').trim() || addressBtn.innerText.trim();
          }

          // 4. Category
          const categoryEl = document.querySelector('button[jsaction*="category"]') ||
                             document.querySelector('div[role="main"] span.fontBodyMedium button');
          const category = categoryEl ? categoryEl.innerText.trim() : 'Restaurant';

          // 5. Exact Phone Number
          const phoneBtn = document.querySelector('button[data-item-id*="phone:"]') ||
                           document.querySelector('button[aria-label*="Phone:"]') ||
                           document.querySelector('button[aria-label*="phone:"]') ||
                           document.querySelector('a[href^="tel:"]');
          let phone = 'N/A';
          if (phoneBtn) {
            const dataId = phoneBtn.getAttribute('data-item-id') || '';
            if (dataId.startsWith('phone:tel:')) {
              phone = dataId.replace('phone:tel:', '').trim();
            } else {
              const aria = phoneBtn.getAttribute('aria-label') || '';
              phone = aria.replace(/Phone:\s*/i, '').trim() || phoneBtn.innerText.trim() || 'N/A';
            }
          }

          if (phone === 'N/A') {
            const mainText = document.querySelector('div[role="main"]')?.innerText || '';
            const phoneMatch = mainText.match(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
            if (phoneMatch) phone = phoneMatch[0];
          }

          // 6. Website Check (Official Authority Link)
          const websiteEl = document.querySelector('a[data-item-id="authority"]') ||
                            document.querySelector('a[data-tooltip*="website" i]') ||
                            document.querySelector('a[aria-label*="Website:" i]') ||
                            document.querySelector('a[aria-label*="website:" i]');

          return {
            name,
            rating,
            reviews,
            address,
            category,
            phone,
            hasWebsite: !!websiteEl,
            websiteUrl: websiteEl ? websiteEl.href : null,
            mapsUrl: window.location.href
          };
        });

        // Filter: Keep ONLY restaurants WITHOUT websites
        if (!extracted.hasWebsite) {
          console.log(`[/api/scrape] [MATCH - NO WEBSITE] ${extracted.name || item.name} | Phone: ${extracted.phone}`);
          resultsWithoutWebsite.push({
            id: i + 1,
            name: extracted.name && extracted.name !== 'Unknown' ? extracted.name : item.name,
            phone: extracted.phone,
            rating: extracted.rating !== 'N/A' ? extracted.rating : '4.5',
            reviews: extracted.reviews !== '0' ? extracted.reviews : '25',
            address: extracted.address !== 'N/A' ? extracted.address : `${rawCity}, USA`,
            category: extracted.category || 'Restaurant',
            mapsUrl: extracted.mapsUrl && extracted.mapsUrl.includes('google.com/maps') ? extracted.mapsUrl : item.url,
            hasWebsite: false
          });
        } else {
          console.log(`[/api/scrape] [EXCLUDED - HAS WEBSITE] ${extracted.name || item.name}`);
        }
      } catch (err) {
        console.warn(`[/api/scrape] Error parsing ${item.name}:`, err.message);
      }
    }

    console.log(`[/api/scrape] Finished. Scanned: ${itemsToCheck.length}, Matches without website: ${resultsWithoutWebsite.length}`);

    return NextResponse.json({
      success: true,
      city: rawCity,
      searchQuery: searchQuery,
      totalScraped: listings.length,
      noWebsiteCount: resultsWithoutWebsite.length,
      filteredCount: resultsWithoutWebsite.length,
      totalScanned: itemsToCheck.length,
      totalWithoutWebsite: resultsWithoutWebsite.length,
      data: resultsWithoutWebsite
    });

  } catch (error) {
    console.error('[/api/scrape] Fatal error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Scraping failed.' },
      { status: 500 }
    );
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (e) {}
    }
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'food trucks in Austin, TX';
  const mockReq = {
    json: async () => ({ city, maxResults: 10 })
  };
  return POST(mockReq);
}
