import { cryptoRandomString } from "randomstring";
import { extname } from "std/path/posix.ts";

export function inProduction() {
    return Deno.env.get("DENO_ENV") === "production";
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

export function generateFileName(name: string) {
    const ext = extname(name);
    return cryptoRandomString({ length: 8, type: "alphanumeric" }) + ext;
}

export function getUrl(name: string) {
    const url = inProduction() ? Deno.env.get("URL") : "http://localhost:4500/";
    return url + name;
}