'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderIcon,
  DocumentIcon,
  CloudArrowUpIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ShareIcon,
  TrashIcon,
  FolderPlusIcon,
  UserPlusIcon,
  XMarkIcon,
  ArrowDownOnSquareIcon,
  StarIcon,
  FunnelIcon,
  TableCellsIcon,
  Squares2X2Icon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
  ClockIcon,
  CheckIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

// Types for Drive integration
const DriveInterface = () => {
  // States for Drive integration
  interface DriveAccount {
    _id: string;
    email: string;
    name: string;
    status: string;
    quota: {
      used: number;
      total: number;
    };
    lastSynced: string;
    isDefault: boolean;
  }
  
  const [driveAccounts, setDriveAccounts] = useState<DriveAccount[]>([]);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  interface DriveItem {
    _id: string;
    name: string;
    type: string;
    mimeType: string;
    size: number;
    owner: {
      name: string;
      email: string;
      picture: string;
    };
    createdAt: string;
    modifiedAt: string;
    parentId: string;
    path: string[];
    shared: boolean;
    starred: boolean;
    accountId: string;
    sharedWith?: {
      type: string;
      email: string;
      name: string;
      role: string;
    }[];
    webViewLink?: string;
    webContentLink?: string;
    thumbnail?: string;
  }

  const [items, setItems] = useState<DriveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState("root");
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: "root", name: "Mon Drive" }]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [fileTypeFilter, setFileTypeFilter] = useState<string | null>(null);
  const [sharedFilter, setSharedFilter] = useState<boolean | null>(null);
  
  // Modal states
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isShareFileModalOpen, setIsShareFileModalOpen] = useState(false);
  const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState(false);
  const [isConnectDriveModalOpen, setIsConnectDriveModalOpen] = useState(false);
  const [fileDetailsModal, setFileDetailsModal] = useState<{
    isOpen: boolean;
    fileId: string | null;
  }>({
    isOpen: false,
    fileId: null
  });
  
  // Stats
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalFolders: 0,
    totalShared: 0,
    recentlyModified: 0
  });

  // Helper utilities
  interface FileSizeFormatter {
    (bytes: number): string;
  }

  const formatFileSize: FileSizeFormatter = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  interface DateFormatOptions {
    hour: '2-digit';
    minute: '2-digit';
  }

  interface DateStringOptions {
    day: 'numeric';
    month: 'short'; 
    year: 'numeric';
  }

  const formatDate = (dateString: string): string => {
    const date: Date = new Date(dateString);
    const now: Date = new Date();
    const diff: number = now.getTime() - date.getTime();
    const dayDiff: number = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    const timeOptions: DateFormatOptions = { hour: '2-digit', minute: '2-digit' };

    if (dayDiff === 0) {
      return 'Aujourd\'hui ' + date.toLocaleTimeString([], timeOptions);
    } else if (dayDiff === 1) {
      return 'Hier ' + date.toLocaleTimeString([], timeOptions);
    } else if (dayDiff < 7) {
      const days: string[] = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      return days[date.getDay()] + ' ' + date.toLocaleTimeString([], timeOptions);
    } else {
      const dateStringOptions: DateStringOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      return date.toLocaleDateString([], dateStringOptions as Intl.DateTimeFormatOptions);
    }
  };

  // Pre-defined folders/views
  const specialFolders = [
    { id: "root", name: "Mon Drive", icon: FolderIcon, color: "#213f5b" },
    { id: "shared-with-me", name: "Partagés avec moi", icon: ShareIcon, color: "#0ea5e9" },
    { id: "starred", name: "Suivis", icon: StarIcon, color: "#f59e0b" },
    { id: "recent", name: "Récents", icon: ClockIcon, color: "#8b5cf6" },
    { id: "trash", name: "Corbeille", icon: TrashIcon, color: "#6b7280" },
  ];

  // File type icons and colors mapping
  const fileTypeIcons = {
    "folder": { icon: FolderIcon, color: "#213f5b", bgColor: "#f0f7ff" },
    "document": { icon: DocumentIcon, color: "#3b82f6", bgColor: "#eff6ff" },
    "spreadsheet": { icon: TableCellsIcon, color: "#10b981", bgColor: "#ecfdf5" },
    "presentation": { icon: Squares2X2Icon, color: "#f59e0b", bgColor: "#fffbeb" },
    "pdf": { icon: DocumentDuplicateIcon, color: "#ef4444", bgColor: "#fef2f2" },
    "image": { icon: PhotoIcon, color: "#8b5cf6", bgColor: "#f5f3ff" },
    "video": { icon: FilmIcon, color: "#ec4899", bgColor: "#fdf2f8" },
    "audio": { icon: MusicalNoteIcon, color: "#0ea5e9", bgColor: "#f0f9ff" },
    "archive": { icon: ArchiveBoxIcon, color: "#6b7280", bgColor: "#f3f4f6" },
    "other": { icon: DocumentIcon, color: "#6b7280", bgColor: "#f3f4f6" },
  };

  // Fetch Drive accounts and files
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Mock fetching Drive accounts
        const mockAccounts = [
          {
            _id: "1",
            email: "contact@votreentreprise.com",
            name: "Professionnel",
            status: "connected",
            quota: {
              used: 5.2 * 1024 * 1024 * 1024, // 5.2 GB
              total: 15 * 1024 * 1024 * 1024  // 15 GB
            },
            lastSynced: new Date().toISOString(),
            isDefault: true
          },
          {
            _id: "2",
            email: "marketing@votreentreprise.com",
            name: "Marketing",
            status: "connected",
            quota: {
              used: 8.7 * 1024 * 1024 * 1024, // 8.7 GB
              total: 30 * 1024 * 1024 * 1024  // 30 GB
            },
            lastSynced: new Date().toISOString(),
            isDefault: false
          },
          {
            _id: "3",
            email: "personnel@gmail.com",
            name: "Personnel",
            status: "disconnected",
            quota: {
              used: 0,
              total: 15 * 1024 * 1024 * 1024  // 15 GB
            },
            lastSynced: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            isDefault: false
          }
        ];
        
        // Set default account
        const defaultAccount = mockAccounts.find(a => a.status === "connected" && a.isDefault);
        
        if (defaultAccount) {
          setCurrentAccount(defaultAccount._id);
        } else {
          const firstConnected = mockAccounts.find(a => a.status === "connected");
          if (firstConnected) {
            setCurrentAccount(firstConnected._id);
          }
        }
        
        setDriveAccounts(mockAccounts);
        
        // Mock Drive items
        await fetchDriveItems();
        
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Fetch Drive items based on current folder
  const fetchDriveItems = async (folderId = "root") => {
    setLoading(true);
    try {
      // Mock fetching files and folders
      const types = Object.keys(fileTypeIcons);
      const sharedOptions = [true, false, false, false]; // 25% chance of being shared
      
      const folderCount = Math.floor(Math.random() * 5) + 2; // 2-6 folders
      const fileCount = Math.floor(Math.random() * 15) + 5; // 5-19 files
      
      // Generate folders
      const folders = Array.from({ length: folderCount }, (_, i) => {
        const isShared = sharedOptions[Math.floor(Math.random() * sharedOptions.length)];
        
        return {
          _id: `folder_${folderId}_${i}`,
          name: `Dossier ${i + 1}`,
          type: "folder",
          mimeType: "application/vnd.google-apps.folder",
          size: 0,
          owner: {
            name: "Vous",
            email: currentAccount ? driveAccounts.find(a => a._id === currentAccount)?.email || "" : "",
            picture: "https://ui-avatars.com/api/?name=You&background=213f5b&color=fff"
          },
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          modifiedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
          parentId: folderId,
          path: folderId === "root" ? ["root"] : ["root", folderId],
          shared: isShared,
          starred: Math.random() > 0.8,
          accountId: currentAccount || "1"
        };
      });
      
      // Generate files with proper type handling
      const files = Array.from({ length: fileCount }, (_, i) => {
        // Filter out folder type and select from remaining valid types
        const fileTypes = types.filter(t => t !== "folder");
        const type = fileTypes[Math.floor(Math.random() * fileTypes.length)];
        
        const isShared = sharedOptions[Math.floor(Math.random() * sharedOptions.length)];
        const size = Math.floor(Math.random() * 100000000) + 500000; // 500KB to 100MB
        
        let fileName = `Fichier ${i + 1}`;
        const fileExtensions: Record<string, string | string[]> = {
          "document": ".docx",
          "spreadsheet": ".xlsx",
          "presentation": ".pptx",
          "pdf": ".pdf",
          "image": [".jpg", ".png", ".gif"][Math.floor(Math.random() * 3)],
          "video": [".mp4", ".mov", ".avi"][Math.floor(Math.random() * 3)],
          "audio": [".mp3", ".wav", ".flac"][Math.floor(Math.random() * 3)],
          "archive": [".zip", ".rar", ".tar.gz"][Math.floor(Math.random() * 3)],
          "other": [".txt", ".json", ".xml", ".html"][Math.floor(Math.random() * 4)]
        };
        
        const extension = fileExtensions[type];
        if (Array.isArray(extension)) {
          fileName += extension[Math.floor(Math.random() * extension.length)];
        } else if (extension) {
          fileName += extension;
        }
        
        return {
          _id: `file_${folderId}_${i}`,
          name: fileName,
          type: type,
          mimeType: `application/${type}`,
          size: size,
          owner: {
            name: "Vous",
            email: currentAccount ? driveAccounts.find(a => a._id === currentAccount)?.email || "" : "",
            picture: "https://ui-avatars.com/api/?name=You&background=213f5b&color=fff"
          },
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          modifiedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
          parentId: folderId,
          path: folderId === "root" ? ["root"] : ["root", folderId],
          shared: isShared,
          sharedWith: isShared ? [
            {
              type: "user",
              email: "collaborateur@example.com",
              name: "Collaborateur",
              role: ["viewer", "commenter", "editor"][Math.floor(Math.random() * 3)]
            }
          ] : undefined,
          starred: Math.random() > 0.8,
          webViewLink: `https://drive.google.com/file/d/${i}/view`,
          webContentLink: `https://drive.google.com/uc?id=${i}`,
          thumbnail: type === "image" ? `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/400/300` : undefined,
          accountId: currentAccount || "1"
        };
      });
      
      // Combine and sort items
      const allItems = [...folders, ...files];
      allItems.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());
      
      setItems(allItems);
      
      // Update breadcrumbs if necessary
      if (folderId === "root") {
        setBreadcrumbs([{ id: "root", name: "Mon Drive" }]);
      } else if (folderId === "shared-with-me") {
        setBreadcrumbs([{ id: "shared-with-me", name: "Partagés avec moi" }]);
      } else if (folderId === "starred") {
        setBreadcrumbs([{ id: "starred", name: "Suivis" }]);
      } else if (folderId === "recent") {
        setBreadcrumbs([{ id: "recent", name: "Récents" }]);
      } else if (folderId === "trash") {
        setBreadcrumbs([{ id: "trash", name: "Corbeille" }]);
      }
      
      // Update stats
      const mockStats = {
        totalFiles: fileCount,
        totalFolders: folderCount,
        totalShared: allItems.filter(item => item.shared).length,
        recentlyModified: allItems.filter(item => {
          const modified = new Date(item.modifiedAt);
          const now = new Date();
          const diff = now.getTime() - modified.getTime();
          const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
          return dayDiff < 7;
        }).length
      };
      
      setStats(mockStats);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle folder navigation
  // interface Breadcrumb {
  //   id: string;
  //   name: string;
  // }

  interface NavigateToFolderParams {
    folderId: string;
    folderName?: string;
  }

  const navigateToFolder = ({ folderId, folderName }: NavigateToFolderParams): void => {
    setSelectedItems([]);
    setCurrentFolder(folderId);
    
    // Handle special folders
    if (specialFolders.some((f) => f.id === folderId)) {
      const specialFolder = specialFolders.find((f) => f.id === folderId);
      if (specialFolder) {
        setBreadcrumbs([{ id: specialFolder.id, name: specialFolder.name }]);
      }
    } else {
      // For normal folders
      if (folderName) {
        setBreadcrumbs([...breadcrumbs, { id: folderId, name: folderName }]);
      }
    }
    
    fetchDriveItems(folderId);
  };

  // Navigate up one level in the folder hierarchy
  const navigateUp = () => {
    if (breadcrumbs.length > 1) {
      const newBreadcrumbs = breadcrumbs.slice(0, -1);
      setBreadcrumbs(newBreadcrumbs);
      const parentFolder = newBreadcrumbs[newBreadcrumbs.length - 1];
      setCurrentFolder(parentFolder.id);
      fetchDriveItems(parentFolder.id);
    }
  };

  // Handle selecting items
  interface ToggleSelectItemProps {
    itemId: string;
  }

  const toggleSelectItem = ({ itemId }: ToggleSelectItemProps): void => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id: string) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // Handle sorting
  interface SortField {
    field: "name" | "modified" | "size";
  }

  const handleSort = ({ field }: SortField): void => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // Apply filters and sorting to items
  const filteredAndSortedItems = items
    .filter(item => {
      // Apply search
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply file type filter
      if (fileTypeFilter && item.type !== fileTypeFilter) {
        return false;
      }
      
      // Apply shared filter
      if (sharedFilter !== null && item.shared !== sharedFilter) {
        return false;
      }
      
      // Special folder filters
      if (currentFolder === "shared-with-me" && !item.shared) {
        return false;
      }
      
      if (currentFolder === "starred" && !item.starred) {
        return false;
      }
      
      if (currentFolder === "recent") {
        const modified = new Date(item.modifiedAt);
        const now = new Date();
        const diff = now.getTime() - modified.getTime();
        const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
        return dayDiff < 7;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Always show folders first
      if (a.type === "folder" && b.type !== "folder") {
        return -1;
      }
      if (a.type !== "folder" && b.type === "folder") {
        return 1;
      }
      
      // Then apply the selected sort
      switch (sortBy) {
        case "name":
          return sortDirection === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case "modified":
          return sortDirection === "asc"
            ? new Date(a.modifiedAt).getTime() - new Date(b.modifiedAt).getTime()
            : new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
        case "size":
          return sortDirection === "asc"
            ? a.size - b.size
            : b.size - a.size;
        default:
          return 0;
      }
    });

  // Handle creating a folder (mock implementation)
  const handleCreateFolder = (folderName: string) => {
    const newFolder = {
      _id: `folder_${Date.now()}`,
      name: folderName,
      type: "folder",
      mimeType: "application/vnd.google-apps.folder",
      size: 0,
      owner: {
        name: "Vous",
        email: currentAccount ? driveAccounts.find(a => a._id === currentAccount)?.email || "" : "",
        picture: "https://ui-avatars.com/api/?name=You&background=213f5b&color=fff"
      },
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      parentId: currentFolder,
      path: currentFolder === "root" ? ["root"] : ["root", currentFolder],
      shared: false,
      starred: false,
      accountId: currentAccount || "1"
    };
    
    setItems([newFolder, ...items]);
    setIsCreateFolderModalOpen(false);
  };

  // Handle share functionality
  interface ShareWithItem {
    email: string;
    role: string;
  }

  interface SharedUser {
    type: string;
    email: string;
    name: string;
    role: string;
  }

  const handleShare = (itemId: string | null, shareWith: ShareWithItem[]): void => {
    if (!itemId && selectedItems.length === 0) return;

    setItems(items.map(item => {
      if ((itemId && item._id === itemId) || (!itemId && selectedItems.includes(item._id))) {
        return {
          ...item,
          shared: true,
          sharedWith: shareWith.map(share => {
            // Validate that the role is a valid one before assigning
            const validRole: string = ["viewer", "commenter", "editor", "owner"].includes(share.role) 
              ? share.role
              : "viewer"; // Default to viewer if an invalid role is provided
              
            const sharedUser: SharedUser = {
              type: "user",
              email: share.email,
              name: share.email.split("@")[0],
              role: validRole
            };
            
            return sharedUser;
          })
        };
      }
      return item;
    }));
    
    setIsShareFileModalOpen(false);
  };

  // Delete selected items (mock implementation)
  const deleteItems = () => {
    if (selectedItems.length === 0) return;
    
    // In a real implementation, would make API call to Google Drive
    setItems(items.filter(item => !selectedItems.includes(item._id)));
    setSelectedItems([]);
  };

  // Toggle star status for items (mock implementation)
  const toggleStarred = () => {
    if (selectedItems.length === 0) return;
    
    setItems(items.map(item => {
      if (selectedItems.includes(item._id)) {
        return { ...item, starred: !item.starred };
      }
      return item;
    }));
  };

  // Connect a new Google Drive account (mock implementation)
  const handleConnectDrive = (account: DriveAccount) => {
    setDriveAccounts([...driveAccounts, account]);
    setCurrentAccount(account._id);
    setIsConnectDriveModalOpen(false);
  };

  // View file details
  const viewFileDetails = (fileId: string) => {
    setFileDetailsModal({
      isOpen: true,
      fileId
    });
  };

  // Handle file upload
  const handleUpload = (file: File) => {
    console.log("Uploading file:", file);
    setIsUploadFileModalOpen(false);
  };

  // Render file/folder icon based on type
  const renderItemIcon = (type: string) => {
    const fileType = fileTypeIcons[type as keyof typeof fileTypeIcons] || fileTypeIcons.other;
    const Icon = fileType.icon;
    
    return (
      <div className="rounded-lg p-2" style={{ backgroundColor: fileType.bgColor }}>
        <Icon className="h-5 w-5 md:h-6 md:w-6" style={{ color: fileType.color }} />
      </div>
    );
  };

  // Simple Button component
  interface ButtonProps {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;  // Remove optional parameter
    className?: string;
    variant?: 'default' | 'outline' | 'ghost';
    disabled?: boolean;
    size?: 'default' | 'sm' | 'lg';
  }

  const Button = ({ children, onClick, className, variant = "default", disabled = false }: ButtonProps) => {
    const baseClasses = "inline-flex items-center justify-center font-medium focus:outline-none transition-colors";
    const variantClasses = {
      default: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow",
      outline: "bg-white border hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg",
      ghost: "hover:bg-gray-100 text-gray-700",
    };

    return (
      <button 
        onClick={onClick} 
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };

  // Simple Modal component for CreateFolder
  interface CreateFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateFolder: (folderName: string) => void;
  }

  const CreateFolderModal = ({ isOpen, onClose, onCreateFolder }: CreateFolderModalProps) => {
    const [folderName, setFolderName] = useState('');

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-blue-500 p-4 flex items-center justify-between text-white">
            <h2 className="text-lg font-semibold">Créer un nouveau dossier</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du dossier</label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Entrez un nom de dossier"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                autoFocus
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={() => onCreateFolder(folderName)}
                disabled={!folderName.trim()}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                  folderName.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
                }`}
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Simple Modal component for ShareFile
  interface ShareFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onShare: (itemId: string | null, shareWith: { email: string; role: string; }[]) => void;
    selectedItems: string[];
    items: DriveItem[];
  }

  const ShareFileModal = ({ isOpen, onClose, onShare, selectedItems, items }: ShareFileModalProps) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('viewer');
    interface ShareListItem {
      email: string;
      role: string;
    }
    const [shareList, setShareList] = useState<ShareListItem[]>([]);

    if (!isOpen) return null;

    const handleAddEmail = () => {
      if (email.trim() && !shareList.some(s => s.email === email.trim())) {
        setShareList([...shareList, { email: email.trim(), role }]);
        setEmail('');
      }
    };

    interface SharePerson {
      email: string;
      role: string;
    }

    const handleRemoveEmail = (emailToRemove: string): void => {
      setShareList(shareList.filter((s: SharePerson) => s.email !== emailToRemove));
    };

    const handleSubmit = () => {
      const itemId = selectedItems.length === 1 ? selectedItems[0] : null;
      onShare(itemId, shareList);
    };

    const itemsToShare = selectedItems.map(id => 
      items.find(item => item._id === id)
    ).filter((item): item is DriveItem => !!item);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-blue-500 p-4 flex items-center justify-between text-white">
            <h2 className="text-lg font-semibold">Partager</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                {selectedItems.length === 1 && itemsToShare[0]
                  ? `Partager "${itemsToShare[0].name}"` 
                  : `Partager ${selectedItems.length} éléments`}
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Personnes</label>
              <div className="flex mb-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ajouter une adresse email"
                  className="w-full rounded-l-lg border-r-0 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddEmail();
                    }
                  }}
                />
                <button
                  onClick={handleAddEmail}
                  disabled={!email.trim()}
                  className="px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300"
                >
                  <UserPlusIcon className="h-5 w-5" />
                </button>
              </div>
              
              {shareList.length > 0 && (
                <div className="border rounded-lg p-3 mb-3 bg-gray-50">
                  <h3 className="text-xs font-medium text-gray-700 mb-2">Sera partagé avec:</h3>
                  <ul className="space-y-2">
                    {shareList.map((person, idx) => (
                      <li key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                            {person.email.charAt(0).toUpperCase()}
                          </div>
                          <span>{person.email}</span>
                        </div>
                        <div className="flex items-center">
                          <select
                            value={person.role}
                            onChange={(e) => {
                              const newList = [...shareList];
                              newList[idx].role = e.target.value;
                              setShareList(newList);
                            }}
                            className="text-xs mr-2 border-gray-300 rounded"
                          >
                            <option value="viewer">Lecteur</option>
                            <option value="commenter">Commentateur</option>
                            <option value="editor">Éditeur</option>
                          </select>
                          <button 
                            onClick={() => handleRemoveEmail(person.email)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle par défaut</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="viewer">Lecteur (peut voir)</option>
                  <option value="commenter">Commentateur (peut commenter)</option>
                  <option value="editor">Éditeur (peut modifier)</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={shareList.length === 0}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                  shareList.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
                }`}
              >
                Partager
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Simple Modal component for UploadFile
  interface UploadFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
    currentFolder: string;
    folderName: string;
  }

  const UploadFileModal = ({ isOpen, onClose, onUpload,  folderName }: UploadFileModalProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);

    if (!isOpen) return null;

    const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setFile(e.dataTransfer.files[0]);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-blue-500 p-4 flex items-center justify-between text-white">
            <h2 className="text-lg font-semibold">Importer un fichier</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Importation dans: {folderName || "Mon Drive"}
              </p>
            </div>
            
            <div className="mb-6">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="p-2 bg-blue-100 rounded-full mb-3">
                      <DocumentIcon className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    <button 
                      onClick={() => setFile(null)}
                      className="mt-3 text-xs text-blue-600 hover:text-blue-800"
                    >
                      Changer de fichier
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-2 bg-gray-100 rounded-full mx-auto mb-3 w-fit">
                      <CloudArrowUpIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Glissez-déposez un fichier ici ou
                    </p>
                    <label className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-blue-700">
                      Parcourir
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleChange}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={() => file && onUpload(file)}
                disabled={!file}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                  file ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
                }`}
              >
                Importer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Simple Modal component for ConnectDrive
  interface ConnectDriveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConnectDrive: (account: DriveAccount) => void;
  }

  const ConnectDriveModal = ({ isOpen, onClose, onConnectDrive }: ConnectDriveModalProps) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [step, setStep] = useState(1);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = () => {
      if (step === 1) {
        setStep(2);
      } else {
        setLoading(true);
        // Simulate connection process
        setTimeout(() => {
          const newAccount = {
            _id: `acc_${Date.now()}`,
            email,
            name: name || email.split('@')[0],
            status: "connected",
            quota: {
              used: 0,
              total: 15 * 1024 * 1024 * 1024 // 15 GB
            },
            lastSynced: new Date().toISOString(),
            isDefault: false
          };
          onConnectDrive(newAccount);
          setLoading(false);
        }, 1500);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-blue-500 p-4 flex items-center justify-between text-white">
            <h2 className="text-lg font-semibold">Connecter Google Drive</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            {step === 1 ? (
              <>
                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    Connectez votre compte Google Drive pour accéder à vos fichiers.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom du compte (optionnel)</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Drive Personnel"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votremail@gmail.com"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!email}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                      email ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
                    }`}
                  >
                    Continuer
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Vérification Google</h3>
                    <p className="text-gray-600 text-sm">Entrez le code de vérification envoyé à {email}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Code de vérification</label>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Entrez le code à 6 chiffres"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-center text-xl tracking-widest"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                    disabled={loading}
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || code.length < 6}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                      loading || code.length < 6 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                        Connexion...
                      </div>
                    ) : "Connecter"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Simple Modal component for FileDetails
  interface FileDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileId: string | null;
    items: DriveItem[];
    onShare: (fileId: string | null, shareWith: { email: string; role: string; }[]) => void;
  }

  const FileDetailsModal = ({ isOpen, onClose, fileId, items, onShare }: FileDetailsModalProps) => {
    const [shareEmail, setShareEmail] = useState('');
    const [shareRole, setShareRole] = useState('viewer');
    const [, setIsEditing] = useState(false);

    if (!isOpen || !fileId) return null;

    const file = items.find(item => item._id === fileId);
    if (!file) return null;

    const handleShare = () => {
      if (shareEmail.trim()) {
        onShare(file._id, [{ email: shareEmail, role: shareRole }]);
        setShareEmail('');
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md md:max-w-lg overflow-hidden">
          <div className="bg-blue-500 p-4 flex items-center justify-between text-white">
            <h2 className="text-lg font-semibold">Détails du fichier</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0">
                {file.type === "image" && file.thumbnail ? (
                  <Image
                    src={file.thumbnail} 
                    alt={file.name} 
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16">
                    {renderItemIcon(file.type)}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{file.name}</h3>
                  {file.starred && <StarIcon className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
                </div>
                <p className="text-sm text-gray-500 mb-2">{formatFileSize(file.size)} • {formatDate(file.modifiedAt)}</p>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    className="text-xs px-3 py-1 border-gray-200"
                    onClick={() => setIsEditing(true)}
                  >
                    <ArrowDownOnSquareIcon className="h-3.5 w-3.5 mr-1" />
                    Télécharger
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="text-xs px-3 py-1 border-gray-200"
                    onClick={() => setIsEditing(true)}
                  >
                    <ShareIcon className="h-3.5 w-3.5 mr-1" />
                    Partager
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Détails</h4>
              
              <dl className="grid grid-cols-3 gap-2 text-sm">
                <dt className="text-gray-500">Type</dt>
                <dd className="col-span-2 text-gray-900">{file.type.charAt(0).toUpperCase() + file.type.slice(1)}</dd>
                
                <dt className="text-gray-500">Propriétaire</dt>
                <dd className="col-span-2 text-gray-900">{file.owner.name}</dd>
                
                <dt className="text-gray-500">Modifié</dt>
                <dd className="col-span-2 text-gray-900">{formatDate(file.modifiedAt)}</dd>
                
                <dt className="text-gray-500">Créé</dt>
                <dd className="col-span-2 text-gray-900">{formatDate(file.createdAt)}</dd>
                
                <dt className="text-gray-500">Emplacement</dt>
                <dd className="col-span-2 text-gray-900 truncate">
                  {file.path.map((p, i) => {
                    const folderName = specialFolders.find(f => f.id === p)?.name || p;
                    return (
                      <span key={i}>
                        {i > 0 && " > "}
                        {folderName}
                      </span>
                    );
                  })}
                </dd>
              </dl>
            </div>
            
            {file.shared && file.sharedWith && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Partagé avec</h4>
                
                <ul className="space-y-2 mb-4">
                  {file.sharedWith.map((person, idx) => (
                    <li key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                          {person.name?.charAt(0).toUpperCase() || person.email.charAt(0).toUpperCase()}
                        </div>
                        <span>{person.name || person.email}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                        {person.role === "viewer" ? "Lecteur" : 
                         person.role === "commenter" ? "Commentateur" : 
                         person.role === "editor" ? "Éditeur" : "Propriétaire"}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    placeholder="Ajouter une personne"
                    className="flex-1 text-sm rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  
                  <select
                    value={shareRole}
                    onChange={(e) => setShareRole(e.target.value)}
                    className="text-sm rounded-lg border-gray-300"
                  >
                    <option value="viewer">Lecteur</option>
                    <option value="commenter">Commentateur</option>
                    <option value="editor">Éditeur</option>
                  </select>
                  
                  <Button
                    onClick={handleShare}
                    disabled={!shareEmail.trim()}
                    className="text-sm px-3 py-1"
                  >
                    Partager
                  </Button>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="text-sm px-4 py-2"
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#f8fafc] to-[#f0f7ff]">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-[#eaeaea] px-6 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-[#213f5b]">CRM</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-[#213f5b] hover:bg-[#f8fafc] rounded-full">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
            <button className="p-2 text-[#213f5b] hover:bg-[#f8fafc] rounded-full">
              <UserPlusIcon className="h-5 w-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-[#213f5b] flex items-center justify-center text-white">
              U
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-hidden flex flex-col">
          <div className="max-w-full h-full flex flex-col">
            {/* Dashboard Header with Stats */}
            <div className="bg-white border-b border-[#eaeaea] px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                <div className="relative">
                  <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-700 mb-1 pl-2">Google Drive</h1>
                  <p className="text-[#213f5b] opacity-75 pl-2">Gérez vos fichiers et dossiers Google Drive</p>
                  <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#bfddf9] opacity-10 rounded-full blur-3xl"></div>
                </div>
                
                <div className="flex items-center gap-3 self-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsConnectDriveModalOpen(true)}
                    className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] transition-colors rounded-lg px-4 py-2 flex items-center shadow-sm hover:shadow"
                  >
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    Ajouter un compte
                  </Button>
                  <Button
                    onClick={() => setIsUploadFileModalOpen(true)}
                    className="bg-gradient-to-r from-[#213f5b] to-[#3978b5] hover:from-[#152a3d] hover:to-[#2d5e8e] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                  >
                    <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                    Importer
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="bg-white backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border border-[#f0f0f0] hover:border-[#bfddf9] transition-colors overflow-hidden relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#bfddf9] to-[#d2fcb2] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#bfddf9] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-[#213f5b] font-medium">Fichiers</p>
                      <div className="flex items-center">
                        <p className="text-2xl sm:text-3xl font-bold text-[#213f5b] mt-1">{stats.totalFiles}</p>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">documents, images, etc.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg shadow-blue-100">
                      <DocumentIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="bg-white backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border border-[#f0f0f0] hover:border-[#bfddf9] transition-colors overflow-hidden relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#213f5b] to-[#415d7c] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#213f5b] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-[#213f5b] font-medium">Dossiers</p>
                      <div className="flex items-center">
                        <p className="text-2xl sm:text-3xl font-bold text-[#213f5b] mt-1">{stats.totalFolders}</p>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">dossiers organisés</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-500 shadow-lg shadow-indigo-100">
                      <FolderIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="bg-white backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border border-[#f0f0f0] hover:border-[#bfddf9] transition-colors overflow-hidden relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d2fcb2] to-[#a7f17f] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#d2fcb2] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-[#213f5b] font-medium">Partagés</p>
                      <div className="flex items-center">
                        <p className="text-2xl sm:text-3xl font-bold text-[#213f5b] mt-1">{stats.totalShared}</p>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">fichiers collaboratifs</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-500 shadow-lg shadow-green-100">
                      <ShareIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="bg-white backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border border-[#f0f0f0] hover:border-[#bfddf9] transition-colors overflow-hidden relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#bfddf9] to-[#8cc7ff] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#bfddf9] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-[#213f5b] font-medium">Récents</p>
                      <div className="flex items-center">
                        <p className="text-2xl sm:text-3xl font-bold text-[#213f5b] mt-1">{stats.recentlyModified}</p>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">derniers 7 jours</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-100">
                      <ClockIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Storage Usage */}
              {currentAccount && (
                <div className="mt-4 bg-white rounded-xl border border-[#eaeaea] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-medium text-[#213f5b]">Espace de stockage</h3>
                      <select
                        value={currentAccount}
                        onChange={(e) => setCurrentAccount(e.target.value)}
                        className="text-xs bg-[#f8fafc] border-[#eaeaea] rounded-lg text-[#213f5b] focus:ring-[#bfddf9] focus:border-[#bfddf9] py-1"
                      >
                        {driveAccounts.map(account => (
                          <option key={account._id} value={account._id} disabled={account.status === "disconnected"}>
                            {account.name} ({account.email})
                            {account.status === "disconnected" ? " - Déconnecté" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="text-xs text-[#213f5b]">
                      {formatFileSize(driveAccounts.find(a => a._id === currentAccount)?.quota.used || 0)}
                      {" / "}
                      {formatFileSize(driveAccounts.find(a => a._id === currentAccount)?.quota.total || 0)}
                    </span>
                  </div>
                  <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#bfddf9] to-[#3978b5] rounded-full"
                      style={{ 
                        width: `${(driveAccounts.find(a => a._id === currentAccount)?.quota.used || 0) / (driveAccounts.find(a => a._id === currentAccount)?.quota.total || 1) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Main Content - Drive */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Navigation */}
              <div className="w-48 xl:w-56 border-r border-[#eaeaea] flex flex-col bg-white">
                {/* Actions Buttons */}
                <div className="p-3">
                  <Button
                    onClick={() => setIsCreateFolderModalOpen(true)}
                    className="w-full bg-[#f0f7ff] hover:bg-[#e0f2fe] text-[#213f5b] transition-all rounded-lg py-2 flex items-center justify-center shadow-sm hover:shadow"
                  >
                    <FolderPlusIcon className="h-4 w-4 mr-2" />
                    Nouveau dossier
                  </Button>
                </div>
                
                {/* Folders Navigation */}
                <div className="flex-1 overflow-y-auto p-2">
                  <div className="space-y-1">
                  {specialFolders.map((folder) => {
                    const FolderIconComponent = folder.icon;
                    const isActive = currentFolder === folder.id;
                    
                    return (
                      <button
                        key={folder.id}
                        className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive 
                            ? 'bg-[#f0f7ff] text-[#213f5b]' 
                            : 'text-[#213f5b] hover:bg-[#f8fafc]'
                        }`}
                        onClick={() => navigateToFolder({ folderId: folder.id })}
                      >
                        <FolderIconComponent className="h-5 w-5 mr-3" style={{ color: folder.color }} />
                        <span>{folder.name}</span>
                      </button>
                    );
                  })}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-[#eaeaea]">
                    <h3 className="px-3 mb-2 text-xs font-semibold text-[#213f5b] uppercase tracking-wider">Stockage</h3>
                    <div className="space-y-2">
                      {driveAccounts.filter(account => account.status === "connected").map(account => (
                        <div 
                          key={account._id}
                          className={`flex flex-col px-3 py-2 rounded-lg transition-colors text-[#213f5b] ${
                            currentAccount === account._id ? 'bg-[#f0f7ff]' : 'hover:bg-[#f8fafc]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full overflow-hidden bg-[#213f5b] flex items-center justify-center text-white text-xs font-bold">
                              {account.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium truncate flex-1">{account.name}</span>
                          </div>
                          <div className="mt-1.5 flex items-center justify-between text-xs">
                            <span className="opacity-75 truncate">{account.email.split('@')[0]}</span>
                            <span className="opacity-75">{formatFileSize(account.quota.used)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Panel - File Explorer */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {/* Search and Filter Toolbar */}
                <div className="p-4 bg-white border-b border-[#eaeaea]">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[200px] relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="h-4 w-4 text-[#213f5b] opacity-50" />
                      </div>
                      <input
                        type="text"
                        placeholder="Rechercher dans Drive..."
                        className="pl-10 pr-10 py-2.5 w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] bg-[#f8fafc]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button 
                          onClick={() => setSearchTerm("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#213f5b] hover:text-[#152a3d]"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                        className="flex items-center gap-1 text-xs text-[#213f5b] border-[#eaeaea] hover:border-[#bfddf9] hover:bg-[#f8fafc] rounded-lg py-1.5 px-3 shadow-sm transition-all"
                      >
                        <FunnelIcon className="h-3 w-3" />
                        <span>Filtres</span>
                        {(fileTypeFilter || sharedFilter !== null) && (
                          <span className="flex items-center justify-center h-4 w-4 bg-[#d2fcb2] text-[#213f5b] text-xs font-medium rounded-full">
                            {(fileTypeFilter ? 1 : 0) + (sharedFilter !== null ? 1 : 0)}
                          </span>
                        )}
                      </Button>
                      
                      <div className="h-6 border-r border-[#eaeaea]"></div>
                      
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          onClick={() => setViewMode("grid")}
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            viewMode === "grid" ? 'bg-[#f0f7ff] text-[#213f5b]' : 'text-[#213f5b] hover:bg-[#f8fafc]'
                          }`}
                        >
                          <Squares2X2Icon className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          onClick={() => setViewMode("list")}
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            viewMode === "list" ? 'bg-[#f0f7ff] text-[#213f5b]' : 'text-[#213f5b] hover:bg-[#f8fafc]'
                          }`}
                        >
                          <TableCellsIcon className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          className="h-8 w-8 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f8fafc]"
                          onClick={() => fetchDriveItems(currentFolder)}
                        >
                          <ArrowPathIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Breadcrumbs */}
                  <div className="flex items-center mt-3 text-sm">
                    {breadcrumbs.length > 1 && (
                      <Button
                        variant="ghost"
                        onClick={navigateUp}
                        className="mr-1 h-6 w-6 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f8fafc]"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <div className="flex items-center flex-wrap gap-1">
                    {breadcrumbs.map((crumb, index) => (
                      <div key={crumb.id} className="flex items-center">
                        {index > 0 && (
                          <ChevronRightIcon className="h-3 w-3 mx-1 text-[#213f5b] opacity-50" />
                        )}
                        <button
                          onClick={() => navigateToFolder({ folderId: crumb.id })}
                          className={`px-2 py-1 rounded hover:bg-[#f0f7ff] ${
                            index === breadcrumbs.length - 1 
                              ? 'font-medium text-[#213f5b]' 
                              : 'text-[#213f5b] opacity-75'
                          }`}
                        >
                          {crumb.name}
                        </button>
                      </div>
                    ))}
                    </div>
                  </div>
                  
                  {/* Expanded Filters */}
                  <AnimatePresence>
                    {isFiltersVisible && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 overflow-hidden"
                      >
                        <div className="pt-3 border-t border-[#eaeaea]">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-[#213f5b] mb-1">Type de fichier</label>
                              <select
                                value={fileTypeFilter || ""}
                                onChange={(e) => setFileTypeFilter(e.target.value || null)}
                                className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] text-sm bg-[#f8fafc]"
                              >
                                <option value="">Tous les types</option>
                                {Object.keys(fileTypeIcons).map(type => (
                                  <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1) + "s"}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-[#213f5b] mb-1">Partage</label>
                              <select
                                value={sharedFilter === null ? "" : sharedFilter ? "shared" : "not-shared"}
                                onChange={(e) => {
                                  if (e.target.value === "") {
                                    setSharedFilter(null);
                                  } else {
                                    setSharedFilter(e.target.value === "shared");
                                  }
                                }}
                                className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] text-sm bg-[#f8fafc]"
                              >
                                <option value="">Tous</option>
                                <option value="shared">Partagés</option>
                                <option value="not-shared">Non partagés</option>
                              </select>
                            </div>
                          </div>
                          
                          {(fileTypeFilter || sharedFilter !== null) && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setFileTypeFilter(null);
                                setSharedFilter(null);
                              }}
                              className="mt-2 text-[#213f5b] hover:text-[#152a3d] text-xs"
                            >
                              Effacer les filtres
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Selection Actions */}
                <AnimatePresence>
                  {selectedItems.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-[#f0f7ff] border-b border-[#bfddf9] overflow-hidden"
                    >
                      <div className="px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-[#213f5b]">
                            {selectedItems.length} {selectedItems.length > 1 ? 'éléments sélectionnés' : 'élément sélectionné'}
                          </span>
                          <Button
                            variant="ghost"
                            onClick={() => setSelectedItems([])}
                            className="text-[#213f5b] hover:bg-[#e0f2fe] py-1 px-2 rounded text-xs"
                          >
                            Annuler
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            onClick={toggleStarred}
                            className="text-[#213f5b] hover:bg-[#e0f2fe] py-1 px-2 rounded text-xs flex items-center"
                          >
                            <StarIcon className="h-3.5 w-3.5 mr-1" />
                            <span>Suivre</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            onClick={() => setIsShareFileModalOpen(true)}
                            className="text-[#213f5b] hover:bg-[#e0f2fe] py-1 px-2 rounded text-xs flex items-center"
                          >
                            <ShareIcon className="h-3.5 w-3.5 mr-1" />
                            <span>Partager</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            className="text-[#213f5b] hover:bg-[#e0f2fe] py-1 px-2 rounded text-xs flex items-center"
                          >
                            <ArrowDownOnSquareIcon className="h-3.5 w-3.5 mr-1" />
                            <span>Télécharger</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            onClick={deleteItems}
                            className="text-red-500 hover:bg-red-50 py-1 px-2 rounded text-xs flex items-center"
                          >
                            <TrashIcon className="h-3.5 w-3.5 mr-1" />
                            <span>Supprimer</span>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Sorting Options (List View) */}
                {viewMode === "list" && (
                  <div className="bg-[#f8fafc] border-b border-[#eaeaea] px-4 py-2">
                    <div className="flex items-center text-xs font-medium text-[#213f5b]">
                      <div className="w-12 px-2"></div> {/* Checkbox column */}
                      <button
                        className="flex-1 flex items-center px-2 py-1 hover:bg-[#f0f7ff] rounded"
                        onClick={() => handleSort({ field: "name" })}
                      >
                        <span>Nom</span>
                        {sortBy === "name" && (
                          sortDirection === "asc" 
                            ? <ChevronUpIcon className="h-3 w-3 ml-1" /> 
                            : <ChevronDownIcon className="h-3 w-3 ml-1" />
                        )}
                      </button>
                      <button
                        className="w-40 flex items-center px-2 py-1 hover:bg-[#f0f7ff] rounded"
                        onClick={() => handleSort({ field: "modified" })}
                      >
                        <span>Dernière modification</span>
                        {sortBy === "modified" && (
                          sortDirection === "asc" 
                            ? <ChevronUpIcon className="h-3 w-3 ml-1" /> 
                            : <ChevronDownIcon className="h-3 w-3 ml-1" />
                        )}
                      </button>
                      <button
                        className="w-28 flex items-center px-2 py-1 hover:bg-[#f0f7ff] rounded"
                        onClick={() => handleSort({ field: "size" })} 
                      >
                        <span>Taille</span>
                        {sortBy === "size" && (
                          sortDirection === "asc" 
                            ? <ChevronUpIcon className="h-3 w-3 ml-1" /> 
                            : <ChevronDownIcon className="h-3 w-3 ml-1" />
                        )}
                      </button>
                      <div className="w-10"></div> {/* Actions column */}
                    </div>
                  </div>
                )}
                
                {/* File/Folder List */}
                <div className="flex-1 overflow-y-auto p-4 bg-white">
                  {loading ? (
                    <div className="flex flex-col justify-center items-center p-12">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#bfddf9] to-[#d2fcb2] rounded-full blur opacity-30 animate-pulse"></div>
                        <div className="relative animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#213f5b]"></div>
                      </div>
                      <p className="mt-4 text-[#213f5b] animate-pulse">Chargement des fichiers...</p>
                    </div>
                  ) : error ? (
                    <div className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
                      <p className="text-red-700 mb-4">{error}</p>
                      <Button 
                        variant="outline"
                        className="mt-2 text-red-600 border-red-300 hover:bg-red-100 rounded-lg"
                        onClick={() => fetchDriveItems(currentFolder)}
                      >
                        Réessayer
                      </Button>
                    </div>
                  ) : filteredAndSortedItems.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="relative mx-auto mb-6 w-20 h-20">
                        <div className="absolute inset-0 bg-[#bfddf9] opacity-20 rounded-full animate-pulse"></div>
                        <FolderIcon className="h-20 w-20 text-[#bfddf9] opacity-60" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#213f5b] mb-2">Dossier vide</h3>
                      <p className="text-[#213f5b] opacity-75 mb-4">
                        {searchTerm || fileTypeFilter || sharedFilter !== null
                          ? "Aucun élément ne correspond à vos critères de recherche."
                          : "Ce dossier ne contient aucun élément."}
                      </p>
                      {(searchTerm || fileTypeFilter || sharedFilter !== null) && (
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setSearchTerm("");
                            setFileTypeFilter(null);
                            setSharedFilter(null);
                          }}
                          className="border-[#bfddf9] bg-white text-[#213f5b] hover:bg-[#bfddf9] transition-all rounded-lg py-2 px-4"
                        >
                          <XMarkIcon className="h-4 w-4 mr-2" />
                          Effacer les filtres
                        </Button>
                      )}
                    </div>
                  ) : (
                    // Grid or List view based on viewMode
                    viewMode === "grid" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                        {filteredAndSortedItems.map(item => (
                          <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`relative group rounded-xl border transition-all cursor-pointer ${
                              selectedItems.includes(item._id)
                                ? 'border-[#3978b5] bg-[#f0f7ff] shadow-md'
                                : 'border-[#eaeaea] hover:border-[#bfddf9] hover:shadow-sm bg-white'
                            }`}
                            onClick={() => {
                              if (item.type === "folder") {
                                navigateToFolder({ folderId: item._id, folderName: item.name });
                              } else {
                                viewFileDetails(item._id);
                              }
                            }}
                          >
                            {/* Selection Checkbox */}
                            <div
                              className={`absolute top-2 left-2 z-10 rounded-full p-1 ${
                                selectedItems.includes(item._id)
                                  ? 'bg-[#3978b5] text-white'
                                  : 'bg-white text-[#213f5b] opacity-0 group-hover:opacity-100 border border-[#eaeaea] shadow-sm'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSelectItem({ itemId: item._id });
                              }}
                            >
                              <CheckIcon className="h-3 w-3" />
                            </div>
                            
                            {/* Star Indicator */}
                            {item.starred && (
                              <div className="absolute top-2 right-2 z-10 text-[#f59e0b]">
                                <StarIcon className="h-4 w-4 fill-[#f59e0b]" />
                              </div>
                            )}
                            
                            {/* Share Indicator */}
                            {item.shared && (
                              <div className="absolute bottom-2 right-2 z-10 text-[#3978b5]">
                                <ShareIcon className="h-4 w-4" />
                              </div>
                            )}
                            
                            {/* File/Folder Preview */}
                            <div className="h-32 flex items-center justify-center p-4">
                              {item.type === "image" && item.thumbnail ? (
                                <Image
                                  src={item.thumbnail} 
                                  alt={item.name} 
                                  className="max-h-full max-w-full object-contain rounded"
                                />
                              ) : (
                                <div className="h-16 w-16 flex items-center justify-center">
                                  {renderItemIcon(item.type)}
                                </div>
                              )}
                            </div>
                            
                            {/* File/Folder Info */}
                            <div className="p-3 border-t border-[#eaeaea] bg-[#f8fafc] rounded-b-xl">
                              <p className="text-sm font-medium text-[#213f5b] truncate mb-1" title={item.name}>
                                {item.name}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-[#213f5b] opacity-60">
                                  {item.type !== "folder" ? formatFileSize(item.size) : ''}
                                </span>
                                <span className="text-xs text-[#213f5b] opacity-60">
                                  {formatDate(item.modifiedAt).split(' ')[0]}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      // List View
                      <div className="overflow-hidden rounded-xl border border-[#eaeaea]">
                        {filteredAndSortedItems.map(item => (
                          <motion.div
                            key={item._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`flex items-center border-b border-[#eaeaea] last:border-b-0 group transition-colors ${
                              selectedItems.includes(item._id)
                                ? 'bg-[#f0f7ff]'
                                : 'bg-white hover:bg-[#f8fafc]'
                            }`}
                          >
                            <div className="w-12 px-2 py-3 flex justify-center">
                              <div
                                className={`rounded-full p-1 ${
                                  selectedItems.includes(item._id)
                                    ? 'bg-[#3978b5] text-white'
                                    : 'bg-white text-[#213f5b] opacity-0 group-hover:opacity-100 border border-[#eaeaea] shadow-sm'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSelectItem({ itemId: item._id });
                                }}
                              >
                                <CheckIcon className="h-3 w-3" />
                              </div>
                            </div>
                            
                            <div 
                              className="flex-1 flex items-center py-3 px-2 cursor-pointer"
                              onClick={() => {
                                if (item.type === "folder") {
                                  navigateToFolder({ folderId: item._id, folderName: item.name });
                                } else {
                                  viewFileDetails(item._id);
                                }
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                  {renderItemIcon(item.type)}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center">
                                    <p className="text-sm font-medium text-[#213f5b] truncate mr-2">
                                      {item.name}
                                    </p>
                                    {item.starred && (
                                      <StarIcon className="h-3.5 w-3.5 text-[#f59e0b] fill-[#f59e0b]" />
                                    )}
                                    {item.shared && (
                                      <ShareIcon className="h-3.5 w-3.5 text-[#3978b5] ml-1" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="w-40 px-2 py-3 text-xs text-[#213f5b] opacity-75">
                              {formatDate(item.modifiedAt)}
                            </div>
                            
                            <div className="w-28 px-2 py-3 text-xs text-[#213f5b] opacity-75">
                              {item.type !== "folder" ? formatFileSize(item.size) : '-'}
                            </div>
                            
                            <div className="w-10 px-2 py-3 flex justify-center">
                            <Button
                                variant="ghost"
                                className="h-6 w-6 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f7ff] opacity-0 group-hover:opacity-100"
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.stopPropagation();
                                  viewFileDetails(item._id);
                                }}
                              >
                                <EllipsisHorizontalIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Modals */}
      <CreateFolderModal 
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />
      
      <ShareFileModal
        isOpen={isShareFileModalOpen}
        onClose={() => setIsShareFileModalOpen(false)}
        onShare={handleShare}
        selectedItems={selectedItems}
        items={items}
      />
      
      <UploadFileModal
        isOpen={isUploadFileModalOpen}
        onClose={() => setIsUploadFileModalOpen(false)}
        onUpload={handleUpload}
        currentFolder={currentFolder}
        folderName={breadcrumbs[breadcrumbs.length - 1]?.name || ""}
      />
      
      <ConnectDriveModal
        isOpen={isConnectDriveModalOpen}
        onClose={() => setIsConnectDriveModalOpen(false)}
        onConnectDrive={handleConnectDrive}
      />
      
      <FileDetailsModal
        isOpen={fileDetailsModal.isOpen}
        fileId={fileDetailsModal.fileId}
        onClose={() => setFileDetailsModal({ isOpen: false, fileId: null })}
        onShare={handleShare}
        items={items}
      />
    </div>
  );
};

export default DriveInterface;