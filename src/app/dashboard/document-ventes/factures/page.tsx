// This is the main Page component for the /factures route
// In Next.js App Router, this is a Server Component by default

import FacturesClient from './client';

// Server Component
export default function FacturesPage() {
  // In a real app, you would fetch data from your API or database here
  // Since the data is static in the example, we'll pass it to the client component
  
  return (
    <FacturesClient />
  );
}

// You could add metadata for the page
export const metadata = {
  title: 'Gestion des Factures',
  description: 'Gérez vos factures et suivez leur état de paiement',
};