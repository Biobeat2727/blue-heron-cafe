import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Blue Heron Café | Samuels, ID</title>
        <meta name="description" content="A cozy country café offering fresh eats, baked goods, and local events. Located in Samuels, Idaho." />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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