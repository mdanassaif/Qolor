'use client';

import { useState, useEffect } from 'react';
import PaletteCard from '@/components/PaletteCard';
import styles from './collection.module.css';

export default function CollectionContent() {
  const [favoritePalettes, setFavoritePalettes] = useState([]);

  useEffect(() => {
    // Load favorites from localStorage
    const loadFavorites = () => {
      const favorites = JSON.parse(localStorage.getItem('culrs_collection') || '[]');
      setFavoritePalettes(favorites);
    };

    loadFavorites();

    // Listen for changes in localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'culrs_collection') {
        loadFavorites();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (favoritePalettes.length === 0) {
    return <p className={styles.emptyState}>Collection is empty</p>;
  }

  return (
    <div className={styles.grid}>
      {favoritePalettes.map((palette, index) => (
        <PaletteCard key={`${palette.name}-${index}`} palette={palette} />
      ))}
    </div>
  );
} 