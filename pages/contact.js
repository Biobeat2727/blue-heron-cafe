// pages/contact.js
import { useState } from "react";

export default function ContactPage() {
  return (
    <div className="pt-28 pb-16 px-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center text-cyan-900">
          Contact & Event Booking
        </h1>
        <p className="text-center text-gray-700 mb-8">
          Have a question or want to book our new outdoor patio and amphitheater for a special event?
          Fill out the form below and we'll be in touch!
        </p>
    

      <div className="relative">
        {/* Contact Form */}
        <form
          action="https://formspree.io/f/xdkzdgvw" // Replace with your Formspree ID
          method="POST"
          className="space-y-6 bg-white shadow-lg rounded-lg p-8"
        >
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input name="name" required className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" name="email" required className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Event Type</label>
            <select name="eventType" className="w-full border rounded p-2">
              <option>Wedding</option>
              <option>Live Music</option>
              <option>Private Party</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea name="message" rows="5" required className="w-full border rounded p-2" />
          </div>
          <button type="submit" className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700">
            Submit
          </button>
        </form>

        {/* Info Panel */}
        <div className="absolute right-[-18rem] top-0 w-64 space-y-6 text-sm text-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-cyan-800">Hours</h2>
            <p>Mon – Sun: 7:00am – 3:00pm</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-cyan-800">Phone</h2>
            <p>(208) 555-1234</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-cyan-800">Map</h2>
            <iframe
              className="w-full h-40 border rounded"
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=486260%20US-95,%20Sandpoint,%20ID%2083864+(Blue%20Heron)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      </div>
    
  );
}

