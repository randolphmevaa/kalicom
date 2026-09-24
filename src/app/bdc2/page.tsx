'use client';

import { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

interface FormData {
  // Company info
  companyName: string;
  representative: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  delegateName: string;

  surfaceChoisie: string;
  secteurActivites: string;
  montantHT: string;
  datePremiereMiseEnLigne: string;
  dateSouscription: string;

  // Comment lines
  commentaire1: string;
  commentaire2: string;
  commentaire3: string;
  commentaire4: string;
}

export default function PDFFormPage() {
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    representative: '',
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    email: '',
    website: '',
    delegateName: '',
    surfaceChoisie: '',
    secteurActivites: '',
    montantHT: '',
    datePremiereMiseEnLigne: '',
    dateSouscription: '',
    commentaire1: '',
    commentaire2: '',
    commentaire3: '',
    commentaire4: '',
  });

  const [nbMises, setNbMises] = useState<string>(''); // '3', '6', '9', '12'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  // Mapping between PDF internal field names and our form fields
  const textFieldMappings: Record<string, string> = {
    'Texte1': 'companyName',        // Text1: Raison sociale
    'Texte2': 'representative',     // Text2: Représenté par
    'Texte3': 'address',            // Text3: Adresse
    'Texte4': 'postalCode',         // Text4: Code postal
    'Texte5': 'city',               // Text5: Ville
    'Texte6': 'phone',              // Text6: Tél
    'Texte8': 'email',              // Text8: Email
    'Texte9': 'website',                      // Texte9: Site Web
    'Texte10': 'surfaceChoisie',              // Texte10: Surface choisie
    'Texte11': 'secteurActivites',            // Texte11: Secteur d'activités
    'Texte12': 'montantHT',                   // Texte12: Montant HT (par mise en ligne)
    'Texte13': 'tvaCalculated',               // Texte13: TVA (calculée)
    'Texte14': 'ttcCalculated',               // Texte14: Montant TTC
    'Texte15': 'commentaire1',                // Texte15: Commentaire ligne 1
    'Texte16': 'commentaire2',                // Texte16: Commentaire ligne 2
    'Texte17': 'commentaire3',                // Texte17: Commentaire ligne 3
    'Texte18': 'commentaire4',                // Texte18: Commentaire ligne 4
    'Texte19': 'datePremiereMiseEnLigne',     // Texte19: Date première mise en ligne
    'Text-IyHWkT1FRp': 'dateSouscription',   // Texte20: Date de souscription
    'Text-I3lccKVl7j': 'delegateName',       // Texte21: Nom du délégué
    'text_26ldlg': 'montantAnnuelHT',        // Montant annuel HT de la campagne
    'text_27qdud': 'numeroBDC',              // Numéro de BDC
  };

  // Checkbox names for "nombre de mise en ligne" (3, 6, 9, 12)
  // Update these with the actual checkbox field names from your PDF
  const nbMisesCheckboxNames: Record<string, string> = {
    '3': 'Case à cocher22',   // Case à cocher22 (3 mises en ligne)
    '6': 'Case à cocher23',   // Case à cocher23 (6 mises en ligne)
    '9': 'Case à cocher24',   // Case à cocher24 (9 mises en ligne)
    '12': 'Case à cocher25', // Case à cocher25 (12 mises en ligne)
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US') + ' €';
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // DD-MM-YYYY
  };

  const handleDownload = async () => {
    try {
      const randomNumber = Math.floor(Math.random() * 1000000);
      const pdfUrl = '/FormulaireMoiranevillecopie1.pdf';
      
      // Load the PDF
      const pdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const form = pdfDoc.getForm();

      // Parse numeric values
      const montantHT = parseFloat(formData.montantHT) || 0;
      const nbMisesValue = parseInt(nbMises) || 0;
      const tva = montantHT * 0.20;
      const ttc = montantHT + tva;
      const montantAnnuelHT = montantHT * nbMisesValue;

      // Helper to safely set text field
      const setTextField = (fieldName: string, value: string) => {
        try {
          const field = form.getTextField(fieldName);
          field.setText(value);
        } catch (error) {
          console.warn(`Field ${fieldName} not found in PDF`);
        }
      };

      // Fill all text fields
      setTextField('Texte1', formData.companyName);
      setTextField('Texte2', formData.representative);
      setTextField('Texte3', formData.address);
      setTextField('Texte4', formData.postalCode);
      setTextField('Texte5', formData.city);
      setTextField('Texte6', formData.phone);
      setTextField('Texte8', formData.email);
      setTextField('Texte9', formData.website);
      setTextField('Texte10', formData.surfaceChoisie);
      setTextField('Texte11', formData.secteurActivites);
      setTextField('Texte12', formatCurrency(montantHT));
      setTextField('Texte13', formatCurrency(tva));
      setTextField('Texte14', formatCurrency(ttc));
      setTextField('Texte15', formData.commentaire1);
      setTextField('Texte16', formData.commentaire2);
      setTextField('Texte17', formData.commentaire3);
      setTextField('Texte18', formData.commentaire4);
      setTextField('Texte19', formatDate(formData.datePremiereMiseEnLigne));
      setTextField('Text-IyHWkT1FRp', formatDate(formData.dateSouscription));
      setTextField('Text-I3lccKVl7j', formData.delegateName);
      setTextField('text_26ldlg', formatCurrency(montantAnnuelHT));
      setTextField('text_27qdud', randomNumber.toString());

      // Handle checkboxes for number of postings (only one selected)
      Object.entries(nbMisesCheckboxNames).forEach(([value, checkboxName]) => {
        try {
          const checkbox = form.getCheckBox(checkboxName);
          if (nbMises === value) {
            checkbox.check();
          } else {
            checkbox.uncheck();
          }
          checkbox.updateAppearances();
        } catch (error) {
          console.warn(`Checkbox ${checkboxName} not found`);
        }
      });

      // Optional: If you need to draw the total TTC on a specific position (like the original)
      // Uncomment and adjust coordinates if needed
      /*
      const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      firstPage.drawText(formatCurrency(ttc), {
        x: 160,
        y: 576,
        size: 12,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });
      */

      // Flatten the form to make fields non-editable
      form.flatten();

      // Save and download
      const pdfData = await pdfDoc.save();
      const pdfArray = new Uint8Array(pdfData);
      const pdfBlob = new Blob([pdfArray], { type: 'application/pdf' });
      const pdfObjectUrl = URL.createObjectURL(pdfBlob);

      const downloadLink = document.createElement('a');
      downloadLink.href = pdfObjectUrl;
      downloadLink.download = `BDC_${randomNumber}.pdf`;
      downloadLink.click();
      
      URL.revokeObjectURL(pdfObjectUrl);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .form-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .form-section {
          background: white;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #ddd;
        }
        .form-section h2 {
          font-size: 1.4em;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #333;
          color: #333;
        }
        .form-group {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        .form-group > div {
          flex: 1;
          min-width: calc(50% - 20px);
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .form-group > div {
            min-width: 100%;
          }
        }
        .form-label {
          display: block;
          margin-bottom: 5px;
          color: #333;
          font-weight: 500;
        }
        .form-input, .form-textarea, .form-select {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          box-sizing: border-box;
          font-size: 16px;
        }
        .form-textarea {
          resize: vertical;
        }
        .radio-group {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 10px;
        }
        .radio-label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .radio-label input {
          margin-right: 8px;
          cursor: pointer;
        }
        .download-btn {
          width: 100%;
          padding: 15px;
          background-color: #333;
          color: white;
          font-size: 1.2em;
          font-weight: bold;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .download-btn:hover {
          background-color: #555;
        }
        h1 {
          text-align: center;
          color: #333;
          margin: 30px 0;
        }
        .info-text {
          font-size: 0.85em;
          color: #666;
          margin-top: -5px;
          margin-bottom: 10px;
        }
      `}</style>

      <div className="form-container text-gray-800">
        <h1>Générateur de Bon de Commande</h1>

        {/* Section 1: Commanditaire / Entreprise */}
        <div className="form-section">
          <h2>Commanditaire / Entreprise</h2>
          <div className="form-group">
            <div>
              <label htmlFor="companyName" className="form-label">Raison sociale</label>
              <input type="text" id="companyName" className="form-input" value={formData.companyName} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="representative" className="form-label">Représenté par</label>
              <input type="text" id="representative" className="form-input" value={formData.representative} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="address" className="form-label">Adresse</label>
              <input type="text" id="address" className="form-input" value={formData.address} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="postalCode" className="form-label">Code postal</label>
              <input type="text" id="postalCode" className="form-input" value={formData.postalCode} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="city" className="form-label">Ville</label>
              <input type="text" id="city" className="form-input" value={formData.city} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="phone" className="form-label">Téléphone</label>
              <input type="text" id="phone" className="form-input" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" id="email" className="form-input" value={formData.email} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="website" className="form-label">Site Web</label>
              <input type="text" id="website" className="form-input" value={formData.website} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* Section 2: Détails de la campagne */}
        <div className="form-section">
          <h2>Détails de la campagne</h2>
          <div className="form-group">
            <div>
              <label htmlFor="surfaceChoisie" className="form-label">Surface choisie</label>
              <input type="text" id="surfaceChoisie" className="form-input" value={formData.surfaceChoisie} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="secteurActivites" className="form-label">Secteur d'activités</label>
              <input type="text" id="secteurActivites" className="form-input" value={formData.secteurActivites} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="montantHT" className="form-label">Montant HT (par mise en ligne)</label>
              <input type="number" id="montantHT" className="form-input" step="0.01" value={formData.montantHT} onChange={handleInputChange} />
              <div className="info-text">TVA 20% appliquée automatiquement</div>
            </div>
            <div>
              <label htmlFor="datePremiereMiseEnLigne" className="form-label">Date de première mise en ligne</label>
              <input type="date" id="datePremiereMiseEnLigne" className="form-input" value={formData.datePremiereMiseEnLigne} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="dateSouscription" className="form-label">Date de souscription</label>
              <input type="date" id="dateSouscription" className="form-input" value={formData.dateSouscription} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* Section 3: Nombre de mises en ligne */}
        <div className="form-section">
          <h2>Nombre de mises en ligne</h2>
          <div className="radio-group">
            {[3, 6, 9, 12].map(n => (
              <label key={n} className="radio-label">
                <input
                  type="radio"
                  name="nbMises"
                  value={n}
                  checked={nbMises === n.toString()}
                  onChange={(e) => setNbMises(e.target.value)}
                />
                {n} mise{n > 1 ? 's' : ''} en ligne
              </label>
            ))}
          </div>
          {nbMises && (
            <div className="info-text" style={{ marginTop: '10px' }}>
              Montant annuel HT : {formatCurrency((parseFloat(formData.montantHT) || 0) * parseInt(nbMises))}
            </div>
          )}
        </div>

        {/* Section 4: Commentaires */}
        <div className="form-section">
          <h2>Commentaires</h2>
          <div className="form-group">
            <div style={{ minWidth: '100%' }}>
              <label htmlFor="commentaire1" className="form-label">Commentaire ligne 1</label>
              <input type="text" id="commentaire1" className="form-input" value={formData.commentaire1} onChange={handleInputChange} />
            </div>
            <div style={{ minWidth: '100%' }}>
              <label htmlFor="commentaire2" className="form-label">Commentaire ligne 2</label>
              <input type="text" id="commentaire2" className="form-input" value={formData.commentaire2} onChange={handleInputChange} />
            </div>
            <div style={{ minWidth: '100%' }}>
              <label htmlFor="commentaire3" className="form-label">Commentaire ligne 3</label>
              <input type="text" id="commentaire3" className="form-input" value={formData.commentaire3} onChange={handleInputChange} />
            </div>
            <div style={{ minWidth: '100%' }}>
              <label htmlFor="commentaire4" className="form-label">Commentaire ligne 4</label>
              <input type="text" id="commentaire4" className="form-input" value={formData.commentaire4} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="delegateName" className="form-label">Nom du délégué</label>
              <input type="text" id="delegateName" className="form-input" value={formData.delegateName} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button className="download-btn" onClick={handleDownload}>
          Télécharger le PDF
        </button>
      </div>
    </div>
  );
}