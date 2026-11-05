# Publishing 5do12.de

Prepared 31 October 2026; hosting verification updated 5 November 2026. This is an official-domain launch plan; the public preview is now associated with **5do12.de**. **Legal pages remain incomplete drafts. Domain ownership and DNS are configured; HTTPS is active and enforced.** A root CNAME file is tracked; no custom deployment workflow is needed.

## Verified preview state

- Repository: public, separate from the app/game projects; default branch `main`.
- Pages: deploy from `main`, `/(root)`; custom domain `5do12.de`. The former GitHub Pages URL redirects to the custom domain. GitHub reports DNS check successful; HTTPS enforcement enabled on 5 November 2026.
- Initial deployment succeeded: [Pages run #1](https://github.com/dvanula13/5do12-website/actions/runs/41230723128), source commit `4ff76cf`.
- Live homepage, QR image and both legal draft pages opened successfully. Both PayPal links match the QR payload; the actual PayPal page opens with the intended support description.
- QR independently decoded at original size and at 240, 276 and 360 pixels. Desktop and 390-pixel phone layouts checked.
- The operator name, postal address and chosen public contact email are published in the two legal pages with explicit authorization. Other private contact details, unrelated files and credentials are excluded. Commit identity uses a GitHub no-reply email.
- GitHub account-level ownership verification for `5do12.de` succeeded; keep its DNS TXT record in place. The verification value is not copied into source files.
- IONOS parking-page A/AAAA records were replaced with all four GitHub A records at `@` (TTL 300). `www` is a CNAME to `dvanula13.github.io` (TTL 300). There is no apex AAAA record; the obsolete parking IPv6 address is removed.
- IONOS mail MX, SPF, DKIM, DMARC, autodiscover, Domain Connect and nameservers were preserved. Before/after DNS records were saved locally outside this public repository.
- Cloudflare and Google public DNS return all intended A records and the www CNAME. HTTPS responses for the homepage, `app-ads.txt` and `robots.txt` verified as 200 with certificate validation enabled on 5 November 2026.
- The automatic CNAME commit was replaced on the main branch with identical files and a no-reply author identity.
- Legal pages are still incomplete; indexing is discouraged. The preview label is not a legal exemption.

## AdMob verification setup — 5 November 2026

- `https://5do12.de/app-ads.txt` serves `google.com, pub-5540236690935067, DIRECT, f08c47fec0942fa0`.
- `robots.txt` allows `/app-ads.txt` while retaining the existing indexing restriction for the rest of the preview site.
- The My Financial App Google Play store contact website was published as `https://5do12.de/`.
- The existing AdMob app and ad unit IDs are retained. Request verification in AdMob after Google detects the updated store contact website; store metadata and crawler updates can take time to propagate.

## 1. Complete the legal information for regular operation

1. Assess the actual German operator and activity, then complete the Impressum with the actual operator, appropriate address, public email/contact method and other applicable details. A brand name alone is insufficient. Keep private information out until explicitly approved for publication. If a private home address must not be public, resolve a legally suitable alternative before launch.
2. Complete the privacy notice for the actual operator, GitHub Pages hosting and PayPal support processing. Check the applicable legal basis, recipients, retention, transfers and contact details.
3. Open the supplied PayPal link and check that the recipient, currency, amount options and terms are intended. The QR must decode to exactly the same URL. No transaction is required.
4. Check hosting suitability: GitHub Pages is not permitted for a site primarily facilitating commercial transactions, e-commerce or commercial SaaS. This source is for an independent project introduction and voluntary support; reassess the final purpose before launch, especially before adding sales or paid services. Use another host if necessary.
5. Remove the draft banner and draft footer labels only after the legal pages are complete. Remove `noindex, nofollow` from all pages and change `robots.txt` to allow indexing when ready. These are indexing hints, not privacy protection.

## 2. Prepare GitHub Pages and verify domain ownership

Repository: `dvanula13/5do12-website`. Do not use an app/game repository.

1. In GitHub **account settings → Pages → Add a domain**, enter `5do12.de`.
2. GitHub supplies a unique TXT value for `_github-pages-challenge-dvanula13.5do12.de`. In IONOS, go to **Domains & SSL → 5do12.de → DNS → Add record → TXT** and enter the hostname/value GitHub actually gives. Do not invent or commit a verification value.
3. Wait for propagation, then verify in GitHub. Keep the TXT record after verification.
4. For the public preview, use **repository settings → Pages → Build and deployment → Deploy from a branch**, choose `main` and `/(root)`, and save. This step publishes a preview at `https://dvanula13.github.io/5do12-website/`.
5. After domain ownership verification, add `5do12.de` in the repository's Pages **Custom domain** field and save **before pointing the domain's traffic to GitHub**. A branch deployment creates a root `CNAME` file; pull that change locally before editing again.

## 3. Connect IONOS DNS

First record the current DNS values and confirm domain verification. Preserve mail-related MX, SPF, DKIM and DMARC records, and keep the existing nameservers. Replace only conflicting website records after checking them; do not reset the DNS zone. Do not create wildcard records.

| Type | Host in IONOS | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `dvanula13.github.io` |

The CNAME target is the account hostname, without `https://` and without the repository path. Optional IPv6 uses all four GitHub AAAA addresses: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`. Inspect any existing AAAA records so they do not send IPv6 users to the old host. Keep or configure IONOS records based on the actual zone, not guesses.

## 4. Verify launch

- Wait for GitHub's DNS check and certificate issuance; propagation may take up to 24 hours. Enable **Enforce HTTPS** when available.
- Check `https://5do12.de` and `https://www.5do12.de` and the expected redirect, certificate, mobile layout, keyboard navigation and legal links.
- Scan the displayed QR with a phone and confirm the exact PayPal URL. Confirm the support button matches. Do not submit a payment as a test.
- Confirm only intended public business information appears, including repository history and commit metadata. Check for browser errors, broken assets and unintended third-party requests.
- Update this document with the actual launch state. If moving hosts later, remove obsolete traffic DNS records in coordination with the old custom-domain association, so the domain is not left pointing to an unclaimed site.

## Official references

- [GitHub: managing a custom domain and DNS records](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub: verify your custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [GitHub Pages usage limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [IONOS DNS settings](https://www.ionos.de/hilfe/domains/dns-einstellungen/)
- [German provider information requirements, § 5 DDG](https://www.gesetze-im-internet.de/ddg/__5.html)
- [GitHub privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)

Recheck provider instructions when changing the configuration. Working from home does not automatically require renting an office. An alternative public address must be suitable for the actual legal requirements; a mailbox or generic mail-forwarding service is not automatically sufficient.

Address guidance: [IHK Munich](https://www.ihk-muenchen.de/ratgeber/recht/internetrecht/impressum/).
