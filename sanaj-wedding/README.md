# Sanaj AP & Farhana CK — Wedding Invitation

A static wedding invitation with an opening envelope, background nasheed, three event sections, maps links, countdown to the Nikah, and a calendar download containing all three events.

## Event details

- **Nikah:** Saturday, 17 October 2026 at 4:00 PM — Badar Jumah Masjid, Illipuram.
- **Gents reception:** Saturday, 17 October 2026 at 7:00 PM, after the Nikah — Fathima's, Manna, Valapattanam.
- **Ladies reception:** Sunday, 18 October 2026 from 12:00 PM — Fathima's, Manna, Valapattanam.
- **Reception directions:** https://maps.google.com/?q=11.920301,75.353912

## Run locally

```sh
npm run dev
```

Open http://localhost:5173.

## Firebase deployment

The Firebase target in `.firebaserc` is `sanaj-farhana-wedding`. The previous wedding project is no longer configured as this site's default. Once the new project has been successfully created, deploy only to the explicit target:

```sh
firebase deploy --only hosting --project sanaj-farhana-wedding
```

The invitation is deployed at https://sanaj-farhana-wedding.web.app/. Always specify the `sanaj-farhana-wedding` project ID when deploying updates.
