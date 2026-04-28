export default {
  async fetch(request, env) {
    const { searchParams } = new URL(request.url);
    const mcid = searchParams.get('mcid');
    const uuid = searchParams.get('uuid');

    // CORSヘッダーの設定
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    };

    let apiUrl = "";
    if (mcid) {
      apiUrl = `https://api.minecraftservices.com/minecraft/profile/lookup/name/${mcid}`;
    } else if (uuid) {
      apiUrl = `https://api.minecraftservices.com/minecraft/profile/${uuid.replace(/-/g, '')}`;
    } else {
      return new Response(JSON.stringify({ error: "Missing parameter" }), { status: 400, headers });
    }

    try {
      const response = await fetch(apiUrl, {
        headers: { "User-Agent": "CloudflareWorker-MC-Converter" }
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to fetch from Mojang" }), { status: 500, headers });
    }
  }
};
