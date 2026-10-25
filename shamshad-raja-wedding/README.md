# Shamshad Shaduli & Raja Jabir — Wedding invitations

Two independent static invitation folders preserve the `sanaj-wedding` floral cream, brown and gold theme, opening envelope, nasheed, countdown and calendar download. The original invitation folders have not been modified.

## Invitations

| Invitation | Folder | Hosting site |
| --- | --- | --- |
| Bride: Raja Jabir first | `bride/` | https://raja-shamshad-wedding.web.app/ |
| Groom: Shamshad Shaduli first | `groom/` | https://shamshad-raja-wedding.web.app/ |

Firebase project: `shamshad-raja-wedding`. A single project with two Hosting sites keeps related invitations together while allowing independent deployments. Separate projects would be useful if the sites needed separate owners, billing, or backend resources.

## Details

- Nikah: Saturday, 28 November 2026, **after Asr**, Rifayi Juma Masjid, Cheruthazham.
- Bride reception: Saturday, 28 November (night) and Sunday, 29 November 2026, Mottammal House, Cheruthazham.
- Groom reception: same dates, Asmas House, Eripram, Muttam.
- Both invitations link only to **Directions to Nikah**: https://maps.app.goo.gl/z61tZ2AN4w9ZqBA9A?g_st=iw
- Countdown targets the beginning of 28 November 2026 in India (`2026-11-28T00:00:00+05:30`). The invitation explains the Nikah is after Asr; no exact ceremony time has been assumed.
- Calendar downloads contain three date-only reminders: Nikah, Saturday night reception, and Sunday reception. Descriptions preserve the supplied timing. Each invitation uses its own reception venue.
- Each folder has its own sharing preview. Keep metadata URLs aligned if Hosting site IDs change.

## Local preview

From this folder:

```sh
npm run dev
```

Open http://localhost:5173/bride/ or http://localhost:5173/groom/.

## Deployment

From this folder, with Firebase CLI installed and authenticated:

```sh
npm run deploy
# Or update one invitation:
npm run deploy:bride
npm run deploy:groom
```

These commands explicitly select the new project and the configured bride/groom targets. No build step or Firebase client SDK is needed for these static sites.

## Verification

JavaScript syntax and local asset references were checked. Script execution verified envelope reveal, countdown before/on the wedding date, and both invitation-specific calendar downloads (event dates, venues, and UTF-8 line folding).

Both Hosting deployments completed successfully. Live HTML, styles, scripts and social preview images were fetched over HTTPS and matched their local files. The invitation was visually checked in Chrome.
