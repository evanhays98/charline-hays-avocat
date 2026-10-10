import type { Metadata } from "next";
import { CONTACT } from "@/lib/content";
import { LegalPage, type LegalBlock } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false },
};

const BLOCKS: LegalBlock[] = [
  {
    heading: "Éditeur du site",
    paragraphs: [
      "Charline HAYS, avocate inscrite au Barreau de Paris.",
      `Adresse professionnelle : ${CONTACT.address}.`,
      `Contact : ${CONTACT.email} — ${CONTACT.phone}.`,
      "[À compléter : numéro SIREN, case palais / toque.]",
    ],
  },
  {
    heading: "Profession réglementée",
    paragraphs: [
      "Avocat, profession régie par la loi n° 71-1130 du 31 décembre 1971 et le Règlement Intérieur National de la profession d'avocat (RIN).",
      "Ordre professionnel : Barreau de Paris — 11 place Dauphine, 75001 Paris.",
    ],
  },
  {
    heading: "Assurance responsabilité civile professionnelle",
    paragraphs: [
      "[À compléter : nom et adresse de l'assureur, couverture géographique.]",
    ],
  },
  {
    heading: "Hébergement",
    paragraphs: [
      "[À compléter : nom, raison sociale et adresse de l'hébergeur.]",
    ],
  },
  {
    heading: "Propriété intellectuelle",
    paragraphs: [
      "L'ensemble des contenus de ce site (textes, images, charte graphique) est protégé par le droit d'auteur. Toute reproduction sans autorisation préalable est interdite.",
    ],
  },
];

const MentionsLegalesPage = () => (
  <LegalPage title="Mentions légales" blocks={BLOCKS} />
);

export default MentionsLegalesPage;
