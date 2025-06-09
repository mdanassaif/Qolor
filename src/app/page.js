'use client'
import Head from 'next/head';
import Header from '../components/Header';
import ColorFilter from '../components/ColorFilter';
import PaletteCard from '../components/PaletteCard';
import { palettesData } from '../data/palettes';
import styles from '../styles/Home.module.css';

export default function Home() {
  // Show all palettes on home page
  const allPalettes = Object.values(palettesData).flat();

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
 