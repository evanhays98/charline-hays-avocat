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
  slug: string;
}

export interface QuestionAnswer {
  question: string;
  answer: string;
}

export interface DomainPage {
  slug: string;
  situation: SituationId;
  title: string;
  heading: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  services: string[];
  steps: ProcessStep[];
  faq: QuestionAnswer[];
}

export interface AboutPage {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  intro: string;
  paragraphs: string[];
  career: string[];
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

export const SITE_URL = "https://www.haysavocat.fr";

export const CONTACT: ContactDetails = {
  phone: "06 15 57 00 55",
  phoneHref: "tel:+33615570055",
  email: "charlinehays.avocat@gmail.com",
  address: "156 avenue Victor Hugo, 75116 Paris",
};

export const NAV_LINKS: NavLink[] = [
  { href: "/#domaines", label: "Domaines" },
  { href: "/a-propos", label: "À propos" },
  { href: "/#deroule", label: "Déroulé" },
  { href: "/#honoraires", label: "Honoraires" },
  { href: "/#faq", label: "FAQ" },
];

export const DOMAINS: Domain[] = [
  {
    title: "Divorce & séparation",
    description:
      "Divorce par consentement mutuel ou judiciaire, séparation de corps.",
    situation: "divorce",
    slug: "divorce-separation",
  },
  {
    title: "Enfants",
    description:
      "Autorité parentale, résidence, droit de visite et d'hébergement.",
    situation: "enfants",
    slug: "enfants-residence-autorite-parentale",
  },
  {
    title: "Pensions & compensations",
    description:
      "Pension alimentaire, contribution à l'éducation, prestation compensatoire.",
    situation: "pension",
    slug: "pension-alimentaire-prestation-compensatoire",
  },
  {
    title: "Régimes matrimoniaux",
    description: "Liquidation et partage du patrimoine des époux.",
    situation: "patrimoine",
    slug: "regimes-matrimoniaux-partage",
  },
  {
    title: "Filiation",
    description: "Établissement et contestation de la filiation.",
    situation: "filiation",
    slug: "filiation",
  },
  {
    title: "Droit pénal de la famille",
    description: "Non-représentation d'enfant, abandon de famille.",
    situation: "penal",
    slug: "droit-penal-de-la-famille",
  },
  {
    title: "Enlèvements internationaux d'enfants",
    description:
      "Déplacements illicites d'enfants, Convention de La Haye du 25 octobre 1980.",
    situation: "etranger",
    slug: "enlevement-international-enfants",
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

export const DOMAIN_PAGES: DomainPage[] = [
  {
    slug: "divorce-separation",
    situation: "divorce",
    title: "Divorce & séparation",
    heading: "Divorce et séparation",
    metaTitle: "Avocate divorce à Paris 16",
    metaDescription:
      "Divorce par consentement mutuel ou judiciaire, séparation de corps, mesures provisoires : Charline HAYS, avocate en droit de la famille à Paris 16, vous accompagne.",
    intro:
      "Que la séparation soit amiable ou conflictuelle, je vous aide à choisir la procédure adaptée, à protéger vos intérêts et ceux de vos enfants, et à avancer sereinement.",
    services: [
      "Divorce par consentement mutuel, sans juge : négociation et rédaction de la convention",
      "Divorce judiciaire : acceptation du principe de la rupture, altération définitive du lien conjugal, faute",
      "Mesures provisoires pendant la procédure : résidence des enfants, logement, pensions",
      "Séparation de corps",
      "Séparation des couples non mariés (PACS, concubinage) : enfants et biens",
    ],
    steps: [
      {
        title: "Premier échange",
        description:
          "Nous faisons le point sur votre situation, vos objectifs et les éventuelles urgences.",
      },
      {
        title: "Choix de la procédure",
        description:
          "Divorce amiable si un accord est possible, procédure judiciaire dans le cas contraire.",
      },
      {
        title: "Négociation ou audience",
        description:
          "Convention signée par les époux et leurs avocats, ou audience devant le juge aux affaires familiales.",
      },
      {
        title: "Suites du divorce",
        description:
          "Partage des biens, mise en œuvre et adaptation des mesures concernant les enfants.",
      },
    ],
    faq: [
      {
        question:
          "Faut-il un avocat chacun pour un divorce par consentement mutuel ?",
        answer:
          "Oui. Chaque époux doit être assisté de son propre avocat. La convention est signée par les époux et leurs avocats, puis déposée chez un notaire.",
      },
      {
        question: "Peut-on divorcer si l'autre époux refuse ?",
        answer:
          "Oui. Le divorce pour altération définitive du lien conjugal peut être demandé lorsque les époux vivent séparés depuis un an. Le divorce pour faute reste possible lorsque des manquements graves sont établis.",
      },
      {
        question: "Combien de temps dure une procédure de divorce ?",
        answer:
          "Quelques semaines pour un divorce par consentement mutuel lorsque les époux sont d'accord ; de plusieurs mois à plusieurs années pour un divorce contentieux, selon la complexité du dossier.",
      },
      {
        question: "Que devient le logement familial pendant la procédure ?",
        answer:
          "Le juge peut en attribuer la jouissance à l'un des époux, à titre gratuit ou en contrepartie d'une indemnité. Son sort définitif est réglé lors du partage des biens.",
      },
    ],
  },
  {
    slug: "enfants-residence-autorite-parentale",
    situation: "enfants",
    title: "Enfants",
    heading: "Résidence des enfants et autorité parentale",
    metaTitle: "Avocate garde d'enfant et résidence à Paris 16",
    metaDescription:
      "Résidence alternée, droit de visite et d'hébergement, autorité parentale, déménagement d'un parent : Charline HAYS, avocate en droit de la famille à Paris 16.",
    intro:
      "L'organisation de la vie des enfants après une séparation est souvent la question la plus sensible. Je vous aide à construire un cadre stable, centré sur leur intérêt.",
    services: [
      "Résidence des enfants : alternée ou chez l'un des parents",
      "Droit de visite et d'hébergement",
      "Exercice de l'autorité parentale : école, santé, voyages",
      "Déménagement d'un parent et changement d'école",
      "Modification des mesures lorsque la situation évolue",
      "Audition de l'enfant par le juge",
    ],
    steps: [
      {
        title: "Écoute",
        description:
          "Nous faisons le point sur l'organisation actuelle, les besoins des enfants et vos attentes.",
      },
      {
        title: "Recherche d'un accord",
        description:
          "Lorsque c'est possible, une convention parentale soumise à l'homologation du juge.",
      },
      {
        title: "Saisine du juge",
        description:
          "À défaut d'accord, le juge aux affaires familiales statue dans l'intérêt de l'enfant.",
      },
      {
        title: "Suivi",
        description:
          "Les mesures peuvent être adaptées si la situation des enfants ou des parents change.",
      },
    ],
    faq: [
      {
        question: "Comment est fixée la résidence des enfants ?",
        answer:
          "Le juge statue en fonction de l'intérêt de l'enfant : âge, stabilité, disponibilité de chaque parent, entente parentale. La résidence peut être fixée chez l'un des parents ou en alternance.",
      },
      {
        question: "À partir de quel âge l'enfant peut-il être entendu ?",
        answer:
          "Il n'y a pas d'âge fixe : tout enfant capable de discernement peut demander à être entendu par le juge. Son avis est pris en compte, sans qu'il décide à la place de ses parents.",
      },
      {
        question: "Un parent peut-il déménager avec l'enfant ?",
        answer:
          "Un déménagement qui modifie l'organisation de la vie de l'enfant doit être annoncé à l'autre parent à l'avance. En cas de désaccord, le juge aux affaires familiales tranche dans l'intérêt de l'enfant.",
      },
      {
        question:
          "Que faire si l'autre parent ne respecte pas le droit de visite ?",
        answer:
          "Le refus de remettre l'enfant constitue le délit de non-représentation d'enfant. Il convient de faire constater les faits, puis d'agir au civil comme au pénal.",
      },
    ],
  },
  {
    slug: "pension-alimentaire-prestation-compensatoire",
    situation: "pension",
    title: "Pensions & compensations",
    heading: "Pension alimentaire et prestation compensatoire",
    metaTitle: "Avocate pension alimentaire à Paris 16",
    metaDescription:
      "Fixation, révision et recouvrement de pension alimentaire, prestation compensatoire : Charline HAYS, avocate en droit de la famille à Paris 16.",
    intro:
      "Les questions financières conditionnent l'équilibre de chacun après la séparation. Je vous aide à obtenir ou à faire réviser un montant juste, et à le faire respecter.",
    services: [
      "Contribution à l'entretien et à l'éducation des enfants : fixation et révision",
      "Pension entre époux pendant la procédure de divorce",
      "Prestation compensatoire : évaluation, négociation, contentieux",
      "Recouvrement des pensions impayées",
      "Révision lorsque les revenus ou la situation changent",
    ],
    steps: [
      {
        title: "Analyse",
        description:
          "Revenus, charges et besoins de chacun : nous évaluons ensemble un montant cohérent.",
      },
      {
        title: "Accord ou demande",
        description:
          "Un accord homologué par le juge, ou une demande devant le juge aux affaires familiales.",
      },
      {
        title: "Décision",
        description:
          "Le montant est fixé et peut être versé par l'intermédiaire de la CAF.",
      },
      {
        title: "Exécution",
        description:
          "En cas d'impayé, nous engageons les mesures de recouvrement adaptées.",
      },
    ],
    faq: [
      {
        question: "Comment est calculée la pension alimentaire ?",
        answer:
          "Elle dépend des ressources de chaque parent, des besoins de l'enfant et du temps de résidence chez chacun. Une table de référence indicative existe, mais le juge apprécie au cas par cas.",
      },
      {
        question: "Que faire si la pension n'est pas payée ?",
        answer:
          "Plusieurs voies existent : paiement direct auprès de l'employeur, saisie, recours à l'agence de recouvrement de la CAF. Le non-paiement pendant plus de deux mois constitue aussi le délit d'abandon de famille.",
      },
      {
        question: "Qu'est-ce que la prestation compensatoire ?",
        answer:
          "Elle compense, au moment du divorce, la disparité que la rupture crée dans les conditions de vie des époux. Elle prend le plus souvent la forme d'un capital.",
      },
      {
        question: "Peut-on modifier le montant d'une pension ?",
        answer:
          "Oui, en cas de changement important dans la situation de l'un des parents ou dans les besoins de l'enfant, par un accord homologué ou par une décision du juge.",
      },
    ],
  },
  {
    slug: "regimes-matrimoniaux-partage",
    situation: "patrimoine",
    title: "Régimes matrimoniaux",
    heading: "Régimes matrimoniaux et partage des biens",
    metaTitle: "Avocate liquidation de régime matrimonial à Paris 16",
    metaDescription:
      "Liquidation et partage des biens après divorce, communauté, séparation de biens, indivision : Charline HAYS, avocate en droit de la famille à Paris 16.",
    intro:
      "Le partage du patrimoine est souvent l'étape la plus technique d'une séparation. Je vous aide à faire valoir vos droits, en lien avec le notaire.",
    services: [
      "Liquidation et partage du régime matrimonial après un divorce",
      "Communauté, séparation de biens, participation aux acquêts : droits de chacun",
      "Sort du logement familial et des biens immobiliers",
      "Récompenses et créances entre époux",
      "Indivision entre partenaires de PACS ou concubins",
      "Changement de régime matrimonial",
    ],
    steps: [
      {
        title: "Inventaire",
        description:
          "Nous recensons les biens, les dettes et l'origine des financements.",
      },
      {
        title: "Évaluation des droits",
        description:
          "Selon votre régime matrimonial, nous déterminons ce qui revient à chacun.",
      },
      {
        title: "Négociation",
        description:
          "Recherche d'un partage amiable, avec le notaire lorsqu'un bien immobilier est concerné.",
      },
      {
        title: "Partage judiciaire",
        description:
          "À défaut d'accord, le juge tranche les points de désaccord.",
      },
    ],
    faq: [
      {
        question: "Quel est mon régime matrimonial ?",
        answer:
          "Sans contrat de mariage, les époux sont mariés sous le régime de la communauté réduite aux acquêts : les biens acquis pendant le mariage sont communs, ceux possédés avant ou reçus par donation ou succession restent propres.",
      },
      {
        question: "Le partage se fait-il chez le notaire ?",
        answer:
          "Un notaire est nécessaire dès qu'un bien immobilier est concerné. À défaut d'accord entre les époux, le partage peut être tranché par le juge.",
      },
      {
        question: "Que sont les récompenses ?",
        answer:
          "Ce sont des comptes entre la communauté et chaque époux, par exemple lorsque des fonds communs ont financé un bien propre, ou l'inverse.",
      },
    ],
  },
  {
    slug: "filiation",
    situation: "filiation",
    title: "Filiation",
    heading: "Filiation : établir ou contester un lien",
    metaTitle: "Avocate filiation et paternité à Paris 16",
    metaDescription:
      "Reconnaissance, recherche ou contestation de paternité, possession d'état : Charline HAYS, avocate en droit de la famille à Paris 16.",
    intro:
      "Établir ou contester une filiation a des conséquences durables pour l'enfant comme pour les parents. Je vous accompagne dans ces démarches délicates.",
    services: [
      "Reconnaissance et établissement de la filiation",
      "Action en recherche de paternité ou de maternité",
      "Contestation de paternité",
      "Possession d'état",
      "Conséquences : nom de l'enfant, autorité parentale, pension",
    ],
    steps: [
      {
        title: "Analyse",
        description:
          "Nous examinons la situation de l'enfant et les délais applicables.",
      },
      {
        title: "Stratégie",
        description:
          "Choix de l'action adaptée et des éléments de preuve à réunir.",
      },
      {
        title: "Procédure",
        description:
          "Le tribunal judiciaire statue, le cas échéant après une expertise biologique.",
      },
      {
        title: "Conséquences",
        description:
          "Nom, autorité parentale, pension : nous réglons les suites de la décision.",
      },
    ],
    faq: [
      {
        question: "Peut-on faire un test de paternité ?",
        answer:
          "En France, l'expertise biologique ne peut être réalisée que sur décision d'un juge, dans le cadre d'une action relative à la filiation. Les tests réalisés hors de ce cadre sont interdits.",
      },
      {
        question: "Dans quel délai contester une paternité ?",
        answer:
          "Le délai dépend de la situation. Sans possession d'état, l'action est en principe ouverte pendant dix ans. Lorsque la filiation est confortée par une possession d'état d'au moins cinq ans, elle ne peut plus, en principe, être contestée.",
      },
    ],
  },
  {
    slug: "droit-penal-de-la-famille",
    situation: "penal",
    title: "Droit pénal de la famille",
    heading: "Droit pénal de la famille",
    metaTitle:
      "Avocate non-représentation d'enfant et abandon de famille à Paris",
    metaDescription:
      "Non-représentation d'enfant, abandon de famille, soustraction d'enfant : Charline HAYS, avocate en droit de la famille à Paris, vous assiste ou vous défend.",
    intro:
      "Certains conflits familiaux relèvent aussi du pénal. J'assiste les victimes comme les personnes mises en cause, en gardant à l'esprit l'intérêt des enfants.",
    services: [
      "Non-représentation d'enfant : plainte et défense",
      "Abandon de famille : pension impayée",
      "Soustraction d'enfant",
      "Assistance de la victime ou défense de la personne poursuivie",
    ],
    steps: [
      {
        title: "Constat",
        description:
          "Nous réunissons les éléments : décisions, échanges, mains courantes.",
      },
      {
        title: "Plainte ou défense",
        description:
          "Dépôt de plainte, ou préparation de votre défense si vous êtes mis en cause.",
      },
      {
        title: "Audience",
        description: "Assistance devant le tribunal correctionnel.",
      },
      {
        title: "Volet civil",
        description:
          "En parallèle, adaptation des mesures devant le juge aux affaires familiales si nécessaire.",
      },
    ],
    faq: [
      {
        question: "Que faire en cas de non-représentation d'enfant ?",
        answer:
          "La non-représentation d'enfant est un délit. Il convient de faire constater les faits (main courante ou plainte) puis d'agir, au civil comme au pénal, pour faire respecter vos droits.",
      },
      {
        question: "Qu'est-ce que l'abandon de famille ?",
        answer:
          "C'est le fait de ne pas payer, pendant plus de deux mois, une pension fixée par une décision de justice ou une convention homologuée. Le délit est puni de deux ans d'emprisonnement et de 15 000 € d'amende.",
      },
      {
        question:
          "Faut-il porter plainte ou saisir le juge aux affaires familiales ?",
        answer:
          "Les deux voies sont complémentaires : la plainte sanctionne le comportement, le juge aux affaires familiales peut adapter l'organisation de la vie de l'enfant.",
      },
    ],
  },
  {
    slug: "enlevement-international-enfants",
    situation: "etranger",
    title: "Enlèvements internationaux d'enfants",
    heading: "Enlèvements internationaux d'enfants",
    metaTitle: "Avocate enlèvement international d'enfant à Paris",
    metaDescription:
      "Déplacement illicite d'enfant à l'étranger, Convention de La Haye de 1980, interdiction de sortie du territoire : Charline HAYS, avocate en droit de la famille à Paris.",
    intro:
      "Lorsqu'un enfant est emmené ou retenu à l'étranger sans l'accord de l'autre parent, il faut agir vite. Je vous accompagne pour obtenir son retour.",
    services: [
      "Retour de l'enfant déplacé ou retenu à l'étranger (Convention de La Haye du 25 octobre 1980)",
      "Saisine de l'autorité centrale",
      "Procédures en France lorsque l'enfant y a été emmené",
      "Interdiction de sortie du territoire",
      "Droit de visite transfrontière",
    ],
    steps: [
      {
        title: "Urgence",
        description:
          "Nous faisons immédiatement le point sur la situation et les documents disponibles.",
      },
      {
        title: "Autorité centrale",
        description:
          "Saisine de l'autorité centrale pour localiser l'enfant et engager la procédure de retour.",
      },
      {
        title: "Procédure",
        description:
          "Le juge compétent statue sur le retour de l'enfant, dans des délais courts.",
      },
      {
        title: "Prévention",
        description:
          "Mesures pour éviter un nouveau départ : interdiction de sortie du territoire.",
      },
    ],
    faq: [
      {
        question:
          "Mon enfant a été emmené à l'étranger sans mon accord : que faire ?",
        answer:
          "Il faut agir vite. La Convention de La Haye du 25 octobre 1980 organise le retour de l'enfant déplacé illicitement. Contactez-moi sans attendre pour engager la procédure adaptée.",
      },
      {
        question: "Qu'est-ce que l'autorité centrale ?",
        answer:
          "Chaque pays signataire de la Convention de La Haye désigne une autorité centrale chargée de coopérer pour localiser l'enfant et organiser son retour. En France, il s'agit du ministère de la Justice.",
      },
      {
        question: "Le délai écoulé compte-t-il ?",
        answer:
          "Oui. Lorsque la demande est faite moins d'un an après le déplacement, le retour est en principe ordonné. Au-delà, le juge peut le refuser si l'enfant s'est intégré dans son nouveau milieu.",
      },
      {
        question: "Comment éviter un départ à l'étranger ?",
        answer:
          "Le juge aux affaires familiales peut ordonner une interdiction de sortie du territoire de l'enfant sans l'autorisation des deux parents.",
      },
    ],
  },
];

export const ABOUT_PAGE: AboutPage = {
  metaTitle: "À propos",
  metaDescription:
    "Charline HAYS, avocate au Barreau de Paris depuis 2021, intervient exclusivement en droit de la famille. Écoute, réactivité et rigueur, à Paris 16.",
  heading: "Charline HAYS, avocate au Barreau de Paris",
  intro:
    "Le droit de la famille est un domaine où le droit touche à l'intime. Chaque dossier est unique.",
  paragraphs: [
    "Inscrite au Barreau de Paris depuis 2021, j'ai fait le choix de me consacrer entièrement au droit de la famille.",
    "J'accompagne mes clients avec écoute, réactivité et rigueur, en recherchant d'abord des solutions négociées, sans jamais renoncer à défendre fermement leurs intérêts lorsque le contentieux s'impose.",
    "J'interviens devant les juridictions d'Île-de-France et les cours d'appel de Paris et de Versailles. Les rendez-vous ont lieu au 156 avenue Victor Hugo, dans le 16e arrondissement, en visio ou par téléphone.",
  ],
  career: [],
};

export interface SeoSettings {
  siteName: string;
  alternateNames: string[];
  homeTitle: string;
  homeDescription: string;
  geo: { latitude: number; longitude: number };
  profiles: string[];
}

export const SEO: SeoSettings = {
  siteName: "Charline HAYS — Avocate",
  alternateNames: ["Hays Avocat", "Maître Hays", "Charline Hays avocate"],
  homeTitle: "Charline HAYS — Avocate en droit de la famille à Paris 16",
  homeDescription:
    "Charline HAYS, avocate au Barreau de Paris, intervient exclusivement en droit de la famille : divorce, résidence des enfants, pension alimentaire, filiation, enlèvement international d'enfants. Rendez-vous à Paris 16, en visio ou par téléphone.",
  geo: { latitude: 48.866598, longitude: 2.277772 },
  profiles: [],
};
