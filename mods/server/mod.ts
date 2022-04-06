import { serve } from "std/http/server.ts";
import { 
    inProduction, 
    json, 
    isVaildApiKey,
    generateFileName,
    getUrl 
} from "@content-serve/utils";

import { mime } from "mime-types";
import { join } from "std/path/posix.ts";

serve(async (req) => {
    const type = req.headers.get("content-type") || ""
    const url = new URL(req.url);
    
    if (url.pathname === "/upload" && req.method === "POST" && type.startsWith("multipart/form-data")) {
        if (!isVaildApiKey(req.headers.get("x-upload-key"))) return json({
            success: false,
            error: "unauthorized to use the endpoint"
        }, 401);
        
        const data = await req.formData();
        const file = <File>data.get("file");
        if (!file || !(file instanceof File)) return json({
            success: false,
            error: "invaild form configuration"
        }, 400);

        const buf = await file.arrayBuffer();
        const name = generateFileName(file.name);
        await Deno.writeFile(join("uploads", name), new Uint8Array(buf));
        
        return json({ 
            success: true,
            url: getUrl(name)
        }, 201);
    }
    
    try {
        const file = await Deno.readFile(join("uploads", url.pathname));
        const type = mime.getType(url.pathname);
        return new Response(file.buffer, {
            headers: {
                "Content-Type": type!
            }
        });
    } catch(err) {
        return json({ 
            success: false,
            error: "resource not found"
        }, 404)
    }
    
}, { port: inProduction() ? 80 : 4500 });