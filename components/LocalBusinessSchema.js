// components/LocalBusinessSchema.js
export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness"],
    "name": "Blue Heron Café",
    "alternateName": "Blue Heron Cafe",
    "description": "Hidden gem café serving fresh, elevated homestyle food with live music events and outdoor patio dining in Samuels, Idaho.",
    "url": "https://blueheronsamuels.com",
    "logo": "https://blueheronsamuels.com/images/blue-heron-vertical-logo.png",
    "image": "https://blueheronsamuels.com/images/blue-heron-hero.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "486260 US-95",
      "addressLocality": "Samuels", 
      "addressRegion": "ID",
      "postalCode": "83864",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.3686,
      "longitude": -116.5535
    },
    "telephone": "(208) 263-1146",
    "email": "info@blueheronsamuels.com",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Sunday", "Monday"],
        "opens": "06:00",
        "closes": "14:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday"],
        "opens": "06:00",
        "closes": "19:30"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Friday", "Saturday"],
        "opens": "06:00",
        "closes": "20:30"
      }
    ],
    "servesCuisine": ["American", "Country", "Farm-to-table"],
    "priceRange": "$$",
    "acceptsReservations": true,
    "paymentAccepted": ["Cash", "Credit Card"],
    "currenciesAccepted": "USD",
    "hasMenu": "https://blueheronsamuels.com/menu",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Outdoor Seating",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Live Music",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Parking Available",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Family Friendly",
        "value": true
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "24"
    },
    "areaServed": [
      "Samuels",
      "Sandpoint",
      "Bonner County",
      "North Idaho"
    ],
    "sameAs": [
      "https://www.facebook.com/blueheronsandpoint",
      "https://www.instagram.com/blue.heroncafe"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}