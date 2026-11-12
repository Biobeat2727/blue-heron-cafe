// Site-wide popup that promotes one special event on a visitor's first page view.
// To promote a different event, change EVENT_SLUG. Set it to null to turn the popup off.
// The popup hides itself once the event date has passed.
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Calendar, Phone } from "lucide-react";
import { client } from "@/lib/sanity";

const EVENT_SLUG = "a-taste-of-fall";
const SHOW_DELAY_MS = 1200;
const STORAGE_KEY = `event-popup-dismissed:${EVENT_SLUG}`;

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function eventIsOver(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date() > new Date(y, m - 1, d, 23, 59, 59);
}

function wasDismissed() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberDismissed() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {}
}

export default function EventPopup() {
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [open, setOpen] = useState(false);

  const eventPath = `/events/${EVENT_SLUG}`;
  const onEventPage = router.asPath.split(/[?#]/)[0] === eventPath;

  useEffect(() => {
    if (!EVENT_SLUG || wasDismissed()) return;
    let cancelled = false;
    let timer;

    client
      .fetch(
        `*[_type == "event" && slug.current == $slug][0]{
          title, date, time,
          "imageUrl": image.asset->url + "?w=700&fit=max&auto=format&q=75"
        }`,
        { slug: EVENT_SLUG }
      )
      .then((data) => {
        if (cancelled || !data?.date || eventIsOver(data.date)) return;
        setEvent(data);
        timer = setTimeout(() => {
          if (!cancelled) setOpen(true);
        }, SHOW_DELAY_MS);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const close = () => {
    rememberDismissed();
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Don't show it on top of the page it's advertising.
  const visible = open && event && !onEventPage;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-popup-title"
            className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute z-10 flex items-center justify-center w-10 h-10 text-white transition rounded-full top-3 right-3 bg-black/50 hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </button>

            {event.imageUrl && (
              <Link href={eventPath} onClick={close} className="block">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="object-contain w-full max-h-[50vh] bg-black"
                />
              </Link>
            )}

            <div className="p-6 text-center">
              <p className="text-xs font-semibold tracking-widest uppercase text-cyan-700">
                Special Event
              </p>
              <h2 id="event-popup-title" className="mt-1 font-serif text-3xl font-bold text-gray-900">
                {event.title}
              </h2>
              <p className="flex items-center justify-center gap-2 mt-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                {formatDate(event.date)}
                {event.time ? ` at ${event.time}` : ""}
              </p>

              <div className="flex flex-col gap-2 mt-5 sm:flex-row">
                <Link
                  href={eventPath}
                  onClick={close}
                  className="flex-1 px-5 py-3 font-semibold text-white transition rounded-lg bg-cyan-600 hover:bg-cyan-700"
                >
                  See the details
                </Link>
                <a
                  href="tel:+12082631146"
                  className="flex items-center justify-center flex-1 gap-2 px-5 py-3 font-semibold transition border rounded-lg text-cyan-700 border-cyan-600 hover:bg-cyan-50"
                >
                  <Phone className="w-4 h-4" />
                  Reserve a spot
                </a>
              </div>

              <button
                onClick={close}
                className="mt-4 text-sm text-gray-500 underline-offset-2 hover:underline"
              >
                No thanks, take me to the site
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
