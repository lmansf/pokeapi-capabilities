# Development — PokéAPI Explorer

This is the **development** environment for the PokéAPI Explorer site.

## Purpose

This is the sandbox for **experimenting**. Make changes, try out new ideas, and
break things freely here. Nothing in this folder is guaranteed to be stable.

## Promotion flow

```
development  ──▶  staging  ──▶  production
(experiment)     (final checks)  (public, live)
```

When work here is ready for final checks, copy it into `../staging`.

## Running locally

These are static files. Serve the folder with any static web server, e.g.:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/index.html>.
