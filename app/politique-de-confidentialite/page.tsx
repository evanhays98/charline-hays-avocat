import type { Metadata } from "next";
import { CONTACT } from "@/lib/content";
import { LegalPage, type LegalBlock } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Charline HAYS, Avocate",
  robots: { index: false },
};

const BLOCKS: LegalBlock[] = [
  {
    heading: "Données collectées",
    paragraphs: [
      "Ce site n'utilise aucun cookie et ne stocke, sur ses propres serveurs, aucune donnée personnelle vous concernant. Une mesure d'audience anonyme est toutefois en place, décrite ci-dessous.",
      "Le formulaire de contact ouvre votre propre messagerie : les informations que vous saisissez ne transitent pas par ce site et n'y sont pas stockées.",
    ],
  },
  {
    heading: "Mesure d'audience",
    paragraphs: [
      "Ce site utilise PostHog pour mesurer sa fréquentation de façon anonyme : pages consultées, clics sur les liens d'appel et d'email, démarrage et envoi du formulaire de contact. Ces statistiques sont agrégées et ne permettent pas de vous identifier.",
      "La mesure est réalisée sans cookie, sans profilage et sans suivi entre sites ; le contenu que vous saisissez dans le formulaire n'est jamais transmis. Les données sont hébergées dans l'Union européenne (Francfort, Allemagne) et le signal « Ne pas me pister » (Do Not Track) de votre navigateur est respecté.",
      "Cette mesure d'audience anonyme repose sur l'intérêt légitime à comprendre l'usage du site et à l'améliorer.",
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
