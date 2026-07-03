export interface NavLink {
  href: string;
  label: string;
}

export interface Domain {
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface TimelineEntry {
  date: string;
  title: string;
  detail: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface ContactDetails {
  phone: string;
  phoneHref: string;
  email: string;
  address: string;
}

export const SITE_URL = "https://charlinehays-avocat.fr";

export const CONTACT: ContactDetails = {
  phone: "06 15 57 00 55",
  phoneHref: "tel:+33615570055",
  email: "contact@charlinehays-avocat.fr",
  address: "47 avenue Hoche, 75008 Paris",
};

export const NAV_LINKS: NavLink[] = [
  { href: "#domaines", label: "Domaines" },
  { href: "#a-propos", label: "À propos" },
  { href: "#deroule", label: "Déroulé" },
  { href: "#parcours", label: "Parcours" },
  { href: "#honoraires", label: "Honoraires" },
  { href: "#faq", label: "FAQ" },
];

export const DOMAINS: Domain[] = [
  {
    title: "Divorce & séparation",
    description:
      "Divorce par consentement mutuel ou judiciaire, séparation de corps.",
  },
  {
    title: "Enfants",
    description:
      "Autorité parentale, résidence, droit de visite et d'hébergement.",
  },
  {
    title: "Pensions & compensations",
    description:
      "Pension alimentaire, contribution à l'éducation, prestation compensatoire.",
  },
  {
    title: "Régimes matrimoniaux",
    description: "Liquidation et partage du patrimoine des époux.",
  },
  {
    title: "Filiation",
    description: "Établissement et contestation de la filiation.",
  },
  {
    title: "Droit pénal de la famille",
    description: "Non-représentation d'enfant, abandon de famille.",
  },
  {
    title: "Enlèvements internationaux d'enfants",
    description:
      "Déplacements illicites d'enfants, Convention de La Haye du 25 octobre 1980.",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    title: "Premier contact",
    description:
      "Vous me joignez par téléphone ou par email pour exposer votre situation.",
  },
  {
    title: "Consultation",
    description:
      "Nous faisons le point sur vos droits et les options qui s'offrent à vous.",
  },
  {
    title: "Stratégie",
    description:
      "Nous définissons ensemble la voie la plus adaptée : amiable ou contentieuse.",
  },
  {
    title: "Suivi",
    description:
      "Je vous accompagne et vous informe à chaque étape de la procédure.",
  },
];

export const CAREER: TimelineEntry[] = [
  {
    date: "Depuis 2021",
    title: "Avocate au Barreau de Paris",
    detail:
      "Exercice exclusif en droit de la famille : divorce, autorité parentale, liquidations, filiation, droit pénal de la famille.",
  },
  {
    date: "2019",
    title: "Tribunal judiciaire de Versailles",
    detail:
      "Pôle affaires familiales — participation aux audiences, rédaction de projets de décisions.",
  },
  {
    date: "2018",
    title: "Cour d'appel de Paris",
    detail:
      "Assistante de justice — assistance des magistrats, recherches juridiques.",
  },
];

export const EDUCATION: TimelineEntry[] = [
  {
    date: "2021",
    title: "Prestation de serment",
    detail: "Barreau de Paris.",
  },
  {
    date: "2020",
    title: "CAPA — HEDAC",
    detail: "École de formation des barreaux de la cour d'appel de Versailles.",
  },
  {
    date: "2017",
    title: "Master 2 Carrières judiciaires",
    detail: "Université de Versailles Saint-Quentin-en-Yvelines.",
  },
];

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    question:
      "Quelle est la différence entre divorce amiable et divorce judiciaire ?",
    answer:
      "Le divorce par consentement mutuel repose sur l'accord des époux sur le principe et l'ensemble des conséquences du divorce ; il est plus rapide et se déroule sans juge. Le divorce judiciaire s'impose lorsqu'un désaccord subsiste : c'est alors le juge aux affaires familiales qui tranche.",
  },
  {
    question: "Combien de temps dure une procédure de divorce ?",
    answer:
      "Quelques semaines pour un divorce par consentement mutuel lorsque les époux sont d'accord ; de plusieurs mois à plusieurs années pour un divorce contentieux, selon la complexité du dossier et les juridictions saisies.",
  },
  {
    question: "Comment est fixée la résidence des enfants ?",
    answer:
      "Le juge statue en fonction de l'intérêt de l'enfant : âge, stabilité, disponibilité de chaque parent, entente parentale. La résidence peut être fixée chez l'un des parents ou en alternance.",
  },
  {
    question: "Comment est calculée la pension alimentaire ?",
    answer:
      "Elle dépend des ressources de chaque parent, des besoins de l'enfant et du temps de résidence chez chacun. Une table de référence indicative existe, mais le juge apprécie au cas par cas.",
  },
  {
    question: "Que faire en cas de non-représentation d'enfant ?",
    answer:
      "La non-représentation d'enfant est un délit. Il convient de faire constater les faits (main courante ou plainte) puis d'agir, au civil comme au pénal, pour faire respecter vos droits.",
  },
  {
    question:
      "Mon enfant a été emmené à l'étranger sans mon accord : que faire ?",
    answer:
      "Il faut agir vite. La Convention de La Haye du 25 octobre 1980 organise le retour de l'enfant déplacé illicitement. Chaque jour compte : contactez-moi sans attendre pour engager la procédure adaptée.",
  },
];
