import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-cyan-900 text-white py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        
        {/* Logo / About */}
        <div>
          <h2 className="text-xl font-bold mb-2">Blue Heron Café</h2>
          <p className="text-sm">
            A cozy country store and café in Samuels, Idaho. Stop in for fresh bites, coffee, and community.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/menu">Menu</Link></li>
            <li><Link href="/events">Events</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </div>

        {/* Contact / Hours */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <p className="text-sm">Samuels Store, ID 83864</p>
          <p className="text-sm">Mon–Sat: 7am – 6pm</p>
          <p className="text-sm">Phone: (208) 123-4567</p>
        </div>

      </div>

      <div className="text-center text-xs mt-6 border-t border-cyan-700 pt-4">
        © {new Date().getFullYear()} Blue Heron Café. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
