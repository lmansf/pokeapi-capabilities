# Production — PokéAPI Explorer

This is the **production** environment for the PokéAPI Explorer site.

## Purpose

This is the **public-facing** copy of the site — the version real users see.
It should always be a copy of the **most recently working staging version**.

Do **not** edit files in this folder directly. All changes flow in from
`../staging` only after they have passed their final checks.

## Promotion flow

```
development  ──▶  staging  ──▶  production
(experiment)     (final checks)  (public, live)
```

Only promote to production once the change has been verified in `../staging`.

## Running locally

These are static files. Serve the folder with any static web server, e.g.:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/index.html>.
