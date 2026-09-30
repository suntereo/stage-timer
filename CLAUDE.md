# Stage Timer

Single-file PWA: all markup, styles, logic and sounds live in `index.html`. `sw.js` caches it for offline use.

## Deploying

Pushing to `main` deploys automatically: `.github/workflows/deploy.yml` publishes to Cloudflare Pages
(project `stage-timer`, https://stage-timer-9ml.pages.dev/) and stamps the `sw.js` cache version with the
commit, so no manual cache bump is needed. When asked to "deploy" or "publish", commit and push to `main`,
then check the "Deploy to Cloudflare Pages" workflow run on GitHub.

Cloud sessions cannot run wrangler themselves (no Cloudflare credentials, network blocks Cloudflare);
deploy through the workflow.

## Testing

No build or test suite. Check changes in headless Chromium with Playwright
(`executablePath: '/opt/pw-browsers/chromium'`), stubbing `Date.now` to fast-forward the timer.
