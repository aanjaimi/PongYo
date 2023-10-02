import Head from "next/head";
import Test from "@/components/Home";
import Landingpage from "@/components/Landingpage";

export default function Home() {
  return (
    <>
      <Head>
        <title>Ping Pong</title>
        <link rel="icon" href="/favicon.ico" />
        <style>
          @import
          url(`https://fonts.googleapis.com/css2?family=Outfit&display=swap`);
        </style>
      </Head>
      <Landingpage/>
    </>
  );
}
