'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './demo-design.module.css';
import { useSearchParams } from 'next/navigation';

export default function DemoDesign() {
  const [selectedPalette, setSelectedPalette] = useState([]);
  const [customColor, setCustomColor] = useState('#333333');
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop', 'tablet', or 'mobile'
  const [previewStyles, setPreviewStyles] = useState({
    navbar: {
      backgroundColor: '#ffffff',
      color: '#333333'
    },
    hero: {
      backgroundColor: '#f8f9fa',
      color: '#333333'
    },
    footer: {
      backgroundColor: '#ffffff',
      color: '#333333'
    }
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const palette = params.get('palette');
    if (palette) {
      try {
        const parsedPalette = JSON.parse(decodeURIComponent(palette));
        const colors = Array.isArray(parsedPalette) ? parsedPalette : 
                      (parsedPalette.colors && Array.isArray(parsedPalette.colors)) ? parsedPalette.colors : [];
        
        // Initialize with custom color for text
        const initialColors = [...colors];
        initialColors[1] = customColor; // navbar text
        initialColors[3] = customColor; // hero text
        initialColors[5] = customColor; // footer text
        
        setSelectedPalette(initialColors);
        updatePreviewStyles(initialColors);
      } catch (error) {
        console.error('Error parsing palette:', error);
        setSelectedPalette([]);
      }
    }
  }, [customColor, updatePreviewStyles]);

  const updatePreviewStyles = (colors) => {
    setPreviewStyles({
      navbar: {
        backgroundColor: colors[0] || '#ffffff',
        color: colors[1] || customColor
      },
      hero: {
        backgroundColor: colors[2] || '#f8f9fa',
        color: colors[3] || customColor
      },
      footer: {
        backgroundColor: colors[4] || '#ffffff',
        color: colors[5] || customColor
      }
    });
  };

  const handleColorChange = (element, color) => {
    console.log('Color change:', element, color);
    const newColors = [...selectedPalette];
    switch(element) {
      case 'navbarBg':
        newColors[0] = color;
        break;
      case 'navbarText':
        newColors[1] = color;
        break;
      case 'heroBg':
        newColors[2] = color;
        break;
      case 'heroText':
        newColors[3] = color;
        break;
      case 'footerBg':
        newColors[4] = color;
        break;
      case 'footerText':
        newColors[5] = color;
        break;
    }
    setSelectedPalette(newColors);
    updatePreviewStyles(newColors);
  };

  const handleCopy = (color) => {
    navigator.clipboard.writeText(color);
  };

  const handlePreviewClick = (mode) => {
    setPreviewMode(mode);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <Link href="/" className={styles.backButton}>
              ← Back to Home
            </Link>
          </div>

          {selectedPalette.length > 0 && (
            <div className={styles.paletteColors}>
              {selectedPalette.map((color, index) => (
                <div
                  key={index}
                  className={styles.colorPreview}
                  style={{ backgroundColor: color }}
                  onClick={() => handleCopy(color)}
                  title={`Click to copy ${color}`}
                />
              ))}
            </div>
          )}

          <div className={styles.customColor}>
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              title="Custom color"
            />
            <span>Custom Color</span>
          </div>

          <div className={styles.colorControls}>
            <div className={styles.colorControl}>
              <label>Navbar Background</label>
              <select 
                value={selectedPalette[0] || customColor}
                onChange={(e) => handleColorChange('navbarBg', e.target.value)}
              >
                <option value={customColor}>Custom</option>
                {selectedPalette.map((color, index) => (
                  <option key={index} value={color}>
                    Color {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.colorControl}>
              <label>Navbar Text</label>
              <select 
                value={selectedPalette[1] || customColor}
                onChange={(e) => handleColorChange('navbarText', e.target.value)}
              >
                <option value={customColor}>Custom</option>
                {selectedPalette.map((color, index) => (
                  <option key={index} value={color}>
                    Color {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.colorControl}>
              <label>Hero Background</label>
              <select 
                value={selectedPalette[2] || customColor}
                onChange={(e) => handleColorChange('heroBg', e.target.value)}
              >
                <option value={customColor}>Custom</option>
                {selectedPalette.map((color, index) => (
                  <option key={index} value={color}>
                    Color {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.colorControl}>
              <label>Hero Text</label>
              <select 
                value={selectedPalette[3] || customColor}
                onChange={(e) => handleColorChange('heroText', e.target.value)}
              >
                <option value={customColor}>Custom</option>
                {selectedPalette.map((color, index) => (
                  <option key={index} value={color}>
                    Color {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.colorControl}>
              <label>Button Background</label>
              <select 
                value={selectedPalette[4] || customColor}
                onChange={(e) => handleColorChange('buttonBg', e.target.value)}
              >
                <option value={customColor}>Custom</option>
                {selectedPalette.map((color, index) => (
                  <option key={index} value={color}>
                    Color {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.colorControl}>
              <label>Button Text</label>
              <select 
                value={selectedPalette[5] || customColor}
                onChange={(e) => handleColorChange('buttonText', e.target.value)}
              >
                <option value={customColor}>Custom</option>
                {selectedPalette.map((color, index) => (
                  <option key={index} value={color}>
                    Color {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.colorControl}>
              <label>Footer Background</label>
              <select 
                value={selectedPalette[4] || customColor}
                onChange={(e) => handleColorChange('footerBg', e.target.value)}
              >
                <option value={customColor}>Custom</option>
                {selectedPalette.map((color, index) => (
                  <option key={index} value={color}>
                    Color {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.colorControl}>
              <label>Footer Text</label>
              <select 
                value={selectedPalette[5] || customColor}
                onChange={(e) => handleColorChange('footerText', e.target.value)}
              >
                <option value={customColor}>Custom</option>
                {selectedPalette.map((color, index) => (
                  <option key={index} value={color}>
                    Color {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.preview}>
          <div className={styles.previewHeader}>
            <div className={styles.previewControls}>
              <button 
                className={`${styles.previewButton} ${previewMode === 'desktop' ? styles.active : ''}`}
                onClick={() => handlePreviewClick('desktop')}
              >
                Desktop
              </button>
              <button 
                className={`${styles.previewButton} ${previewMode === 'tablet' ? styles.active : ''}`}
                onClick={() => handlePreviewClick('tablet')}
              >
                Tablet
              </button>
              <button 
                className={`${styles.previewButton} ${previewMode === 'mobile' ? styles.active : ''}`}
                onClick={() => handlePreviewClick('mobile')}
              >
                Mobile
              </button>
            </div>
          </div>

          <div 
            className={`${styles.previewContent} ${previewMode !== 'desktop' ? styles[previewMode] : ''}`}
            onClick={() => previewMode !== 'desktop' && handlePreviewClick('desktop')}
          >
            <nav className={styles.previewNav} style={previewStyles.navbar}>
              <div className={styles.navContent}>
                <div className={styles.navBrand}>Brand</div>
                <div className={styles.navLinks}>
                  <a href="#">Home</a>
                  <a href="#">About</a>
                  <a href="#">Contact</a>
                </div>
              </div>
            </nav>

            <section className={styles.heroSection} style={previewStyles.hero}>
              <div className={styles.heroContent}>
                <h1>Create Beautiful Designs</h1>
                <p>Transform your ideas into stunning visuals with our powerful design tools.</p>
                <div className={styles.heroButtons}>
                  <button 
                    className={styles.primaryButton}
                    style={{ 
                      backgroundColor: selectedPalette[4] || customColor,
                      color: selectedPalette[5] || customColor
                    }}
                  >
                    Get Started
                  </button>
                  <button 
                    className={styles.secondaryButton}
                    style={{ 
                      backgroundColor: 'transparent',
                      color: selectedPalette[4] || customColor,
                      border: `2px solid ${selectedPalette[4] || customColor}`
                    }}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </section>

            <div className={styles.footer} style={previewStyles.footer}>
              <div className={styles.footerContent}>
                <p>© 2024 Culrs. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 