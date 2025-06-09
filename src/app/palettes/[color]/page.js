import Header from '../../../components/Header';
import ColorFilter from '../../../components/ColorFilter';
import PaletteCard from '../../../components/PaletteCard';
import { palettesData } from '../../../data/palettes';
import styles from '../../../styles/Home.module.css';

export default function ColorPalettes({ params }) {
  const { color } = params;
  // Only get palettes for the selected color category
  const palettes = palettesData[color] || [];

  return (
    <div className={styles.container}>
      <Header />
      <ColorFilter />
      
      <main className={styles.main}>
        <div className={styles.grid}>
          {palettes.map((palette, index) => (
            <PaletteCard key={index} palette={palette} />
          ))}
        </div>
      </main>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { color } = params;
  return {
    title: `${color.charAt(0).toUpperCase() + color.slice(1)} Color Palettes`,
    description: `Explore ${color} color palettes`,
  };
} 