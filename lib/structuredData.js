// lib/structuredData.js
export const generateRestaurantSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Blue Heron Café",
  "alternateName": "Blue Heron Cafe",
  "description": "Hidden gem café in Samuels, Idaho serving fresh, elevated homestyle food with live music events and outdoor patio dining.",
  "url": "https://blueheronsamuels.com",
  "logo": "https://blueheronsamuels.com/images/blue-heron-vertical-logo.png",
  "image": [
    "https://blueheronsamuels.com/images/blue-heron-hero.jpg",
    "https://blueheronsamuels.com/images/about-cafe.jpg"
  ],
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
  "telephone": "(208) 555-1234",
  "email": "info@blueheronsamuels.com",
  "openingHours": [
    "Mo-Su 07:00-15:00"
  ],
  "servesCuisine": ["American", "Country", "Farm-to-table"],
  "priceRange": "$$",
  "acceptsReservations": true,
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
      "name": "Parking",
      "value": true
    }
  ],
  "sameAs": [
    "https://www.facebook.com/blueheronsamuels",
    "https://www.instagram.com/blueheronsamuels"
  ]
});

export const generateMenuSchema = (menuItems) => ({
  "@context": "https://schema.org",
  "@type": "Menu",
  "name": "Blue Heron Café Menu",
  "description": "Fresh, elevated homestyle cuisine featuring breakfast, lunch, and dinner options",
  "hasMenuSection": [
    {
      "@type": "MenuSection",
      "name": "Breakfast",
      "hasMenuItem": menuItems
        .filter(item => item.category === "breakfast")
        .map(item => ({
          "@type": "MenuItem",
          "name": item.title,
          "description": item.description,
          "offers": {
            "@type": "Offer",
            "price": item.price?.replace('$', ''),
            "priceCurrency": "USD"
          }
        }))
    },
    {
      "@type": "MenuSection", 
      "name": "Lunch",
      "hasMenuItem": menuItems
        .filter(item => item.category === "lunch")
        .map(item => ({
          "@type": "MenuItem",
          "name": item.title,
          "description": item.description,
          "offers": {
            "@type": "Offer",
            "price": item.price?.replace('$', ''),
            "priceCurrency": "USD"
          }
        }))
    }
  ]
});

export const generateEventSchema = (event) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.title,
  "description": event.description,
  "startDate": event.date,
  "location": {
    "@type": "Restaurant",
    "name": "Blue Heron Café",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "486260 US-95",
      "addressLocality": "Samuels",
      "addressRegion": "ID",
      "postalCode": "83864",
      "addressCountry": "US"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Blue Heron Café"
  },
  "image": event.imageUrl,
  "url": `https://blueheronsamuels.com/events/${event.slug?.current}`,
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
});

export const generateBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});