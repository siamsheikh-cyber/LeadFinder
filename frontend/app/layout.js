import "./globals.css";

export const metadata = {
  title: "US Restaurant Lead Finder | Google Maps Scraper Dashboard",
  description: "Discover US restaurants and local eateries from Google Maps that do not have a website yet. Ideal for digital agencies, SEO consultants, and web designers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full dark">
      <body className="min-h-full bg-[#090d16] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
