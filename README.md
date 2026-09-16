# Stage Timer

A single-page count-up speech timer. Black screen, then green, amber and red at
times you set, with a distinct sound at each and a repeating alarm at red until
you silence it. No accounts, no network calls, no data leaves the device.

## Files

- `index.html` — the whole app: markup, styles, logic, sounds
- `manifest.webmanifest` — name, icons, standalone display
- `sw.js` — service worker, caches the app so it runs with no signal
- `icons/` — 192, 512, 512 maskable, and the Apple touch icon

## Put it on GitHub Pages

1. Create a repo, e.g. `stage-timer`, and push these files at the root.

   ```
   git init
   git add .
   git commit -m "Stage timer"
   git branch -M main
   git remote add origin git@github.com:YOURNAME/stage-timer.git
   git push -u origin main
   ```

2. Repo, Settings, Pages. Source: Deploy from a branch. Branch: `main`, folder `/ (root)`. Save.
3. Wait a minute, then open `https://YOURNAME.github.io/stage-timer/`.

Paths are all relative, so the subdirectory URL works without changes. Pages
serves over HTTPS, which the screen wake lock requires.

## Install on the iPhone

Open the Pages URL in Safari, tap Share, then Add to Home Screen. It launches
full-screen with no address bar, and the service worker means it opens with the
phone in airplane mode too.

## Shipping a change

Edit `index.html`, then bump the version string in `sw.js`:

```js
var CACHE = "stage-timer-v2";
```

Without that bump, installed phones keep serving the cached old copy. After
pushing, open the app twice: the first launch fetches the new worker, the second
runs it.

## Known limits

- iOS mutes web audio when the ringer switch is off. Ringer on, volume up.
- Safari can release the wake lock on low battery or in Low Power Mode. Set
  Auto-Lock to Never for anything that matters, and keep the phone plugged in.
- Wake lock needs iOS 16.4 or later, and in home-screen apps specifically it was
  broken by an Apple bug until iOS 18.4.
- If the screen does sleep, the clock stays correct because it reads wall time,
  but cues may not fire until the screen wakes.
- The display font comes from Google Fonts and is cached after the first online
  load. Offline before that, it falls back to the system font. Everything else
  works regardless.
