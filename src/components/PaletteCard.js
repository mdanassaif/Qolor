'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHeart, FaRegHeart, FaCopy, FaEye } from 'react-icons/fa';
import styles from '@/styles/PaletteCard.module.css';

export default function PaletteCard({ palette }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [showCopyIndicator, setShowCopyIndicator] = useState(false);
  const [copiedColor, setCopiedColor] = useState('');

  useEffect(() => {
    // Check if palette is in favorites on component mount
    const favorites = JSON.parse(localStorage.getItem('favoritePalettes') || '[]');
    setIsLiked(favorites.some(fav => fav.name === palette.name));
  }, [palette.name]);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('favoritePalettes') || '[]');
    const newFavorites = isLiked
      ? favorites.filter(fav => fav.name !== palette.name)
      : [...favorites, palette];
    
    localStorage.setItem('favoritePalettes', JSON.stringify(newFavorites));
    setIsLiked(!isLiked);
  };

  const handleCopy = (e, color) => {
    e.preventDefault();
    e.stopPropagation();
    
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setShowCopyIndicator(true);
    setTimeout(() => {
      setShowCopyIndicator(false);
      setCopiedColor('');
    }, 2000);
  };

  const handleTryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/demo-design?palette=${encodeURIComponent(JSON.stringify(palette))}`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.colorStrip}>
        {palette.colors.map((color, index) => (
          <div
            key={index}
            className={styles.color}
            style={{ backgroundColor: color }}
            onClick={(e) => handleCopy(e, color)}
            title={`Click to copy ${color}`}
          />
        ))}
        {showCopyIndicator && (
          <div className={styles.copyIndicator}>
            <FaCopy />
            <span>Copied {copiedColor}!</span>
          </div>
        )}
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.paletteName}>{palette.name}</h3>
        <div className={styles.actions}>
          <button
            onClick={handleLike}
            className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
            aria-label={isLiked ? 'Unlike palette' : 'Like palette'}
            title={isLiked ? 'Remove from collection' : 'Add to collection'}
          >
            {isLiked ? <FaHeart /> : <FaRegHeart />}
          </button>
          <button 
            onClick={handleTryClick}
            className={styles.tryButton}
            title="Preview in demo"
          >
            <FaEye />
          </button>
        </div>
      </div>
    </div>
  );
}
 