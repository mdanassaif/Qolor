'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from '../styles/Header.module.css';

export default function Header() {
  const [currentColor, setCurrentColor] = useState('#ff4757');

  useEffect(() => {
    const colors = [
      '#ff4757', // red
      '#ff6b9d', // pink
      '#c44569', // purple
      '#3742fa', // blue
      '#00d2d3', // cyan
      '#2f3542', // teal
      '#2ed573', // green
      '#7bed9f', // lime
      '#ffa502', // yellow
    ];

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * colors.length);
      setCurrentColor(colors[randomIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoContent}>
            <Image
              src="/qolor.png"
              alt="Qolor Logo"
              width={32}
              height={32}
              className={styles.logoImage}
            />
            <div className={styles.logoText}>
              {/* <h1 className={styles.brandName}>Qolor</h1> */}
              <span className={`${styles.tagline} ${styles.jostFont}`}>handcurated color palettes<br/> for developers :)</span>
            </div>
          </div>
        </Link>
        <nav className={styles.nav}>
          <Link href="/collection" className={styles.navLink}>
            Collection
          </Link>
          <Link href="/about" className={styles.navLink}>
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}