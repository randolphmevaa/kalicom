
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const UsersPage = dynamic(
  () => import('./UsersPage'),
  {
    // This page is purely client‑side; no SSR
    ssr: false,
    // A small fallback while pulling down the JS chunk
    loading: () => <div className="p-8 text-center">Chargement de l’interface emails…</div>,
  }
);

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Chargement…</div>}>
      <UsersPage />
    </Suspense>
  );
}
