'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FaCopy, FaEye, FaUndo, FaRandom, FaPalette } from 'react-icons/fa';
import styles from './demo-design.module.css';
import { useSearchParams } from 'next/navigation';

export default function DemoDesign() {
  const [selectedPalette, setSelectedPalette] = useState([]);
  const [originalPalette, setOriginalPalette] = useState([]);
  const [customColor, setCustomColor] = useState('#333333');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [copiedColor, setCopiedColor] = useState('');
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

  const updatePreviewStyles = useCallback((colors) => {
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
  }, [customColor]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const colors = params.get('colors');
    if (colors) {
      try {
        const parsedColors = JSON.parse(decodeURIComponent(colors));
        const initialColors = [...parsedColors];
        initialColors[1] = customColor;
        initialColors[3] = customColor;
        initialColors[7] = customColor;
        
        setOriginalPalette(parsedColors);
        setSelectedPalette(initialColors);
        updatePreviewStyles(initialColors);
      } catch (error) {
        console.error('Error parsing colors:', error);
        setSelectedPalette([]);
        setOriginalPalette([]);
      }
    }
  }, [customColor, updatePreviewStyles]);

  const handleColorChange = (element, color) => {
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
      case 'buttonBg':
        newColors[6] = color;
        break;
      case 'buttonText':
        newColors[7] = color;
        break;
      case 'secondaryButton':
        newColors[8] = color;
        break;
    }
    setSelectedPalette(newColors);
    updatePreviewStyles(newColors);
  };

  const handleCopy = (color) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  const handlePreviewClick = (mode) => {
    setPreviewMode(mode);
  };

  const handleReset = () => {
    const initialColors = [...originalPalette];
    initialColors[1] = customColor;
    initialColors[3] = customColor;
    initialColors[7] = customColor;
    setSelectedPalette(initialColors);
    updatePreviewStyles(initialColors);
  };

  const handleRandomize = () => {
    const newColors = [...selectedPalette];
    for (let i = 0; i < newColors.length; i++) {
      if (i % 2 === 0) { // Only randomize background colors
        const randomIndex = Math.floor(Math.random() * originalPalette.length);
        newColors[i] = originalPalette[randomIndex];
      }
    }
    setSelectedPalette(newColors);
    updatePreviewStyles(newColors);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <Link href="/" className={styles.backButton}>
              ← Back to Home
            </Link>
            <div className={styles.headerActions}>
              <button onClick={handleReset} className={styles.actionButton} title="Reset to original">
                <FaUndo />
              </button>
              <button onClick={handleRandomize} className={styles.actionButton} title="Randomize colors">
                <FaRandom />
              </button>
            </div>
          </div>

          {originalPalette.length > 0 && (
            <div className={styles.paletteColors}>
              {originalPalette.map((color, index) => (
                <div
                  key={index}
                  className={styles.colorPreview}
                  style={{ backgroundColor: color }}
                  onClick={() => handleCopy(color)}
                  title={`Click to copy ${color}`}
                >
                  <span className={styles.colorHex}>{color}</span>
                </div>
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
                value={selectedPalette[0] || '#ffffff'}
                onChange={(e) => handleColorChange('navbarBg', e.target.value)}
              >
                <option value={customColor}>Custom</option>
                {originalPalette.map((color, index) => (
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
                {originalPalette.map((color, index) => (
                  <option key={index} value={color}>
                    Color {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.colorControl}>
              <label>Hero Background</label>
              <select 
                value={selectedPalette[2] || '#f8f9fa'}
                onChange={(e) => handleColorChange('heroBg', e.target.value)}
              >
                <option value={customColor}>Custom</option>
                {originalPalette.map((color, index) => (
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
                {originalPalette.map((color, index) => (
                  <option key={index} value={color}>
                    Color {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.colorControl}>
              <label>Footer Background</label>
              <select 
                value={selectedPalette[4] || '#ffffff'}
                onChange={(e) => handleColorChange('footerBg', e.target.value)}
              >
                <option value={customColor}>Custom</option>
                {originalPalette.map((color, index) => (
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
                {originalPalette.map((color, index) => (
                  <option key={index} value={color}>
                    Color {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.colorControl}>
              <label>Primary Button Background</label>
              <select 
                value={selectedPalette[6] || customColor}
                onChange={(e) => handleColorChange('buttonBg', e.target.value)}
              >
                <option value={customColor}>Custom</option>
                {originalPalette.map((color, index) => (
                  <option key={index} value={color}>
                    Color {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.colorControl}>
              <label>Primary Button Text</label>
              <select 
                value={selectedPalette[7] || customColor}
                onChange={(e) => handleColorChange('buttonText', e.target.value)}
              >
                <option value={customColor}>Custom</option>
                {originalPalette.map((color, index) => (
                  <option key={index} value={color}>
                    Color {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.colorControl}>
              <label>Secondary Button Color</label>
              <select 
                value={selectedPalette[8] || customColor}
                onChange={(e) => handleColorChange('secondaryButton', e.target.value)}
              >
                <option value={customColor}>Custom</option>
                {originalPalette.map((color, index) => (
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
                <FaEye /> Desktop
              </button>
              <button 
                className={`${styles.previewButton} ${previewMode === 'tablet' ? styles.active : ''}`}
                onClick={() => handlePreviewClick('tablet')}
              >
                <FaEye /> Tablet
              </button>
              <button 
                className={`${styles.previewButton} ${previewMode === 'mobile' ? styles.active : ''}`}
                onClick={() => handlePreviewClick('mobile')}
              >
                <FaEye /> Mobile
              </button>
            </div>
          </div>

          <div className={styles.previewWrapper}>
            <div 
              className={`${styles.previewContent} ${previewMode !== 'desktop' ? styles[previewMode] : ''}`}
            >
              <nav className={styles.previewNav} style={previewStyles.navbar}>
                <div className={styles.navContent}>
                  <div className={styles.navBrand}>
                    <FaPalette /> Brand
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
                        backgroundColor: selectedPalette[6] || customColor,
                        color: selectedPalette[1] || customColor
                      }}
                    >
                      Get Started
                    </button>
                    <button 
                      className={styles.secondaryButton}
                      style={{ 
                        backgroundColor: 'transparent',
                        color: selectedPalette[8] || customColor,
                        border: `2px solid ${selectedPalette[8] || customColor}`
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
        </div>
      </main>

      {showCopyToast && (
        <div className={styles.copyToast}>
          <FaCopy /> Copied {copiedColor}!
        </div>
      )}
    </div>
  );
} 