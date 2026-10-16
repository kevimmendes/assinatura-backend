const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));

const WEBHOOK_URL = process.env.WEBHOOK_URL;

const recentes = new Set();

app.post('/assinatura', async (req, res) => {
    try {
        const { userId, jogador, nome } = req.body;

        if (!userId || !jogador || !nome) return res.json({ ignorado: true });

        const chave = `${userId}-${nome}`;
        if (recentes.has(chave)) return res.json({ duplicado: true });
        recentes.add(chave);
        setTimeout(() => recentes.delete(chave), 10000);

        let avatarUrl;
        try {
            const avatarRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`);
            const avatarData = await avatarRes.json();
            avatarUrl = avatarData.data[0]?.imageUrl;
        } catch (e) {}

        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: 'Documento Assinado',
                    description: `**${jogador}** assinou o documento como **${nome}**`,
                    color: 5763719,
                    thumbnail: avatarUrl ? { url: avatarUrl } : undefined,
                    timestamp: new Date().toISOString()
                }]
            })
        });

        res.json({ sucesso: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: err.message });
    }
});

app.listen(process.env.PORT || 3000);
