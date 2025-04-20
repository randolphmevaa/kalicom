import { useState, ChangeEvent, useCallback } from 'react';
import { FormData, Client, Invoice } from '../types/creditNote';

export const useCreditNoteForm = () => {
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
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Populate form with client data
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

  // Set the linked invoice
  const setLinkedInvoice = useCallback((invoice: Invoice) => {
    setFormData(prev => ({
      ...prev,
      factureLiee: invoice.id
    }));
  }, []);

  return {
    formData,
    setFormData,
    handleInputChange,
    populateFromClient,
    setLinkedInvoice
  };
};