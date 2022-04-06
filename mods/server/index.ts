import { serve } from "std/http/server.ts";
const production = Deno.env.get("DENO_ENV") === "production" ? true : false;
const API_KEY = production ? Deno.env.get("API_KEY") : "test";

function json(data: any, status: number = 200) {
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

serve(async (req) => {
    const type = req.headers.get("content-type") || ""
    const url = new URL(req.url);
    
    if (url.pathname === "/upload" && req.method === "POST" && type.startsWith("multipart/form-data")) {
        if (req.headers.get("x-upload-key") !== API_KEY) return json({
            success: false,
            error: "unauthorized to use the endpoint"
        }, 401);
        
        const data = await req.formData();
        const file = <File>data.get("file");
        if (!file) return json({
            success: false,
            error: "invaild form configuration"
        }, 400);
        
        const buf = await file.arrayBuffer();
        
        return json({ 
            success: true
        }, 201);
    }
    
    return json({ 
        success: false,
        error: "resource not found"
    }, 404)
}, { port: 4533 }) // TODO: fetch the port to use from somewhere or make it 80 for production images