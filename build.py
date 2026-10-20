import os
PHONE="(415) 385-7409"; TEL="tel:+14153857409"; SMS="sms:+14153857409"
BOOK="#book-placeholder"
SDK='<script async src="https://www.loanfactory.com/sdk.js?owner=jzialcita@yourmortgageteam.net"></script>'
INIT="""<script>(function(){function go(){if(window.LoanFactory){window.LoanFactory.init();return true}return false}
if(!go()){var e=setInterval(function(){if(go())clearInterval(e)},300)}})();</script>"""
WIDGET='<div class="widget-wrap"><div data-ui-widget="quote_small" data-lead-info-required="1"></div><p class="fine">Rates shown are provided by Loan Factory\'s pricing engine, change daily, and are not a commitment to lend. Not all applicants qualify. APR and terms depend on credit, property and loan details; you will receive a Loan Estimate.</p></div>'
NAV=[("index.html","Home"),("jumbo-refinance.html","Jumbo Refi"),("jumbo-refinance-hawaii.html","Hawaii"),("jumbo-refinance-california.html","California"),("rates.html","Rates"),("about.html","About"),("reviews.html","Reviews"),("contact.html","Contact")]
def V(x): return f'<mark class="verify">[VERIFY: {x}]</mark>'
FOOT=f"""<footer><div class="wrap">
<img src="img/ehl.png" alt="Equal Housing Lender" class="ehl">
<p><strong>John Zialcita</strong>, Mortgage Loan Originator · NMLS #337891 · CA DRE Broker License #01727126 · Hawaii MLO License {V('HI-337891, confirm on NMLS Consumer Access')}</p>
<p><strong>Loan Factory, Inc.</strong> · Company NMLS #320841 · CA DRE Corporation License #01771313 · 2195 Tully Road, San Jose, CA 95122 · (660) 333-3333</p>
<p>California: Licensed by the Department of Real Estate (DRE) Loan Factory also holds California DFPI Financing Law License #60DBO-110501 (per Loan Factory) {V('current site cites CRMLA; DFPI license is listed as Financing Law. Confirm correct statement with compliance')}. Hawaii: Loan Factory, Inc. Mortgage Loan Originator Company License #HI-320841 (per loanfactory.com/state-licenses) {V('confirm on NMLS Consumer Access')}.</p>
<p><a href="https://www.nmlsconsumeraccess.org/" rel="nofollow">NMLS Consumer Access</a> · <a href="licensing.html">Licensing</a> · <a href="#privacy">Privacy Policy {V('page to be written')}</a> · <a href="#sms">SMS Terms {V('page to be written')}</a></p>
<p class="fine">Equal Housing Opportunity. This is not a commitment to lend. Programs, rates, terms and conditions are subject to change without notice and subject to credit and property approval. Loan Factory, Inc. is a mortgage broker, not a direct lender. {V('Loan Factory compliance to approve all copy before launch')}</p>
<p class="fine">Draft preview, not live. Not for public distribution.</p></div></footer>
<div class="stickybar"><a href="{TEL}" data-ev="click_to_call">📞 Call</a><a href="{SMS}" data-ev="click_to_text">💬 Text</a><a href="book.html" data-ev="cta_click">📅 Book</a></div>"""
CSS="""*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2937;line-height:1.6;padding-bottom:64px}
.wrap{max-width:1080px;margin:0 auto;padding:0 18px}a{color:#0b4f8a}
header{position:sticky;top:0;background:#fff;border-bottom:1px solid #e5e7eb;z-index:10}
.hd{display:flex;align-items:center;justify-content:space-between;padding:10px 18px;max-width:1080px;margin:0 auto}
.brand{font-weight:800;text-decoration:none;color:#0b2540}.brand small{display:block;font-weight:400;font-size:12px;color:#6b7280}
nav{display:none}nav a{margin-left:14px;text-decoration:none;font-size:14px;color:#374151}
.btn{display:inline-block;background:#c8a44d;color:#0b2540;font-weight:700;padding:12px 20px;border-radius:8px;text-decoration:none;margin:4px 6px 4px 0}
.btn.alt{background:#0b2540;color:#fff}.hcall{display:none}
.hero{background:linear-gradient(135deg,#0b2540,#134e7a);color:#fff;padding:40px 0}
.hero h1{font-size:30px;line-height:1.2;margin:0 0 12px}.hero p{color:#dbe7f3}.lic{font-size:13px;color:#b9cde0;margin-top:10px}
section{padding:36px 0}section.alt{background:#f7f8fa}h2{font-size:24px;color:#0b2540}
.grid{display:grid;gap:16px}.card{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:18px}
.widget-wrap{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px;min-height:200px}
.fine{font-size:12px;color:#6b7280}.verify{background:#fff3b0;color:#7a4b00;padding:0 3px;font-size:.85em}
.ph{border:2px dashed #c8a44d;background:#fffbea;padding:16px;border-radius:10px}
.about img{width:100%;max-width:360px;border-radius:12px}
footer{background:#0b2540;color:#cfd8e3;font-size:13px;padding:28px 0}footer a{color:#fff}.ehl{width:60px;background:#fff;padding:4px;border-radius:4px}
.stickybar{position:fixed;bottom:0;left:0;right:0;display:flex;background:#0b2540;z-index:20}
.stickybar a{flex:1;text-align:center;color:#fff;text-decoration:none;font-weight:700;padding:14px 0;border-right:1px solid #1e3a5f}
details{background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin:8px 0}summary{font-weight:600;cursor:pointer}
@media(min-width:860px){nav{display:block}.hcall{display:inline-block}.grid.c2{grid-template-columns:1fr 1fr}.grid.c3{grid-template-columns:repeat(3,1fr)}.hero h1{font-size:42px}.stickybar{display:none}body{padding-bottom:0}}"""
def page(fn,title,desc,body,widget=False,schema=""):
    nav="".join(f'<a href="{h}">{t}</a>' for h,t in NAV)
    html=f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>{title}</title><meta name="description" content="{desc}">
<link rel="stylesheet" href="style.css">{SDK if widget else ''}
<!-- GTM container goes here at build in GHL: GTM-XXXXXXX [VERIFY] -->{schema}</head><body>
<header><div class="hd"><a class="brand" href="index.html">John Zialcita<small>Mortgage Broker · NMLS #337891 · Loan Factory</small></a>
<nav>{nav}</nav><a class="btn hcall" href="{TEL}" data-ev="click_to_call">Call {PHONE}</a></div></header>
{body}{FOOT}{INIT if widget else ''}</body></html>"""
    open(fn,"w").write(html)
open("style.css","w").write(CSS)
CTA=f'<a class="btn" href="rates.html" data-ev="cta_click">Check My Jumbo Rate</a><a class="btn alt" href="book.html" data-ev="cta_click">Book a Call</a>'
LICLINE='<p class="lic">NMLS #337891 · CA DRE #01727126 · Loan Factory, Inc. NMLS #320841</p>'
FAQ_HOME=[("Will checking my rate affect my credit?","Checking a rate scenario on this page does not pull your credit. A credit check happens only if you choose to apply. [VERIFY with Loan Factory how the widget handles credit]"),
("What makes a broker different from a big online lender?","Retail banks are limited to their own product suite and pricing. Brokers compare multiple wholesale lenders simultaneously, matching your profile to the lender with the best combination of rate, fees, and underwriting flexibility."),
("How long does a jumbo refinance take?","Many refinances close in 21–30 days. Complex scenarios involving multiple properties, self-employment income, or asset depletion may take 30–45 days."),
("Should I refinance?","Refinancing isn't always the right move—it depends on your goals, timeline, and current loan structure. We analyze your break-even point, closing costs, and long-term savings to ensure refinancing delivers real value. If it doesn't make sense, we'll tell you.")]
def faq(items): return "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q,a in items)
page("index.html","Jumbo Refinance & Cash-Out in Hawaii and California | John Zialcita, NMLS #337891","Jumbo refinance and cash-out refinance in Hawaii and California with mortgage broker John Zialcita (Loan Factory, NMLS #337891).",
f"""<div class="hero"><div class="wrap"><h1>Jumbo Refinance &amp; Cash-Out in Hawaii and California</h1>
<p>John Zialcita specializes in complex mortgage scenarios across California and Hawaii, focusing on refinance strategy, $1M–$3M home loans, VA lending, and property types that require precise underwriting.</p>{CTA}{LICLINE}</div></div>
<section id="quote"><div class="wrap"><h2>Check Live Rates for CA &amp; HI</h2><p>See what you qualify for in seconds.</p>{WIDGET}</div></section>
<section class="alt"><div class="wrap"><h2>Choose your state</h2><div class="grid c2">
<div class="card"><h3>Hawaii Jumbo Refinance</h3><p>Refinance expertise for Oahu and neighbor islands including VA IRRRL, cash-out refinance, condotel and non-warrantable condo scenarios.</p><a class="btn" href="jumbo-refinance-hawaii.html">Hawaii options</a></div>
<div class="card"><h3>California Jumbo Refinance</h3><p>Strategic refinance structuring for $1M–$3M homes, Bay Area jumbo loans, RSU/bonus income scenarios, and high-equity property optimization.</p><a class="btn" href="jumbo-refinance-california.html">California options</a></div></div></div></section>
<section><div class="wrap"><h2>How it works</h2><div class="grid c3"><div class="card"><h3>1. Check your rate</h3><p>Enter your scenario in the rate tool above.</p></div><div class="card"><h3>2. Talk with John</h3><p>A short call to review your goals, income and property.</p></div><div class="card"><h3>3. Get your Loan Estimate</h3><p>All fees clearly disclosed upfront in your Loan Estimate.</p></div></div></div></section>
<section class="alt"><div class="wrap"><h2>What clients say</h2><p>John holds a 5.0 rating across 52 reviews on Yelp {V('re-check count on Yelp before launch; figures from Oct 12 audit')}.</p><div class="ph">Verified review excerpts go here, quoted verbatim from Yelp / Zillow / Experience.com with source links. {V('pending John approval')}</div><p><a href="reviews.html">See all review sources</a></p></div></section>
<section><div class="wrap about grid c2"><img src="img/john.jpg" alt="John Zialcita, mortgage broker" loading="lazy" width="360"><div><h2>About John</h2><p>John Zialcita is a mortgage broker with Loan Factory, Inc., serving homeowners in Hawaii and California. As a mortgage broker, he accesses wholesale lender pricing, which allows for more competitive pricing and flexibility in lender selection based on your specific scenario.</p><a class="btn alt" href="about.html">More about John</a></div></div></section>
<section class="alt"><div class="wrap"><h2>Frequently asked questions</h2>{faq(FAQ_HOME)}</div></section>
<section><div class="wrap"><h2>Ready to see your options?</h2>{CTA}<a class="btn alt" href="{TEL}" data-ev="click_to_call">Call {PHONE}</a></div></section>""",widget=True,
schema='<script type="application/ld+json">{"@context":"https://schema.org","@type":"MortgageBroker","name":"John Zialcita – Loan Factory","url":"https://johnzialcita.com/","telephone":"+1-415-385-7409","areaServed":["Hawaii","California"],"employee":{"@type":"Person","name":"John Zialcita","jobTitle":"Mortgage Loan Originator","identifier":"NMLS 337891"},"parentOrganization":{"@type":"Organization","name":"Loan Factory, Inc.","identifier":"NMLS 320841"}}</script>')
page("jumbo-refinance.html","Jumbo Cash-Out & Rate-and-Term Refinance | Hawaii & California","Jumbo refinance options in Hawaii and California.",
f"""<div class="hero"><div class="wrap"><h1>Jumbo Refinance &amp; Cash-Out</h1><p>A jumbo loan is a mortgage above the conforming loan limit set each year by the FHFA for your county. Limits vary by county, so check the <a style="color:#fff" href="https://www.fhfa.gov/data/conforming-loan-limit">FHFA conforming loan limit table</a> for your area.</p>{CTA}{LICLINE}</div></div>
<section><div class="wrap grid c2"><div class="card"><h3>Hawaii</h3><p>Hawaii's unique property types, land tenure structures, and geographic factors create refinancing complexity that mainland lenders often mishandle.</p><a class="btn" href="jumbo-refinance-hawaii.html">Hawaii jumbo refi</a></div>
<div class="card"><h3>California</h3><p>California jumbo refinances require strategic planning, proper documentation, and lender expertise.</p><a class="btn" href="jumbo-refinance-california.html">California jumbo refi</a></div></div></section>
<section class="alt"><div class="wrap"><h2>Common goals</h2><ul><li>Lower your rate or change your term (rate-and-term)</li><li>Take cash out of your equity (cash-out)</li><li>Restructure for RSU, bonus or self-employed income</li><li>VA IRRRL or VA cash-out for eligible borrowers</li></ul><p>Jumbo loan thresholds and reserve requirements vary by value tier.</p></div></section>""")
def state(fn,st,h1,intro,who,notes,faqs):
    page(fn,f"{st} Jumbo Refinance & Cash-Out | John Zialcita, NMLS #337891",f"{st} jumbo refinance and cash-out refinance with John Zialcita, Loan Factory.",
f"""<div class="hero"><div class="wrap"><h1>{h1}</h1><p>{intro}</p>{CTA}{LICLINE}</div></div>
<section><div class="wrap"><h2>Check {st} jumbo rates</h2><p>Real-time rate comparisons updated daily. Enter your scenario to see current wholesale pricing for {st} refinance loans.</p>{WIDGET}</div></section>
<section class="alt"><div class="wrap"><h2>Who we help</h2><ul>{''.join('<li>'+w+'</li>' for w in who)}</ul></div></section>
<section><div class="wrap"><h2>What we look at</h2><p>{notes}</p><p>The conforming loan limit for your county is published each year by the FHFA: <a href="https://www.fhfa.gov/data/conforming-loan-limit">FHFA conforming loan limits</a>. {V('add current-year county figures quoted from FHFA')}</p>
<h3>Typical documents</h3><p>Recent pay stubs and W-2s or tax returns, bank and asset statements, photo ID, proof of any other income, and information about your debts. For self-employed borrowers or those with RSU income, additional documentation may be required.</p>
<h3>Timeline</h3><p>Many refinances close in 21–30 days; complex scenarios may take 30–45 days.</p></div></section>
<section class="alt"><div class="wrap"><h2>{st} jumbo refi FAQ</h2>{faq(faqs)}</div></section>
<section><div class="wrap"><h2>Talk it through with John</h2>{CTA}<a class="btn alt" href="{TEL}">Call {PHONE}</a></div></section>""",widget=True)
state("jumbo-refinance-hawaii.html","Hawaii","Hawaii Jumbo Refinance &amp; Cash-Out","Refinance expertise for Oahu and neighbor islands including VA IRRRL, cash-out refinance, condotel and non-warrantable condo scenarios.",
["Rate-and-term refinance on higher-value homes","Cash-out refinance","VA IRRRL and VA cash-out for active duty, veterans and eligible family members","Condotel and non-warrantable condo owners","Leasehold and other Hawaii land-tenure situations"],
"Hawaii's unique property types, land tenure structures, and geographic factors create refinancing complexity that mainland lenders often mishandle. We shop wholesale lenders with Hawaii experience and appetite for your specific property.",
[("Do you work on neighbor islands?","Yes. John serves Oahu and the neighbor islands."),("Can I refinance a condotel or non-warrantable condo?","Often, through portfolio lenders. Eligibility depends on the project and lender; we review your specific property."),FAQ_HOME[3]])
state("jumbo-refinance-california.html","California","California Jumbo Refinance &amp; Cash-Out","The Bay Area real estate market demands specialized refinance expertise. From tech compensation structures to property tax implications, understanding local nuances is critical for optimal refinance outcomes.",
["Bay Area homeowners with $1M–$3M homes","RSU and bonus income borrowers","Self-employed borrowers","High-equity owners considering cash-out"],
"California jumbo refinances require strategic planning, proper documentation, and lender expertise. Don't waste time with retail banks that don't understand complex income scenarios.",
[("Can RSU income count?","Often yes, if properly documented and you have a track record of receiving similar income. We'll review your vesting history."),FAQ_HOME[2],FAQ_HOME[3]])
page("rates.html","Today's Mortgage Rates for CA & HI | John Zialcita","Live wholesale rate quotes for California and Hawaii.",
f"""<div class="hero"><div class="wrap"><h1>Today's Rates for California &amp; Hawaii</h1><p>Real-time mortgage rates updated daily for California and Hawaii.</p>{LICLINE}</div></div><section><div class="wrap">{WIDGET}</div></section>""",widget=True)
page("about.html","About John Zialcita | Mortgage Broker, NMLS #337891","About John Zialcita, mortgage broker with Loan Factory.",
f"""<section><div class="wrap about grid c2"><img src="img/john.jpg" alt="John Zialcita" width="360"><div><h1>About John Zialcita</h1>
<p>John Zialcita is a mortgage broker with Loan Factory, Inc., serving Hawaii and California. He focuses on refinance strategy, $1M–$3M home loans, VA lending, RSU/bonus income and self-employed borrowers, and property types that require precise underwriting.</p>
<p>Specialties: No-Cost Refinance loans, Jumbo loans, Self-Employed Borrowers, First-Time Homebuyers.</p>
<p>California DRE broker license issued 12/28/2005 (CA DRE public record). {V('years-in-business and funded-volume claims removed until John provides documentation')}</p>
<p><img src="img/loan-factory.png" alt="Loan Factory" style="max-width:220px;border-radius:0"></p>{CTA}</div></div></section>""")
page("reviews.html","Reviews | John Zialcita","Verified review sources for John Zialcita.",
f"""<section><div class="wrap"><h1>Client Reviews</h1><p>Read John's reviews directly on these independent sites (figures checked Oct 12, 2026 {V('re-check before launch')}):</p>
<div class="grid c3"><div class="card"><h3>Yelp</h3><p>5.0 · 52 reviews</p>{V('add Yelp profile URL')}</div>
<div class="card"><h3>Zillow</h3><p>5.0 · 3 reviews</p><a href="https://www.zillow.com/lender-profile/JohnZialcita/">Zillow profile</a> <span class="fine">(profile still lists his former employer; update pending)</span></div>
<div class="card"><h3>Experience.com</h3><p>5.0 · 3 reviews</p>{V('add profile URL')}</div></div>
<div class="ph" style="margin-top:18px">Placeholder: verbatim review excerpts with reviewer first name/initial, source and date. Only reviews copied from the sources above. {V('select with John')}</div>
<p class="fine">Testimonials on the current site are not shown here because they could not be matched to a public source.</p></div></section>""")
page("book.html","Book a Call with John Zialcita","Schedule a jumbo refinance review.",
f"""<section><div class="wrap"><h1>Book a Jumbo Refi Review</h1><p>Pick a time for a short call with John.</p>
<div class="ph" id="book-placeholder" style="min-height:320px">GHL booking calendar embed goes here ("Jumbo Refi Review", 15/30 min). {V('John\'s booking calendar to be created in GHL')}</div>
<p>Prefer to talk now? <a href="{TEL}">Call {PHONE}</a> or <a href="{SMS}">text John</a>.</p></div></section>""")
page("contact.html","Contact John Zialcita | NMLS #337891","Contact John Zialcita, Loan Factory.",
f"""<section><div class="wrap"><h1>Contact John</h1><div class="grid c2"><div class="card"><p><strong>Phone / text:</strong> <a href="{TEL}">{PHONE}</a></p>
<p><strong>Email:</strong> <a href="mailto:john.zialcita@loanfactory.com">john.zialcita@loanfactory.com</a> {V('confirm the one public email')}</p>
<p><strong>Office:</strong> Loan Factory, Inc., 2195 Tully Road, San Jose, CA 95122 · (660) 333-3333</p><p>Serving Hawaii and California.</p></div>
<div class="ph">GHL "Jumbo Qualifier" form goes here: state, property value range, loan balance range, goal, credit range, name/phone/email, plus an unchecked TCPA/SMS consent box (msg &amp; data rates may apply; reply STOP to opt out, HELP for help; link to Privacy Policy). {V('GHL form pending sub-account access')}</div></div></div></section>""")
page("licensing.html","Licensing & Disclosures | John Zialcita, NMLS #337891","Licensing information for John Zialcita and Loan Factory, Inc.",
f"""<section><div class="wrap"><h1>Licensing &amp; Disclosures</h1>
<h2>John Zialcita</h2><ul><li>NMLS ID: 337891. Verify at <a href="https://www.nmlsconsumeraccess.org/">NMLS Consumer Access</a>.</li>
<li>California: Department of Real Estate Broker License #01727126, licensed, expires 12/25/2027, MLO endorsement NMLS 337891 (<a href="https://www2.dre.ca.gov/PublicASP/pplinfo.asp?License_id=01727126">DRE record</a>, checked Oct 20, 2026).</li>
<li>Hawaii: Mortgage Loan Originator License {V('HI-337891 and status, confirm on NMLS Consumer Access')}</li>
<li>Other states: {V('any other state licenses, per NMLS Consumer Access')}</li></ul>
<h2>Loan Factory, Inc.</h2><ul><li>Company NMLS ID: 320841</li>
<li>California DRE Corporation License #01771313, licensed, expires 03/08/2027, MLO endorsement 320841 (<a href="https://www2.dre.ca.gov/PublicASP/pplinfo.asp?License_id=01771313">DRE record</a>, checked Oct 20, 2026).</li>
<li>Hawaii: Mortgage Loan Originator Company License #HI-320841, per Loan Factory's state-licenses page (checked Oct 20, 2026) {V('confirm on NMLS Consumer Access')}</li><li>California DFPI Financing Law License #60DBO-110501 (per Loan Factory)</li>
<li>Full state list: <a href="https://www.loanfactory.com/state-licenses">loanfactory.com/state-licenses</a></li></ul>
<p>Equal Housing Opportunity. Loan Factory, Inc. is a mortgage broker, not a direct lender.</p></div></section>""")
