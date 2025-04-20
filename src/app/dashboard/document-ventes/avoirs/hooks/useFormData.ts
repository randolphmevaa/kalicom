// hooks/useFormData.ts
import { useState, ChangeEvent } from 'react';
import { FormData } from '../types';

const useFormData = () => {
  // State for form fields
  const [formData, setFormData] = useState<FormData>({
    numero: 'AV-2025-001',
    codeTiers: '',
    civilite: '',
    nom: '',
    prenom: '',
    adresse: '',
    codePostal: '',
    ville: '',
    reference: '',
    factureLiee: '',
    motif: 'Erreur de facturation',
    etat: 'En attente',
    date: new Date().toISOString().split('T')[0],
    dateReglement: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
    modeReglement: 'Virement',
    modeCalcul: 'HT',
    montantHT: '0.00',
  });

  // Handle input change for form fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    formData,
    setFormData,
    handleInputChange
  };
};

export default useFormData;