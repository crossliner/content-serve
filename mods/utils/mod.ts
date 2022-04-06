export function inProduction() {
    return Deno.env.get("DENO_ENV") === "production" ? true : false;
};

export function json(data: any, status: number = 200) {
    return new Response(
        JSON.stringify(data),
        {
            status,
            headers: {
                "Content-Type": "application/json"
            }
        }
    )
}

export function isVaildApiKey(key: string | null) {
    const apiKey = inProduction() ? Deno.env.get("API_KEY") : "test";
    return apiKey === key;
}