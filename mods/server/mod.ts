import { serve } from "std/http/server.ts";
import { inProduction, json, isVaildApiKey } from "@content-serve/utils";


serve(async (req) => {
    const type = req.headers.get("content-type") || ""
    const url = new URL(req.url);
    
    if (url.pathname === "/upload" && req.method === "POST" && type.startsWith("multipart/form-data")) {
        if (isVaildApiKey(req.headers.get("x-upload-key"))) return json({
            success: false,
            error: "unauthorized to use the endpoint"
        }, 401);
        
        const data = await req.formData();
        const file = <File>data.get("file");
        if (!file) return json({
            success: false,
            error: "invaild form configuration"
        }, 400);
        
        // const buf = await file.arrayBuffer();
        
        return json({ 
            success: true
        }, 201);
    }
    
    return json({ 
        success: false,
        error: "resource not found"
    }, 404)
}, { port: inProduction() ? 80 : 4500 });