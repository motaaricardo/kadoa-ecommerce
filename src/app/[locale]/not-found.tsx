import { Link } from '@/i18n/routing';

export default function NotFound() {
  return (
    <section className="section">
      <div className="mx-auto max-w-md card text-center">
        <p className="font-display text-6xl font-bold text-accent-300">404</p>
        <p className="mt-4 text-ink-soft">Page introuvable.</p>
        <Link href="/" className="btn-primary mt-6">Retour à l'accueil</Link>
      </div>
    </section>
  );
}
