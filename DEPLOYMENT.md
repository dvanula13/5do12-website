# Publishing 5do12.de

Prepared 31 October 2026. This is an official-domain launch plan; a public GitHub Pages preview is being prepared separately. **Legal pages remain incomplete drafts and 5do12.de is not connected.** No custom-domain CNAME file or automatic deployment workflow is included yet.

## 1. Finish the launch requirements

1. Complete the Impressum with the actual operator, appropriate service/business address, public email/contact method and other applicable details. A brand name alone is insufficient. Keep private information out until explicitly approved for publication. If a private home address must not be public, resolve a legally suitable alternative before launch.
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
5. Only after legal and official launch checks pass, add `5do12.de` in the repository's Pages **Custom domain** field and save **before pointing the domain's traffic to GitHub**. A branch deployment creates a root `CNAME` file; pull that change locally before editing again.

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

Recheck provider instructions when performing the eventual launch.
