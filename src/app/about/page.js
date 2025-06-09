import Header from '../../components/Header';
import styles from './about.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>About Qolor</h1>
        
        <section className={styles.section}>
          <p className={styles.intro}>
            Qolor is a simple yet powerful tool that helps you discover and use beautiful color palettes in your projects. 
            Whether you're designing a website, creating an app, or working on any visual project, Qolor makes it easy to find 
            the perfect colors.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Features</h2>
          <ul className={styles.features}>
            <li>✨ Handpicked color palettes</li>
            <li>🎨 One-click color copying</li>
            <li>💖 Save your favorites</li>
            <li>🔍 Filter by color categories</li>
            <li>📱 Preview in different devices</li>
          </ul>
        </section>

        <footer className={styles.footer}>
          <p>Made with ❤️ by <a href="https://x.com/mdanassaif" target="_blank" rel="noopener noreferrer">@mdanassaif</a></p>
        </footer>
      </main>
    </div>
  );
} 