'use client';

import { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

interface FormData {
  subscriptionDate: string;
  cityPostalCode: string;
  activities: string;
  priceHT: string;
  companyName: string;
  representative: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  delegateName: string;
  observationsText: string;
  observationsParagraph: string;
}

interface CheckboxState {
  checkbox1: boolean;
  checkbox2: boolean;
  checkbox3: boolean;
  checkbox4: boolean;
  checkbox5: boolean;
  checkbox6: boolean;
}

export default function PDFFormPage() {
  const [formData, setFormData] = useState<FormData>({
    subscriptionDate: '',
    cityPostalCode: '',
    activities: '',
    priceHT: '',
    companyName: '',
    representative: '',
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    email: '',
    delegateName: '',
    observationsText: '',
    observationsParagraph: '',
  });

  const [checkboxes, setCheckboxes] = useState<CheckboxState>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
    checkbox5: false,
    checkbox6: false,
  });

  const [duration, setDuration] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCheckboxChange = (checkboxId: keyof CheckboxState) => {
    setCheckboxes(prev => ({
      ...prev,
      [checkboxId]: !prev[checkboxId],
    }));
  };

  const handleDownload = async () => {
    try {
      const randomNumber = Math.floor(Math.random() * 1000000);

      const pdfUrl = 'https://cdn.prod.website-files.com/669d0652d02654086ead4f5f/66db352c6cb87b0be42c9820_BDC2_final.pdf';
      const pdfDoc = await PDFDocument.load(await (await fetch(pdfUrl)).arrayBuffer());

      const form = pdfDoc.getForm();

      // Define checkbox mappings between HTML and PDF
      const checkboxMappings = [
        { htmlId: 'checkbox1', pdfName: 'CheckBox-9NqQpLuHdT' },
        { htmlId: 'checkbox2', pdfName: 'CheckBox-K0X4WJye6d' },
        { htmlId: 'checkbox3', pdfName: 'CheckBox-vvvZYqDrEN' },
        { htmlId: 'checkbox4', pdfName: 'CheckBox-uiPrxj0E-k' },
        { htmlId: 'checkbox5', pdfName: 'CheckBox-d0dpU1Xzl7' },
        { htmlId: 'checkbox6', pdfName: 'CheckBox-Fo5rNiG6rH' },
      ];

      checkboxMappings.forEach(checkbox => {
        if (checkboxes[checkbox.htmlId as keyof CheckboxState]) {
          const pdfCheckbox = form.getCheckBox(checkbox.pdfName);
          pdfCheckbox.check();
          pdfCheckbox.updateAppearances();
        }
      });

      // Handle radio buttons for Duration
      const radioMappings: Record<string, string> = {
        '1': 'CheckBox-lSuwbEIa3a',
        '2': 'CheckBox-o4zzwaUfFx',
        '3': 'CheckBox-_t5wOM7Qkc',
        '4': 'CheckBox-Sa4Cbp-cgK',
        '5': 'CheckBox-nOETQE6sRq',
        '6': 'CheckBox-6b82wr3Fn0',
        '7': 'CheckBox-9ahfOk8jh3',
        '8': 'CheckBox-mLE-Wd2ft9',
        '9': 'CheckBox-D6nNsJ9GNi',
        '10': 'CheckBox-3ztJ9epLTm',
        '11': 'CheckBox-8rPScV9W_k',
        '12': 'CheckBox-GNfxQHEayP',
      };

      if (duration && radioMappings[duration]) {
        const pdfRadio = form.getCheckBox(radioMappings[duration]);
        pdfRadio.check();
        pdfRadio.updateAppearances();
      }

      // Format the subscription date as DD-MM-YYYY
      if (formData.subscriptionDate) {
        const dateParts = formData.subscriptionDate.split('-');
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        form.getTextField('Text-IyHWkT1FRp').setText(formattedDate);
      }

      // Limit the Remarques field to 40 characters
      const remarquesText = formData.observationsText.slice(0, 40);
      form.getTextField('text_113cvcv').setText(remarquesText);

      // Limit the Observations field to 58 characters each and split across 3 fields
      const observationsParts = [
        formData.observationsParagraph.slice(0, 58),
        formData.observationsParagraph.slice(58, 116),
        formData.observationsParagraph.slice(116, 174),
      ];

      form.getTextField('text_114otrj').setText(observationsParts[0] || '');
      form.getTextField('text_115mid').setText(observationsParts[1] || '');
      form.getTextField('text_116yfol').setText(observationsParts[2] || '');

      // Calculate prices
      const priceHT = parseFloat(formData.priceHT) || 0;
      const vat20 = priceHT * 0.20;
      const totalTTC = priceHT + vat20;

      const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US') + '€';
      };

      // Set form fields
      form.getTextField('Text-MnJL-U4uru').setText(formData.cityPostalCode);
      form.getTextField('Text-Bq2r5-9Cwf').setText(formData.activities);
      form.getTextField('Text-mc7ooOPAxZ').setText(formatCurrency(priceHT));
      form.getTextField('Text-U0XQ1Q0b3V').setText(formatCurrency(vat20));

      const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      firstPage.drawText(formatCurrency(totalTTC), {
        x: 160,
        y: 576,
        size: 12,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });

      form.getTextField('Text-JzBNhzNJt2').setText(formData.companyName);
      form.getTextField('Text-XY-28EWxlZ').setText(formData.representative);
      form.getTextField('Text-hvnfiZyUaY').setText(formData.address);
      form.getTextField('Text-9npuANvdMn').setText(formData.postalCode);
      form.getTextField('Text-q_CYFcDbco').setText(formData.city);
      form.getTextField('Text-k0k3rLqCuM').setText(formData.phone);
      form.getTextField('Text-FH3ti9UZLb').setText(formData.email);
      form.getTextField('Text-I3lccKVl7j').setText(formData.delegateName);

      const totalHTCampagne = priceHT * (parseInt(duration) || 0);
      form.getTextField('text_76pthu').setText(formatCurrency(totalHTCampagne));
      form.getTextField('Text-FLOQVtnFeq').setText(randomNumber.toString());

      form.flatten();

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const pdfObjectUrl = URL.createObjectURL(pdfBlob);

      const downloadLink = document.createElement('a');
      downloadLink.href = pdfObjectUrl;
      downloadLink.download = `BDC_${randomNumber}.pdf`;
      downloadLink.click();
      URL.revokeObjectURL(pdfObjectUrl);
    } catch (error) {
      console.error('Error filling and downloading the PDF:', error);
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

        .form-input {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          box-sizing: border-box;
          font-size: 16px;
        }

        .form-textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          box-sizing: border-box;
          resize: vertical;
        }

        .checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .checkbox-label input {
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
      `}</style>

      <div className="form-container text-gray-800">
        <h1>Générateur de Bon de Commande</h1>

        {/* Section 1: Campaign */}
        <div className="form-section">
          <h2>Campaign</h2>
          <div className="form-group">
            <div>
              <label htmlFor="subscriptionDate" className="form-label">Date de souscription</label>
              <input
                type="date"
                id="subscriptionDate"
                className="form-input"
                value={formData.subscriptionDate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="cityPostalCode" className="form-label">Ville & Code Postale</label>
              <input
                type="text"
                id="cityPostalCode"
                className="form-input"
                value={formData.cityPostalCode}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="activities" className="form-label">Activités (2 max)</label>
              <input
                type="text"
                id="activities"
                className="form-input"
                value={formData.activities}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="priceHT" className="form-label">Tarif H.T (par mise en ligne)</label>
              <input
                type="number"
                id="priceHT"
                className="form-input"
                step="0.01"
                value={formData.priceHT}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Commanditaire/Entreprise */}
        <div className="form-section">
          <h2>Commanditaire/Entreprise</h2>
          <div className="form-group">
            <div>
              <label htmlFor="companyName" className="form-label">Raison sociale</label>
              <input
                type="text"
                id="companyName"
                className="form-input"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="representative" className="form-label">Représentant</label>
              <input
                type="text"
                id="representative"
                className="form-input"
                value={formData.representative}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="address" className="form-label">Adresse</label>
              <input
                type="text"
                id="address"
                className="form-input"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="form-label">Code postale</label>
              <input
                type="text"
                id="postalCode"
                className="form-input"
                value={formData.postalCode}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="city" className="form-label">Ville</label>
              <input
                type="text"
                id="city"
                className="form-input"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="form-label">Tél</label>
              <input
                type="text"
                id="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="form-label">E-mail</label>
              <input
                type="text"
                id="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Annonce/Prix campagne annuelle */}
        <div className="form-section">
          <h2>Annonce/Prix campagne annuelle</h2>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={checkboxes.checkbox1}
                onChange={() => handleCheckboxChange('checkbox1')}
              />
              Parution uberplan.fr
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={checkboxes.checkbox2}
                onChange={() => handleCheckboxChange('checkbox2')}
              />
              Parution TikTok
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={checkboxes.checkbox3}
                onChange={() => handleCheckboxChange('checkbox3')}
              />
              Parution Facebook
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={checkboxes.checkbox4}
                onChange={() => handleCheckboxChange('checkbox4')}
              />
              Parution Instagram
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={checkboxes.checkbox5}
                onChange={() => handleCheckboxChange('checkbox5')}
              />
              Secteur géographique supplémentaire
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={checkboxes.checkbox6}
                onChange={() => handleCheckboxChange('checkbox6')}
              />
              Secteur d&apos;activité supplémentaire
            </label>
          </div>
        </div>

        {/* Section 4: Durée */}
        <div className="form-section">
          <h2>Durée</h2>
          <div className="checkbox-group">
            {[...Array(12)].map((_, i) => (
              <label key={i + 1} className="checkbox-label">
                <input
                  type="radio"
                  name="duration"
                  value={String(i + 1)}
                  checked={duration === String(i + 1)}
                  onChange={(e) => setDuration(e.target.value)}
                />
                {i + 1} mois
              </label>
            ))}
          </div>
        </div>

        {/* Section 5: Remarques & Observations */}
        <div className="form-section">
          <h2>Remarques & Observations</h2>
          <div className="form-group">
            <div>
              <label htmlFor="delegateName" className="form-label">Nom du délégué</label>
              <input
                type="text"
                id="delegateName"
                className="form-input"
                value={formData.delegateName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="observationsText" className="form-label">REMARQUES</label>
              <input
                type="text"
                id="observationsText"
                className="form-input"
                maxLength={40}
                value={formData.observationsText}
                onChange={handleInputChange}
              />
            </div>
            <div style={{ minWidth: '100%' }}>
              <label htmlFor="observationsParagraph" className="form-label">OBSERVATION</label>
              <textarea
                id="observationsParagraph"
                className="form-textarea"
                rows={4}
                maxLength={174}
                value={formData.observationsParagraph}
                onChange={handleInputChange}
              />
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