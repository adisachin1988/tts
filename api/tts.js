export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {

        const { text, apiKey, model } = req.body;

        const response = await fetch(
            "https://openrouter.ai/api/v1/audio/speech",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: model,
                    input: text,
                    voice: "alloy",
                    response_format: "mp3"
                })
            }
        );

        if (!response.ok) {
            const err = await response.text();
            return res.status(500).send(err);
        }

        const buffer = await response.arrayBuffer();

        res.setHeader("Content-Type", "audio/mpeg");
        res.send(Buffer.from(buffer));

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
