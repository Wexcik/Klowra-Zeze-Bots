module.exports = {
    name: "inviteCreate",
    execute(client, invite) {
        const guildData = client.invites.get(invite.guild.id);
        guildData.set(invite.code, invite);
        client.invites.set(invite.guild.id, guildData);
    }
};
