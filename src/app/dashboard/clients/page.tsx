// app/dashboard/clients/page.tsx
'use client';

// import React from 'react';
// import ClientsPage from '@/app/components/clients/ClientsPage';

// export default function ClientsDashboardPage() {
//   return <ClientsPage />;
// }


'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ClientsPage = dynamic(
  () => import('@/app/components/clients/ClientsPage'),
  {
    // This page is purely client‑side; no SSR
    ssr: false,
    // A small fallback while pulling down the JS chunk
    loading: () => <div className="p-8 text-center">Chargement de la page client…</div>,
  }
);

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Chargement…</div>}>
      <ClientsPage />
    </Suspense>
  );
}
