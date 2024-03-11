# Doc Gen

Generate README.md from jsdoc @module

It uses `deno doc --json` to get the needed informations

## Usage

By default its outputs to stdout

```
deno run -A jsr:@sigmasd/doc-gen entrypoint.ts
```

If you want to create/update README.md you can use shell redirection

```
deno run -A jsr:@sigmasd/doc-gen entrypoint.ts > README.md
```

Or add a convenience task in deno.json

```json
"tasks": {
  "doc": "deno run -A jsr:@sigmasd/doc-gen ./entrypoint.ts > README.md && deno fmt README.md"
}
```

