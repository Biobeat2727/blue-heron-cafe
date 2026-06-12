// components/HoursSection.js
const HOURS = [
  { day: "Sunday",    range: "6:00am – 2:00pm" },
  { day: "Monday",    range: "6:00am – 2:00pm" },
  { day: "Tuesday",   range: "6:00am – 7:30pm" },
  { day: "Wednesday", range: "6:00am – 7:30pm" },
  { day: "Thursday",  range: "6:00am – 7:30pm" },
  { day: "Friday",    range: "6:00am – 8:30pm" },
  { day: "Saturday",  range: "6:00am – 8:30pm" },
];

const TODAY = new Date().toLocaleDateString("en-US", { weekday: "long" });

export default function HoursSection() {
  return (
    <section className="bg-cyan-900 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-start md:items-center">

        {/* Left: Heading + phone */}
        <div className="md:w-1/3 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🕒</span>
            <h2 className="text-2xl font-bold font-serif">Hours</h2>
          </div>
          <p className="text-cyan-300 text-sm mb-5">
            Open every day starting at 6:00am
          </p>
          <a
            href="tel:+12082631146"
            className="inline-flex items-center gap-2 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-lg px-4 py-2 text-sm font-semibold"
          >
            📞 (208) 263-1146
          </a>
        </div>

        {/* Right: Hours list */}
        <div className="flex-1 w-full divide-y divide-cyan-700/50">
          {HOURS.map(({ day, range }) => {
            const isToday = day === TODAY;
            return (
              <div
                key={day}
                className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-all ${
                  isToday ? "bg-white/10 ring-1 ring-cyan-400" : ""
                }`}
              >
                <span className={`font-medium text-sm ${isToday ? "text-cyan-300" : "text-cyan-200"}`}>
                  {isToday ? `${day} (Today)` : day}
                </span>
                <span className={`font-bold text-sm tracking-wide ${isToday ? "text-white" : "text-cyan-100"}`}>
                  {range}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
