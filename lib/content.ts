export interface NavLink {
  href: string;
  label: string;
}

export type SituationId =
  | "divorce"
  | "enfants"
  | "pension"
  | "patrimoine"
  | "filiation"
  | "penal"
  | "etranger";

export type SubjectId = SituationId | "autre";

export type FaqTheme = "divorce" | "enfants";

export interface Domain {
  title: string;
  description: string;
  situation: SituationId;
}

export interface Situation {
  id: SituationId;
  label: string;
  title: string;
  description: string;
  faqId?: string;
  urgent?: boolean;
}

export interface Subject {
  id: SubjectId;
  label: string;
}

export interface FaqFilter {
  value: FaqTheme | "toutes";
  label: string;
}

export interface Highlight {
  title: string;
  description: string;
}

export type ConsultationFormatValue = "cabinet" | "visio" | "telephone";

export interface ConsultationFormat {
  value: ConsultationFormatValue;
  label: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface FaqEntry {
  id: string;
  theme: FaqTheme;
  question: string;
  answer: string;
}

export interface ContactDetails {
  phone: string;
  phoneHref: string;
  email: string;
  address: string;
}

export const SITE_URL = "https://haysavocat.fr";

export const CONTACT: ContactDetails = {
  phone: "06 15 57 00 55",
  phoneHref: "tel:+33615570055",
  email: "charlinehays.avocat@gmail.com",
  address: "156 avenue Victor Hugo, 75116 Paris",
};

export const NAV_LINKS: NavLink[] = [
  { href: "#domaines", label: "Domaines" },
  { href: "#a-propos", label: "À propos" },
  { href: "#deroule", label: "Déroulé" },
  { href: "#honoraires", label: "Honoraires" },
  { href: "#faq", label: "FAQ" },
];

export const DOMAINS: Domain[] = [
  {
    title: "Divorce & séparation",
    description:
      "Divorce par consentement mutuel ou judiciaire, séparation de corps.",
    situation: "divorce",
  },
  {
    title: "Enfants",
    description:
      "Autorité parentale, résidence, droit de visite et d'hébergement.",
    situation: "enfants",
  },
  {
    title: "Pensions & compensations",
    description:
      "Pension alimentaire, contribution à l'éducation, prestation compensatoire.",
    situation: "pension",
  },
  {
    title: "Régimes matrimoniaux",
    description: "Liquidation et partage du patrimoine des époux.",
    situation: "patrimoine",
  },
  {
    title: "Filiation",
    description: "Établissement et contestation de la filiation.",
    situation: "filiation",
  },
  {
    title: "Droit pénal de la famille",
    description: "Non-représentation d'enfant, abandon de famille.",
    situation: "penal",
  },
  {
    title: "Enlèvements internationaux d'enfants",
    description:
      "Déplacements illicites d'enfants, Convention de La Haye du 25 octobre 1980.",
    situation: "etranger",
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

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: "divorce-amiable",
    theme: "divorce",
    question:
      "Quelle est la différence entre divorce amiable et divorce judiciaire ?",
    answer:
      "Le divorce par consentement mutuel repose sur l'accord des époux sur le principe et l'ensemble des conséquences du divorce ; il est plus rapide et se déroule sans juge. Le divorce judiciaire s'impose lorsqu'un désaccord subsiste : c'est alors le juge aux affaires familiales qui tranche.",
  },
  {
    id: "duree-divorce",
    theme: "divorce",
    question: "Combien de temps dure une procédure de divorce ?",
    answer:
      "Quelques semaines pour un divorce par consentement mutuel lorsque les époux sont d'accord ; de plusieurs mois à plusieurs années pour un divorce contentieux, selon la complexité du dossier et les juridictions saisies.",
  },
  {
    id: "residence-enfants",
    theme: "enfants",
    question: "Comment est fixée la résidence des enfants ?",
    answer:
      "Le juge statue en fonction de l'intérêt de l'enfant : âge, stabilité, disponibilité de chaque parent, entente parentale. La résidence peut être fixée chez l'un des parents ou en alternance.",
  },
  {
    id: "pension-alimentaire",
    theme: "enfants",
    question: "Comment est calculée la pension alimentaire ?",
    answer:
      "Elle dépend des ressources de chaque parent, des besoins de l'enfant et du temps de résidence chez chacun. Une table de référence indicative existe, mais le juge apprécie au cas par cas.",
  },
  {
    id: "non-representation",
    theme: "enfants",
    question: "Que faire en cas de non-représentation d'enfant ?",
    answer:
      "La non-représentation d'enfant est un délit. Il convient de faire constater les faits (main courante ou plainte) puis d'agir, au civil comme au pénal, pour faire respecter vos droits.",
  },
  {
    id: "enfant-etranger",
    theme: "enfants",
    question:
      "Mon enfant a été emmené à l'étranger sans mon accord : que faire ?",
    answer:
      "Il faut agir vite. La Convention de La Haye du 25 octobre 1980 organise le retour de l'enfant déplacé illicitement. Chaque jour compte : contactez-moi sans attendre pour engager la procédure adaptée.",
  },
];

export const SITUATIONS: Situation[] = [
  {
    id: "divorce",
    label: "Divorce, séparation",
    title: "Divorce & séparation",
    description:
      "Divorce par consentement mutuel ou judiciaire, séparation de corps.",
    faqId: "divorce-amiable",
  },
  {
    id: "enfants",
    label: "Mes enfants",
    title: "Enfants",
    description:
      "Autorité parentale, résidence, droit de visite et d'hébergement.",
    faqId: "residence-enfants",
  },
  {
    id: "pension",
    label: "Pension",
    title: "Pensions & compensations",
    description:
      "Pension alimentaire, contribution à l'éducation, prestation compensatoire.",
    faqId: "pension-alimentaire",
  },
  {
    id: "patrimoine",
    label: "Patrimoine du couple",
    title: "Régimes matrimoniaux",
    description: "Liquidation et partage du patrimoine des époux.",
  },
  {
    id: "filiation",
    label: "Filiation",
    title: "Filiation",
    description: "Établissement et contestation de la filiation.",
  },
  {
    id: "etranger",
    label: "Enfant emmené à l'étranger",
    title: "Chaque jour compte",
    description:
      "Déplacement illicite d'enfant : la Convention de La Haye du 25 octobre 1980 organise son retour. Appelez sans attendre.",
    faqId: "enfant-etranger",
    urgent: true,
  },
];

export const SUBJECTS: Subject[] = [
  { id: "divorce", label: "Divorce, séparation" },
  { id: "enfants", label: "Enfants" },
  { id: "pension", label: "Pension" },
  { id: "patrimoine", label: "Patrimoine" },
  { id: "filiation", label: "Filiation" },
  { id: "penal", label: "Pénal de la famille" },
  { id: "etranger", label: "Enfant à l'étranger" },
  { id: "autre", label: "Autre" },
];

export const FAQ_FILTERS: FaqFilter[] = [
  { value: "toutes", label: "Toutes" },
  { value: "divorce", label: "Divorce" },
  { value: "enfants", label: "Enfants" },
];

export const VALUES: Highlight[] = [
  { title: "Écoute", description: "Votre situation, dans ses détails" },
  { title: "Réactivité", description: "Réponse rapide, suivi constant" },
  { title: "Rigueur", description: "Stratégie claire, dossier solide" },
];

export const FEES: Highlight[] = [
  {
    title: "Convention écrite",
    description: "Établie dès le premier rendez-vous",
  },
  {
    title: "Forfait ou temps passé",
    description: "Selon la nature du dossier",
  },
  {
    title: "Estimation préalable",
    description: "Avant tout engagement",
  },
];

export const CONSULTATION_FORMATS: ConsultationFormat[] = [
  { value: "cabinet", label: "Cabinet" },
  { value: "visio", label: "Visio" },
  { value: "telephone", label: "Téléphone" },
];

export const APPOINTMENT_MESSAGES: Record<
  "schedule" | "reschedule",
  Record<ConsultationFormatValue, string>
> = {
  schedule: {
    cabinet:
      "Je vous confirme notre rendez-vous au cabinet. Pensez à apporter les documents utiles à votre dossier.",
    visio:
      "Je vous confirme notre rendez-vous en visio. Je vous enverrai le lien de connexion peu avant le rendez-vous.",
    telephone:
      "Je vous confirme notre rendez-vous téléphonique. Je vous appellerai au numéro que vous m'avez indiqué.",
  },
  reschedule: {
    cabinet:
      "Je vous confirme le nouvel horaire de notre rendez-vous au cabinet. Pensez à apporter les documents utiles à votre dossier.",
    visio:
      "Je vous confirme le nouvel horaire de notre rendez-vous en visio. Je vous enverrai le lien de connexion peu avant le rendez-vous.",
    telephone:
      "Je vous confirme le nouvel horaire de notre rendez-vous téléphonique. Je vous appellerai au numéro que vous m'avez indiqué.",
  },
};

export const RESOLUTION_MESSAGES = {
  decline:
    "Je ne suis malheureusement pas en mesure de donner suite à votre demande.\n\nJe reste joignable pour toute question.",
  cancel:
    "Je dois malheureusement annuler notre rendez-vous. Je reviens vers vous pour en convenir d'un autre.",
};
