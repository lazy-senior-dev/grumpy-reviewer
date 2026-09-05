Tasks are Python services; the checks look for the defect class in the added lines of the diff.

Any agent can be measured, not only the four with built-in adapters. Point `LSD_AGENT_CMD` at a command that reads the prompt on standard input and edits files in the working directory:

```sh
LSD_AGENT_CMD="my-agent --write" LSD_AGENT_LABEL="My agent" npm run bench:author -- --agents any
LSD_AGENT_CMD="my-agent --print" LSD_AGENT_LABEL="My agent" npm run bench -- --agents any
```

The first measures what the agent ships; the second measures how it reviews. Nothing else in the benchmark knows which agent it is talking to.
