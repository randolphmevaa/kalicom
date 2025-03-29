"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  FiBox,
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiDollarSign,
  FiBarChart2,
  FiTag,
  FiPackage,
  FiRefreshCw,
  FiDownload,
  FiGrid,
  FiList,
  FiClock,
  FiCheck,
  FiX,
  FiFileText,
  FiFilePlus,
  FiArrowUp,
  FiArrowDown,
  FiShoppingCart,
  FiTrendingUp,
  // FiChevronDown,
  // FiChevronUp,
  FiMoreVertical,
  FiInfo,
  FiChevronRight,
  FiHome,
} from "react-icons/fi";
import Link from "next/link";
import ProductDetailsModal from "./ProductDetailsModal";
import AddProductForm from "./AddProductForm";

// 1) Define a Product interface for type safety:
interface Product {
  id: number;
  nom: string;
  reference: string;
  description: string;
  prix: string;
  prixAchat: string;
  categorie: string;
  statut: string;
  stock: string;
  dateCreation: string;
  dateMiseAJour: string;
  image: string;
  vendu: number;
  // If you do have a description, mark it optional
  // description?: string;
}

// Updated Breadcrumbs component with navigation
const Breadcrumbs = ({ items }: { items: string[] }) => (
  <div className="flex items-center text-sm text-gray-600 mb-6">
    <FiHome className="mr-2 text-gray-500" />
    {items.map((item, index) => (
      <div key={index} className="flex items-center">
        {index > 0 && <FiChevronRight className="mx-2 text-gray-400" />}
        {index === items.length - 1 ? (
          <span className="text-[#004AC8] font-medium">{item}</span>
        ) : (
          <Link 
            href={item === 'Acceuil' ? '/dashboard/acceuil' : `/${item.toLowerCase()}`}
            className="hover:text-[#004AC8] transition-colors duration-200"
          >
            {item}
          </Link>
        )}
      </div>
    ))}
  </div>
);

export default function Produits() {
  // -------------------------------------
  // 2) Typed state variables
  // -------------------------------------
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tous");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(true);
  const [activeSort, setActiveSort] = useState<string>("vendu");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [ , setHoverProductId] = useState<number | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState<boolean>(false);
  const [showAddProductForm, setShowAddProductForm] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // 3) Provide a parameter type for this function
  const displaySuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // -------------------------------------
  // 4) Product images
  // -------------------------------------
  const productImages: { [key: string]: string } = {
    "CRM-001":
      "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&auto=format&fit=crop",
    "MOD-FACT":
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop",
    "SUP-PREM":
      "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=600&auto=format&fit=crop",
    "FORM-BASE":
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&auto=format&fit=crop",
    "FORM-ADV":
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop",
    "MOD-MKT":
      "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&auto=format&fit=crop",
    "INST-SITE":
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop",
    "PACK-START":
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop",
    "MOD-ANALYTICS":
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop",
    "CRM-LITE":
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop",
    "MOD-API":
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop",
    "SUP-BASIC":
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop",
  };

  // -------------------------------------
  // 5) Sample product data
  // -------------------------------------
  const products: Product[] = [
    {
      id: 1,
      nom: "Pro CRM Suite",
      reference: "CRM-001",
      description: '',
      prix: "1 200,00 €",
      prixAchat: "600,00 €",
      categorie: "Bien",
      statut: "Actif",
      stock: "Illimité",
      dateCreation: "10/01/2025",
      dateMiseAJour: "01/03/2025",
      image: productImages["CRM-001"],
      vendu: 145,
    },
    {
      id: 2,
      nom: "Module Facturation",
      reference: "MOD-FACT",
      description: '',
      prix: "299,00 €",
      prixAchat: "150,00 €",
      categorie: "Bien",
      statut: "Actif",
      stock: "Illimité",
      dateCreation: "15/01/2025",
      dateMiseAJour: "15/02/2025",
      image: productImages["MOD-FACT"],
      vendu: 98,
    },
    {
      id: 3,
      nom: "Support Premium (1 an)",
      reference: "SUP-PREM",
      prix: "499,00 €",
      prixAchat: "200,00 €",
      categorie: "Service",
      description: '',
      statut: "Actif",
      stock: "Illimité",
      dateCreation: "20/01/2025",
      dateMiseAJour: "20/02/2025",
      image: productImages["SUP-PREM"],
      vendu: 65,
    },
    {
      id: 4,
      nom: "Formation Utilisateur",
      reference: "FORM-BASE",
      prix: "350,00 €",
      prixAchat: "150,00 €",
      categorie: "Service",
      statut: "Actif",
      stock: "25",
      dateCreation: "25/01/2025",
      description: '',
      dateMiseAJour: "15/02/2025",
      image: productImages["FORM-BASE"],
      vendu: 42,
    },
    {
      id: 5,
      nom: "Formation Administrateur",
      reference: "FORM-ADV",
      prix: "650,00 €",
      prixAchat: "300,00 €",
      categorie: "Service",
      statut: "Actif",
      stock: "15",
      dateCreation: "25/01/2025",
      dateMiseAJour: "15/02/2025",
      description: '',
      image: productImages["FORM-ADV"],
      vendu: 28,
    },
    {
      id: 6,
      nom: "Module Marketing",
      reference: "MOD-MKT",
      prix: "399,00 €",
      description: '',
      prixAchat: "200,00 €",
      categorie: "Bien",
      statut: "Actif",
      stock: "Illimité",
      dateCreation: "01/02/2025",
      dateMiseAJour: "01/03/2025",
      image: productImages["MOD-MKT"],
      vendu: 76,
    },
    {
      id: 7,
      nom: "Installation Sur Site",
      reference: "INST-SITE",
      prix: "899,00 €",
      prixAchat: "500,00 €",
      categorie: "Service",
      description: '',
      statut: "Actif",
      stock: "10",
      dateCreation: "05/02/2025",
      dateMiseAJour: "05/03/2025",
      image: productImages["INST-SITE"],
      vendu: 15,
    },
    {
      id: 8,
      nom: "Pack Démarrage",
      reference: "PACK-START",
      prix: "1 799,00 €",
      prixAchat: "900,00 €",
      categorie: "Bien",
      statut: "Actif",
      stock: "50",
      dateCreation: "10/02/2025",
      description: '',
      dateMiseAJour: "10/03/2025",
      image: productImages["PACK-START"],
      vendu: 32,
    },
    {
      id: 9,
      nom: "Module Analytics",
      reference: "MOD-ANALYTICS",
      prix: "499,00 €",
      prixAchat: "250,00 €",
      description: '',
      categorie: "Bien",
      statut: "Nouveau",
      stock: "Illimité",
      dateCreation: "20/02/2025",
      dateMiseAJour: "20/02/2025",
      image: productImages["MOD-ANALYTICS"],
      vendu: 12,
    },
    {
      id: 10,
      nom: "CRM Lite",
      reference: "CRM-LITE",
      prix: "499,00 €",
      description: '',
      prixAchat: "250,00 €",
      categorie: "Bien",
      statut: "Actif",
      stock: "Illimité",
      dateCreation: "25/02/2025",
      dateMiseAJour: "01/03/2025",
      image: productImages["CRM-LITE"],
      vendu: 87,
    },
    {
      id: 11,
      nom: "Module API",
      reference: "MOD-API",
      prix: "599,00 €",
      prixAchat: "300,00 €",
      description: '',
      categorie: "Bien",
      statut: "Actif",
      stock: "Illimité",
      dateCreation: "01/03/2025",
      dateMiseAJour: "01/03/2025",
      image: productImages["MOD-API"],
      vendu: 23,
    },
    {
      id: 12,
      nom: "Support Basique (1 an)",
      reference: "SUP-BASIC",
      prix: "199,00 €",
      prixAchat: "100,00 €",
      categorie: "Service",
      statut: "Actif",
      stock: "Illimité",
      description: '',
      dateCreation: "05/03/2025",
      dateMiseAJour: "05/03/2025",
      image: productImages["SUP-BASIC"],
      vendu: 103,
    },
  ];

  // -------------------------------------
  // 6) Filter/sort options, typed arrays
  // -------------------------------------
  const categoryOptions: string[] = ["Tous", "Bien", "Service"];
  const statusOptions: string[] = ["Tous", "Actif", "Inactif", "Nouveau", "Épuisé"];

  // -------------------------------------
  // 7) Animation variants must specify a type for 'i'
  // -------------------------------------
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
    hover: {
      y: -10,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
  };

  // -------------------------------------
  // 8) Checkbox handlers
  // -------------------------------------
  const handleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    if (newValue) {
      // If we are checking 'all', select all product IDs
      setSelectedProducts(filteredProducts.map((p) => p.id));
    } else {
      // Otherwise clear
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
      setSelectAll(false);
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // -------------------------------------
  // 9) Sorting
  // -------------------------------------
  const sortProducts = (list: Product[]): Product[] => {
    return [...list].sort((a, b) => {
      let compareA: string | number = a[activeSort as keyof Product] as string | number;
      let compareB: string | number = b[activeSort as keyof Product] as string | number;

      // Handle special case for price (remove currency symbols, etc.)
      if (activeSort === "prix") {
        compareA = parseFloat(
          a.prix.replace(/[^0-9,]/g, "").replace(",", ".") || "0"
        );
        compareB = parseFloat(
          b.prix.replace(/[^0-9,]/g, "").replace(",", ".") || "0"
        );
      }

      // If they’re strings, do a locale compare
      if (typeof compareA === "string" && typeof compareB === "string") {
        if (sortDirection === "asc") {
          return compareA.localeCompare(compareB);
        } else {
          return compareB.localeCompare(compareA);
        }
      } else {
        // Otherwise assume numeric
        const numA = Number(compareA);
        const numB = Number(compareB);
        if (sortDirection === "asc") {
          return numA - numB;
        } else {
          return numB - numA;
        }
      }
    });
  };

  // -------------------------------------
  // 10) Filtering
  // -------------------------------------
  const filteredProducts: Product[] = sortProducts(
    products.filter((product) => {
      // Compare against optional description safely with ?.
      const matchesSearch =
        searchTerm === "" ||
        product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "Tous" || product.categorie === selectedCategory;
      const matchesStatus =
        selectedStatus === "Tous" || product.statut === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    })
  );

  // -------------------------------------
  // 11) Reset filters
  // -------------------------------------
  const resetFilters = () => {
    setSelectedCategory("Tous");
    setSelectedStatus("Tous");
    setSearchTerm("");
  };

  // -------------------------------------
  // 12) Change sort key
  // -------------------------------------
  const handleSortChange = (sortKey: string) => {
    if (activeSort === sortKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setActiveSort(sortKey);
      setSortDirection("desc");
    }
  };

  // -------------------------------------
  // 13) Badge color helper
  // -------------------------------------
  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case "Actif":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "Inactif":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      case "Nouveau":
        return "bg-[#1B0353]/10 text-[#1B0353] border border-[#1B0353]/20";
      case "Épuisé":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-purple-100 text-purple-800 border border-purple-200";
    }
  };

  // -------------------------------------
  // 14) Quick stats example data
  // -------------------------------------
  // In real usage, these might be typed objects or fetched from an API
  const stats = [
    {
      id: "total",
      name: "Total produits",
      value: products.length,
      icon: <FiPackage className="h-6 w-6 text-[#1B0353]" />,
      change: "+12%",
      changeType: "increase",
    },
    {
      id: "revenue",
      name: "Revenu mensuel",
      value: "46 853 €",
      icon: <FiDollarSign className="h-6 w-6 text-emerald-600" />,
      change: "+8%",
      changeType: "increase",
    },
    {
      id: "sales",
      name: "Ventes du mois",
      value: "247",
      icon: <FiShoppingCart className="h-6 w-6 text-[#1B0353]" />,
      change: "+23%",
      changeType: "increase",
    },
    {
      id: "popular",
      name: "Produit le plus vendu",
      value: "Pro CRM Suite",
      icon: <FiTrendingUp className="h-6 w-6 text-amber-600" />,
      change: "CRM-001",
      changeType: "neutral",
    },
  ];

  // -------------------------------------
  // 15) Example export functions
  // -------------------------------------
  const exportAsCSV = () => {
    displaySuccessMessage("Export CSV en cours...");
    // Implementation
  };

  const exportAsPDF = () => {
    displaySuccessMessage("Export PDF en cours...");
    // Implementation
  };

  // Function to handle opening product details
const handleViewProduct = (product: Product) => {
  setSelectedProduct(product);
  setShowProductDetails(true);
};

// Function to handle opening the add product form
const handleAddProduct = () => {
  setProductToEdit(null);
  setShowAddProductForm(true);
};

// Function to handle editing a product
const handleEditProduct = (product: Product) => {
  setProductToEdit(product);
  setShowProductDetails(false);
  setShowAddProductForm(true);
};

// Function to handle saving a new or edited product
const handleSaveProduct = (productData: Product) => {
  if (productToEdit) {
    // Update existing product
    // const updatedProducts = products.map(p => 
    //   p.id === productData.id ? productData : p
    // );
    // In a real app, you would update your products state or call an API
    // For now, we'll just display a success message
    displaySuccessMessage(`Produit "${productData.nom}" mis à jour avec succès!`);
  } else {
    // Add new product
    // In a real app, you would update your products state or call an API
    // For now, we'll just display a success message
    displaySuccessMessage(`Produit "${productData.nom}" ajouté avec succès!`);
  }
  setShowAddProductForm(false);
};

  // -------------------------------------
  // 16) Render
  // -------------------------------------
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 pb-12">
        {/* Success Message Toast */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 right-4 z-50 bg-white border-l-4 border-emerald-500 text-emerald-700 p-4 rounded-lg shadow-lg flex items-center justify-between max-w-md"
            >
              <div className="flex items-center">
                <div className="bg-emerald-100 p-2 rounded-full mr-3">
                  <FiCheck className="text-emerald-500 text-lg" />
                </div>
                <span className="font-medium">{successMessage}</span>
              </div>
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <FiX className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breadcrumbs */}
        <Breadcrumbs items={['Accueil', 'Produits']} />

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
        >
          {/* Background gradient with pattern */}
          <div 
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />
          
          {/* Blurred circles for decoration */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#1B0353]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#3B0A87]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-[#1B0353]/10 via-white/70 to-[#3B0A87]/10 rounded-3xl pointer-events-none" />

          <div className="relative p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                {/* Title with decorative elements */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#1B0353]/10 rounded-lg">
                    <FiBox className="w-6 h-6 text-[#1B0353]" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1B0353] to-[#3B0A87]">
                    Produits
                  </h1>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Gestion de catalogue produits. Créez, modifiez et organisez votre inventaire de produits en toute simplicité.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center px-4 py-2.5 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium bg-gradient-to-r from-[#1B0353] to-[#3B0A87]"
                  onClick={() => setIsStatsOpen(!isStatsOpen)}
                >
                  <FiBarChart2 className="mr-2" />
                  <span>Statistiques</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow transition-all font-medium"
                  onClick={handleAddProduct}
                >
                  <FiPlus className="mr-2" style={{ color: '#1B0353' }} />
                  <span>Ajouter un produit</span>
                </motion.button>
              </div>
            </div>
            
            {/* Quick tip */}
            <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
              <FiInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-amber-700">Astuce :</span>{' '}
                <span className="text-amber-700">
                  Dernière mise à jour: 15 mars 2025. Les produits peuvent être organisés par catégories et tags pour faciliter la recherche.
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <AnimatePresence>
          {isStatsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat ) => (
                  <motion.div
                    key={stat.id}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-50 p-2 rounded-lg">
                            {stat.icon}
                          </div>
                          <h3 className="text-sm font-medium text-gray-500">
                            {stat.name}
                          </h3>
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full flex items-center ${
                            stat.changeType === "increase"
                              ? "bg-green-50 text-green-700"
                              : stat.changeType === "decrease"
                              ? "bg-red-50 text-red-700"
                              : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {stat.changeType === "increase" && (
                            <FiArrowUp className="mr-1 w-3 h-3" />
                          )}
                          {stat.changeType === "decrease" && (
                            <FiArrowDown className="mr-1 w-3 h-3" />
                          )}
                          {stat.change}
                        </div>
                      </div>
                      <p className="mt-3 text-2xl font-semibold text-gray-800">{stat.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions & Search Bar */}
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Search */}
            <div className="w-full md:w-96 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  displaySuccessMessage("Formulaire d'ajout de produit ouvert")
                }
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#1B0353] to-[#3B0A87] text-white rounded-xl hover:from-[#2A0570] hover:to-[#4B0DA7] transition shadow-md"
                // onClick={handleAddProduct}Z
              >
                <FiPlus />
                <span>Ajouter un produit</span>
              </motion.button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1 px-3 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition shadow-sm"
              >
                <FiFilter className={showFilters ? "text-[#1B0353]" : ""} />
                <span>{showFilters ? "Masquer filtres" : "Filtres"}</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition shadow-sm">
                <FiRefreshCw />
                <span className="hidden md:inline">Actualiser</span>
              </button>

              {/* Export Dropdown */}
              <div className="relative inline-block">
                <button
                  className="flex items-center space-x-1 px-3 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition shadow-sm"
                  onClick={() => {
                    const dropdown = document.getElementById("export-dropdown");
                    if (dropdown) {
                      dropdown.classList.toggle("hidden");
                    }
                  }}
                >
                  <FiDownload />
                  <span className="hidden md:inline">Exporter</span>
                </button>
                <div
                  id="export-dropdown"
                  className="hidden absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-10 border border-gray-100 overflow-hidden"
                >
                  <div className="py-1">
                    <button
                      onClick={exportAsCSV}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FiFileText className="mr-2" />
                      Exporter en CSV
                    </button>
                    <button
                      onClick={exportAsPDF}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FiFilePlus className="mr-2" />
                      Exporter en PDF
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 ${
                    viewMode === "grid"
                      ? "bg-[#1B0353]/10 text-[#1B0353]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 ${
                    viewMode === "list"
                      ? "bg-[#1B0353]/10 text-[#1B0353]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-5 border-t border-gray-100 pt-5 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categoryOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => setSelectedCategory(option)}
                          className={`px-3 py-1.5 rounded-lg text-sm ${
                            selectedCategory === option
                              ? "bg-[#1B0353]/10 text-[#1B0353] border border-[#1B0353]/20"
                              : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => setSelectedStatus(option)}
                          className={`px-3 py-1.5 rounded-lg text-sm ${
                            selectedStatus === option
                              ? "bg-[#1B0353]/10 text-[#1B0353] border border-[#1B0353]/20"
                              : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trier par
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        onClick={() => handleSortChange("nom")}
                        className={`px-3 py-1.5 rounded-lg text-sm flex items-center justify-center ${
                          activeSort === "nom"
                            ? "bg-[#1B0353]/10 text-[#1B0353] border border-[#1B0353]/20"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        Nom
                        {activeSort === "nom" && (
                          sortDirection === "asc" ? (
                            <FiArrowUp className="ml-1" />
                          ) : (
                            <FiArrowDown className="ml-1" />
                          )
                        )}
                      </button>
                      <button
                        onClick={() => handleSortChange("prix")}
                        className={`px-3 py-1.5 rounded-lg text-sm flex items-center justify-center ${
                          activeSort === "prix"
                            ? "bg-[#1B0353]/10 text-[#1B0353] border border-[#1B0353]/20"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        Prix
                        {activeSort === "prix" && (
                          sortDirection === "asc" ? (
                            <FiArrowUp className="ml-1" />
                          ) : (
                            <FiArrowDown className="ml-1" />
                          )
                        )}
                      </button>
                      <button
                        onClick={() => handleSortChange("vendu")}
                        className={`px-3 py-1.5 rounded-lg text-sm flex items-center justify-center ${
                          activeSort === "vendu"
                            ? "bg-[#1B0353]/10 text-[#1B0353] border border-[#1B0353]/20"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        Les plus vendus
                        {activeSort === "vendu" && (
                          sortDirection === "asc" ? (
                            <FiArrowUp className="ml-1" />
                          ) : (
                            <FiArrowDown className="ml-1" />
                          )
                        )}
                      </button>
                      <button
                        onClick={() => handleSortChange("dateCreation")}
                        className={`px-3 py-1.5 rounded-lg text-sm flex items-center justify-center ${
                          activeSort === "dateCreation"
                            ? "bg-[#1B0353]/10 text-[#1B0353] border border-[#1B0353]/20"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        Date de création
                        {activeSort === "dateCreation" && (
                          sortDirection === "asc" ? (
                            <FiArrowUp className="ml-1" />
                          ) : (
                            <FiArrowDown className="ml-1" />
                          )
                        )}
                      </button>
                      <button
                        onClick={() => handleSortChange("categorie")}
                        className={`px-3 py-1.5 rounded-lg text-sm flex items-center justify-center ${
                          activeSort === "categorie"
                            ? "bg-[#1B0353]/10 text-[#1B0353] border border-[#1B0353]/20"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        Catégorie
                        {activeSort === "categorie" && (
                          sortDirection === "asc" ? (
                            <FiArrowUp className="ml-1" />
                          ) : (
                            <FiArrowDown className="ml-1" />
                          )
                        )}
                      </button>
                      <button
                        onClick={() => handleSortChange("statut")}
                        className={`px-3 py-1.5 rounded-lg text-sm flex items-center justify-center ${
                          activeSort === "statut"
                            ? "bg-[#1B0353]/10 text-[#1B0353] border border-[#1B0353]/20"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        Statut
                        {activeSort === "statut" && (
                          sortDirection === "asc" ? (
                            <FiArrowUp className="ml-1" />
                          ) : (
                            <FiArrowDown className="ml-1" />
                          )
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={resetFilters}
                    className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => {
                      setShowFilters(false);
                      displaySuccessMessage("Filtres appliqués");
                    }}
                    className="px-3 py-1.5 bg-[#1B0353] text-white rounded-lg hover:bg-[#2A0570] transition shadow-sm"
                  >
                    Appliquer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bulk Actions (visible when products are selected) */}
        <AnimatePresence>
          {selectedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-4 bg-[#1B0353]/5 rounded-2xl border border-[#1B0353]/10 flex justify-between items-center shadow-md"
            >
              <div className="text-[#1B0353] font-medium flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#1B0353]/10 flex items-center justify-center mr-3">
                  <span className="text-[#1B0353]">{selectedProducts.length}</span>
                </div>
                <span>produit(s) sélectionné(s)</span>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center space-x-1 shadow-sm">
                  <FiTag />
                  <span>Modifier catégorie</span>
                </button>
                <button className="px-3 py-2 text-sm bg-[#1B0353] text-white rounded-lg hover:bg-[#2A0570] transition flex items-center space-x-1 shadow-sm">
                  <FiDollarSign />
                  <span>Modifier prix</span>
                </button>
                <button
                  onClick={() => {
                    const count = selectedProducts.length;
                    setSelectedProducts([]);
                    setSelectAll(false);
                    displaySuccessMessage(
                      `${count} produit(s) supprimé(s) avec succès`
                    );
                  }}
                  className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center space-x-1 shadow-sm"
                >
                  <FiTrash2 />
                  <span>Supprimer</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products List/Grid View */}
        {viewMode === "grid" ? (
          // GRID VIEW
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                onMouseEnter={() => setHoverProductId(product.id)}
                onMouseLeave={() => setHoverProductId(null)}
                className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transform transition-all duration-300 relative border border-gray-100"
              >
                {/* Product Image */}
                <div className="relative group">
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={product.image || `/api/placeholder/400/300`}
                      alt={product.nom}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute top-0 left-0 p-2">
                    <div className="bg-white bg-opacity-90 rounded-lg p-1 shadow-sm">
                      <input
                        type="checkbox"
                        className="h-5 w-5 text-[#1B0353] focus:ring-[#1B0353] border-gray-300 rounded"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                      />
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-2">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                        product.statut
                      )}`}
                    >
                      {product.statut}
                    </span>
                  </div>

                  {/* Quick action buttons overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                    <button 
                    className="p-2 bg-white rounded-full text-[#1B0353] hover:bg-[#1B0353]/10 transition"
                    onClick={() => handleViewProduct(product)}>
                      <FiEye size={18} />
                    </button>
                    <button className="p-2 bg-white rounded-full text-[#1B0353] hover:bg-[#1B0353]/10 transition">
                      <FiEdit size={18} />
                    </button>
                    <button className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">
                        {product.nom}
                      </h3>
                      <span className="ml-2 text-lg font-bold text-[#1B0353] whitespace-nowrap">
                        {product.prix}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      Réf: {product.reference}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 text-xs rounded-full bg-[#1B0353]/10 text-[#1B0353] border border-[#1B0353]/20`}
                      >
                        {product.categorie}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <FiPackage className="mr-1" />
                        Stock:{" "}
                        <span className="font-medium ml-1">{product.stock}</span>
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <FiBarChart2 className="mr-1" />
                        <span>
                          <b>{product.vendu}</b> vendus
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <FiClock className="mr-1" />
                        <span>{product.dateMiseAJour}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // LIST VIEW
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-[#1B0353] focus:ring-[#1B0353] border-gray-300 rounded"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Produit
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Catégorie
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Prix
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Stock
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Statut
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ventes
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Mis à jour
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-[#1B0353] focus:ring-[#1B0353] border-gray-300 rounded"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleSelectProduct(product.id)}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                            <img
                              src={product.image || "/api/placeholder/200/200"}
                              alt={product.nom}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.nom}
                            </div>
                            <div className="text-xs text-gray-500">
                              Réf: {product.reference}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 text-xs rounded-full bg-[#1B0353]/10 text-[#1B0353] border border-[#1B0353]/20`}
                        >
                          {product.categorie}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-[#1B0353]">
                        {product.prix}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.stock}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                            product.statut
                          )}`}
                        >
                          {product.statut}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {product.vendu}
                          </span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-[#1B0353] h-1.5 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (product.vendu / 150) * 100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.dateMiseAJour}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <div className="flex justify-end space-x-1">
                          <button
                            className="p-1.5 text-[#1B0353] hover:text-[#2A0570] bg-[#1B0353]/10 rounded-lg hover:bg-[#1B0353]/20 transition"
                            title="Voir"
                            onClick={() => handleViewProduct(product)}
                          >
                            <FiEye size={16} />
                          </button>
                          <button
                            className="p-1.5 text-[#1B0353] hover:text-[#2A0570] bg-[#1B0353]/10 rounded-lg hover:bg-[#1B0353]/20 transition"
                            title="Modifier"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            className="p-1.5 text-red-600 hover:text-red-900 bg-red-50 rounded-lg hover:bg-red-100 transition"
                            title="Supprimer"
                          >
                            <FiTrash2 size={16} />
                          </button>
                          <button
                            className="p-1.5 text-gray-600 hover:text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                            onClick={() =>
                              setShowActionMenu(
                                showActionMenu === product.id ? null : product.id
                              )
                            }
                            title="Plus d'options"
                          >
                            <FiMoreVertical size={16} />
                          </button>
                        </div>

                        {/* Dropdown menu for more actions */}
                        {showActionMenu === product.id && (
                          <div className="absolute right-4 mt-2 w-48 bg-white rounded-xl shadow-lg z-10 border border-gray-100 overflow-hidden">
                            <div className="py-1">
                              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <FiTag className="mr-2" />
                                Changer catégorie
                              </button>
                              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <FiDollarSign className="mr-2" />
                                Modifier prix
                              </button>
                              <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                <FiTrash2 className="mr-2" />
                                Supprimer
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty state (List View) */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Aucun produit trouvé
                </h3>
                <p className="mt-2 text-base text-gray-500 max-w-md mx-auto">
                  Aucun produit ne correspond à vos critères de recherche.
                  Essayez d&apos;ajuster vos filtres ou créez un nouveau produit.
                </p>
                <div className="mt-6 flex justify-center space-x-3">
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B0353]"
                  >
                    <FiRefreshCw className="mr-2 h-5 w-5" />
                    Réinitialiser les filtres
                  </button>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-[#1B0353] hover:bg-[#2A0570] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B0353]"
                  >
                    <FiPlus className="mr-2 h-5 w-5" />
                    Créer un produit
                  </button>
                </div>
              </div>
            )}

            {/* Pagination (List View) */}
            <nav
              className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">1</span> à{" "}
                  <span className="font-medium">{filteredProducts.length}</span>{" "}
                  sur <span className="font-medium">{products.length}</span>{" "}
                  produits
                </p>
              </div>
              <div className="flex-1 flex justify-between sm:justify-end">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 mr-3 shadow-sm">
                  Précédent
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
                  Suivant
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Empty state (Grid View) */}
        {viewMode === "grid" && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100"
          >
            <div className="bg-[#1B0353]/10 mx-auto w-20 h-20 flex items-center justify-center rounded-full mb-4">
              <FiBox className="h-10 w-10 text-[#1B0353]" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">
              Aucun produit trouvé
            </h3>
            <p className="mt-2 text-base text-gray-500 max-w-md mx-auto">
              Aucun produit ne correspond à vos critères de recherche. Essayez
              d&apos;ajuster vos filtres ou créez un nouveau produit.
            </p>
            <div className="mt-8 flex justify-center space-x-3">
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B0353]"
              >
                <FiRefreshCw className="mr-2 h-5 w-5" />
                Réinitialiser les filtres
              </button>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-[#1B0353] hover:bg-[#2A0570] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B0353]"
              >
                <FiPlus className="mr-2 h-5 w-5" />
                Créer un produit
              </button>
            </div>
          </motion.div>
        )}
      </div>
      {/* Product Details Modal */}
      {showProductDetails && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setShowProductDetails(false)}
          onEdit={handleEditProduct}
        />
      )}

      {/* Add/Edit Product Form */}
      {showAddProductForm && (
        <AddProductForm
          onClose={() => setShowAddProductForm(false)}
          onSave={handleSaveProduct}
          editProduct={productToEdit}
        />
      )}
    </motion.div>
    
  );
}
