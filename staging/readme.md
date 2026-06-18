# Staging — PokéAPI Explorer

This is the **staging** environment for the PokéAPI Explorer site.

## Purpose

This is where a change goes once it is ready for **final checks**. Treat this
as a pre-release mirror of production: verify everything works here before
anything is promoted to the public site. Avoid experimenting directly in this
folder — do that in `../development`.

## Promotion flow

```
development  ──▶  staging  ──▶  production
(experiment)     (final checks)  (public, live)
```

- Incoming changes are copied here from `../development`.
- Once the changes pass their final checks, copy this folder's contents into
  `../production`.

## Running locally

These are static files. Serve the folder with any static web server, e.g.:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/index.html>.
