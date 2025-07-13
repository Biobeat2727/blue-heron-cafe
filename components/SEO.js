// components/SEO.js - Enhanced Version
import Head from "next/head";

export default function SEO({
  title = "Blue Heron Café | Fresh Country Dining in Samuels, Idaho",
  description = "Hidden gem café in Samuels, Idaho serving fresh, elevated homestyle food. Live music events, outdoor patio dining, and cozy atmosphere near Sandpoint.",
  image = "/images/blue-heron-hero.jpg",
  url = "https://blueheronsamuels.com",
  type = "website",
  keywords = "restaurant Samuels Idaho, café Sandpoint, fresh food Idaho, live music events, outdoor dining, country store, homestyle cooking",
  author = "Blue Heron Café",
  canonical,
  noindex = false,
  jsonLd
}) {
  const siteUrl = "https://blueheronsamuels.com"; // Replace with your actual domain
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const canonicalUrl = canonical || fullUrl;

  return (
    <Head>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Blue Heron Café" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Geographic SEO */}
      <meta name="geo.region" content="US-ID" />
      <meta name="geo.placename" content="Samuels, Idaho" />
      <meta name="geo.position" content="48.3686;-116.5535" />
      <meta name="ICBM" content="48.3686, -116.5535" />
      
      {/* Business/Restaurant specific */}
      <meta property="business:contact_data:locality" content="Samuels" />
      <meta property="business:contact_data:region" content="Idaho" />
      <meta property="business:contact_data:postal_code" content="83864" />
      <meta property="business:contact_data:country_name" content="United States" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}