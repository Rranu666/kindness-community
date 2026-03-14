import { useEffect } from "react";

export default function Layout({ children }) {
  useEffect(() => {
    // ── Fonts (guard against duplicates) ──────────────────────────────────
    if (!document.querySelector("link[href*='Montserrat']")) {
      const fontLink = document.createElement("link");
      fontLink.rel = "stylesheet";
      fontLink.href =
        "https://fonts.googleapis.com/css2?family=Montserrat:wght@900&family=Dancing+Script:wght@500;600&display=swap";
      document.head.appendChild(fontLink);
    }

    // ── Helper ─────────────────────────────────────────────────────────────
    const setMeta = (name, content, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setLink = (rel, href, extra = {}) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
      Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
    };

    // ── Page title ─────────────────────────────────────────────────────────
    document.title =
      "Kindness Community | Structured Community Infrastructure";

    // ── html lang ──────────────────────────────────────────────────────────
    document.documentElement.lang = "en";

    // ── Core meta ──────────────────────────────────────────────────────────
    setMeta(
      "description",
      "Kindness Community (KCF) is a California nonprofit building ethical, technology-assisted volunteer networks, transparent governance, and sustainable community infrastructure for the digital age."
    );
    setMeta(
      "keywords",
      "kindness community, KCF, nonprofit, volunteer network, ethical technology, community development, transparent governance, social impact, Fred Behr, California nonprofit"
    );
    setMeta(
      "robots",
      "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
    );
    setMeta("author", "Kindness Community");
    setMeta("theme-color", "#0d1b2a");

    // Geo / local SEO
    setMeta("geo.region", "US-CA");
    setMeta("geo.placename", "California, USA");

    // ── Open Graph ─────────────────────────────────────────────────────────
    setMeta("og:type", "website", "property");
    setMeta(
      "og:title",
      "Kindness Community | Structured Community Infrastructure",
      "property"
    );
    setMeta(
      "og:description",
      "A California nonprofit building ethical volunteer networks, transparent governance, and technology-assisted community infrastructure for the digital age.",
      "property"
    );
    setMeta(
      "og:url",
      "https://www.kindnesscommunityfoundation.com",
      "property"
    );
    setMeta("og:site_name", "Kindness Community", "property");
    setMeta(
      "og:image",
      "https://www.kindnesscommunityfoundation.com/og-image.png",
      "property"
    );
    setMeta("og:image:width", "1200", "property");
    setMeta("og:image:height", "630", "property");
    setMeta(
      "og:image:alt",
      "Kindness Community - Building Community Infrastructure",
      "property"
    );
    setMeta("og:locale", "en_US", "property");

    // ── Twitter Card ───────────────────────────────────────────────────────
    setMeta("twitter:card", "summary_large_image");
    setMeta(
      "twitter:title",
      "Kindness Community | Structured Community Infrastructure"
    );
    setMeta(
      "twitter:description",
      "A California nonprofit building ethical volunteer networks, transparent governance, and technology-assisted community infrastructure for the digital age."
    );
    setMeta(
      "twitter:image",
      "https://www.kindnesscommunityfoundation.com/og-image.png"
    );
    setMeta(
      "twitter:image:alt",
      "Kindness Community - Building Sustainable Community Infrastructure"
    );

    // ── Canonical ──────────────────────────────────────────────────────────
    setLink("canonical", "https://www.kindnesscommunityfoundation.com");

    // ── Sitemap reference ──────────────────────────────────────────────────
    if (!document.querySelector("link[rel='sitemap']")) {
      const sitemapEl = document.createElement("link");
      sitemapEl.rel = "sitemap";
      sitemapEl.type = "application/xml";
      sitemapEl.href = "/sitemap.xml";
      document.head.appendChild(sitemapEl);
    }

    // ── Preconnect for performance (Google ranking signal) ─────────────────
    if (!document.querySelector("link[href='https://fonts.googleapis.com']")) {
      const pc1 = document.createElement("link");
      pc1.rel = "preconnect";
      pc1.href = "https://fonts.googleapis.com";
      document.head.appendChild(pc1);

      const pc2 = document.createElement("link");
      pc2.rel = "preconnect";
      pc2.href = "https://fonts.gstatic.com";
      pc2.crossOrigin = "anonymous";
      document.head.appendChild(pc2);
    }

    // ── Structured Data (JSON-LD) ──────────────────────────────────────────
    let jsonLd = document.getElementById("kcf-jsonld");
    if (!jsonLd) {
      jsonLd = document.createElement("script");
      jsonLd.id = "kcf-jsonld";
      jsonLd.type = "application/ld+json";
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "NGO",
          "@id": "https://www.kindnesscommunityfoundation.com/#organization",
          name: "Kindness Community",
          alternateName: "KCF",
          url: "https://www.kindnesscommunityfoundation.com",
          logo: {
            "@type": "ImageObject",
            url: "https://www.kindnesscommunityfoundation.com/logo.png",
            width: 200,
            height: 60,
          },
          description:
            "A California nonprofit public benefit corporation promoting community stabilization, ethical participation, and technology-assisted coordination of volunteer and contribution networks.",
          founder: {
            "@type": "Person",
            name: "Fred A. Behr",
          },
          foundingDate: "2024",
          foundingLocation: {
            "@type": "Place",
            name: "California, USA",
            address: {
              "@type": "PostalAddress",
              addressRegion: "CA",
              addressCountry: "US",
            },
          },
          areaServed: {
            "@type": "Place",
            name: "United States",
          },
          email: "contact@kindnesscommunityfoundation.com",
          contactPoint: {
            "@type": "ContactPoint",
            email: "contact@kindnesscommunityfoundation.com",
            contactType: "General Inquiries",
            availableLanguage: "English",
          },
          knowsAbout: [
            "Community Development",
            "Volunteer Networks",
            "Ethical Technology",
            "Nonprofit Governance",
            "Social Impact",
            "Economic Empowerment",
          ],
          sameAs: [],
        },
        {
          "@type": "WebSite",
          "@id": "https://www.kindnesscommunityfoundation.com/#website",
          url: "https://www.kindnesscommunityfoundation.com",
          name: "Kindness Community",
          description:
            "Building ethical, technology-assisted volunteer networks and sustainable community infrastructure.",
          publisher: {
            "@id":
              "https://www.kindnesscommunityfoundation.com/#organization",
          },
          inLanguage: "en-US",
        },
        {
          "@type": "WebPage",
          "@id": "https://www.kindnesscommunityfoundation.com/#webpage",
          url: "https://www.kindnesscommunityfoundation.com",
          name: "Kindness Community | Structured Community Infrastructure",
          isPartOf: {
            "@id": "https://www.kindnesscommunityfoundation.com/#website",
          },
          about: {
            "@id":
              "https://www.kindnesscommunityfoundation.com/#organization",
          },
          description:
            "Kindness Community (KCF) is a California nonprofit building ethical, technology-assisted volunteer networks, transparent governance, and sustainable community infrastructure.",
          inLanguage: "en-US",
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: ["h1", "h2"],
          },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.kindnesscommunityfoundation.com",
              },
            ],
          },
        },
      ],
    });
  }, []);

  return (
    <div>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-rose-500 focus:text-white focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>
      {children}
    </div>
  );
}