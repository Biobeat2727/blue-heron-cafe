// pages/contact.js - Fixed Mobile Layout with Correct Hours and Full-Width Footer
import { useState } from "react";


export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://formspree.io/f/xdkzdgvw", {
        method: "POST",
        body: new FormData(e.target),
        headers: { Accept: "application/json" }
      });
      
      if (response.ok) {
        setSubmitStatus("success");
        e.target.reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 px-6 min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-cyan-900 font-serif">
            Contact & Event Booking
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Have a question or want to book our new outdoor patio and amphitheater for a special event?
            Fill out the form below and we'll be in touch!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-xl rounded-2xl p-8 space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input 
                    name="name" 
                    required 
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type</label>
                <select 
                  name="eventType" 
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                >
                  <option>General Inquiry</option>
                  <option>Wedding</option>
                  <option>Live Music Event</option>
                  <option>Private Party</option>
                  <option>Corporate Event</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea 
                  name="message" 
                  rows="5" 
                  required 
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition" 
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-cyan-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  Thank you! We'll get back to you soon.
                </div>
              )}
              {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  Something went wrong. Please try again or call us directly.
                </div>
              )}
            </form>
          </div>

          {/* Contact Info - Now Mobile Friendly with Correct Hours */}
          <div className="space-y-6">
            <div className="bg-white shadow-xl rounded-2xl p-6">
              <h2 className="text-xl font-bold text-cyan-800 mb-4 flex items-center">
                <span className="mr-2">📍</span>
                Visit Us
              </h2>
              <p className="text-gray-700 mb-2">486260 US-95</p>
              <p className="text-gray-700 mb-4">Sandpoint, ID 83864</p>
              
              <h3 className="text-lg font-semibold text-cyan-800 mb-3 flex items-center">
                <span className="mr-2">🕒</span>
                Hours
              </h3>
              <div className="text-gray-700 space-y-1 mb-4">
                <p><span className="font-medium">Sunday:</span> 6:00am – 2:00pm</p>
                <p><span className="font-medium">Monday:</span> 6:00am – 2:00pm</p>
                <p><span className="font-medium">Tuesday:</span> 6:00am – 7:30pm</p>
                <p><span className="font-medium">Wednesday:</span> 6:00am – 7:30pm</p>
                <p><span className="font-medium">Thursday:</span> 6:00am – 7:30pm</p>
                <p><span className="font-medium">Friday:</span> 6:00am – 8:30pm</p>
                <p><span className="font-medium">Saturday:</span> 6:00am – 8:30pm</p>
              </div>
              
              <h3 className="text-lg font-semibold text-cyan-800 mb-2 flex items-center">
                <span className="mr-2">📞</span>
                Phone
              </h3>
              <a href="tel:+12085551234" className="text-cyan-600 font-semibold text-lg hover:text-cyan-700">
                (208) 555-1234
              </a>
            </div>

            {/* Map */}
            <div className="bg-white shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-cyan-800 mb-4">Find Us</h3>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=486260%20US-95,%20Sandpoint,%20ID%2083864+(Blue%20Heron%20Cafe)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}