import Head from "next/head";
import Link from "next/link";
import { client, getAllEvents } from "@/lib/sanity";
import EventsCalendar from "@/components/EventsCalendar";

export default function EventsPage({ events }) {
  // Client-side filter as backup (in case Sanity query doesn't catch everything)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  
  const futureEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  // Fixed timezone-safe date formatting
  const formatDate = (isoDate) => {
    // If it's a string in YYYY-MM-DD format, parse it as local date
    if (typeof isoDate === 'string') {
      const [year, month, day] = isoDate.split('-').map(Number);
      // Create date at noon local time to avoid timezone shifts
      const localDate = new Date(year, month - 1, day, 12, 0, 0);
      return localDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    
    // Fallback for Date objects
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    // Convert 24h to 12h format if needed
    const [hours, minutes] = timeString.split(':');
    const hour12 = ((parseInt(hours) + 11) % 12) + 1;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Show message if no upcoming events
  if (futureEvents.length === 0) {
    return (
      <>
        <Head>
          <title>Events | Blue Heron Café</title>
          <meta
            name="description"
            content="Experience live music and community gatherings at Blue Heron Café's stunning outdoor stage and patio in Samuels, Idaho."
          />
        </Head>

        <main className="pt-24 pb-32 min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
          {/* Hero Section */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-blue-600/10 pointer-events-none"></div>
            
            <section className="text-center mb-16 px-6 max-w-5xl mx-auto relative">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                New Outdoor Stage & Patio Now Open!
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-blue-700 to-emerald-600 bg-clip-text text-transparent leading-tight">
                Our Live Events
              </h1>
              
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
                Join us at our beautiful new outdoor stage and patio area for unforgettable evenings of live music, community gatherings, and seasonal celebrations in the heart of Samuels, Idaho.
              </p>
            </section>
          </div>

          {/* No Events Message */}
          <div className="px-6 max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12 border border-emerald-100">
              <div className="text-6xl mb-6">🎵</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                No Upcoming Events Scheduled
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We're planning some amazing events for our outdoor stage and patio! 
                Check back soon or follow us on social media for announcements.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+12082631146" // Use your actual number
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition font-semibold"
                >
                  📞 Call for Event Info
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border-2 border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg hover:bg-emerald-600 hover:text-white transition font-semibold"
                >
                  📧 Contact Us
                </Link>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Events | Blue Heron Café</title>
        <meta
          name="description"
          content="Experience live music and community gatherings at Blue Heron Café's stunning outdoor stage and patio in Samuels, Idaho."
        />
      </Head>

      <main className="pt-24 pb-32 min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-blue-600/10 pointer-events-none"></div>
          
          <section className="text-center mb-16 px-6 max-w-5xl mx-auto relative">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              New Outdoor Stage & Patio Now Open!
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-blue-700 to-emerald-600 bg-clip-text text-transparent leading-tight">
              Come Enjoy Our Live Events
            </h1>
            
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Join us at our beautiful new outdoor stage and patio area for unforgettable evenings of live music, community gatherings, and seasonal celebrations in the heart of Samuels, Idaho.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg border border-emerald-100">
                <span className="text-emerald-600 font-semibold">🎵 Live Music</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg border border-emerald-100">
                <span className="text-emerald-600 font-semibold">🌿 Garden Patio</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg border border-emerald-100">
                <span className="text-emerald-600 font-semibold">🎭 Community Events</span>
              </div>
            </div>
          </section>
        </div>

        {/* Events Calendar - Pass filtered events */}
        <div className="px-6 max-w-7xl mx-auto mb-16">
          <EventsCalendar events={futureEvents} />
        </div>

        {/* Events Grid */}
        <div className="px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-gray-900">
              Upcoming Events ({futureEvents.length})
            </h2>
            <div className="h-px bg-gradient-to-r from-emerald-300 to-blue-300 flex-1 ml-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {futureEvents.map((event, index) => (
              <Link key={event._id} href={`/events/${event.slug.current}`}>
                <div 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-emerald-200 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                  data-event-date={event.date} // Added for calendar clicking
                >
                  <div className="relative aspect-[5/3] w-full overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Outdoor Stage
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm font-medium text-emerald-600 uppercase tracking-wide">
                        {formatDate(event.date)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Outdoor Patio
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 pb-6">
                    <div className="flex items-center text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors">
                      <span className="mr-2">Learn More</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold mb-4">
                Ready to Experience Our Outdoor Stage?
              </h3>
              <p className="text-lg mb-6 text-emerald-100">
                Join us for an evening under the stars with live music and great food.
              </p>
              <Link
                href="/contact"
                className="bg-white text-emerald-600 font-bold py-3 px-8 rounded-full hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Get Event Updates
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const query = `*[_type == "event"] | order(date asc) {
    _id,
    title,
    date,
    time,
    description,
    "slug": slug,
    "imageUrl": image.asset->url
  }`;

  const events = await client.fetch(query);

  return {
    props: { events },
    revalidate: 3600, // Revalidate every hour to ensure past events disappear
  };
}