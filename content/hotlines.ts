/**
 * Hotline fixture (blueprint §5.1, G-10).
 *
 * Every number the Threshold renders comes from here. Each carries a
 * `lastVerified` date, a `sourceUrl` (the official service), and a
 * `verificationStatus`. The set shipped stamped `verify-before-launch` until the
 * owner closed that launch gate (§5.1, §15.2) on 2026-09-04; see below. The Threshold page states plainly that these numbers
 * change and that findahelpline.com is maintained continuously while this page
 * is not.
 *
 * No number here is invented (G-10): all are the widely published official
 * lines, matching the Opus 5 Threshold donor and blueprint §5.1 verbatim.
 */

export type VerificationStatus = "verify-before-launch" | "verified";

/**
 * N-260 — WHO A NUMBER ACTUALLY SERVES, enumerated (blueprint 6.0 §3.10, §7.1).
 *
 * The trunk labelled 0808 2000 247 `regions: "United Kingdom"`. It is England's
 * line. A woman in Belfast, Glasgow or Cardiff who calls it and is redirected has
 * spent the one call she could safely make, so the label is not a presentation
 * detail — it is the record's most load-bearing field.
 *
 * `coverage` is therefore the stored fact and `regions` is DERIVED from it
 * (`regionsLabel` below), so a label can no longer drift wider than the coverage
 * anybody verified. C-4 asserts it in both directions.
 *
 * The list is the nations and the broad clauses the shipped records need, and
 * nothing else. `NATIONS` is the subset a coverage claim can actually be checked
 * against; the rest are the honest vaguenesses a directory row is allowed.
 */
export const NATIONS = [
  "England",
  "Scotland",
  "Wales",
  "Northern Ireland",
  "Ireland",
  "United States",
  "Canada",
  "Australia",
] as const;

const BROAD = [
  "European Union",
  "Many European countries",
  "Many other countries",
  "Most countries",
  "Everywhere",
  "Anywhere",
  "Anywhere else",
] as const;

export type Nation = (typeof NATIONS)[number] | (typeof BROAD)[number];

/** The four nations of the United Kingdom, collapsed in a label only when all four are covered. */
export const UK_NATIONS: Nation[] = ["England", "Scotland", "Wales", "Northern Ireland"];

/**
 * How each entry is printed. Lower-case entries are the trailing clauses, joined
 * with "and" rather than a comma, which is what keeps the rendered labels the
 * same sentences they have always been.
 */
const NATION_LABEL: Record<Nation, string> = {
  England: "England",
  Scotland: "Scotland",
  Wales: "Wales",
  "Northern Ireland": "Northern Ireland",
  Ireland: "Ireland",
  "United States": "United States",
  Canada: "Canada",
  Australia: "Australia",
  "European Union": "European Union",
  "Many European countries": "Many European countries",
  "Many other countries": "many other countries",
  "Most countries": "Most countries",
  Everywhere: "Everywhere",
  Anywhere: "Anywhere",
  "Anywhere else": "Anywhere else",
};

/**
 * The rendered region label, derived — never typed by hand (N-260).
 *
 * "United Kingdom" appears only when all four of its nations are covered; that is
 * the whole point of the row. Anything else is listed as itself.
 */
export function regionsLabel(coverage: Nation[]): string {
  const allUk = UK_NATIONS.every((n) => coverage.includes(n));
  const parts: string[] = [];
  if (allUk) parts.push("United Kingdom");
  for (const n of coverage) {
    if (allUk && UK_NATIONS.includes(n)) continue;
    parts.push(NATION_LABEL[n]);
  }
  return parts.reduce((acc, part, i) => {
    if (i === 0) return part;
    // A trailing clause ("many other countries") reads as a clause, not an item.
    return /^[a-z]/.test(part) ? `${acc} and ${part}` : `${acc}, ${part}`;
  }, "");
}

export type Hotline = {
  id: string;
  /** The dialable number or contact instruction, exactly as a person would use it. */
  contact: string;
  /** The service or, for emergency numbers, the regions it covers. */
  label: string;
  /** N-260 — who this number actually serves, per the retrievals in records/research-pipeline.md. */
  coverage: Nation[];
  note?: string;
  availability?: string;
  sourceUrl: string;
  lastVerified: string;
  verificationStatus: VerificationStatus;
};

/** The rendered label for a record. Derived from `coverage`, never stored. */
export function hotlineRegions(h: Hotline): string {
  return regionsLabel(h.coverage);
}

export type HotlineGroup = {
  id: string;
  heading: string;
  intro?: string;
  hotlines: Hotline[];
  /** A plain closing note for the group (not a number). */
  closing?: string;
};

/**
 * VERIFIED 2026-09-04 (publish pass, owner sign-off): every number below was
 * checked against the official page named in its `sourceUrl`, and the five
 * source addresses recorded on 2026-08-26 that were dead or never stated the
 * number were replaced by the page that does. The record of the check is the
 * hotline sign-off table in the audit and DECISIONS.md §7.
 */
export const HOTLINE_LAST_VERIFIED = "2026-09-04";
const LAST_VERIFIED = HOTLINE_LAST_VERIFIED;
const STATUS: VerificationStatus = "verified";

export const HOTLINE_GROUPS: HotlineGroup[] = [
  {
    id: "emergency",
    heading: "Emergency",
    intro: "If someone is in immediate physical danger, call your local emergency number.",
    hotlines: [
      {
        id: "emergency-uk-ie",
        contact: "999",
        label: "Emergency services",
        coverage: ["England", "Scotland", "Wales", "Northern Ireland", "Ireland"],
        sourceUrl: "https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/",
        lastVerified: LAST_VERIFIED,
        verificationStatus: STATUS,
      },
      {
        id: "emergency-us-ca",
        contact: "911",
        label: "Emergency services",
        coverage: ["United States", "Canada"],
        sourceUrl: "https://www.911.gov/",
        lastVerified: LAST_VERIFIED,
        verificationStatus: STATUS,
      },
      {
        id: "emergency-eu",
        contact: "112",
        label: "Emergency services",
        coverage: ["European Union", "Many other countries"],
        sourceUrl: "https://europa.eu/youreurope/citizens/travel/security-and-emergencies/emergency/index_en.htm",
        lastVerified: LAST_VERIFIED,
        verificationStatus: STATUS,
      },
      {
        id: "emergency-au",
        contact: "000",
        label: "Emergency services",
        coverage: ["Australia"],
        sourceUrl: "https://www.infrastructure.gov.au/triple-zero",
        lastVerified: LAST_VERIFIED,
        verificationStatus: STATUS,
      },
    ],
  },
  {
    id: "ending-your-life",
    heading: "If you are thinking about ending your life",
    hotlines: [
      {
        id: "hotline-988",
        contact: "988",
        label: "988 Suicide & Crisis Lifeline — call or text",
        coverage: ["United States", "Canada"],
        // Reviewer note (batch 1): the label is the US service's name; in Canada the
        // same three digits reach the 9-8-8 Suicide Crisis Helpline
        // (records/research-pipeline.md, consolidation batch 1, retrieval 10).
        note: "In Canada the same number reaches the 9-8-8 Suicide Crisis Helpline.",
        availability: "24 hours",
        sourceUrl: "https://988lifeline.org/",
        lastVerified: LAST_VERIFIED,
        verificationStatus: STATUS,
      },
      {
        id: "hotline-samaritans",
        contact: "116 123",
        label: "Samaritans",
        coverage: ["England", "Scotland", "Wales", "Northern Ireland", "Ireland"],
        availability: "24 hours, free",
        sourceUrl: "https://www.samaritans.org/how-we-can-help/contact-samaritan/",
        lastVerified: LAST_VERIFIED,
        verificationStatus: STATUS,
      },
      {
        id: "hotline-lifeline-au",
        contact: "13 11 14",
        label: "Lifeline",
        coverage: ["Australia"],
        availability: "24 hours",
        sourceUrl: "https://www.lifeline.org.au/",
        lastVerified: LAST_VERIFIED,
        verificationStatus: STATUS,
      },
      {
        id: "hotline-eu-116123",
        contact: "116 123",
        label: "Emotional support line",
        coverage: ["Many European countries"],
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32009D0884",
        lastVerified: LAST_VERIFIED,
        verificationStatus: STATUS,
      },
      {
        id: "hotline-findahelpline-crisis",
        contact: "findahelpline.com",
        label: "Verified lines by country",
        coverage: ["Anywhere else"],
        sourceUrl: "https://findahelpline.com/",
        lastVerified: LAST_VERIFIED,
        verificationStatus: STATUS,
      },
    ],
    closing:
      "You do not have to be in immediate danger to call any of these. Not knowing whether you count is a normal reason to call.",
  },
  {
    id: "hurting-controlling",
    heading: "If someone is hurting or controlling you",
    hotlines: [
      /**
       * N-260 — THE ENGLAND-ONLY CORRECTION.
       *
       * 0808 2000 247 was labelled "United Kingdom". It is Refuge's line and
       * GOV.UK lists it under England; Scotland, Wales and Northern Ireland each
       * run their own, and Ireland is not in the United Kingdom at all. Each line
       * below covers exactly one nation, carries the page that states both the
       * number and the nation, and was re-checked on 2026-09-04. The retrievals
       * are in records/research-pipeline.md.
       */
      {
        id: "hotline-england-dv",
        contact: "0808 2000 247",
        label: "National Domestic Abuse Helpline",
        coverage: ["England"],
        availability: "24 hours, free",
        sourceUrl: "https://www.gov.uk/guidance/domestic-abuse-how-to-get-help",
        lastVerified: "2026-09-04",
        verificationStatus: STATUS,
      },
      {
        id: "hotline-scotland-dv",
        contact: "0800 027 1234",
        label: "Scotland's Domestic Abuse and Forced Marriage Helpline",
        coverage: ["Scotland"],
        availability: "24 hours",
        sourceUrl: "https://sdafmh.org.uk/",
        lastVerified: "2026-09-04",
        verificationStatus: STATUS,
      },
      {
        id: "hotline-wales-dv",
        contact: "0808 80 10 800",
        label: "Live Fear Free",
        coverage: ["Wales"],
        availability: "24 hours",
        sourceUrl: "https://www.gov.wales/live-fear-free/contact-live-fear-free",
        lastVerified: "2026-09-04",
        verificationStatus: STATUS,
      },
      {
        id: "hotline-ni-dv",
        contact: "0808 802 1414",
        label: "Domestic and Sexual Abuse Helpline",
        coverage: ["Northern Ireland"],
        availability: "24 hours",
        sourceUrl: "https://dsahelpline.org/",
        lastVerified: "2026-09-04",
        verificationStatus: STATUS,
      },
      {
        id: "hotline-ireland-dv",
        contact: "1800 341 900",
        label: "Women's Aid National Freephone Helpline",
        coverage: ["Ireland"],
        availability: "24 hours, free",
        sourceUrl: "https://www.womensaid.ie/",
        lastVerified: "2026-09-04",
        verificationStatus: STATUS,
      },
      {
        id: "hotline-us-dv",
        contact: "1-800-799-7233",
        label: "National Domestic Violence Hotline",
        coverage: ["United States"],
        availability: "24 hours",
        sourceUrl: "https://www.thehotline.org/",
        lastVerified: LAST_VERIFIED,
        verificationStatus: STATUS,
      },
      {
        id: "hotline-au-dv",
        contact: "1800 737 732",
        label: "1800RESPECT",
        coverage: ["Australia"],
        availability: "24 hours",
        sourceUrl: "https://www.1800respect.org.au/",
        lastVerified: LAST_VERIFIED,
        verificationStatus: STATUS,
      },
      {
        id: "hotline-findahelpline-abuse",
        contact: "findahelpline.com",
        label: "Directory, filtered for abuse",
        coverage: ["Anywhere else"],
        sourceUrl: "https://findahelpline.com/",
        lastVerified: LAST_VERIFIED,
        verificationStatus: STATUS,
      },
    ],
    closing:
      "These services do risk assessment, which is a real skill and not something a website can do. Talking to one commits you to nothing, including to talking to them again, and it does not require you to have decided anything.",
  },
  {
    id: "someone-has-died",
    heading: "If someone has died",
    hotlines: [
      {
        id: "bereavement-lines-above",
        contact: "The lines above",
        label: "Most of them will talk to you — they are not only for emergencies",
        coverage: ["Everywhere"],
        sourceUrl: "https://findahelpline.com/",
        lastVerified: LAST_VERIFIED,
        verificationStatus: STATUS,
      },
      {
        id: "bereavement-findahelpline",
        contact: "findahelpline.com",
        label: "Bereavement filter",
        coverage: ["Anywhere"],
        sourceUrl: "https://findahelpline.com/topics/grief-loss",
        lastVerified: LAST_VERIFIED,
        verificationStatus: STATUS,
      },
      {
        id: "bereavement-hospice",
        contact: "Local hospice or palliative service",
        label: "Most offer bereavement support to anyone, not only to families of their own patients",
        coverage: ["Most countries"],
        sourceUrl: "https://findahelpline.com/topics/grief-loss",
        lastVerified: LAST_VERIFIED,
        verificationStatus: STATUS,
      },
    ],
  },
];

/** All hotlines flattened — used by the launch-gate report and verification pass. */
export const ALL_HOTLINES: Hotline[] = HOTLINE_GROUPS.flatMap((g) => g.hotlines);
