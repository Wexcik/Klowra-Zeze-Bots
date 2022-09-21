module.exports = {
    name: "inviteDelete",
    execute(client, invite) {
        const guildData = client.invites.get(invite.guild.id);
        guildData.delete(invite.code, invite);
        client.invites.set(invite.guild.id, guildData);
    }
};
