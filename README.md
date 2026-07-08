# Sabeeha Abdul Nasir &amp; Muhammed Shibin — Nikah Invitation

A two-screen static wedding website. The entry is a wax-sealed **emerald &
gold envelope** that opens on tap; behind it is a cream-paper, olive-botanical
invitation with a background nasheed and quick actions (open in maps, add to
calendar, mute / unmute).

## Files

- `index.html` — markup, inline SVG florals/icons, both screens
- `styles.css` — full styling (envelope, cards, floating buttons, responsive)
- `script.js` — envelope open sequence, audio playback, mute toggle, `.ics` download
- `wedding_nasheed.mp3` — background music (looped, starts on Open Invitation)

## Screens

1. **Envelope** — "You're invited" · a sealed emerald envelope with a gold
   crescent wax seal. Tapping the seal lifts the flap, the letter rises out,
   and it cross-fades into the invitation while the nasheed begins.
2. **Invitation** — Full details with floral decorations and:
   - **Open in Maps** → Google Maps search for *Green Land Palace Convention
     Centre, Athanipadi, Purathur, Malappuram, Kerala 676102*
   - **Add to calendar** → downloads an `.ics` for Thu 27 Aug 2026, 11 AM – 2 PM IST
   - **Mute / Unmute** floating button (top-right) controls the background nasheed

## Details

- **Bride** — Sabeeha Abdul Nasir, D/O Abdul Nasir Kunhi Moossa Cheracham &
  Rahimabi P.V — Puthan Purayil House, Perumthiruthi, Chennara, Mangalam, Tirur
- **Groom** — Muhammed Shibin, S/O late Mohammed Iqbal C.H & Salma P
- **Date** — Thursday, 27 August 2026 · 14 Rabi' al-Awwal 1448 AH · 11 AM – 2 PM
- **Venue** — Green Land Palace Convention Centre, Athanipadi, Purathur,
  Malappuram District, Kerala 676102

## Run it

Serve locally so the audio file loads correctly (browsers block audio over `file://`):

```sh
npm run dev
# then visit http://localhost:5173
```

Or without npm:

```sh
npx serve . -p 5173
```

> Browsers block audio autoplay without a user gesture. The nasheed therefore
> begins the moment the user taps the wax seal. If the browser still blocks it,
> the floating audio button starts in the "muted" state so the user can tap to play.

## Editing

- **Couple / family / venue copy** — edit the `.invite__*` blocks in `index.html`.
- **Date / time / Hijri date** — edit the `.card--date` block.
- **Maps link** — change the `href` on the `.btn-map` anchor.
- **Calendar event** — edit `icsContent()` in `script.js` (UTC times).
- **Envelope colours / theme** — adjust the CSS variables at the top of `styles.css`
  (`--emerald-*` for the envelope, `--gold-foil-*` for the seal, `--paper-*`/`--olive-*`
  for the invitation).
- **Seal monogram** — edit the `#i-crescent` symbol in `index.html`.
- **Music** — replace `wedding_nasheed.mp3` with another file of the same name,
  or update the `<audio src>` in `index.html`.
