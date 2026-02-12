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

await sandbox.sh`$HOME/.local/bin/claude -p "output ONLY the code for a deno serve hello world app using export default { fetch } pattern. No markdown, no explanation, just the code." > $HOME/main.ts`;
await sandbox.sh`cat $HOME/main.ts`;
const p = await sandbox.sh`deno serve -A --watch $HOME/main.ts`.spawn();

console.log("deno now listening on", sandbox.url);


await p.output();
