import Header from '@/components/Header';
import CollectionContent from './CollectionContent';
import styles from './collection.module.css';

export default function Collection() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Your Collection</h1>
        <CollectionContent />
      </main>
    </div>
  );
} 