/**
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
  "doc": "deno run --allow-run=deno jsr:@sigmasd/doc-gen ./entrypoint.ts > README.md"
}
```

@module
*/

if (import.meta.main) {
  const entrypoint = Deno.args[0];
  if (!entrypoint) {
    console.error("doc-gen ${entrypoint.ts}");
    Deno.exit(1);
  }
  const docJson = await denoDocJson(entrypoint);
  const moduleDoc = docJson.find((entry) => entry.kind === "moduleDoc");
  if (!moduleDoc) {
    console.error("Could not detect module docs");
    Deno.exit(1);
  }
  console.log(moduleDoc.jsDoc.doc);

  if (!moduleDoc.jsDoc.tags.find((tag) => tag.kind === "example")) {
    Deno.exit(0);
  }
  console.log("## Examples\n");
  let i = 1;
  for (const tag of moduleDoc.jsDoc.tags) {
    if (tag.kind === "example") {
      console.log(`**Example ${i}**\n`);
      console.log(tag.doc);
      i++;
    }
  }
}

interface Entry {
  kind: string;
  jsDoc: {
    doc: string;
    tags: { kind: string; doc: string }[];
  };
}

async function denoDocJson(entrypoint: string): Promise<Entry[]> {
  const output = await new Deno.Command("deno", {
    args: ["doc", "--json", entrypoint],
  })
    .output();
  return JSON.parse(new TextDecoder().decode(output.stdout));
}
