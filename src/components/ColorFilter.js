'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/ColorFilter.module.css';

const colorFilters = [
  { name: 'red', color: '#ff4757', path: '/palettes/red' },
  { name: 'pink', color: '#ff6b9d', path: '/palettes/pink' },
  { name: 'purple', color: '#c44569', path: '/palettes/purple' },
  { name: 'blue', color: '#3742fa', path: '/palettes/blue' },
  { name: 'cyan', color: '#00d2d3', path: '/palettes/cyan' },
  { name: 'teal', color: '#2f3542', path: '/palettes/teal' },
  { name: 'green', color: '#2ed573', path: '/palettes/green' },
  { name: 'lime', color: '#7bed9f', path: '/palettes/lime' },
  { name: 'yellow', color: '#ffa502', path: '/palettes/yellow' },
  { name: 'analogous', color: 'linear-gradient(45deg, #ff4757, #ff6b9d, #c44569)', path: '/palettes/analogous' }
];

export default function ColorFilter() {
  const pathname = usePathname();
  const currentColor = pathname.split('/').pop();

  return (
    <div className={styles.filterBar}>
      <div className={styles.container}>
        {colorFilters.map((filter) => (
          <Link
            key={filter.name}
            href={filter.path}
            className={`${styles.filterButton} ${currentColor === filter.name ? styles.active : ''}`}
            style={{ '--filter-color': filter.color }}
          >
            <div className={styles.filterColor} />
            <span>{filter.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}