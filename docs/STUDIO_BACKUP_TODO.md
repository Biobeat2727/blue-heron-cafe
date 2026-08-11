# TODO: Back up the Sanity Studio source

**Status: not done yet (flagged 2026-08-11)**

The `studio/` folder is its own git repo, but it has **no remote** — its
commits exist only on this machine. The main `blue-heron-cafe` repo on
GitHub records pointers (gitlinks) to studio commits that nobody else can
fetch.

## Why this hasn't broken anything

- The live site talks straight to Sanity's API; it never reads `studio/`.
- `sanity deploy` uploads the built Studio (schema included) to Sanity's
  hosted infrastructure, so the working editor also lives in their cloud.
- All content is stored in Sanity's cloud dataset, backed up by them.

## The actual risk

If this machine is lost, the **schema source files** (`studio/schemas/`)
are gone. The deployed Studio and all content would keep working, but
future schema changes would require reconstructing those files.

## The fix (when ready)

1. Create a private GitHub repo, e.g. `blue-heron-studio`.
2. In `studio/`: `git remote add origin <repo-url>` and `git push -u origin main`.
3. Optionally wire it into the main repo as a proper submodule
   (`.gitmodules`) so fresh clones can fetch it.
