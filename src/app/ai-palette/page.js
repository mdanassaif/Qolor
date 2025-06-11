'use client';

import { useState, useEffect } from 'react';
import { FaPalette, FaSpinner, FaHeart, FaRegHeart, FaEye, FaTrash, FaCopy } from 'react-icons/fa';
import Image from 'next/image';
import styles from './ai-palette.module.css';
import Link from 'next/link';
import Header from '@/components/Header';

// Constants for localStorage keys
const STORAGE_KEYS = {
  PALETTES: 'culrs_ai_palettes',
  LIKED: 'culrs_liked_palettes',
  COLLECTION: 'culrs_collection'
};

// Helper function to get data from localStorage
const getFromStorage = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (err) {
    console.error(`Error reading from localStorage (${key}):`, err);
    return null;
  }
};

// Helper function to save data to localStorage
const saveToStorage = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving to localStorage (${key}):`, err);
  }
};

export default function AIPalette() {
  const [prompt, setPrompt] = useState('');
  const [generatedPalettes, setGeneratedPalettes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [likedPalettes, setLikedPalettes] = useState(new Set());
  const [showCopyIndicator, setShowCopyIndicator] = useState(false);
  const [copiedColor, setCopiedColor] = useState('');

  // Load saved palettes and liked state from localStorage
  useEffect(() => {
    const loadSavedData = () => {
      const savedPalettes = getFromStorage(STORAGE_KEYS.PALETTES);
      const savedLikedPalettes = getFromStorage(STORAGE_KEYS.LIKED);

      if (savedPalettes) {
        // Sort palettes by timestamp, newest first
        const sortedPalettes = [...savedPalettes].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setGeneratedPalettes(sortedPalettes);
      }

      if (savedLikedPalettes) {
        setLikedPalettes(new Set(savedLikedPalettes));
      }
    };

    // Load data on mount
    loadSavedData();

    // Add event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.PALETTES || e.key === STORAGE_KEYS.LIKED) {
        loadSavedData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save palettes to localStorage whenever they change
  useEffect(() => {
    if (generatedPalettes.length > 0) {
      saveToStorage(STORAGE_KEYS.PALETTES, generatedPalettes);
    }
  }, [generatedPalettes]);

  // Save liked state to localStorage whenever it changes
  useEffect(() => {
    if (likedPalettes.size > 0) {
      saveToStorage(STORAGE_KEYS.LIKED, Array.from(likedPalettes));
    }
  }, [likedPalettes]);

  const generatePalette = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-palette', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate palette');
      }

      const data = await response.json();
      
      // Create a new palette object with the generated colors
      const newPalette = {
        id: Date.now(),
        name: prompt,
        colors: data.palette,
        likes: 0,
        timestamp: new Date().toISOString(),
        prompt: prompt // Store the original prompt
      };

      // Add new palette to the beginning of the array
      setGeneratedPalettes(prev => {
        const updatedPalettes = [newPalette, ...prev];
        saveToStorage(STORAGE_KEYS.PALETTES, updatedPalettes);
        return updatedPalettes;
      });
      
      setPrompt(''); // Clear the prompt after successful generation
    } catch (err) {
      setError('Failed to generate palette. Please try again.');
      console.error('Error generating palette:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (color) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setShowCopyIndicator(true);
      setTimeout(() => {
        setShowCopyIndicator(false);
        setCopiedColor('');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const handleLike = (paletteId) => {
    const palette = generatedPalettes.find(p => p.id === paletteId);
    if (!palette) return;

    setLikedPalettes(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(paletteId)) {
        // Remove from collection
        newLiked.delete(paletteId);
        const collection = getFromStorage(STORAGE_KEYS.COLLECTION) || [];
        const updatedCollection = collection.filter(p => p.id !== paletteId);
        saveToStorage(STORAGE_KEYS.COLLECTION, updatedCollection);
      } else {
        // Add to collection
        newLiked.add(paletteId);
        const collection = getFromStorage(STORAGE_KEYS.COLLECTION) || [];
        // Check if palette already exists in collection
        const exists = collection.some(p => p.id === paletteId);
        if (!exists) {
          const updatedCollection = [...collection, {
            ...palette,
            source: 'ai-generated',
            timestamp: new Date().toISOString()
          }];
          saveToStorage(STORAGE_KEYS.COLLECTION, updatedCollection);
        }
      }
      saveToStorage(STORAGE_KEYS.LIKED, Array.from(newLiked));
      return newLiked;
    });
  };

  const handleDelete = (paletteId) => {
    setGeneratedPalettes(prev => {
      const updatedPalettes = prev.filter(palette => palette.id !== paletteId);
      saveToStorage(STORAGE_KEYS.PALETTES, updatedPalettes);
      return updatedPalettes;
    });
    
    setLikedPalettes(prev => {
      const newLiked = new Set(prev);
      newLiked.delete(paletteId);
      saveToStorage(STORAGE_KEYS.LIKED, Array.from(newLiked));
      return newLiked;
    });

    // Also remove from collection if it exists there
    const collection = getFromStorage(STORAGE_KEYS.COLLECTION) || [];
    const updatedCollection = collection.filter(p => p.id !== paletteId);
    saveToStorage(STORAGE_KEYS.COLLECTION, updatedCollection);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.generator}>
          <div className={styles.generatorHeader}>
            <h1 className={styles.title}>AI Qolor Palette</h1>
            <p className={styles.description}>
              Describe your desired color palette and let AI create it for you
            </p>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A warm and cozy autumn palette"
              className={styles.input}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isLoading && prompt.trim()) {
                  generatePalette();
                }
              }}
            />
            <button
              onClick={generatePalette}
              disabled={isLoading || !prompt.trim()}
              className={styles.generateButton}
            >
              {isLoading ? (
                <FaSpinner className={styles.spinner} />
              ) : (
                <Image
                  src="/qolor.png"
                  alt="Culrs Logo"
                  width={20}
                  height={20}
                  className={styles.buttonLogo}
                />
              )}
              Generate Palette
            </button>
          </div>

          <div className={styles.suggestedPrompts}>
            <div className={styles.promptChips}>
              <button
                onClick={() => setPrompt("A modern tech startup palette")}
                className={styles.promptChip}
              >
                Modern Tech Startup
              </button>
              <button
                onClick={() => setPrompt("A calming ocean-inspired palette")}
                className={styles.promptChip}
              >
                Ocean Calm
              </button>
              <button
                onClick={() => setPrompt("A vibrant sunset gradient")}
                className={styles.promptChip}
              >
                Sunset Vibes
              </button>
              <button
                onClick={() => setPrompt("A professional corporate palette")}
                className={styles.promptChip}
              >
                Corporate Professional
              </button>
              <button
                onClick={() => setPrompt("A playful children's app palette")}
                className={styles.promptChip}
              >
                Playful Kids
              </button>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          {generatedPalettes.length > 0 && (
            <div className={styles.savedPalettes}>
              <h2 className={styles.savedPalettesTitle}>Your AI Generated Palettes</h2>
              <div className={styles.palettesGrid}>
                {generatedPalettes.map((palette) => (
                  <div key={palette.id} className={styles.paletteCard}>
                    <div className={styles.colorStrip}>
                      {palette.colors.map((color, index) => (
                        <div
                          key={index}
                          className={styles.color}
                          style={{ backgroundColor: color }}
                          onClick={() => handleCopy(color)}
                          title={`Click to copy ${color}`}
                        >
                          <span className={styles.colorHex}>{color}</span>
                        </div>
                      ))}
                      {showCopyIndicator && (
                        <div className={styles.copyIndicator}>
                          <FaCopy />
                          <span>Copied {copiedColor}!</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.paletteInfo}>
                      <div className={styles.paletteHeader}>
                        <h3 className={styles.paletteName}>{palette.name}</h3>
                      </div>
                      <div className={styles.paletteActions}>
                        <button
                          onClick={() => handleLike(palette.id)}
                          className={`${styles.actionButton} ${likedPalettes.has(palette.id) ? styles.liked : ''}`}
                          title={likedPalettes.has(palette.id) ? 'Remove from collection' : 'Add to collection'}
                        >
                          {likedPalettes.has(palette.id) ? <FaHeart /> : <FaRegHeart />}
                        </button>
                        <button
                          onClick={() => {
                            const colors = encodeURIComponent(JSON.stringify(palette.colors));
                            window.location.href = `/demo-design?colors=${colors}`;
                          }}
                          className={styles.actionButton}
                          title="Preview in demo"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleDelete(palette.id)}
                          className={styles.actionButton}
                          title="Delete palette"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 