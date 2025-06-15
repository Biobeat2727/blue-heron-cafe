// pages/events/[slug].js
import Head from "next/head";
import { useRouter } from "next/router";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import Footer from "@/components/Footer";

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

export default function EventDetail({ event }) {
  const router = useRouter();

  if (router.isFallback) return <div>Loading…</div>;
  if (!event) return <div>Event not found</div>;

  const {
    title,
    description,
    date,
    time,
    image,
    metaDescription,
    openGraphImage,
  } = event;

  return (
    <>
      <Head>
        <title>{title} | Blue Heron Café</title>
        <meta name="description" content={metaDescription || description?.slice(0, 150)} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription || description?.slice(0, 150)} />
        {openGraphImage && (
          <meta property="og:image" content={urlFor(openGraphImage).width(1200).url()} />
        )}
      </Head>

      <main className="pt-32 px-6 max-w-3xl mx-auto">
        {image && (
          <img
            src={urlFor(image).width(1000).url()}
            alt={title}
            className="w-full h-auto rounded-lg mb-8"
          />
        )}
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600 mb-4">{date} • {time}</p>
        <p className="text-lg text-gray-800">{description}</p>
      </main>
      <Footer />
    </>
  );
}

export async function getStaticProps({ params }) {
  const query = `*[_type == "event" && slug.current == $slug][0]{
    title,
    description,
    date,
    time,
    image,
    metaDescription,
    openGraphImage
  }`;

  const event = await client.fetch(query, { slug: params.slug });

  return {
    props: { event },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const query = `*[_type == "event"]{ "slug": slug.current }`;
  const slugs = await client.fetch(query);

  const paths = slugs.map((s) => ({
    params: { slug: s.slug },
  }));

  return { paths, fallback: true };
}
