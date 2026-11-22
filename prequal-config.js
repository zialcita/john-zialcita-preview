/* John Zialcita pre-qual config (preview only).
   OPEN QUESTIONS FOR JOHN: change the values in JZ_PREQUAL_CONFIG below.
   This is the single place for the credit cutoff, under-limit policy, jumbo
   threshold reference figures, and the Loan Factory widget contact setting.

   Loan-limit figures are 2026 FHFA values already published on
   /loan-limits-hawaii-california.html. They were checked October 30, 2026
   against the FHFA November 25, 2025 news release and the 2026 full county
   CSV. Do not invent figures. FHFA 2027 limits were not verified for this
   preview; recheck before any production use if FHFA has posted them.
*/
window.JZ_PREQUAL_CONFIG = {
  /* Band that counts as "under the jumbo cutoff" in this form.
     The form asks for bands, not a county, so we cannot apply a precise
     per-county jumbo test here. "Under $800K" is below the 2026 FHFA
     baseline one-unit limit of $832,750 in every county. The $800K to $1.25M
     band can be conforming or jumbo depending on the county (for example
     Honolulu, Kauai, Hawaii County, and many Bay Area counties sit at the
     $1,249,125 contiguous / Hawaii statutory baseline). */
  loanSizeDqBand: "under_800k",

  /* Default (a) in the spec: still qualified, tagged conforming, quote tool
     only, no booking button. Set to "disqualify" if John wants under-limit
     loans turned away (DQ reason loan_size). */
  underLimitPolicy: "conforming_quote_only",

  /* Credit answers at or below this band are disqualified (reason: credit).
     "Not sure" always continues. Jumbo minimums are often around 680-700;
     John should confirm this cutoff. */
  creditCutoffBand: "under_660",

  /* "1" asks for contact inside the Loan Factory widget as well (recommended
     because John works from the Loan Factory CRM). "0" skips that second
     form, which is what elitejumborates.com does. John picks. */
  widgetLeadInfoRequired: "1",

  /* Optional link on the out-of-state screen to loanfactory.com. Off until
     John says it is okay to point people to colleagues. */
  showOutOfStateLoanFactoryLink: false,
  outOfStateLoanFactoryUrl: "https://www.loanfactory.com/",

  bookingUrl: "https://calendar.app.google/2VznYYZbBozjzgraA",
  phone: "(415) 385-7409",
  phoneHref: "tel:+14153857409",
  smsHref: "sms:+14153857409",

  /* Preview must not email John or write to a live sheet. The endpoint is a
     stub. Flip previewStub to false only after a real backend is connected. */
  leadEndpoint: "/api/prequal-lead",
  previewStub: true,

  limitsYear: 2026,
  limitsSource: {
    label: "FHFA, Conforming Loan Limit Values for 2026 (November 25, 2025)",
    url: "https://www.fhfa.gov/news/news-release/fhfa-announces-conforming-loan-limit-values-for-2026",
    csv: "https://www.fhfa.gov/document/d/cll/fullcountyloanlimitlist2026_hera-based_final_flat.csv",
    hub: "https://www.fhfa.gov/data/conforming-loan-limit",
    checkedOn: "2026-10-30",
    sitePage: "/loan-limits-hawaii-california.html"
  },
  /* Verified 2026 one-unit conforming limits, in dollars. */
  baselineConforming1Unit: 832750,
  contiguousHighCostCeiling1Unit: 1249125,
  hawaiiStatutoryBaseline1Unit: 1249125,
  hawaiiStatutoryCeiling1Unit: 1873675,
  countyLimits1Unit: {
    "Hawaii County": 1249125,
    "Honolulu County": 1249125,
    "Kauai County": 1249125,
    "Maui County": 1299500,
    "Kalawao County": 1299500,
    "Alameda County": 1249125,
    "Los Angeles County": 1249125,
    "Orange County": 1249125,
    "Sacramento County": 832750,
    "San Diego County": 1104000,
    "San Francisco County": 1249125,
    "San Mateo County": 1249125,
    "Santa Clara County": 1249125
  }
};
