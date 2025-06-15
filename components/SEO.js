// components/SEO.js
import Head from "next/head";

export default function SEO({
  title = "Blue Heron Café",
  description = "A cozy country store and café in Samuels, Idaho. Fresh food, coffee, and community events.",
  image = "/images/og-hero.jpg",
  url = "https://blueheroncafe.com", // replace with your domain
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
    </Head>
  );
}
