// File: components/ui/LoadingSpinner.jsx
import { memo } from 'react';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E05D5D]"></div>
      <span className="sr-only">Chargement...</span>
    </div>
  );
}

export default memo(LoadingSpinner);