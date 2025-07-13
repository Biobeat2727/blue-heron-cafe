// components/ReviewsSection.js
import { motion } from "framer-motion";
import { useState } from "react";

const ReviewsSection = () => {
  const [reviews] = useState([
    {
      id: 1,
      name: "XSA International",
      rating: 5,
      text: "Fantastic food! Highly recommended! The best prime rib on Saturday night in the area. If you missed the prime rib, try the prime rib stew! Their club sandwich is off the charts! Live music and a family atmosphere that will just blow you away!",
      date: "2 Months ago",
      platform: "Google",
      verified: true
    },
    {
      id: 2,
      name: "Aaron B.", 
      rating: 5,
      text: "Excellent experience! Awesome food, grocery, tourist trap, goodies shop. I had the meatloaf wrapped in bacon sandwich. Amazing! Nice bathroom. Highly recommended ‼️",
      date: "8 months ago",
      platform: "Google",
      verified: true
    },
    {
      id: 3,
      name: "Tracie A.",
      rating: 5,
      text: "Wonderful service, great food! I am so excited to experience the live music this summer. And stoked about the food truck!",
      date: "3 weeks ago",
      platform: "Facebook",
      verified: true
    },
    {
      id: 4,
      name: "Nicole A.",
      rating: 5,
      text: "Great food and the service is always top notch. Looking forward to trying the outdoor seating sometime. Great place for breakfast, lunch or dinner.",
      date: "1 week ago",
      platform: "Yelp",
      verified: true
    },
    {
      id: 5,
      name: "Ron M.",
      rating: 5,
      text: "Excellent food and service!! They're busy because it's awesome. I've been here twice and both times it was fantastic. I had the French Dip last time. You will not be disappointed.",
      date: "2 months ago",
      platform: "Yelp",
      verified: true
    },
    {
      id: 6,
      name: "Laura B.",
      rating: 5,
      text: "Had a great lunch the other day. Asked for no Mayo on a burger. Asked for my fries crispy. Got all the things with a smile. I've had breakfast there also and it was great. Easy access, lots of parking. Nice view as well. Friendly staff.",
      date: "3 weeks ago",
      platform: "Yelp",
      verified: true
    }
  ]);

  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const currentReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-cyan-800 mb-4 font-serif">
            What Our Community Says
          </h2>
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-500 text-2xl">⭐</span>
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-700">5.0</span>
            <span className="text-gray-600">({reviews.length} reviews)</span>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover why locals and visitors love our hidden gem behind Samuels Store
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {currentReviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-cyan-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-lg">⭐</span>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">{review.platform}</span>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 italic leading-relaxed">
                "{review.text}"
              </p>
              
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-cyan-800">
                    {review.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {review.date}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mb-8">
            <button
              onClick={prevPage}
              className="p-2 rounded-full bg-cyan-600 text-white hover:bg-cyan-700 transition-colors"
              aria-label="Previous reviews"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === currentPage ? 'bg-cyan-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={nextPage}
              className="p-2 rounded-full bg-cyan-600 text-white hover:bg-cyan-700 transition-colors"
              aria-label="Next reviews"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Call to Action */}
        <motion.div
          className="text-center bg-white p-8 rounded-xl shadow-lg border border-cyan-100"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-cyan-800 mb-4">
            Share Your Experience
          </h3>
          <p className="text-gray-600 mb-6">
            Visited us recently? We'd love to hear about your experience!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.google.com/maps/place/Blue+Heron+Cafe+%26+Samuel+Store/@48.4285885,-116.4981498,17z/data=!3m1!4b1!4m6!3m5!1s0x5363c1968a08e967:0x7941553519930ad5!8m2!3d48.428585!4d-116.4955749!16s%2Fg%2F1tdm3d7r"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Review us on Google
            </a>
            <a
              href="https://www.yelp.com/biz/blue-heron-cafe-sandpoint"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Review on Yelp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;