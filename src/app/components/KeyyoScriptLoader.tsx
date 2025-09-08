'use client';
// src/app/components/KeyyoScriptLoader.tsx
import { useState } from 'react';
import Script from 'next/script';

interface KeyyoScriptLoaderProps {
  children: React.ReactNode;
}

const KeyyoScriptLoader = ({ children }: KeyyoScriptLoaderProps) => {
  const [ , setScriptLoaded] = useState(false);

  const handleScriptLoad = () => {
    setScriptLoaded(true);
    console.log('Keyyo CTI script loaded');
  };

  return (
    <>
      <Script
        src="https://api.keyyo.com/libs/keyyo-cti/1.1/keyyo-cti.min.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
      {children}
    </>
  );
};

export default KeyyoScriptLoader;