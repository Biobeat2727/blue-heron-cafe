import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen">
  {/* Background Image */}
  <img
    src="/images/blue-heron-hero.jpg"
    alt="Blue Heron Café background"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>

  {/* Foreground Content */}
  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-white">
      Blue Heron Café
    </h1>
    <p className="text-xl md:text-2xl mb-6 text-emerald-100">
      Fresh eats. Cozy vibes. Local love.
    </p>
    <Link
      href="/menu"
      className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-md text-lg font-semibold hover:bg-emerald-700 transition"
    >
      View Menu
    </Link>
  </div>
</section>

  );
};

export default HeroSection;
