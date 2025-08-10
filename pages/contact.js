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
    <div className="min-h-screen px-6 pt-28 bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl text-cyan-900">
            Contact & Event Booking
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-700">
            Have a question or want to book our new outdoor patio and amphitheater for a special event?
            Fill out the form below and we'll be in touch!
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-6 bg-white shadow-xl rounded-2xl"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Name</label>
                  <input 
                    name="name" 
                    required 
                    className="w-full p-3 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    className="w-full p-3 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Event Type</label>
                <select 
                  name="eventType" 
                  className="w-full p-3 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                <label className="block mb-2 text-sm font-semibold text-gray-700">Message</label>
                <textarea 
                  name="message" 
                  rows="5" 
                  required 
                  className="w-full p-3 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full px-6 py-3 text-lg font-semibold text-white transition rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <div className="px-4 py-3 text-green-700 border border-green-200 rounded-lg bg-green-50">
                  Thank you! We'll get back to you soon.
                </div>
              )}
              {submitStatus === "error" && (
                <div className="px-4 py-3 text-red-700 border border-red-200 rounded-lg bg-red-50">
                  Something went wrong. Please try again or call us directly.
                </div>
              )}
            </form>
          </div>

          {/* Contact Info - Now Mobile Friendly with Correct Hours */}
          <div className="space-y-6">
            <div className="p-6 bg-white shadow-xl rounded-2xl">
              <h2 className="flex items-center mb-4 text-xl font-bold text-cyan-800">
                <span className="mr-2">📍</span>
                Visit Us
              </h2>
              <p className="mb-2 text-gray-700">486260 US-95</p>
              <p className="mb-4 text-gray-700">Sandpoint, ID 83864</p>
              
              <h3 className="flex items-center mb-3 text-lg font-semibold text-cyan-800">
                <span className="mr-2">🕒</span>
                Hours
              </h3>
              <div className="mb-4 space-y-1 text-gray-700">
                <p><span className="font-medium">Sunday:</span> 6:00am – 2:00pm</p>
                <p><span className="font-medium">Monday:</span> 6:00am – 2:00pm</p>
                <p><span className="font-medium">Tuesday:</span> 6:00am – 7:30pm</p>
                <p><span className="font-medium">Wednesday:</span> 6:00am – 7:30pm</p>
                <p><span className="font-medium">Thursday:</span> 6:00am – 7:30pm</p>
                <p><span className="font-medium">Friday:</span> 6:00am – 8:30pm</p>
                <p><span className="font-medium">Saturday:</span> 6:00am – 8:30pm</p>
              </div>
              
              <h3 className="flex items-center mb-2 text-lg font-semibold text-cyan-800">
                <span className="mr-2">📞</span>
                Phone
              </h3>
              <a href="tel:+12082631146" className="text-lg font-semibold text-cyan-600 hover:text-cyan-700">
                (208) 555-1234
              </a>
            </div>

            {/* Map */}
            <div className="p-6 bg-white shadow-xl rounded-2xl">
              <h3 className="mb-4 text-lg font-semibold text-cyan-800">Find Us</h3>
              <div className="relative h-48 overflow-hidden rounded-lg">
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