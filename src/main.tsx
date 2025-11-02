import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { UserProvider } from './contexts/UserContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

// Warm up core assets for offline support
async function warmupCoreAssets() {
  if (!('serviceWorker' in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  const res = await fetch('/content-manifest.json');
  const manifest = await res.json();

  const coreLessonIds = new Set(
    manifest.lessons.filter((l: any) => l.isCore).map((l: any) => l.id)
  );

  const coreAssets = new Set<string>();
  manifest.scenes
    .filter((s: any) => coreLessonIds.has(s.lessonId))
    .forEach((s: any) => (s.assets || []).forEach((a: string) => coreAssets.add(a)));

  reg.active?.postMessage({ type: 'WARMUP_CACHE', assets: [...coreAssets] });
}
warmupCoreAssets().catch(console.error);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <UserProvider>
        <App />
      </UserProvider>
    </ErrorBoundary>
  </StrictMode>
);
