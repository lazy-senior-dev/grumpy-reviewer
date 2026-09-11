# Archived author-tier records

Real runs, kept, but not read by the report. A record here was made on a model that the runner no
longer targets for that agent, and one row in the published table is one agent on one model. Merging
them would average two models into a single number.

| File | Agent | Model | Why it moved |
|---|---|---|---|
| `codex-default.jsonl` | Codex CLI | `codex-default` | The CLI's unnamed default: nothing a reader could pin or reproduce. The runner now targets `gpt-5.5`. |
| `agy-gemini-3.8-flash-medium.jsonl` | Antigravity CLI | `gemini-3.8-flash-medium` | Superseded by `gemini-3.1-pro-low`. |

To resume one of these, point the runner back at that model and move the file into the parent
directory. The runner refuses to append a different model to an existing file, which is why these
are here rather than merged.
