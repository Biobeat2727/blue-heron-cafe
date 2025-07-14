import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0891b2" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}