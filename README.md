# obsidian-auto-ref-server
Stupid and simple server that return information about a web article using openai.

To install dependencies:
```bash
bun install
```

Set the OPENAI_API_KEY env
```bash
export OPENAI_API_KEY=you key
```

To run:
```bash
bun run main.ts
```

To test
```bash
curl -X POST http://localhost:3000/api/reference \
  -H "Content-Type: application/json" \
  -d '{"url": "url of a web page"}'
```