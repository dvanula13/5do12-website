# 5do12 visit counter

The English and German homepages have a collapsed owner panel in the footer. It shows the lifetime total, the current UTC day's total and 30-day summaries by country and device type. The counter covers both homepages, the service catalog, both contact forms and the Online Games directory. Every fresh load of a covered page contributes one opening. Each individual game and app policy is outside this count.

Cloudflare receives the request and supplies an approximate country from its network metadata. The Worker classifies the browser's standard user-agent as phone, tablet, computer or other. The SQLite object stores a lifetime total and separate daily country and device totals for up to 90 UTC calendar days. It does not retain individual requests, IP addresses, browser strings, page paths, referrers, identifiers or the owner key. The client omits cookies and does not write to browser storage. Browser blocking, bots and repeat loads affect the counts. Requests with Global Privacy Control or Do Not Track set are skipped when those headers reach the Worker.

The printed Comic Con QR uses `https://5do12.de/qr/comic-con/`. That page forwards to the Worker's `/qr/comic-con` route, which records eligible link opens in a separate lifetime total and redirects to the homepage. The private footer panel reads the total using the same owner key. The printed URL stays valid when the Worker destination changes.

## Deploy

1. Sign in to the intended Cloudflare account and confirm the account's processing and transfer terms for the Worker. Cloudflare is added as a processor for measurement and the website privacy notice must describe the configured service before the client is connected.
2. In this directory, run `npx wrangler deploy`, then `npx wrangler secret put VISIT_OWNER_KEY`. Store a random URL-safe key of at least 32 characters in the account owner's password manager. Keep it out of Git and website files.
3. From this directory, run `node configure-site.mjs https://5do12-visit-counter.<account>.workers.dev`. This sets the client endpoint and the applicable Content Security Policy for covered pages. Update the privacy notice in the same website deployment. Verify the live site records a test opening and that the footer shows results only with the key.

The checked-in client starts with a blank endpoint. In that state it sends no requests and its panel remains hidden. Run `node configure-site.mjs` without a URL to return the client to that state.

## Check locally

Run `node --test counter.test.mjs` to check access control, the device buckets, atomic totals and retention. To check the Worker bundle without deploying, run `npx wrangler deploy --dry-run`.
