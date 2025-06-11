'use client'
import Head from 'next/head';
import Header from '../components/Header';
import ColorFilter from '../components/ColorFilter';
import PaletteCard from '../components/PaletteCard';
import { palettesData } from '../data/palettes';
import styles from '../styles/Home.module.css';

// Function to get a deterministic random number based on date
const getSeededRandom = () => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return (seed * 9301 + 49297) % 233280 / 233280;
};

// Function to shuffle array deterministically
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(getSeededRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Home() {
  // Get all palettes and shuffle them deterministically
  const allPalettes = shuffleArray([...Object.values(palettesData).flat()]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Browse premium handcurated color palettes</title>
        <meta name="description" content="Explore crafted and curated color palettes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <ColorFilter />
      
      <main className={styles.main}>
        <div className={styles.grid}>
          {allPalettes.map((palette, index) => (
            <PaletteCard key={index} palette={palette} />
          ))}
        </div>
      </main>
    </div>
  );
}
 