export default async function handler(req, res) {

    try {

        // ✅ Parse body safely
        const body =
            typeof req.body === "string"
                ? JSON.parse(req.body)
                : req.body;

        const { text, apiKey, model } = body;

        if (!text || !apiKey || !model) {
            return res.status(400).json({
                error: "Missing text, apiKey, or model"
            });
        }

        const aiResponse = await fetch(
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

        // ✅ If API error → return text
        if (!aiResponse.ok) {
            const errText = await aiResponse.text();
            return res.status(500).send(errText);
        }

        const arrayBuffer = await aiResponse.arrayBuffer();

        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Cache-Control", "no-cache");

        res.send(Buffer.from(arrayBuffer));

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
