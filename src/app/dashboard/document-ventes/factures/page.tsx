// This is the main Page component for the /factures route
// In Next.js App Router, this is a Server Component by default

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load the entire client component with a loading state
const FacturesClient = dynamic(() => import('./client'), {
  loading: () => <div className="pt-16 pb-16 min-h-screen">
                   <div className="pt-12 max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
                     <div className="animate-pulse bg-gray-200 h-8 w-1/4 rounded mb-8"></div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                       {[1,2,3].map(i => (
                         <div key={i} className="animate-pulse bg-gray-200 h-24 rounded"></div>
                       ))}
                     </div>
                     <div className="animate-pulse bg-gray-200 h-12 rounded mb-8"></div>
                     <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
                   </div>
                 </div>
});

// Server Component
export default function FacturesPage() {
  // In a real app, you would fetch data from your API or database here
  // Since the data is static in the example, we'll pass it to the client component
  
  return (
    <Suspense fallback={<div className="pt-16 pb-16 min-h-screen">
                          <div className="pt-12 max-w-7xl mx-auto text-center">
                            Chargement des factures...
                          </div>
                        </div>}>
      <FacturesClient />
    </Suspense>
  );
}

// You could add metadata for the page
export const metadata = {
  title: 'Gestion des Factures',
  description: 'Gérez vos factures et suivez leur état de paiement',
};