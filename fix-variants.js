// fix-variants.js — run with: node fix-variants.js
const fs = require('fs');
const path = require('path');

const files = [
  'src/app/components/dashboard/KalicomChatWidget.tsx',
  'src/app/dashboard/clients/[id]/ClientOverview.tsx',
  'src/app/dashboard/clients/[id]/ComptabiliteTab.tsx',
  'src/app/dashboard/clients/[id]/FacturationTab.tsx',
  'src/app/dashboard/clients/[id]/FactureElectroniqueTab.tsx',
  'src/app/dashboard/clients/[id]/ParametresTab.tsx',
  'src/app/dashboard/clients/[id]/ReglementsSolvabiliteTab.tsx',
  'src/app/dashboard/crm/chat/ChatPage.tsx',
  'src/app/dashboard/crm/prospects/[id]/ComptabiliteTab.tsx',
  'src/app/dashboard/crm/prospects/[id]/FacturationTab.tsx',
  'src/app/dashboard/crm/prospects/[id]/FactureElectroniqueTab.tsx',
  'src/app/dashboard/crm/prospects/[id]/ParametresTab.tsx',
  'src/app/dashboard/crm/prospects/[id]/ProspectOverview.tsx',
  'src/app/dashboard/crm/prospects/[id]/ReglementsSolvabiliteTab.tsx',
  'src/app/dashboard/document-ventes/avoirs-acompte/CreateDepositCreditNoteModal.tsx',
  'src/app/dashboard/document-ventes/avoirs/CreateCreditNoteModal.tsx',
  'src/app/dashboard/document-ventes/devis/components/StatisticsCards.tsx',
  'src/app/dashboard/document-ventes/devis/CreateQuoteModal.tsx',
  'src/app/dashboard/document-ventes/devis/page.tsx',
  'src/app/dashboard/document-ventes/factures/components/StatisticsCards.tsx',
  'src/app/dashboard/document-ventes/factures/CreateCreditNoteModal.tsx',
  'src/app/dashboard/document-ventes/factures/CreateInvoiceModal.tsx',
  'src/app/dashboard/modeles-de-documents/avoirs-acompte/components/templates/DeleteConfirmModal.tsx',
  'src/app/dashboard/modeles-de-documents/avoirs/components/NotificationToast.tsx',
  'src/app/dashboard/modeles-de-documents/avoirs/components/PageHeader.tsx',
  'src/app/dashboard/modeles-de-documents/avoirs/components/TemplateList.tsx',
  'src/app/dashboard/modeles-de-documents/avoirs/components/TemplateWizard.tsx',
  'src/app/dashboard/modeles-de-documents/factures/components/Modals/DeleteConfirmModal.tsx',
  'src/app/dashboard/modeles-de-documents/factures/components/TemplateList/index.tsx',
  'src/app/dashboard/modeles-de-documents/factures/page.tsx',
  'src/app/dashboard/pbx/mes-lignes/pages.tsx',
  'src/app/dashboard/pbx/mes-numeros/page.tsx',
  'src/app/dashboard/pbx/poste-de-travail/page.tsx',
  'src/app/dashboard/utilisateurs/UsersPage.tsx',
];

const MOD = 'framer-motion'; // change to 'motion/react' if that's what your project uses
let changed = 0;

for (const rel of files) {
  const fp = path.join(process.cwd(), rel);
  if (!fs.existsSync(fp)) { console.warn(`SKIP (not found): ${rel}`); continue; }

  let src = fs.readFileSync(fp, 'utf8');
  const original = src;

  // Annotate `const xVariants = {` / `const xAnim = { hidden: ...` / `{ initial: ...` patterns
  src = src.replace(
    /const\s+(\w+)\s*=\s*(\{\s*(?:hidden|show|initial)\s*:)/g,
    (m, name, rest) => `const ${name}: Variants = ${rest}`
  );

  if (src !== original) {
    const hasImport = new RegExp(`import\\s+(?:type\\s+)?\\{[^}]*\\bVariants\\b[^}]*\\}\\s+from\\s+["']${MOD}["']`).test(src);
    if (!hasImport) {
      const existing = new RegExp(`import\\s+\\{([^}]*)\\}\\s+from\\s+["']${MOD}["'];?`);
      if (existing.test(src)) {
        src = src.replace(existing, (m, names) => {
          const n = names.trim();
          return `import { ${n ? n + ', Variants' : 'Variants'} } from "${MOD}";`;
        });
      } else if (/^\s*["']use client["'];?/.test(src)) {
        src = src.replace(/^(\s*["']use client["'];?\s*\n)/, `$1import type { Variants } from "${MOD}";\n`);
      } else {
        src = `import type { Variants } from "${MOD}";\n` + src;
      }
    }
    fs.writeFileSync(fp, src, 'utf8');
    changed++;
    console.log(`FIXED: ${rel}`);
  } else {
    console.log(`No matching pattern — check manually: ${rel}`);
  }
}

console.log(`\nDone. Modified ${changed} file(s). Run npm run build again.`);