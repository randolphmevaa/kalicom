

'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Whatsapp = dynamic(
  () => import('./Whatsapp'),
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
      <Whatsapp />
    </Suspense>
  );
}
