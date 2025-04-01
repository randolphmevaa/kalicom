'use client';

// FormulaireProduitsAmelioré.tsx
import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  FiX, FiSave, FiTag, FiInfo, FiPackage, FiAlertCircle,
  FiImage, FiSettings, FiFileText, FiUser, FiDatabase,
  FiChevronDown, FiArrowDown, FiCornerDownRight
} from "react-icons/fi";
import { FaEuroSign } from "react-icons/fa";
import { Product } from "./types";
import Image from "next/image";

// Define product data structure
interface ProductData {
  // Infos de base
  nom: string;
  reference: string;
  description: string;
  descriptionCommerciale: string;
  categorie: string;
  statut: string;
  
  // Tarification
  prixAchat: string;
  fraisPourcentage: string;
  prixRevient: string;
  tauxMargePourcentage: string;
  tauxMarque: string;
  prixVenteHT: string;
  tauxTVA: string;
  prixVenteTTC: string;
  modifieLe: string;
  
  // Description générale
  quantiteParDefaut: string;
  uniteVente: string;
  
  // Code barre
  codeBarre: string;
  monnaie: string;
  poids: string;
  unitesPoids: string;
  
  // Service à la personne
  isServicePersonne: boolean;
  intervenantPrincipal: string;
  nombreHeuresQuantite: boolean;
  
  // Taxes
  ecoContribution: string;
  
  // Comptabilité
  compteComptable: string;
  
  // Paramètres
  classificationStatut: string;
  
  // Stock
  stock: string;
  
  // Image
  image: string;
  
  // Additional properties that may exist in editProduct
  id?: number;
  vendu?: number;
  dateCreation?: string;
  dateMiseAJour?: string;
  prix?: string;
}

interface FormulaireProduitProps {
  onClose: () => void;
  onSave: (data: Product) => void; // Changed from ProductData to Product
  editProduct: Product | null;
}

interface ErrorState {
  [key: string]: string | null;
}

const FormulaireProduitsAmelioré = ({ onClose, onSave, editProduct = null }: FormulaireProduitProps) => {
  const isEditing = !!editProduct;
  const today = new Date().toLocaleDateString("fr-FR");
  const formEndRef = useRef<HTMLDivElement>(null);
  
  const [activeTab, setActiveTab] = useState("detail");
  const [formData, setFormData] = useState<ProductData>({
    // Infos de base
    nom: editProduct?.nom || "",
    reference: editProduct?.reference || "",
    description: editProduct?.description || "",
    descriptionCommerciale: editProduct?.descriptionCommerciale || "",
    categorie: editProduct?.categorie || "Bien",
    statut: editProduct?.statut || "Actif",
    
    // Tarification
    prixAchat: editProduct?.prixAchat ? editProduct.prixAchat.replace(" €", "") : "",
    fraisPourcentage: editProduct?.fraisPourcentage || "0",
    prixRevient: editProduct?.prixRevient || "",
    tauxMargePourcentage: editProduct?.tauxMargePourcentage || "40",
    tauxMarque: editProduct?.tauxMarque || "",
    prixVenteHT: editProduct?.prixVenteHT || "",
    tauxTVA: editProduct?.tauxTVA || "20",
    prixVenteTTC: editProduct?.prix ? editProduct.prix.replace(" €", "") : "",
    modifieLe: today,
    
    // Description générale
    quantiteParDefaut: editProduct?.quantiteParDefaut || "1",
    uniteVente: editProduct?.uniteVente || "Unité",
    
    // Code barre
    codeBarre: editProduct?.codeBarre || "",
    monnaie: editProduct?.monnaie || "Euros",
    poids: editProduct?.poids || "",
    unitesPoids: editProduct?.unitesPoids || "Grammes",
    
    // Service à la personne
    isServicePersonne: editProduct?.isServicePersonne || false,
    intervenantPrincipal: editProduct?.intervenantPrincipal || "",
    nombreHeuresQuantite: editProduct?.nombreHeuresQuantite || false,
    
    // Taxes
    ecoContribution: editProduct?.ecoContribution || "",
    
    // Comptabilité
    compteComptable: editProduct?.compteComptable || "707",
    
    // Paramètres
    classificationStatut: editProduct?.classificationStatut || "Actif",
    
    // Stock
    stock: editProduct?.stock || "",
    
    // Image
    image: editProduct?.image || "",
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const [imagePreview, setImagePreview] = useState(editProduct?.image || "");
  
  // Calculs automatiques
  useEffect(() => {
    const updatedData = {...formData};
    
    // Calculer le montant des frais
    const prixAchat = parseFloat(formData.prixAchat.replace(",", ".")) || 0;
    const fraisPourcentage = parseFloat(formData.fraisPourcentage.replace(",", ".")) || 0;
    const fraisMontant = prixAchat * (fraisPourcentage / 100);
    
    // Calculer prix de revient
    const prixRevient = prixAchat + fraisMontant;
    updatedData.prixRevient = prixRevient.toFixed(2).replace(".", ",");
    
    // Calculer le montant de la marge
    const tauxMargePourcentage = parseFloat(formData.tauxMargePourcentage.replace(",", ".")) || 0;
    const margeMontant = prixRevient * (tauxMargePourcentage / 100);
    
    // Calculer taux de marque
    const tauxMarque = prixRevient > 0 ? (margeMontant / (prixRevient + margeMontant)) * 100 : 0;
    updatedData.tauxMarque = tauxMarque.toFixed(2).replace(".", ",");
    
    // Calculer prix de vente HT
    const prixVenteHT = prixRevient + margeMontant;
    updatedData.prixVenteHT = prixVenteHT.toFixed(2).replace(".", ",");
    
    // Calculer TVA et TTC
    const tauxTVA = parseFloat(formData.tauxTVA.replace(",", ".")) || 0;
    const tvaMontant = prixVenteHT * (tauxTVA / 100);
    const prixVenteTTC = prixVenteHT + tvaMontant;
    updatedData.prixVenteTTC = prixVenteTTC.toFixed(2).replace(".", ",");
    
    // Mettre à jour seulement si les valeurs ont changé pour éviter une boucle infinie
    if (
      updatedData.prixRevient !== formData.prixRevient ||
      updatedData.tauxMarque !== formData.tauxMarque ||
      updatedData.prixVenteHT !== formData.prixVenteHT ||
      updatedData.prixVenteTTC !== formData.prixVenteTTC
    ) {
      setFormData(updatedData);
    }
  }, [
    formData.prixAchat, 
    formData.fraisPourcentage, 
    formData.tauxMargePourcentage,
    formData.tauxTVA
  ]);

  // Effet pour faire défiler vers le bas lorsque l'onglet change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formEndRef.current) {
        formEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue,
    });
    
    // Effacer l'erreur lorsque le champ est mis à jour
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target && event.target.result) {
          const result = event.target.result as string;
          setImagePreview(result);
          setFormData({
            ...formData,
            image: result,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ErrorState = {};
    
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.reference.trim()) newErrors.reference = "La référence est requise";
    if (!formData.prixAchat.trim()) newErrors.prixAchat = "Le prix d'achat est requis";
    
    // Valider le stock en fonction de la catégorie
    if (formData.categorie === "Bien" && !formData.stock.trim()) {
      newErrors.stock = "Le stock est requis pour les biens";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Create a valid Product object from the form data
      // Ensuring all required fields are present and with correct types
      const product: Product = {
        // Required fields in Product interface
        id: formData.id || Date.now(), // Ensure id is never undefined
        nom: formData.nom,
        reference: formData.reference,
        description: formData.description,
        prix: formData.prixVenteTTC.includes("€") ? formData.prixVenteTTC : `${formData.prixVenteTTC} €`,
        prixAchat: formData.prixAchat.includes("€") ? formData.prixAchat : `${formData.prixAchat} €`,
        categorie: formData.categorie,
        statut: formData.statut,
        stock: formData.stock,
        dateCreation: formData.dateCreation || today,
        dateMiseAJour: today,
        image: formData.image,
        vendu: formData.vendu || 0, // Ensure vendu is a number
        
        // Optional fields
        descriptionCommerciale: formData.descriptionCommerciale,
        tauxTVA: formData.tauxTVA,
        prixVenteHT: formData.prixVenteHT,
        quantiteParDefaut: formData.quantiteParDefaut,
        uniteVente: formData.uniteVente,
        codeBarre: formData.codeBarre,
        monnaie: formData.monnaie,
        poids: formData.poids,
        unitesPoids: formData.unitesPoids,
        isServicePersonne: formData.isServicePersonne,
        intervenantPrincipal: formData.intervenantPrincipal,
        nombreHeuresQuantite: formData.nombreHeuresQuantite,
        ecoContribution: formData.ecoContribution,
        compteComptable: formData.compteComptable,
        classificationStatut: formData.classificationStatut,
        fraisPourcentage: formData.fraisPourcentage,
        prixRevient: formData.prixRevient,
        tauxMargePourcentage: formData.tauxMargePourcentage,
        tauxMarque: formData.tauxMarque
      };
      
      onSave(product);
      onClose();
    }
  };

  // Fonction pour afficher le contenu de l'onglet en fonction de l'onglet actif
  const renderTabContent = () => {
    switch (activeTab) {
      case "detail":
        return (
          <div className="space-y-6">
            {/* Description commerciale */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-[#1B0353] mb-3 flex items-center">
                <FiFileText className="mr-2" />
                Description commerciale
              </h3>
              <textarea
                name="descriptionCommerciale"
                placeholder="Rédigez une description commerciale attrayante..."
                value={formData.descriptionCommerciale}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent"
              ></textarea>
            </div>
            
            {/* Tarif */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-[#1B0353] mb-4 flex items-center">
                <FaEuroSign className="mr-2" />
                Tarif
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix d&apos;achat
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEuroSign className="text-gray-400 w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="prixAchat"
                      placeholder="0,00"
                      value={formData.prixAchat}
                      onChange={handleChange}
                      className={`text-gray-700 w-full pl-10 pr-10 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent ${
                        errors.prixAchat ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                  {errors.prixAchat && (
                    <p className="mt-1 text-sm text-red-600">{errors.prixAchat}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frais %
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fraisPourcentage"
                      placeholder="0,00"
                      value={formData.fraisPourcentage}
                      onChange={handleChange}
                      className="text-gray-700 w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 flex items-center">
                    <FiCornerDownRight className="mr-1" /> 
                    soit {((parseFloat(formData.prixAchat.replace(",", ".")) || 0) * (parseFloat(formData.fraisPourcentage.replace(",", ".")) || 0) / 100).toFixed(2).replace(".", ",")} €
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix de revient
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEuroSign className="text-gray-400 w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="prixRevient"
                      placeholder="0,00"
                      value={formData.prixRevient}
                      readOnly
                      className="w-full pl-10 pr-10 py-2 border border-gray-200 bg-gray-50 rounded-lg shadow-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taux de marge %
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="tauxMargePourcentage"
                      placeholder="0,00"
                      value={formData.tauxMargePourcentage}
                      onChange={handleChange}
                      className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 flex items-center">
                    <FiCornerDownRight className="mr-1" /> 
                    soit {((parseFloat(formData.prixRevient.replace(",", ".")) || 0) * (parseFloat(formData.tauxMargePourcentage.replace(",", ".")) || 0) / 100).toFixed(2).replace(".", ",")} €
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taux de marque
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="tauxMarque"
                      placeholder="0,00"
                      value={formData.tauxMarque}
                      readOnly
                      className="w-full pl-3 pr-10 py-2 border border-gray-200 bg-gray-50 rounded-lg shadow-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix de vente HT
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEuroSign className="text-gray-400 w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="prixVenteHT"
                      placeholder="0,00"
                      value={formData.prixVenteHT}
                      readOnly
                      className="w-full pl-10 pr-10 py-2 border border-gray-200 bg-gray-50 rounded-lg shadow-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taux de TVA %
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="tauxTVA"
                      placeholder="20,00"
                      value={formData.tauxTVA}
                      onChange={handleChange}
                      className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 flex items-center">
                    <FiCornerDownRight className="mr-1" /> 
                    soit {((parseFloat(formData.prixVenteHT.replace(",", ".")) || 0) * (parseFloat(formData.tauxTVA.replace(",", ".")) || 0) / 100).toFixed(2).replace(".", ",")} €
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix de vente TTC
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEuroSign className="text-gray-400 w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="prixVenteTTC"
                      placeholder="0,00"
                      value={formData.prixVenteTTC}
                      readOnly
                      className="w-full pl-10 pr-10 py-2 border border-gray-200 bg-gray-50 rounded-lg shadow-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modifié le
                  </label>
                  <input
                    type="text"
                    value={formData.modifieLe}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Rest of the component remains the same, just continuing with the rendering */}
            {/* Description générale */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-[#1B0353] mb-4 flex items-center">
                <FiInfo className="mr-2" />
                Description générale
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantité par défaut
                  </label>
                  <input
                    type="text"
                    name="quantiteParDefaut"
                    placeholder="1"
                    value={formData.quantiteParDefaut}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unité de vente
                  </label>
                  <input
                    type="text"
                    name="uniteVente"
                    placeholder="Unité"
                    value={formData.uniteVente}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            {/* Code barre */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-[#1B0353] mb-4 flex items-center">
                <FiTag className="mr-2" />
                Code barre
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code barre
                  </label>
                  <input
                    type="text"
                    name="codeBarre"
                    placeholder="Code barre"
                    value={formData.codeBarre}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix
                  </label>
                  <select
                    name="monnaie"
                    value={formData.monnaie}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent"
                  >
                    <option value="Euros">Euros</option>
                    <option value="Francs">Francs</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Poids
                  </label>
                  <input
                    type="text"
                    name="poids"
                    placeholder="Poids"
                    value={formData.poids}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unité de poids
                  </label>
                  <select
                    name="unitesPoids"
                    value={formData.unitesPoids}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent"
                  >
                    <option value="Grammes">Grammes</option>
                    <option value="Kilogrammes">Kilogrammes</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Stock info pour Bien uniquement */}
            {formData.categorie === "Bien" && (
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-medium text-[#1B0353] mb-4 flex items-center">
                  <FiPackage className="mr-2" />
                  Stock
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantité en stock
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPackage className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="stock"
                      placeholder="Quantité en stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent ${
                        errors.stock ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
        
      case "servicePersonne":
        return formData.categorie === "Service" ? (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-[#1B0353] mb-4 flex items-center">
                <FiUser className="mr-2" />
                Service à la personne
              </h3>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="isServicePersonne"
                    checked={formData.isServicePersonne}
                    onChange={handleChange}
                    className="h-5 w-5 text-[#1B0353] focus:ring-[#1B0353] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700 font-medium">Service à la personne</span>
                </label>
                
                {formData.isServicePersonne && (
                  <div className="pt-4 border-t border-gray-200 space-y-4 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Intervenant principal
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="intervenantPrincipal"
                          placeholder="Nom de l'intervenant"
                          value={formData.intervenantPrincipal}
                          onChange={handleChange}
                          className="w-full pl-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        name="nombreHeuresQuantite"
                        checked={formData.nombreHeuresQuantite}
                        onChange={handleChange}
                        className="h-5 w-5 text-[#1B0353] focus:ring-[#1B0353] border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">Nombre d&apos;heures = quantité</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-[#1B0353] mb-4 flex items-center">
                <FaEuroSign className="mr-2" />
                Taxes
              </h3>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                  <FiInfo className="mr-2 text-amber-500" />
                  Eco-contribution DEEE
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant de l&apos;éco-contribution
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEuroSign className="text-gray-400 w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="ecoContribution"
                      placeholder="0,00"
                      value={formData.ecoContribution}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                  {formData.ecoContribution && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                      <p className="text-sm text-amber-700 flex items-center">
                        <FiCornerDownRight className="mr-2" /> 
                        soit {(parseFloat(formData.prixVenteTTC.replace(",", ".")) || 0) + (parseFloat(formData.ecoContribution.replace(",", ".")) || 0)} € TTC avec éco-contribution
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      case "comptabilite":
        return (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-[#1B0353] mb-4 flex items-center">
                <FiDatabase className="mr-2" />
                Comptabilité
              </h3>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium text-gray-800 mb-3">Ventes</h4>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <button 
                    type="button"
                    className="px-3 py-2 bg-[#1B0353]/10 text-[#1B0353] border border-[#1B0353]/20 rounded-lg text-sm font-medium hover:bg-[#1B0353]/20 transition-colors"
                  >
                    Afficher les TVA de la territorialité du dossier
                  </button>
                  <button 
                    type="button"
                    className="px-3 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Afficher toutes les TVA
                  </button>
                </div>
                
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Taux de TVA
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Compte comptable ventes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {formData.tauxTVA}%
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            name="compteComptable"
                            value={formData.compteComptable}
                            onChange={handleChange}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "parametres":
        return (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-[#1B0353] mb-4 flex items-center">
                <FiSettings className="mr-2" />
                Paramètres
              </h3>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium text-gray-800 mb-3">Classification</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    name="classificationStatut"
                    value={formData.classificationStatut}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent"
                  >
                    <option value="Actif">Actif</option>
                    <option value="En sommeil">En sommeil</option>
                    <option value="Bloqué">Bloqué</option>
                    <option value="Partiellement bloqué">Partiellement bloqué</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-[#1B0353] mb-4 flex items-center">
                <FiInfo className="mr-2" />
                Informations supplémentaires
              </h3>
              
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
                <p className="flex items-start">
                  <FiInfo className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Faites défiler vers le bas pour accéder aux boutons &quot;Annuler&quot; et &quot;Enregistrer&quot;. Vous pouvez également changer d&apos;onglet à tout moment pour configurer d&apos;autres aspects du produit.
                  </span>
                </p>
              </div>
            </div>
          </div>
        );
        
      case "image":
        return (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-[#1B0353] mb-4 flex items-center">
                <FiImage className="mr-2" />
                Image du produit
              </h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview} 
                      alt="Aperçu du produit" 
                      className="mx-auto max-h-80 object-contain rounded-lg mb-4 shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setFormData({...formData, image: ""});
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="h-80 flex flex-col items-center justify-center">
                    <FiImage className="w-20 h-20 text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">
                      Cliquez pour ajouter une image ou faites glisser votre image ici
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-4 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#1B0353]/10 file:text-[#1B0353] hover:file:bg-[#1B0353]/20"
                />
                
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600 flex items-center">
                    <FiInfo className="mr-2 text-[#1B0353]" />
                    Formats acceptés : JPG, PNG, GIF. Taille maximale : 5 Mo
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-center">
                <div className="flex flex-col items-center animate-pulse">
                  <FiArrowDown className="h-6 w-6 text-[#1B0353]" />
                  <span className="text-sm text-[#1B0353] font-medium mt-1">Faites défiler pour sauvegarder</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête du formulaire */}
        <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#1B0353]/10 rounded-lg">
                <FiTag className="h-5 w-5 text-[#1B0353]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditing ? "Modifier le produit" : "Ajouter un produit"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Infos de base pour tous les onglets */}
        <div className="px-6 pt-6 bg-white border-b border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du produit*
              </label>
              <input
                type="text"
                name="nom"
                placeholder="Saisissez le nom du produit"
                value={formData.nom}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent ${
                  errors.nom ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.nom && <p className="mt-1 text-sm text-red-600 flex items-center"><FiAlertCircle className="mr-1" /> {errors.nom}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Référence*
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="reference"
                  placeholder="ex: PRD-001"
                  value={formData.reference}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent ${
                    errors.reference ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.reference && <p className="mt-1 text-sm text-red-600 flex items-center"><FiAlertCircle className="mr-1" /> {errors.reference}</p>}
            </div>
          </div>
          
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Type de produit</label>
            <div className="flex flex-wrap gap-4">
              <label className={`relative flex items-center p-3 rounded-xl border ${formData.categorie === "Bien" ? "border-[#1B0353] bg-[#1B0353]/5" : "border-gray-300"} cursor-pointer hover:bg-gray-50 transition-colors`}>
                <input
                  type="radio"
                  name="categorie"
                  value="Bien"
                  checked={formData.categorie === "Bien"}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#1B0353] focus:ring-[#1B0353] border-gray-300"
                />
                <span className={`ml-2 font-medium ${formData.categorie === "Bien" ? "text-[#1B0353]" : "text-gray-700"}`}>Bien</span>
              </label>
              
              <label className={`relative flex items-center p-3 rounded-xl border ${formData.categorie === "Service" ? "border-[#1B0353] bg-[#1B0353]/5" : "border-gray-300"} cursor-pointer hover:bg-gray-50 transition-colors`}>
                <input
                  type="radio"
                  name="categorie"
                  value="Service"
                  checked={formData.categorie === "Service"}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#1B0353] focus:ring-[#1B0353] border-gray-300"
                />
                <span className={`ml-2 font-medium ${formData.categorie === "Service" ? "text-[#1B0353]" : "text-gray-700"}`}>Service</span>
              </label>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white border-b border-gray-200 px-6 sticky top-[73px] z-10 shadow-sm">
          <div className="flex overflow-x-auto scrollbar-hide space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab("detail")}
              className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "detail"
                  ? "border-[#1B0353] text-[#1B0353]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <FiFileText className="mr-2" />
                Détail
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setActiveTab("servicePersonne")}
              className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "servicePersonne"
                  ? "border-[#1B0353] text-[#1B0353]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                {formData.categorie === "Service" ? (
                  <>
                    <FiUser className="mr-2" />
                    Service à la personne
                  </>
                ) : (
                  <>
                    <FaEuroSign className="mr-2" />
                    Taxes
                  </>
                )}
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setActiveTab("comptabilite")}
              className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "comptabilite"
                  ? "border-[#1B0353] text-[#1B0353]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <FiDatabase className="mr-2" />
                Comptabilité
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setActiveTab("parametres")}
              className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "parametres"
                  ? "border-[#1B0353] text-[#1B0353]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <FiSettings className="mr-2" />
                Paramètres
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setActiveTab("image")}
              className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "image"
                  ? "border-[#1B0353] text-[#1B0353]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <FiImage className="mr-2" />
                Image
              </div>
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
          <form onSubmit={handleSubmit} id="product-form">
            {renderTabContent()}
            
            {/* Boutons d'action du formulaire */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center" ref={formEndRef}>
              <div className="flex items-center text-amber-600">
                <FiAlertCircle className="mr-2" />
                <span className="text-sm">* Champs obligatoires</span>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B0353] text-white rounded-lg flex items-center hover:bg-[#2A0570] transition shadow-sm"
                >
                  <FiSave className="mr-2" />
                  {isEditing ? "Enregistrer les modifications" : "Ajouter le produit"}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Indicateur de défilement vers le bas */}
        <div className="fixed bottom-4 right-4 lg:hidden animate-bounce">
          <div className="bg-[#1B0353] text-white p-3 rounded-full shadow-lg" onClick={() => formEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })}>
            <FiChevronDown size={24} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FormulaireProduitsAmelioré;