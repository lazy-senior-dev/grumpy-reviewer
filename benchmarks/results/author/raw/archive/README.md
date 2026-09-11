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
| `agy-gemini-3.1-pro-low.jsonl` | Antigravity CLI | `gemini-3.1-pro-low` | 0 of 6 tickets completed. Superseded. |
| `agy-before-add-dir.jsonl` | Antigravity CLI | various | Made before the runner passed `--add-dir`. The CLI worked in its own scratch directory and reported success having edited a copy, so these score the agent as not making a change it did make somewhere else. They measure the harness, not the agent. |
| `agyg-gpt-oss-tool-schema-error.jsonl` | Antigravity CLI (GPT-OSS) | `gpt-oss-120b-medium` | The service rejects the CLI's own tool definitions: `INVALID_ARGUMENT (code 400): Tool 25 function has invalid 'parameters' schema`. Nothing to measure until that is fixed upstream. |

