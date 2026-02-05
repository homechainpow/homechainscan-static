export default async function handler(request, response) {
    const { endpoint } = request.query;

    // Set CORS headers first to ensure the browser accepts the response even on error
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    if (!endpoint) {
        return response.status(400).json({ error: "Missing endpoint query parameter" });
    }

    try {
        // Use the persistent Serveo Tunnel URL
        const targetUrl = `https://homechain-live.serveo.net${endpoint}`;

        // Serveo doesn't usually require bypass headers, but we keep it clean
        const res = await fetch(targetUrl);

        if (!res.ok) {
            throw new Error(`Node replied using status ${res.status}`);
        }

        const data = await res.json();
        return response.status(200).json(data);

    } catch (error) {
        return response.status(500).json({
            error: "Failed to connect to HomeChain Node",
            details: error.message,
            target: endpoint
        });
    }
}
