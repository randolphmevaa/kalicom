'use client';

// ModalDetailsProduitAmelioré.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiX, FiTag, FiPackage, FiCalendar, FiClock, FiBarChart2,
  FiEdit, FiTrash2,  FiInfo, FiFileText,
  FiUser, FiDatabase,   FiSettings, FiDownload,
  FiArrowDown,   FiCornerDownRight,
  FiCheck
} from "react-icons/fi";
import { FaEuroSign } from "react-icons/fa";
import { Product } from "./types";

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onEdit: (product: Product) => void;
}

const ModalDetailsProduitAmelioré = ({ 
  product, 
  onClose, 
  onEdit 
}: ProductDetailsModalProps) => {
  // FIXED: Moved all hooks to the top before any conditional returns
  const modalEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("detail");
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  
  // FIXED: useEffect hooks now run unconditionally
  useEffect(() => {
    if (!product) return;
    
    const checkScroll = () => {
      const modalContent = document.getElementById("modal-content");
      if (modalContent) {
        setShowScrollIndicator(
          modalContent.scrollHeight > modalContent.clientHeight
        );
      }
    };
    
    checkScroll();
    window.addEventListener("resize", checkScroll);
    
    return () => window.removeEventListener("resize", checkScroll);
  }, [activeTab, product]);
  
  useEffect(() => {
    if (!product) return;
    
    if (modalEndRef.current) {
      const modalContent = document.getElementById("modal-content");
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
    }
  }, [activeTab, product]);

  // Early return after all hooks
  if (!product) return null;
  
  // Déterminer si le produit est un service ou un bien
  const isService = product.categorie === "Service";
  
  // Extraire et calculer des données supplémentaires pour l'affichage
  const prixVente = parseFloat(product.prix?.replace(/[^0-9,]/g, "").replace(",", ".") || "0");
  const prixAchat = parseFloat(product.prixAchat?.replace(/[^0-9,]/g, "").replace(",", ".") || "0");
  const margin = prixVente - prixAchat;
  const marginPercent = ((margin / prixVente) * 100).toFixed(1);
  
  // Valeurs par défaut pour les champs qui peuvent ne pas exister dans l'objet produit
  const defaultValues = {
    descriptionCommerciale: product.descriptionCommerciale || "Aucune description commerciale disponible.",
    tauxTVA: product.tauxTVA || "20",
    prixVenteHT: product.prixVenteHT || ((prixVente / 1.2).toFixed(2).replace(".", ",")),
    quantiteParDefaut: product.quantiteParDefaut || "1",
    uniteVente: product.uniteVente || "Unité",
    codeBarre: product.codeBarre || "Non spécifié",
    monnaie: product.monnaie || "Euros",
    poids: product.poids || "Non spécifié",
    unitesPoids: product.unitesPoids || "Grammes",
    isServicePersonne: product.isServicePersonne || false,
    intervenantPrincipal: product.intervenantPrincipal || "Non spécifié",
    nombreHeuresQuantite: product.nombreHeuresQuantite || false,
    ecoContribution: product.ecoContribution || "0,00",
    compteComptable: product.compteComptable || "707",
    classificationStatut: product.classificationStatut || "Actif",
  };

  interface StatusColors {
    [key: string]: string;
  }

  const getStatusBadgeColor = (status: string): string => {
    const statusColors: StatusColors = {
      "Actif": "bg-emerald-100 text-emerald-800 border border-emerald-200",
      "Inactif": "bg-gray-100 text-gray-800 border border-gray-200", 
      "En sommeil": "bg-gray-100 text-gray-800 border border-gray-200",
      "Nouveau": "bg-[#1B0353]/10 text-[#1B0353] border border-[#1B0353]/20",
      "Épuisé": "bg-red-100 text-red-800 border border-red-200",
      "Bloqué": "bg-red-100 text-red-800 border border-red-200",
      "Partiellement bloqué": "bg-amber-100 text-amber-800 border border-amber-200"
    };

    return statusColors[status] || "bg-purple-100 text-purple-800 border border-purple-200";
  };
  
  // Générer un PDF du produit
  const handleGeneratePDF = () => {
    // Ici on mettrait le code pour générer un PDF
    // C'est juste pour l'exemple
    alert("Export PDF du produit en cours...");
  };
  
  // Fonction pour afficher le contenu de l'onglet en fonction de l'onglet actif
  const renderTabContent = () => {
    switch (activeTab) {
      case "detail":
        return (
          <div className="space-y-6">
            {/* Résumé des informations principales */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-[#1B0353] mb-4 flex items-center">
                <FiInfo className="mr-2" />
                Résumé du produit
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={product.image || "/api/placeholder/400/400"}
                    alt={product.nom}
                    className="w-full h-64 object-cover object-center"
                  />
                </div>
                
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadgeColor(product.statut)}`}>
                        {product.statut}
                      </span>
                      <span className="bg-[#1B0353]/10 text-[#1B0353] px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                        {product.categorie}
                      </span>
                      <span className="text-gray-500 text-sm flex items-center">
                        <FiTag className="mr-1" />
                        Réf: {product.reference}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Prix de vente TTC</span>
                        <span className="text-xl font-bold text-[#1B0353]">{product.prix}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Prix d&apos;achat</span>
                        <span className="text-gray-700">{product.prixAchat}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-gray-600 font-medium text-gray-700">Marge</span>
                        <span className="text-emerald-600 font-bold">{margin.toFixed(2).replace(".", ",")} € ({marginPercent}%)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#1B0353]/5 p-3 rounded-lg">
                      <div className="flex items-center text-[#1B0353] font-medium mb-1 text-sm">
                        <FiBarChart2 className="mr-1" />
                        Ventes
                      </div>
                      <div className="text-xl font-bold">{product.vendu}</div>
                      <div className="text-xs text-gray-500">unités vendues</div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-gray-700 font-medium mb-1 text-sm">
                        <FiPackage className="mr-1" />
                        Stock
                      </div>
                      <div className="text-xl font-bold text-gray-700">{product.stock}</div>
                      <div className="text-xs text-gray-500">disponibles</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description commerciale */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-[#1B0353] mb-3 flex items-center">
                <FiFileText className="mr-2" />
                Description commerciale
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
                {defaultValues.descriptionCommerciale}
              </div>
            </div>
            
            {/* Tarif */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-[#1B0353] mb-4 flex items-center">
                <FaEuroSign className="mr-2" />
                Tarification détaillée
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix d&apos;achat
                  </label>
                  <div className="relative bg-gray-50 p-2 rounded-lg flex items-center">
                    <FaEuroSign className="text-gray-400 w-5 h-5 mr-2" />
                    <span className="font-medium text-gray-700">{product.prixAchat}</span>
                  </div>
                </div>
                
                {(product.fraisPourcentage !== undefined && product.fraisPourcentage !== '') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frais
                  </label>
                  <div className="relative bg-gray-50 p-2 rounded-lg flex items-center">
                    <span className="font-medium text-gray-700">{product.fraisPourcentage} %</span>
                    <span className="ml-2 text-xs text-gray-500 flex items-center">
                      <FiCornerDownRight className="mr-1" /> 
                      soit {((prixAchat || 0) * (parseFloat(product.fraisPourcentage?.replace(",", ".")) || 0) / 100).toFixed(2).replace(".", ",")} €
                    </span>
                  </div>
                </div>
                )}
                
                {product.prixRevient && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix de revient
                  </label>
                  <div className="relative bg-gray-50 p-2 rounded-lg flex items-center">
                    <FaEuroSign className="text-gray-400 w-5 h-5 mr-2" />
                    <span className="font-medium text-gray-700">{product.prixRevient} €</span>
                  </div>
                </div>
                )}
                
                {(product.tauxMargePourcentage !== undefined && product.tauxMargePourcentage !== '') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taux de marge
                  </label>
                  <div className="relative bg-gray-50 p-2 rounded-lg flex items-center">
                    <span className="font-medium text-gray-700">{product.tauxMargePourcentage} %</span>
                  </div>
                </div>
                )}
                
                {product.tauxMarque && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taux de marque
                  </label>
                  <div className="relative bg-gray-50 p-2 rounded-lg flex items-center">
                    <span className="font-medium text-gray-700">{product.tauxMarque} %</span>
                  </div>
                </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix de vente HT
                  </label>
                  <div className="relative bg-gray-50 p-2 rounded-lg flex items-center">
                    <FaEuroSign className="text-gray-400 w-5 h-5 mr-2" />
                    <span className="font-medium text-gray-700">{defaultValues.prixVenteHT} €</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taux de TVA
                  </label>
                  <div className="relative bg-gray-50 p-2 rounded-lg flex items-center">
                    <span className="font-medium text-gray-700">{defaultValues.tauxTVA} %</span>
                    <span className="ml-2 text-xs text-gray-500 flex items-center">
                      <FiCornerDownRight className="mr-1" /> 
                      soit {(parseFloat(defaultValues.prixVenteHT.replace(",", ".")) * parseFloat(defaultValues.tauxTVA.replace(",", ".")) / 100).toFixed(2).replace(".", ",")} €
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix de vente TTC
                  </label>
                  <div className="relative bg-gray-50 p-2 rounded-lg flex items-center">
                    <FaEuroSign className="text-gray-400 w-5 h-5 mr-2" />
                    <span className="font-medium text-gray-700">{product.prix}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dernière mise à jour
                  </label>
                  <div className="relative bg-gray-50 p-2 rounded-lg flex items-center">
                    <FiClock className="text-gray-400 mr-2" />
                    <span className="font-medium text-gray-700">{product.dateMiseAJour}</span>
                  </div>
                </div>
              </div>
            </div>
            
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
                  <div className="relative bg-gray-50 p-2 rounded-lg">
                    <span className="font-medium text-gray-700">{defaultValues.quantiteParDefaut}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unité de vente
                  </label>
                  <div className="relative bg-gray-50 p-2 rounded-lg">
                    <span className="font-medium text-gray-700">{defaultValues.uniteVente}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="relative bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-700">
                    {product.description || 
                      `${product.nom} - ${product.reference} - Un produit de catégorie ${product.categorie.toLowerCase()} disponible en stock ${product.stock}.`}
                  </p>
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
                  <div className="relative bg-gray-50 p-2 rounded-lg">
                    <span className="font-medium text-gray-700">{defaultValues.codeBarre}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monnaie
                  </label>
                  <div className="relative bg-gray-50 p-2 rounded-lg">
                    <span className="font-medium text-gray-700">{defaultValues.monnaie}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Poids
                  </label>
                  <div className="relative bg-gray-50 p-2 rounded-lg">
                    <span className="font-medium text-gray-700">{defaultValues.poids}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unité de poids
                  </label>
                  <div className="relative bg-gray-50 p-2 rounded-lg">
                    <span className="font-medium text-gray-700">{defaultValues.unitesPoids}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "servicePersonne":
        return isService ? (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-[#1B0353] mb-4 flex items-center">
                <FiUser className="mr-2" />
                Service à la personne
              </h3>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className={`h-5 w-5 rounded ${defaultValues.isServicePersonne ? "bg-[#1B0353]" : "bg-gray-300"} flex items-center justify-center mr-2`}>
                    {defaultValues.isServicePersonne && <FiCheck className="text-white" size={14} />}
                  </div>
                  <span className={`font-medium ${defaultValues.isServicePersonne ? "text-[#1B0353]" : "text-gray-500"}`}>
                    Service à la personne
                  </span>
                </div>
                
                {defaultValues.isServicePersonne && (
                  <div className="pt-4 border-t border-gray-200 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Intervenant principal
                      </label>
                      <div className="relative bg-white p-2 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <FiUser className="text-gray-400 mr-2" />
                          <span className="font-medium text-gray-700">{defaultValues.intervenantPrincipal}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className={`h-5 w-5 rounded ${defaultValues.nombreHeuresQuantite ? "bg-[#1B0353]" : "bg-gray-300"} flex items-center justify-center mr-2`}>
                        {defaultValues.nombreHeuresQuantite && <FiCheck className="text-white" size={14} />}
                      </div>
                      <span className={`${defaultValues.nombreHeuresQuantite ? "text-gray-700" : "text-gray-500"}`}>
                        Nombre d&apos;heures = quantité
                      </span>
                    </div>
                  </div>
                )}
                
                {!defaultValues.isServicePersonne && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center text-gray-500 italic">
                      Ce produit n&apos;est pas configuré comme un service à la personne.
                    </div>
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
                  <div className="relative bg-white p-2 rounded-lg border border-gray-200 flex items-center">
                    <FaEuroSign className="text-gray-400 w-5 h-5 mr-2" />
                    <span className="font-medium text-gray-700">{defaultValues.ecoContribution} €</span>
                  </div>
                  
                  {parseFloat(defaultValues.ecoContribution.replace(",", ".")) > 0 && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                      <p className="text-sm text-amber-700 flex items-center">
                        <FiCornerDownRight className="mr-2" /> 
                        soit {(prixVente + parseFloat(defaultValues.ecoContribution.replace(",", "."))).toFixed(2).replace(".", ",")} € TTC avec éco-contribution
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
                          {defaultValues.tauxTVA}%
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {defaultValues.compteComptable}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-[#1B0353] mb-4 flex items-center">
                <FiBarChart2 className="mr-2" />
                Statistiques
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 font-medium text-gray-700">Unités vendues</span>
                    <span className="text-[#1B0353] font-bold text-xl">{product.vendu}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-[#1B0353] h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (product.vendu / 150) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 font-medium text-gray-700">Marge</span>
                    <span className="text-emerald-600 font-bold text-xl">{marginPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-emerald-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, parseFloat(marginPercent))}%` }}
                    ></div>
                  </div>
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
                  <div className="relative bg-white p-2 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <span className={`px-2.5 py-1 text-sm rounded-full ${getStatusBadgeColor(product.statut || defaultValues.classificationStatut)} mr-2`}>
                        {product.statut || defaultValues.classificationStatut}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-[#1B0353] mb-4 flex items-center">
                <FiCalendar className="mr-2" />
                Dates importantes
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de création
                  </label>
                  <div className="relative bg-gray-50 p-2 rounded-lg flex items-center">
                    <FiCalendar className="text-gray-400 mr-2" />
                    <span className="font-medium text-gray-700">{product.dateCreation}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dernière mise à jour
                  </label>
                  <div className="relative bg-gray-50 p-2 rounded-lg flex items-center">
                    <FiClock className="text-gray-400 mr-2" />
                    <span className="font-medium text-gray-700">{product.dateMiseAJour}</span>
                  </div>
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
        {/* En-tête du modal */}
        <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 bg-[#1B0353]/10 rounded-lg mr-3">
                <FiPackage className="h-6 w-6 text-[#1B0353]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {product.nom}
                </h2>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <FiTag className="mr-1" />
                  {product.reference}
                  <span className="mx-2">•</span>
                  <FiCalendar className="mr-1" />
                  Créé le {product.dateCreation}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleGeneratePDF}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                title="Exporter en PDF"
              >
                <FiDownload size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Fermer"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white border-b border-gray-200 px-6 sticky top-[85px] z-10 shadow-sm">
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
                {isService ? (
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
          </div>
        </div>

        {/* Contenu du modal */}
        <div id="modal-content" className="p-6 overflow-y-auto max-h-[calc(90vh-170px)]">
          {renderTabContent()}
          
          {/* Boutons d'action */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center" ref={modalEndRef}>
            <span className="text-sm flex items-center text-gray-500">
              <FiClock className="mr-1" />
              Mis à jour le {product.dateMiseAJour}
            </span>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm"
              >
                Fermer
              </button>
              <button
                onClick={() => onEdit(product)}
                className="px-4 py-2 bg-[#1B0353] text-white rounded-lg flex items-center hover:bg-[#2A0570] transition shadow-sm"
              >
                <FiEdit className="mr-2" />
                Modifier
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center hover:bg-red-600 transition shadow-sm"
              >
                <FiTrash2 className="mr-2" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
        
        {/* Indicateur de défilement vers le bas */}
        {showScrollIndicator && (
          <div className="fixed bottom-4 right-4 lg:hidden animate-bounce">
            <div 
              className="bg-[#1B0353] text-white p-3 rounded-full shadow-lg" 
              onClick={() => modalEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })}
            >
              <FiArrowDown size={24} />
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ModalDetailsProduitAmelioré;