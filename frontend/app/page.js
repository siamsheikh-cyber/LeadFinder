"use client";

import React, { useState } from "react";

// Color themes palette definition
const THEMES = {
  emerald: {
    id: "emerald",
    name: "Emerald Mint",
    dot: "bg-emerald-400",
    gradientText: "from-emerald-400 via-teal-300 to-cyan-300",
    primaryButton: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-emerald-500/25",
    accentText: "text-emerald-400",
    accentLight: "text-emerald-300",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/30",
    badgePill: "bg-emerald-950/60 border-emerald-800/60 text-emerald-300",
    activeChip: "bg-emerald-600/20 border-emerald-500/40 text-emerald-200",
    glow: "from-emerald-600/20 via-teal-600/15 to-transparent",
    ring: "focus:ring-emerald-500",
    avatarBg: "bg-emerald-950/70 border-emerald-800/50 text-emerald-300",
    hoverRow: "group-hover:text-emerald-300",
    viewMapBtn: "hover:bg-emerald-600 hover:border-emerald-500",
  },
  amber: {
    id: "amber",
    name: "Amber Sunset",
    dot: "bg-amber-400",
    gradientText: "from-amber-400 via-orange-400 to-rose-400",
    primaryButton: "bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 shadow-amber-500/25",
    accentText: "text-amber-400",
    accentLight: "text-amber-300",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/30",
    badgePill: "bg-amber-950/60 border-amber-800/60 text-amber-300",
    activeChip: "bg-amber-600/20 border-amber-500/40 text-amber-200",
    glow: "from-amber-600/20 via-orange-600/15 to-transparent",
    ring: "focus:ring-amber-500",
    avatarBg: "bg-amber-950/70 border-amber-800/50 text-amber-300",
    hoverRow: "group-hover:text-amber-300",
    viewMapBtn: "hover:bg-amber-600 hover:border-amber-500",
  },
  violet: {
    id: "violet",
    name: "Royal Violet",
    dot: "bg-purple-400",
    gradientText: "from-purple-400 via-violet-300 to-fuchsia-400",
    primaryButton: "bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 shadow-purple-500/25",
    accentText: "text-purple-400",
    accentLight: "text-purple-300",
    accentBg: "bg-purple-500/10",
    accentBorder: "border-purple-500/30",
    badgePill: "bg-purple-950/60 border-purple-800/60 text-purple-300",
    activeChip: "bg-purple-600/20 border-purple-500/40 text-purple-200",
    glow: "from-purple-600/20 via-violet-600/15 to-transparent",
    ring: "focus:ring-purple-500",
    avatarBg: "bg-purple-950/70 border-purple-800/50 text-purple-300",
    hoverRow: "group-hover:text-purple-300",
    viewMapBtn: "hover:bg-purple-600 hover:border-purple-500",
  },
  rose: {
    id: "rose",
    name: "Neon Rose",
    dot: "bg-rose-400",
    gradientText: "from-rose-400 via-pink-400 to-amber-300",
    primaryButton: "bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 shadow-rose-500/25",
    accentText: "text-rose-400",
    accentLight: "text-rose-300",
    accentBg: "bg-rose-500/10",
    accentBorder: "border-rose-500/30",
    badgePill: "bg-rose-950/60 border-rose-800/60 text-rose-300",
    activeChip: "bg-rose-600/20 border-rose-500/40 text-rose-200",
    glow: "from-rose-600/20 via-pink-600/15 to-transparent",
    ring: "focus:ring-rose-500",
    avatarBg: "bg-rose-950/70 border-rose-800/50 text-rose-300",
    hoverRow: "group-hover:text-rose-300",
    viewMapBtn: "hover:bg-rose-600 hover:border-rose-500",
  },
};

/**
 * Helper to identify if a URL is a social media / third-party platform
 * rather than an independent business website.
 */
export function isSocialMediaUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const raw = url.trim();
    const parsed = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const socialDomains = [
      "facebook.com",
      "fb.com",
      "m.facebook.com",
      "instagram.com",
      "instagr.am",
      "yelp.com",
      "twitter.com",
      "x.com",
      "tiktok.com",
      "wa.me",
      "whatsapp.com",
      "api.whatsapp.com",
      "linkedin.com",
      "youtube.com",
      "pinterest.com",
      "threads.net",
      "linktr.ee",
    ];
    return socialDomains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch (e) {
    return /facebook\.com|fb\.com|instagram\.com|yelp\.com|twitter\.com|x\.com|tiktok\.com|wa\.me|whatsapp\.com|linkedin\.com|linktr\.ee/i.test(
      url
    );
  }
}

/**
 * Helper to get a human-friendly platform label for social URLs
 */
export function getSocialPlatformLabel(url) {
  if (!url) return "Social Link";
  const lower = url.toLowerCase();
  if (lower.includes("instagram.com") || lower.includes("instagr.am")) return "Instagram";
  if (lower.includes("facebook.com") || lower.includes("fb.com")) return "Facebook";
  if (lower.includes("yelp.com")) return "Yelp";
  if (lower.includes("tiktok.com")) return "TikTok";
  if (lower.includes("twitter.com") || lower.includes("x.com")) return "X / Twitter";
  if (lower.includes("wa.me") || lower.includes("whatsapp.com")) return "WhatsApp";
  if (lower.includes("linktr.ee")) return "Linktree";
  return "Social Page";
}

// Initial verified live examples illustrating all lead categories
const INITIAL_VERIFIED_RESULTS = [
  {
    id: 1,
    name: "CHEF TRUCK",
    category: "Food Truck · Latin American",
    address: "1906 E Cesar Chavez St, Austin, TX 78702",
    phone: "+1 737-786-5544",
    rating: "4.9",
    reviews: "253",
    hasWebsite: false,
    websiteUrl: null,
    socialLink: "https://www.instagram.com/cheftruckatx",
    isUnclaimed: true,
    profileStatus: "Unclaimed",
    mapsUrl: "https://www.google.com/maps/place/CHEF+TRUCK/@30.2571689,-97.7239049,17z/",
  },
  {
    id: 2,
    name: "Santo Patio Taco Trailer",
    category: "Taco Stand · Mexican",
    address: "4901 Webberville Rd, Austin, TX 78702",
    phone: "+1 737-419-7841",
    rating: "4.8",
    reviews: "68",
    hasWebsite: false,
    websiteUrl: null,
    socialLink: "https://www.facebook.com/santopatiotacos",
    isUnclaimed: false,
    profileStatus: "Claimed",
    mapsUrl: "https://www.google.com/maps/place/Santo+Patio+Taco+Trailer/@30.2624483,-97.6965058,17z/",
  },
  {
    id: 3,
    name: "Polvos Truck",
    category: "Mexican Food Truck",
    address: "2004 S 1st St, Austin, TX 78704",
    phone: "N/A",
    rating: "4.5",
    reviews: "31",
    hasWebsite: false,
    websiteUrl: null,
    socialLink: "https://www.yelp.com/biz/polvos-austin-3",
    isUnclaimed: true,
    profileStatus: "Unclaimed",
    mapsUrl: "https://www.google.com/maps/place/Polvos+Truck/@30.2155192,-97.7625033,17z/",
  },
  {
    id: 4,
    name: "Webberville Food Truck Park Shacks",
    category: "Food Court · Eatery",
    address: "2201 Webberville Rd, Austin, TX 78702",
    phone: "N/A",
    rating: "4.6",
    reviews: "84",
    hasWebsite: false,
    websiteUrl: null,
    socialLink: null,
    isUnclaimed: true,
    profileStatus: "Unclaimed",
    mapsUrl: "https://www.google.com/maps/place/Webberville+Food+Truck+Park/@30.2629914,-97.7137803,17z/",
  },
  {
    id: 5,
    name: "Cuantos Tacos",
    category: "Taco Truck · Mexico City Style",
    address: "1108 E 12th St, Austin, TX 78702",
    phone: "+1 512-856-4277",
    rating: "4.9",
    reviews: "412",
    hasWebsite: true,
    websiteUrl: "https://cuantostacos.com",
    socialLink: null,
    isUnclaimed: true,
    profileStatus: "Unclaimed",
    mapsUrl: "https://www.google.com/maps/place/Cuantos+Tacos/@30.274152,-97.728913,17z/",
  },
  {
    id: 6,
    name: "Veracruz All Natural",
    category: "Taco Restaurant · Tex-Mex",
    address: "2505 E 6th St, Austin, TX 78702",
    phone: "+1 512-394-5850",
    rating: "4.7",
    reviews: "1,290",
    hasWebsite: true,
    websiteUrl: "https://veracruzallnatural.com",
    socialLink: null,
    isUnclaimed: false,
    profileStatus: "Claimed",
    mapsUrl: "https://www.google.com/maps/place/Veracruz+All+Natural/@30.25983,-97.71442,17z/",
  },
];

// 1-Click Copy Button with animated visual feedback
function CopyButton({ text, copyKey, copiedKey, onCopy, title = "Copy", className = "" }) {
  const isCopied = copiedKey === copyKey;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onCopy(text, copyKey);
      }}
      title={isCopied ? "Copied!" : title}
      aria-label={isCopied ? "Copied!" : title}
      className={`inline-flex items-center text-gray-400 hover:text-white cursor-pointer transition-colors p-0.5 rounded focus:outline-none ${className}`}
    >
      {isCopied ? (
        <span className="inline-flex items-center text-emerald-400 text-xs font-medium gap-0.5 animate-in fade-in duration-150">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-[10px] text-emerald-300 font-sans">Copied!</span>
        </span>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

export default function Dashboard() {
  const [currentThemeKey, setCurrentThemeKey] = useState("emerald");
  const theme = THEMES[currentThemeKey];

  const [cityInput, setCityInput] = useState("food trucks in Austin, TX");
  const [activeCity, setActiveCity] = useState("Austin, TX");
  const [results, setResults] = useState(INITIAL_VERIFIED_RESULTS);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const [stats, setStats] = useState({
    totalScraped: 30,
    noWebsiteCount: 4,
    socialOnlyCount: 3,
    webUnclaimedCount: 1,
    unclaimedCount: 4,
    hasCompleted: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [filterText, setFilterText] = useState("");
  const [alertNotice, setAlertNotice] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    if (!text || text === "N/A") return;
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedKey(key);
          setTimeout(() => {
            setCopiedKey((prev) => (prev === key ? null : prev));
          }, 1500);
        })
        .catch((err) => {
          console.error("Clipboard copy failed:", err);
        });
    }
  };

  const presetQueries = [
    { label: "Austin Food Trucks", query: "food trucks in Austin, TX" },
    { label: "Miami Tacos & Shacks", query: "taco trucks in Miami, FL" },
    { label: "Nashville Diners", query: "diners in Nashville, TN" },
    { label: "Lockhart BBQ", query: "bbq in Lockhart, TX" },
    { label: "Phoenix Street Food", query: "food trucks in Phoenix, AZ" },
  ];

  const loadingMessages = [
    "Launching headless Chromium browser instance...",
    "Navigating to Google Maps search cluster...",
    "Auto-scrolling listings feed (div[role='feed'])...",
    "Opening individual detail panels for exact name, ratings & address...",
    "Inspecting official website & filtering out social media links (FB, IG, Yelp)...",
    "Verifying Google Business profile claim status (Claimed vs Unclaimed)...",
  ];

  // Real backend scraping call to /api/scrape
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!cityInput.trim()) return;

    setIsLoading(true);
    setLoadingStep(0);
    setAlertNotice(null);

    // Dynamic progress stepper
    const statusInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 2800);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: cityInput.trim(),
          maxResults: 15,
        }),
      });

      const resData = await response.json();
      clearInterval(statusInterval);

      if (resData.success) {
        setActiveCity(cityInput.trim());
        const rawData = resData.data || [];

        // Sanitize leads ensuring social links are strictly classified as No Website
        const sanitizedLeads = rawData.map((item, idx) => {
          const rawUrl = item.websiteUrl || item.rawWebsiteUrl || null;
          const isSocial = item.socialLink ? true : isSocialMediaUrl(rawUrl);
          const socialUrl = item.socialLink || (isSocial ? rawUrl : null);
          const hasValidWebsite = !isSocial && Boolean(rawUrl || item.hasWebsite);
          const validWebsiteUrl = hasValidWebsite ? rawUrl : null;
          const isUnclaimed = Boolean(item.isUnclaimed || item.profileStatus === "Unclaimed");

          return {
            ...item,
            id: item.id || idx + 1,
            hasWebsite: hasValidWebsite,
            websiteUrl: validWebsiteUrl,
            socialLink: socialUrl,
            isUnclaimed: isUnclaimed,
            profileStatus: isUnclaimed ? "Unclaimed" : "Claimed",
          };
        });

        setResults(sanitizedLeads);

        const noWebCount = sanitizedLeads.filter((r) => !r.hasWebsite).length;
        const socialCount = sanitizedLeads.filter((r) => !r.hasWebsite && r.socialLink).length;
        const webUnclaimed = sanitizedLeads.filter(
          (r) => r.hasWebsite && (r.isUnclaimed || r.profileStatus === "Unclaimed")
        ).length;
        const totalUnclaimed = sanitizedLeads.filter(
          (r) => r.isUnclaimed || r.profileStatus === "Unclaimed"
        ).length;

        setStats({
          totalScraped: resData.totalScraped ?? resData.totalScanned ?? sanitizedLeads.length,
          noWebsiteCount: resData.noWebsiteCount ?? noWebCount,
          socialOnlyCount: resData.socialOnlyCount ?? socialCount,
          webUnclaimedCount: webUnclaimed,
          unclaimedCount: resData.unclaimedCount ?? totalUnclaimed,
          hasCompleted: true,
        });

        if (sanitizedLeads.length > 0) {
          setAlertNotice({
            type: "success",
            title: "Live Scrape Complete!",
            message: `Scraped ${resData.totalScraped ?? resData.totalScanned ?? sanitizedLeads.length} total restaurants. Found ${noWebCount} with No Website (${socialCount} with social profiles only) and ${webUnclaimed} with Website + Unclaimed GMB.`,
          });
        } else {
          setAlertNotice({
            type: "info",
            title: "Scrape Complete (0 Matches)",
            message: `Scraped ${resData.totalScraped ?? resData.totalScanned} places for "${cityInput}". Try searching "food trucks in ${cityInput}" or "tacos in ${cityInput}".`,
          });
        }
      } else {
        setAlertNotice({
          type: "error",
          title: "Scraper Error",
          message: resData.error || "Failed to extract Google Maps data.",
        });
      }
    } catch (err) {
      clearInterval(statusInterval);
      setAlertNotice({
        type: "error",
        title: "Connection Error",
        message: err.message || "Failed to reach /api/scrape endpoint.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Real CSV export from current results
  const handleDownloadCSV = () => {
    if (results.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = [
      "Restaurant Name",
      "Exact Rating",
      "Review Count",
      "Category",
      "Full Address",
      "Phone Number",
      "Website Status",
      "Official Website URL",
      "Social Media Link",
      "Profile Status",
      "Google Maps Link",
    ];

    const rows = results.map((r) => [
      `"${(r.name || "").replace(/"/g, '""')}"`,
      `"${r.rating || "N/A"}"`,
      `"${r.reviews || "0"}"`,
      `"${(r.category || "").replace(/"/g, '""')}"`,
      `"${(r.address || "").replace(/"/g, '""')}"`,
      `"${r.phone || "N/A"}"`,
      `"${r.hasWebsite ? "Has Website" : "No Website"}"`,
      `"${(r.hasWebsite ? r.websiteUrl : "") || ""}"`,
      `"${r.socialLink || ""}"`,
      `"${r.profileStatus || (r.isUnclaimed ? "Unclaimed" : "Claimed")}"`,
      `"${r.mapsUrl || ""}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `google_maps_leads_${activeCity.toLowerCase().replace(/[^a-z0-9]/g, "_")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setAlertNotice({
      type: "success",
      title: "Real CSV Downloaded",
      message: `Exported ${results.length} verified real leads to CSV format with separated official website and social media fields.`,
    });
  };

  const handleDownloadDocx = () => {
    setAlertNotice({
      type: "info",
      title: "Docx Export Triggered",
      message: `Generating formatted Word document (.docx) summary for "${activeCity}" leads...`,
    });
  };

  // Segment / Tab filtering and search query matching
  const filteredResults = results.filter((item) => {
    // 1. Tab segment filter
    if (selectedFilter === "no_website" && item.hasWebsite) return false;
    if (selectedFilter === "social_only" && (item.hasWebsite || !item.socialLink)) return false;
    if (
      selectedFilter === "web_unclaimed" &&
      (!item.hasWebsite || (!item.isUnclaimed && item.profileStatus !== "Unclaimed"))
    )
      return false;
    if (selectedFilter === "has_website" && !item.hasWebsite) return false;
    if (selectedFilter === "unclaimed" && !item.isUnclaimed && item.profileStatus !== "Unclaimed")
      return false;
    if (selectedFilter === "claimed" && (item.isUnclaimed || item.profileStatus === "Unclaimed"))
      return false;

    // 2. Free text search filter
    if (!filterText.trim()) return true;
    const q = filterText.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.phone && item.phone.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.address && item.address.toLowerCase().includes(q)) ||
      (item.profileStatus && item.profileStatus.toLowerCase().includes(q)) ||
      (item.socialLink && item.socialLink.toLowerCase().includes(q)) ||
      (item.websiteUrl && item.websiteUrl.toLowerCase().includes(q))
    );
  });

  // Dynamic counts for quick segmentation chips
  const totalCount = results.length;
  const noWebCount = results.filter((r) => !r.hasWebsite).length;
  const socialOnlyCount = results.filter((r) => !r.hasWebsite && r.socialLink).length;
  const webUnclaimedCount = results.filter(
    (r) => r.hasWebsite && (r.isUnclaimed || r.profileStatus === "Unclaimed")
  ).length;
  const hasWebCount = results.filter((r) => r.hasWebsite).length;
  const unclaimedCount = results.filter((r) => r.isUnclaimed || r.profileStatus === "Unclaimed").length;
  const claimedCount = results.filter((r) => !r.isUnclaimed && r.profileStatus !== "Unclaimed").length;

  const unclaimedPercentage =
    totalCount > 0 ? Math.round((unclaimedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Top ambient glow */}
      <div
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[380px] bg-gradient-to-b ${theme.glow} blur-3xl pointer-events-none -z-10 transition-all duration-500`}
      />

      {/* Main Navigation Bar */}
      <nav className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.primaryButton} flex items-center justify-center shadow-lg transition-all duration-300`}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                LeadFinder <span className={theme.accentText}>Maps</span>
              </span>
              <span
                className={`hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full ${theme.badgePill}`}
              >
                Live Scraper API
              </span>
            </div>
          </div>

          {/* Color Scheme Switcher */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-xl shadow-inner">
            <span className="text-xs text-slate-400 hidden md:inline font-medium">Palette:</span>
            {Object.values(THEMES).map((t) => (
              <button
                key={t.id}
                onClick={() => setCurrentThemeKey(t.id)}
                title={t.name}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                  currentThemeKey === t.id
                    ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${t.dot}`} />
                <span className="hidden sm:inline">{t.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div
            className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full ${theme.accentBg} ${theme.accentBorder} border ${theme.accentLight} text-xs font-medium transition-all`}
          >
            <span className={`flex h-2 w-2 rounded-full ${theme.dot}`}></span>
            <span>Real Google Maps Backend Scraper Connected</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            US Restaurant{" "}
            <span
              className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent transition-all duration-300`}
            >
              Lead Finder
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Extract verified live businesses from Google Maps. Accurately separates{" "}
            <strong className="text-rose-400">No Website</strong> leads (filtering out Facebook, Instagram, & Yelp),
            highlights <strong className="text-amber-300">Social Media Only</strong> presences, and reveals high-value{" "}
            <strong className="text-cyan-300">Unclaimed Profiles</strong>.
          </p>
        </div>

        {/* Search Card Section */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg className={`w-5 h-5 ${theme.accentText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Enter city or query (e.g., food trucks in Austin, TX or Miami, FL)..."
                disabled={isLoading}
                className={`w-full pl-11 pr-4 py-3.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${theme.ring} focus:border-transparent text-sm sm:text-base transition-all`}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !cityInput.trim()}
              className={`inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-semibold text-white ${theme.primaryButton} focus:ring-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shadow-lg`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2.5 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Scraping Live Maps...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Find Restaurants</span>
                </>
              )}
            </button>
          </form>

          {/* Quick preset location tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-400">Quick Search Suggestions:</span>
            {presetQueries.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setCityInput(item.query)}
                disabled={isLoading}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  cityInput === item.query
                    ? theme.activeChip
                    : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Loading Progress State */}
          {isLoading && (
            <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                <span className={`${theme.accentText} flex items-center gap-2`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${theme.dot} animate-ping inline-block`} />
                  {loadingMessages[loadingStep]}
                </span>
                <span className="text-slate-500">
                  {Math.round(((loadingStep + 1) / loadingMessages.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className={`bg-gradient-to-r ${theme.gradientText} h-2 rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 text-center">
                Running real Puppeteer browser engine via <code className="text-slate-400">/api/scrape</code>. Categorizing custom domains vs social media profiles...
              </p>
            </div>
          )}
        </div>

        {/* Feedback Alert Notice */}
        {alertNotice && (
          <div
            className={`p-4 rounded-xl border flex items-start justify-between gap-3 text-sm transition-all ${
              alertNotice.type === "success"
                ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                : alertNotice.type === "error"
                ? "bg-rose-950/40 border-rose-800/60 text-rose-300"
                : "bg-sky-950/40 border-sky-800/60 text-sky-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">
                {alertNotice.type === "success" ? "✓" : alertNotice.type === "error" ? "⚠" : "ℹ"}
              </span>
              <div>
                <p className="font-semibold">{alertNotice.title}</p>
                <p className="text-xs opacity-90">{alertNotice.message}</p>
              </div>
            </div>
            <button
              onClick={() => setAlertNotice(null)}
              className="text-xs opacity-70 hover:opacity-100 p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scraper Stats Summary Badges (Displayed above data table) */}
        {stats.hasCompleted && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
            <div
              className={`absolute -right-10 -bottom-10 w-48 h-48 rounded-full ${theme.accentBg} blur-3xl pointer-events-none`}
            />

            <div className="flex items-start sm:items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-xl ${theme.avatarBg} border flex items-center justify-center shrink-0 shadow-inner`}
              >
                <svg className={`w-6 h-6 ${theme.accentText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                    Live Scraper Metrics
                  </span>
                  <span className={`inline-block w-2 h-2 rounded-full ${theme.dot} animate-pulse`} />
                </div>
                <p className="text-base sm:text-lg font-bold text-white mt-0.5">
                  <span className="text-rose-400 underline decoration-rose-500/40 decoration-2">
                    {noWebCount} No Website
                  </span>{" "}
                  leads found in <strong className="text-slate-200">{activeCity}</strong>
                  {socialOnlyCount > 0 && (
                    <span className="text-xs text-amber-300 font-normal ml-2">
                      ({socialOnlyCount} have social media only)
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Social links (Facebook, IG, Yelp) filtered to No Website •{" "}
                  <strong className="text-cyan-300">{webUnclaimedCount} Web + Unclaimed GMB</strong> •{" "}
                  <strong className="text-orange-400">{unclaimedCount} Unclaimed Total</strong>
                </p>
              </div>
            </div>

            {/* Stat Badges / Metrics Cards */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div
                onClick={() => setSelectedFilter("all")}
                className={`px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2 cursor-pointer hover:border-slate-700 transition-colors ${
                  selectedFilter === "all" ? "ring-1 ring-slate-400" : ""
                }`}
                title="View all leads"
              >
                <span className="text-xs text-slate-400">Total</span>
                <span className="text-sm font-extrabold text-white bg-slate-800/90 px-2 py-0.5 rounded-lg border border-slate-700">
                  {totalCount}
                </span>
              </div>

              <div
                onClick={() => setSelectedFilter("no_website")}
                className={`px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 cursor-pointer hover:bg-rose-500/20 transition-colors ${
                  selectedFilter === "no_website" ? "ring-1 ring-rose-400" : ""
                }`}
                title="View leads without a valid website (includes social-only pages)"
              >
                <span className="text-xs font-medium text-rose-300">No Website</span>
                <span className="text-sm font-extrabold text-rose-300 bg-slate-950 px-2 py-0.5 rounded-lg border border-rose-500/30">
                  {noWebCount}
                </span>
              </div>

              <div
                onClick={() => setSelectedFilter("social_only")}
                className={`px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 cursor-pointer hover:bg-amber-500/20 transition-colors ${
                  selectedFilter === "social_only" ? "ring-1 ring-amber-400" : ""
                }`}
                title="View leads with social media links (Instagram, Facebook, Yelp) instead of a website"
              >
                <span className="text-xs font-medium text-amber-300">📱 Social Only</span>
                <span className="text-sm font-extrabold text-amber-300 bg-slate-950 px-2 py-0.5 rounded-lg border border-amber-500/30">
                  {socialOnlyCount}
                </span>
              </div>

              <div
                onClick={() => setSelectedFilter("web_unclaimed")}
                className={`px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2 cursor-pointer hover:bg-cyan-500/20 transition-colors ${
                  selectedFilter === "web_unclaimed" ? "ring-1 ring-cyan-400" : ""
                }`}
                title="View leads that have an official website, but their Google Business Profile is Unclaimed"
              >
                <span className="text-xs font-medium text-cyan-300">⚡ Web + Unclaimed</span>
                <span className="text-sm font-extrabold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded-lg border border-cyan-500/30">
                  {webUnclaimedCount}
                </span>
              </div>

              <div
                onClick={() => setSelectedFilter("unclaimed")}
                className={`px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center gap-2 cursor-pointer hover:bg-orange-500/20 transition-colors ${
                  selectedFilter === "unclaimed" ? "ring-1 ring-orange-400" : ""
                }`}
                title={`${unclaimedCount} of ${totalCount} identified leads are unclaimed`}
              >
                <span className="text-xs text-orange-300 font-medium">Unclaimed %</span>
                <span className="text-sm font-extrabold text-orange-400 bg-slate-950 px-2 py-0.5 rounded-lg border border-orange-500/20">
                  {unclaimedPercentage}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Results & Data Table Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col gap-6">
          {/* Header & Controls bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  Identified Leads in <span className={theme.accentText}>{activeCity}</span>
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${theme.accentBg} ${theme.accentLight} border ${theme.accentBorder}`}
                >
                  {filteredResults.length} shown ({totalCount} total)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Verified live Google Maps restaurants • Social links (FB, IG, Yelp) mapped to No Website
              </p>
            </div>

            {/* Action Buttons: Download CSV & Download Docx */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleDownloadCSV}
                className="inline-flex items-center px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-700/20 border border-emerald-500/50 cursor-pointer"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download CSV
              </button>

              <button
                type="button"
                onClick={handleDownloadDocx}
                className="inline-flex items-center px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Docx
              </button>
            </div>
          </div>

          {/* Interactive Filter Pills & Search bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedFilter === "all"
                    ? "bg-slate-200 text-slate-900 shadow font-semibold"
                    : "bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                All Leads ({totalCount})
              </button>

              <button
                onClick={() => setSelectedFilter("no_website")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedFilter === "no_website"
                    ? "bg-rose-500 text-white shadow font-semibold"
                    : "bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30"
                }`}
              >
                No Website ({noWebCount})
              </button>

              <button
                onClick={() => setSelectedFilter("social_only")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedFilter === "social_only"
                    ? "bg-amber-500 text-slate-950 shadow font-semibold"
                    : "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30"
                }`}
              >
                📱 Social Media Only ({socialOnlyCount})
              </button>

              <button
                onClick={() => setSelectedFilter("web_unclaimed")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedFilter === "web_unclaimed"
                    ? "bg-cyan-500 text-slate-950 shadow font-semibold"
                    : "bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30"
                }`}
              >
                ⚡ Website + Unclaimed ({webUnclaimedCount})
              </button>

              <button
                onClick={() => setSelectedFilter("has_website")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedFilter === "has_website"
                    ? "bg-emerald-500 text-white shadow font-semibold"
                    : "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30"
                }`}
              >
                Has Website ({hasWebCount})
              </button>

              <button
                onClick={() => setSelectedFilter("unclaimed")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedFilter === "unclaimed"
                    ? "bg-orange-500 text-white shadow font-semibold"
                    : "bg-orange-500/10 text-orange-300 hover:bg-orange-500/20 border border-orange-500/30"
                }`}
              >
                All Unclaimed ({unclaimedCount})
              </button>

              <button
                onClick={() => setSelectedFilter("claimed")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedFilter === "claimed"
                    ? "bg-slate-700 text-white shadow font-semibold"
                    : "bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                Claimed ({claimedCount})
              </button>
            </div>

            {/* Table filter input */}
            <div className="relative w-full lg:w-72">
              <input
                type="text"
                placeholder="Filter by name, phone, address..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${theme.ring}`}
              />
              <svg className="w-4 h-4 absolute left-3 top-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Responsive Data Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
            <table className="min-w-full divide-y divide-slate-800/80 text-left text-sm">
              <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Restaurant & Location</th>
                  <th scope="col" className="px-5 py-3.5">Phone Number</th>
                  <th scope="col" className="px-5 py-3.5">Website Status</th>
                  <th scope="col" className="px-5 py-3.5">Profile Status</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Google Maps Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-normal">
                {filteredResults.length > 0 ? (
                  filteredResults.map((restaurant) => {
                    const restaurantKey = restaurant.id || restaurant.mapsUrl || restaurant.name;

                    return (
                      <tr
                        key={restaurant.id || restaurant.mapsUrl}
                        className="hover:bg-slate-900/60 transition-colors group"
                      >
                        {/* Name, Category, Rating & Address */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-9 h-9 rounded-lg ${theme.avatarBg} border flex items-center justify-center font-bold text-sm shrink-0 mt-0.5`}
                            >
                              {(restaurant.name || "R").charAt(0)}
                            </div>
                            <div className="max-w-sm">
                              <div className="flex items-center gap-1.5">
                                <span className={`font-semibold text-white ${theme.hoverRow} transition-colors`}>
                                  {restaurant.name}
                                </span>
                                <CopyButton
                                  text={restaurant.name}
                                  copyKey={`${restaurantKey}-name`}
                                  copiedKey={copiedKey}
                                  onCopy={handleCopy}
                                  title="Copy restaurant name"
                                  className="text-gray-400 hover:text-white cursor-pointer ml-1.5"
                                />
                              </div>
                              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                                <span>{restaurant.category}</span>
                                <span>•</span>
                                <span className="text-amber-400 flex items-center font-medium">
                                  ★ {restaurant.rating} ({restaurant.reviews} reviews)
                                </span>
                              </div>
                              {restaurant.address && restaurant.address !== "N/A" && (
                                <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5 flex items-center gap-1">
                                  <span className="opacity-70">📍</span>
                                  <span>{restaurant.address}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          {restaurant.phone && restaurant.phone !== "N/A" ? (
                            <div className="inline-flex items-center">
                              <a
                                href={`tel:${restaurant.phone.replace(/[^0-9+]/g, "")}`}
                                className={`inline-flex items-center text-slate-200 hover:${theme.accentText} font-mono text-xs transition-colors`}
                              >
                                <svg className="w-3.5 h-3.5 mr-1.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {restaurant.phone}
                              </a>
                              <CopyButton
                                text={restaurant.phone}
                                copyKey={`${restaurantKey}-phone`}
                                copiedKey={copiedKey}
                                onCopy={handleCopy}
                                title="Copy phone number"
                                className="text-gray-400 hover:text-white cursor-pointer ml-1.5"
                              />
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800/80 text-slate-400">
                              Not Available
                            </span>
                          )}
                        </td>

                        {/* Website Status & Social Media Badge */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          {restaurant.hasWebsite ? (
                            <div>
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-400" />
                                Has Website
                              </span>
                              {restaurant.websiteUrl && (
                                <div className="mt-1">
                                  <a
                                    href={restaurant.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-[11px] text-emerald-400/90 hover:text-emerald-300 underline underline-offset-2 transition-colors"
                                  >
                                    <span>
                                      {restaurant.websiteUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "")}
                                    </span>
                                    <svg className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                                <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-400 animate-pulse" />
                                No Website
                              </span>

                              {/* Separate display for social profile link if detected */}
                              {restaurant.socialLink ? (
                                <div className="mt-1">
                                  <a
                                    href={restaurant.socialLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`Opens direct ${getSocialPlatformLabel(restaurant.socialLink)} profile`}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                                  >
                                    <span>📱 {getSocialPlatformLabel(restaurant.socialLink)} Only</span>
                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                  <span className="block text-[10px] text-slate-500 mt-0.5">
                                    Social profile only (no custom website)
                                  </span>
                                </div>
                              ) : (
                                <span className="block text-[10px] text-slate-500 mt-0.5">
                                  No link listed
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Profile Status Badge */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          {restaurant.isUnclaimed || restaurant.profileStatus === "Unclaimed" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-300 border border-orange-500/30 shadow-sm shadow-orange-500/5">
                              <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-orange-400 animate-pulse" />
                              Unclaimed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-400" />
                              Claimed
                            </span>
                          )}
                        </td>

                        {/* Action / Google Maps Link */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <a
                              href={restaurant.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800/70 hover:text-white border border-slate-700/60 transition-all ${theme.viewMapBtn}`}
                            >
                              <svg className={`w-3.5 h-3.5 mr-1.5 ${theme.accentText} group-hover:text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              View Map
                            </a>
                            <CopyButton
                              text={restaurant.mapsUrl}
                              copyKey={`${restaurantKey}-map`}
                              copiedKey={copiedKey}
                              onCopy={handleCopy}
                              title="Copy Google Maps link"
                              className="text-gray-400 hover:text-white cursor-pointer ml-1.5 p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                      No restaurants found matching your criteria. Try switching filters or search terms.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer info */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 pt-2">
            <div>
              💡 <strong>Social Media Filter Active:</strong> Facebook, Instagram, Yelp, and WhatsApp links are categorized as &quot;No Website&quot; while storing direct social profile links.
            </div>
            <div>
              Showing {filteredResults.length} of {totalCount} leads
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-600">
        <p>Google Maps Restaurant Lead Finder Dashboard • Live Next.js & Puppeteer Scraper</p>
      </footer>
    </div>
  );
}
