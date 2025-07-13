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
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Contact / Hours */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact & Hours</h3>
          <p className="text-sm mb-2">486260 US-95, Sandpoint, ID 83864</p>
          <div className="text-sm space-y-1 mb-2">
            <p><span className="font-medium">Sun-Mon:</span> 6am–2pm</p>
            <p><span className="font-medium">Tue-Thu:</span> 6am–7:30pm</p>
            <p><span className="font-medium">Fri-Sat:</span> 6am–8:30pm</p>
          </div>
          <p className="text-sm">
            <a href="tel:+12082631146" className="hover:text-cyan-300 transition-colors">
              Phone: (208) 263-1146
            </a>
          </p>
        </div>

      </div>

      <div className="text-center text-xs mt-6 border-t border-cyan-700 pt-4">
        © {new Date().getFullYear()} Blue Heron Café. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;