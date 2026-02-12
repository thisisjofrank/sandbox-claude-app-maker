import { Client } from "@deno/sandbox";

const client = new Client();

console.log("Starting sandbox...");

await using sandbox = await client.sandboxes.create({
  region: "ord",
  root: "fun-with-claude-snapshot",
  env: {
    ANTHROPIC_API_KEY: Deno.env.get("ANTHROPIC_API_KEY"),
  },
  port: 8000,
  timeout: "30m"
});

console.log("Asking Claude to make something sweet...");

await sandbox.sh`$HOME/.local/bin/claude --dangerously-skip-permissions -p "output ONLY the code for a single-file Deno calculator web app. It should use Deno.serve and serve an HTML page with an inline calculator UI - buttons for digits 0-9, +, -, *, /, =, and clear. Make it look nice with CSS. Use the export default { fetch } pattern for deno serve. No markdown, no explanation, no code fences, just the raw TypeScript code." > $HOME/main.ts`;
// Strip markdown code fences if Claude included them
await sandbox.sh`sed -i '/^\`\`\`/d' $HOME/main.ts`;
await sandbox.sh`cat $HOME/main.ts`;
const p = await sandbox.sh`deno serve -A --watch $HOME/main.ts`.spawn();

console.log("deno now listening on", sandbox.url);


await p.output();
