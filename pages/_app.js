import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <meta name="theme-color" content="#0891b2" />
        <meta name="application-name" content="Blue Heron Café" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="google-site-verification" content="1-Zu45mEGNPfPJ9Ae5dpx5N7PxexQO8dbLsAbz0NzHo" />
      </Head>

      <LocalBusinessSchema />

      <Navbar />
      <main className="pt-20">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}