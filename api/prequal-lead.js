/* Preview stub for pre-qual and Rate Alert submissions.
   Does not email anyone, does not write to the lead tracker, and does not
   log names, emails, or phone numbers. Connect a real backend before
   production (see comments at the bottom). */
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ ok: false, error: "method_not_allowed" }); return; }

  var body = req.body || {};
  /* Honeypot: pretend success, still do not store. */
  if (body.company || body.website) {
    res.status(200).json({ ok: true, stub: true });
    return;
  }

  res.status(200).json({
    ok: true,
    stub: true,
    message: "Preview stub. Not saved to a live inbox or sheet."
  });
};

/*
  Production wiring (not enabled on this preview):
  1. A Vercel function or Google Apps Script web app that:
     - Validates required fields and the honeypot
     - Appends a row to the lead tracker Sheet
       (https://docs.google.com/spreadsheets/d/1wc6BZSJgXTT1YlgOqb70B4Rno9G5bOGe3HK-kOMsbWU/edit)
       with answers, UTMs, fbclid/gclid, and a source of Site quote or Rate Alert
     - Emails or texts John a summary
     - Never stores SSN, income, or a credit report
  2. Set previewStub to false in prequal-config.js only after that endpoint is live.
  3. Keep server-side validation and the 30-day UTM cookie/storage already in prequal.js.
*/
