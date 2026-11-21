# 5do12 website

The 5do12 public-preview website, introducing website, web-app, Android-app and Windows-software development, with My Financial App and Deep Vein as examples of the studio’s work and the existing voluntary support option. A buildless static site on GitHub Pages at **https://5do12.de/**.

## Design and content

The homepage uses a dark navy, electric-blue and cyan palette with sans-serif typography, four service cards and direct project-enquiry email links. It includes the live Google Play link, real MFApp screenshots with synthetic example records, a keyboard-accessible app preview, a Deep Vein game showcase with real Google Play screenshots and download link, the studio story, the original PayPal support link and matching QR, FAQs and existing legal/app resources. Screenshots come from the existing MFApp store-assets capture; no testimonials, download claims or product results are fabricated.

All existing public document URLs, `app-ads.txt`, `CNAME`, `.nojekyll` and crawler settings are preserved. Website legal documents remain incomplete drafts and the public-preview/noindex notices remain in place. A preview label does not substitute for completing applicable legal requirements.

## Files and preview

- `index.html`, `styles.css`, `site.js`: responsive homepage. JavaScript controls only navigation and app preview tabs. FAQs use native HTML details elements. Main content and links remain readable without JavaScript.
- `assets/`: MFApp assets plus the Deep Vein icon and two original WebP screenshots from its public Google Play listing. Example financial data is labelled as such.
- `assets/fonts/`: locally hosted Instrument Sans and Instrument Serif, with their SIL Open Font License files. Sources: the official [Google Fonts Instrument Sans directory](https://github.com/google/fonts/tree/main/ofl/instrumentsans) and [Instrument Serif directory](https://github.com/google/fonts/tree/main/ofl/instrumentserif).
- `paypal-qr.png`: unchanged QR pointing to `https://www.paypal.com/ncp/payment/D3EKHN6QDBNLG`.
- Existing app terms, privacy documents, Impressum and Datenschutz keep their established URLs.

Serve this directory with a static web server. No dependency installation, build step, backend, analytics, payment SDK or contact-form service is required. Fonts and images are local. The new script performs no network requests and uses no cookies or local storage. Payment remains entirely on PayPal after the visitor follows the external link.

The public Google Play listing was checked on 14 November 2026: `https://play.google.com/store/apps/details?id=com.myfinancialapp.mfapp`.

## Publication

GitHub Pages deploys `main` from the repository root. Keep the existing custom-domain and HTTPS settings. See `DEPLOYMENT.md` for the established setup. Use a GitHub no-reply author address for public commits. Never commit credentials, account exports, private app data or unrelated project files. Only the existing approved business contact appears in public documents and contact links.

The website's legal drafts still require completion before regular operation. No new legal identifiers or operator details have been invented. No license has been selected for the website or branding; bundled fonts retain their own licenses.

Deep Vein listing and privacy notice verified on 18 November 2026: https://play.google.com/store/apps/details?id=com.deepvein.miner and https://sites.google.com/view/deep-vein-5do12-privacy . The two copies of its terms now describe the current optional rewarded ads, cosmetic purchases and backup features. Store screenshots are copied unchanged; no additional tracking or third-party embeds were added.



## English and German — 21 November 2026

The language selector above the main navigation links to the English homepage (`index.html`) and the fully translated German homepage (`de.html`). It works without JavaScript. Update both pages together when changing homepage content, and keep their language, alternate links, accessibility labels and contact topics consistent.

Public contact links and the existing contact references in the hosted information pages use `republikaborovo@gmail.com`. No custom email mailbox was purchased. The homepage preview banner was removed at the owner's request; the existing legal-page draft labels and crawler settings remain as they were.

Gravitile promotion remains unpublished pending a confirmed download test. Its existing terms URL remains available.
