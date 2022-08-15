async function setup(guildId, userId) {
    if (!guildId || !userId) return;
    
    await fetch("/api/commands/setup", {
        method: "POST",
        body: JSON.stringify({ guildId, userId }),
        headers: {
            "Content-Type": "application/json"
        }
    });
}