export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { text, apiKey, model } = req.body;

    try {

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

        const arrayBuffer = await response.arrayBuffer();

        // ✅ VERY IMPORTANT HEADERS
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Content-Disposition", "inline; filename=speech.mp3");

        res.send(Buffer.from(arrayBuffer));

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
