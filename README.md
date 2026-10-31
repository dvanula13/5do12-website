# 5do12 website

Independent apps, games and technology. A small, buildless static homepage with a voluntary PayPal support link and a matching, locally generated QR code.

**Release status: PUBLIC PREVIEW PREPARED.** The legal pages are explicit, incomplete drafts. The GitHub Pages preview is separate from the eventual official launch on 5do12.de. Complete and check the legal pages before the official launch. See DEPLOYMENT.md for the verified deployment state. `noindex` and `robots.txt` discourage indexing; they are not access controls.

## Files

- `index.html`, `styles.css`: responsive homepage, no JavaScript or external fonts.
- `paypal-qr.png`: QR for `https://www.paypal.com/ncp/payment/D3EKHN6QDBNLG`, error correction Q and four-module quiet zone.
- `impressum.html`, `datenschutz.html`: German legal drafts; no private operator data.
- `DEPLOYMENT.md`: GitHub Pages and IONOS domain connection instructions.

The button and QR link open the same supplied PayPal URL. Payment is handled on PayPal; nothing on this site collects payment details or promises charitable status. Confirm the recipient and terms on PayPal before launch. No test payment is necessary.

## Local preview

Serve this folder with any local static web server. There is no install step, build command, backend, database, analytics or payment SDK. All local links work both under `/5do12-website/` and at the root of the future custom domain.

## Privacy and publication

Do not add personal addresses, private email addresses, account exports, IONOS records, authentication tokens, payment receipts or unrelated project files. Public Git history also exposes author metadata: use a GitHub no-reply commit address. An appropriate public business/service address and contact details must be resolved for the legal pages before launch; never invent them.

No license has been selected. Do not assume that the branding or source has been licensed for reuse.
