const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));

const WEBHOOK_URL = process.env.WEBHOOK_URL;

app.post('/assinatura', async (req, res) => {
    const { imagem, jogador } = req.body;
    const buffer = Buffer.from(imagem.replace(/^data:image\/png;base64,/, ''), 'base64');

    const formData = new FormData();
    formData.append('content', `Assinatura de ${jogador}`);
    formData.append('files[0]', new Blob([buffer]), 'assinatura.png');

    await fetch(WEBHOOK_URL, { method: 'POST', body: formData });
    res.json({ sucesso: true });
});

app.listen(process.env.PORT || 3000);
