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
    "https://www.facebook.com/blueheronsandpoint",
    "https://www.instagram.com/blue.heroncafe"
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
  "url": `https://blueheronsamuels.com/events/${event.slug}`,
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
});

export const generateFAQSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Where is Blue Heron Café located?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "486260 US-95, Samuels, Idaho — just off the highway, about 15 minutes south of Sandpoint."
      }
    },
    {
      "@type": "Question",
      "name": "Does Blue Heron Café serve lunch?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we serve lunch Tuesday through Sunday with fresh, elevated homestyle food including sandwiches, salads, soups, and daily specials."
      }
    },
    {
      "@type": "Question",
      "name": "What are Blue Heron Café's hours?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sunday–Monday 6am–2pm, Tuesday–Thursday 6am–7:30pm, Friday–Saturday 6am–8:30pm."
      }
    },
    {
      "@type": "Question",
      "name": "Does Blue Heron Café have outdoor seating?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we have a beautiful outdoor patio and amphitheater stage available for dining and live events."
      }
    },
    {
      "@type": "Question",
      "name": "Does Blue Heron Café have live music?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we host regular live music events at our outdoor stage in Samuels, Idaho near Sandpoint."
      }
    }
  ]
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