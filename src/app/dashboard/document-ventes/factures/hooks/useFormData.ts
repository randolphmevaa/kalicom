import { useState, ChangeEvent, useCallback } from 'react';
import { FormData, Client } from '../types';

export const useFormData = () => {
  // State for form fields
  const [formData, setFormData] = useState<FormData>({
    numero: 'FACT-2025-011',
    codeTiers: '',
    civilite: '',
    nom: '',
    prenom: '',
    adresse: '',
    codePostal: '',
    ville: '',
    reference: '',
    etat: 'En attente',
    date: new Date().toISOString().split('T')[0],
    dateEcheance: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    modeReglement: 'Virement',
    modeCalcul: 'HT',
    montantHT: '0.00',
  });

  // Handle input change for form fields
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Populate the form with client data
  const populateFromClient = useCallback((client: Client) => {
    setFormData(prev => ({
      ...prev,
      codeTiers: client.id,
      civilite: client.civilite || '',
      nom: client.nom || '',
      prenom: client.prenom || '',
      adresse: client.adresse || '',
      codePostal: client.codePostal || '',
      ville: client.ville || '',
    }));
  }, []);

  return {
    formData,
    setFormData,
    handleInputChange,
    populateFromClient
  };
};