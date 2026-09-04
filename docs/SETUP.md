# Setup: from these two clones to a live launch

Run these in order. Five repositories are already on disk under `~/01.Projects/lazy-senior-dev/` with their commit history: `grumpy-reviewer`, `lazy-senior-dev.github.io`, `paranoid-sre`, `tenured`, and `lazy-senior-dev` (the org profile). Nothing needs unpacking.

## 0. Make the folder-level git config apply

The folder config at `~/01.Projects/lazy-senior-dev/.gitconfig` is not yet included from `~/.gitconfig`, so commits made here were signed with the global key. Add the include once:

```sh
git config --global includeIf."gitdir:~/01.Projects/lazy-senior-dev/".path ~/01.Projects/lazy-senior-dev/.gitconfig
cd ~/01.Projects/lazy-senior-dev/grumpy-reviewer && git config user.signingkey    # expect ~/.ssh/id_ed25519_signing.pub
```

## 1. Verify identity in every repo

```sh
for r in grumpy-reviewer lazy-senior-dev.github.io paranoid-sre tenured lazy-senior-dev; do
  (cd ~/01.Projects/lazy-senior-dev/$r && echo "$r: $(git config user.name) <$(git config user.email)>")
done
# expect: sandeepbazar <5602033+sandeepbazar@users.noreply.github.com> for all five
```

## 2. Run the checks

```sh
cd ~/01.Projects/lazy-senior-dev/grumpy-reviewer
npm test && npm run check
```

## 3. Re-sign the whole history with the intended key

```sh
for r in grumpy-reviewer lazy-senior-dev.github.io paranoid-sre tenured lazy-senior-dev; do
  (cd ~/01.Projects/lazy-senior-dev/$r && git rebase --exec 'git commit --amend --no-edit -n -S --allow-empty' --root)
done
cd ~/01.Projects/lazy-senior-dev/grumpy-reviewer && git log --format='%an <%ae> %G?' | sort -u
# expect exactly one line ending in G
```

If the line ends in `N` or `E`, check `gpg.ssh.allowedSignersFile` points at `~/.ssh/allowed_signers` and that file lists the noreply address with the signing key.

## 4. Push

```sh
for r in grumpy-reviewer lazy-senior-dev.github.io paranoid-sre tenured lazy-senior-dev; do
  (cd ~/01.Projects/lazy-senior-dev/$r && git push -u origin main)
done
```

The `lazy-senior-dev` repo carries `profile/README.md`, which GitHub shows on the org page once pushed.

`gh` on this machine is logged into github.ibm.com; for the `gh` commands below log into github.com first: `gh auth login --hostname github.com`.

## 5. Enable Pages

Project site (served from `docs/` on `main`):

- Settings, Pages, Source: Deploy from a branch, Branch: `main`, Folder: `/docs`, Save.
- `gh api -X POST repos/lazy-senior-dev/grumpy-reviewer/pages -f 'source[branch]=main' -f 'source[path]=/docs'`

Org site (served from the root):

- Settings, Pages, Source: Deploy from a branch, Branch: `main`, Folder: `/ (root)`, Save.
- `gh api -X POST repos/lazy-senior-dev/lazy-senior-dev.github.io/pages -f 'source[branch]=main' -f 'source[path]=/'`

`/ (root)` also works for the three persona repos: each has a root `index.html` that redirects to `docs/` and a root `.nojekyll`. `/docs` is the cleaner choice because the canonical URL then serves the page directly. Both repos also carry `.github/workflows/pages.yml` for the "GitHub Actions" source; pick one source per repo and delete the other. Custom domain later: add a `CNAME` file containing only the bare domain (`docs/CNAME` for the project site, `CNAME` at the root of the org site).

## 6. Protect main with a ruleset

Settings, Rules, Rulesets, New branch ruleset: name `main`, target `main`, bypass list: repository admin (you). Rules: Require a pull request before merging (0 approvals is fine for a solo maintainer), Require signed commits, Block force pushes, Require status checks: `test (node 20)`, `test (node 22)`.

```sh
gh api -X POST repos/lazy-senior-dev/grumpy-reviewer/rulesets --input - <<'JSON'
{ "name": "main", "target": "branch", "enforcement": "active",
  "bypass_actors": [{ "actor_id": 5, "actor_type": "RepositoryRole", "bypass_mode": "always" }],
  "conditions": { "ref_name": { "include": ["refs/heads/main"], "exclude": [] } },
  "rules": [
    { "type": "pull_request", "parameters": { "required_approving_review_count": 0, "dismiss_stale_reviews_on_push": true, "require_code_owner_review": false, "require_last_push_approval": false, "required_review_thread_resolution": false } },
    { "type": "required_signatures" },
    { "type": "non_fast_forward" },
    { "type": "required_status_checks", "parameters": { "strict_required_status_checks_policy": false, "required_status_checks": [{ "context": "test (node 20)" }, { "context": "test (node 22)" }] } }
  ] }
JSON
```

Repeat for `lazy-senior-dev.github.io`, `paranoid-sre`, `tenured`, and `lazy-senior-dev` without the status-check rule.

## 7. Secrets and features

```sh
gh secret set ANTHROPIC_API_KEY --repo lazy-senior-dev/grumpy-reviewer     # for the manual benchmark workflow
gh repo edit lazy-senior-dev/grumpy-reviewer --enable-discussions
gh api -X PUT repos/lazy-senior-dev/grumpy-reviewer/private-vulnerability-reporting
```

Optional, for `npm publish` on tag: `gh secret set NPM_TOKEN --repo lazy-senior-dev/grumpy-reviewer`.

## 8. Tag the release

```sh
cd ~/01.Projects/lazy-senior-dev/grumpy-reviewer
git tag -s v0.1.0 -m "v0.1.0"
git tag -f -s v1 -m "v1"          # the moving major tag the Action's users reference
git push origin v0.1.0 && git push -f origin v1
```

The release workflow builds the adapters zip, drafts release notes, and publishes to npm only if `NPM_TOKEN` exists.

## 9. Confirm

```sh
curl -sI https://lazy-senior-dev.github.io/grumpy-reviewer/ | head -1     # HTTP/2 200
curl -sI https://lazy-senior-dev.github.io/ | head -1                     # HTTP/2 200
gh run list --repo lazy-senior-dev/grumpy-reviewer --limit 3              # ci green
```

Then open Claude Code anywhere and run `/plugin marketplace add lazy-senior-dev/grumpy-reviewer`.

## 10. Benchmark refresh (any time)

```sh
npm run bench                 # uses claude, codex, and agy if installed
npm run bench:report          # results md, latest.json, chart, site data, README block
git add -A benchmarks assets docs README.md && git commit -m "bench: results $(date +%F)"
```
