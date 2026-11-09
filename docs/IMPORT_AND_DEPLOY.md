# GRYFFINDOR — import existing app, then deploy safely

**Status:** This repository currently contains only a README on `main`. The working GRYFFINDOR source still needs to be imported from the local development folder. Do **not** deploy a placeholder.

## 1. Protect the source
- Consider making this repository **private** before importing your personal-life/work application.
- Back up the existing local folder. Do not upload personal diaries, attendance records, databases, uploads, passwords, API secrets, or `.env` files.
- Keep `node_modules`, `dist`, `.next`, `.vercel`, and other generated artifacts out of Git.
- Confirm the current project's actual framework and runtime before adding deployment configuration.

## 2. Import your actual local project

Windows (PowerShell) or macOS (Terminal), from the location where you want the GitHub checkout:

```bash
git clone https://github.com/SreeshM18/GRYFFINDOR.git
cd GRYFFINDOR
git switch -c feat/import-existing-app
```

Copy your **actual project source files** into this checkout using File Explorer/Finder. Do not copy the original project's `.git`, `.env`, or build/dependency directories. Preserve original source structure, including `package.json` and lockfile if present.

After copying:

```bash
git status --short
git add .
git diff --cached --stat
git diff --cached --check
```

Check staged changes for sensitive files and secrets before committing; never paste secrets in chat or commit them.

```bash
git commit -m "feat: import existing Gryffindor OS application"
git push -u origin feat/import-existing-app
```

Open a pull request to `main`; inspect changed files and run the project's actual tests/build before merging. On Windows use the Git Bash or PowerShell shell that has Git installed.

## 3. Pre-deployment verification

- Confirm project entry points, scripts, dependency lockfile and expected Node version.
- Run `npm ci` when a compatible npm lockfile is committed; otherwise use the package manager required by the project.
- Run available unit, type, lint, integration, and end-to-end tests.
- Verify login/session protection, Supabase RLS for every private table, private storage access, and cross-account isolation.
- Check no secret keys are reachable from client bundles, routes, source maps, or public URLs.
- Verify all routes, buttons, forms, 404 behavior, iPhone/desktop navigation, and theme overrides.
- Test tasks, attendance, notes, and shared state against real authorized accounts and database records.

## 4. Connect Vercel after source import

1. In Vercel, **Add New Project → Import Git Repository → SreeshM18/GRYFFINDOR**. Select the intended Vercel team.
2. Confirm framework preset, **Root Directory**, build command and output directory against the actual project. Do not guess or deploy empty root.
3. Configure environment variables through Vercel settings (including preview/production separation), not committed `.env` files. Use the **public** Supabase publishable/anon key in a browser only when RLS correctly protects all private data. Never put the **service role** key in the browser.
4. Check Supabase allowed redirect URLs and site URL match the deployed domain.
5. Deploy a preview from the PR branch, test login, privacy and state sync from at least two devices.
6. Only then merge a reviewed commit and release to production with deployment checks enabled.
7. Add monitoring, error alerts, backup/restore procedures, and a rollback plan.

**Release policy:** Screenshots, build logs, and passing tests are evidence; visual mockups are not proof of production functionality.
