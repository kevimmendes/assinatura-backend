const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));

const WEBHOOK_URL = process.env.WEBHOOK_URL;

app.post('/assinatura', async (req, res) => {
    const { userId, jogador, nome } = req.body;

    const avatarRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`);
    const avatarData = await avatarRes.json();
    const avatarUrl = avatarData.data[0]?.imageUrl;

    await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            embeds: [{
                title: 'Documento Assinado',
                description: `**${jogador}** assinou o documento como **${nome}**`,
                color: 5763719,
                thumbnail: { url: avatarUrl },
                timestamp: new Date().toISOString()
            }]
        })
    });

    res.json({ sucesso: true });
});

app.listen(process.env.PORT || 3000);
