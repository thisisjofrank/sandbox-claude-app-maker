import { Client } from "@deno/sandbox";

const client = new Client();

async function initSandbox() {    
    console.log("Create a bootable volume...");

    const volume = await client.volumes.create({
        region: "ord",
        slug: "fun-with-claude",
        capacity: "10GiB",
        from: "builtin:debian-13",
    });

    console.log("Boot a sandbox with the volume as root...");

    await using sandbox = await client.sandboxes.create({
        region: "ord",
        root: volume.slug,
    });

    console.log("Installing Claude Code...");

    await sandbox.sh`curl -fsSL https://claude.ai/install.sh | bash`;
    await sandbox.sh`echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc`;

    return volume.id;
}

const volumeId = await initSandbox();

console.log("Snapshotting our volume...");

const snapshot = await client.volumes.snapshot(volumeId, {
    slug: "fun-with-claude-snapshot",
});

console.log("Created Claude snapshot " + snapshot.id);

