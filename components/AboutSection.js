import Link from "next/link";

const AboutSection = () => {
  return (
    <section className="bg-emerald-50 py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-serif font-bold mb-4">Our Story</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Blue Heron Café was born from a love of fresh ingredients,
            community, and the healing power of a good meal. Whether you're here
            for a cozy breakfast, a fresh lunch, or a soulful gathering, you'll
            always find a place at our table.
          </p>
          <Link
            href="/about"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-md text-lg font-semibold hover:bg-emerald-700 transition"
          >
            Learn More About Us
          </Link>
        </div>

        {/* Image */}
        <div className="md:w-1/2">
          <img
            src="/images/about-owner.jpg"
            alt="Owner of Blue Heron Café"
            className="rounded-lg shadow-lg w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
