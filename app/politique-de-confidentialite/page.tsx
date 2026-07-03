import type { Metadata } from "next";
import { CONTACT } from "@/lib/content";
import { LegalPage, type LegalBlock } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Charline Hays, Avocate",
  robots: { index: false },
};

const BLOCKS: LegalBlock[] = [
  {
    heading: "Données collectées",
    paragraphs: [
      "Ce site ne collecte aucune donnée personnelle et n'utilise aucun cookie de suivi.",
      "Le formulaire de contact ouvre votre propre messagerie : les informations que vous saisissez ne transitent pas par ce site et n'y sont pas stockées.",
    ],
  },
  {
    heading: "Emails et échanges",
    paragraphs: [
      `Les informations transmises par email à ${CONTACT.email} sont utilisées exclusivement pour répondre à votre demande et sont couvertes par le secret professionnel de l'avocat.`,
    ],
  },
  {
    heading: "Vos droits",
    paragraphs: [
      "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et d'effacement des données vous concernant.",
      `Pour l'exercer, écrivez à ${CONTACT.email}.`,
    ],
  },
];

const PolitiqueConfidentialitePage = () => (
  <LegalPage title="Politique de confidentialité" blocks={BLOCKS} />
);

export default PolitiqueConfidentialitePage;
