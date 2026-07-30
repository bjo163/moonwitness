import Head from "next/head";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

const AppWithoutSSR = dynamic(() => import("@/App"), { ssr: false });

export default function Home() {
    return (
        <>
            <Head>
                <title>Rocksoul — Celitereal Chronicles</title>
                <meta name="description" content="Rocksoul is a cosmic MMORPG adventure set in the Celitereal — a realm of floating rock islands suspended in cosmic energy. Gather Soul Rocks, battle the Void Devourer, and restore balance to the Celitereal." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="keywords" content="Rocksoul, MMORPG, cosmic adventure, Phaser game, Celitereal, void devourer, soul rocks" />
                <meta name="theme-color" content="#0a0a1a" />
                <link rel="icon" href="/favicon.png" />
                <meta property="og:title" content="Rocksoul — Celitereal Chronicles" />
                <meta property="og:description" content="A cosmic MMORPG adventure across floating rock islands. Gather the twelve Soul Rocks and banish the Void Devourer." />
                <meta property="og:type" content="website" />
            </Head>
            <main className="rocksoul-main">
                <AppWithoutSSR />
            </main>
        </>
    );
}