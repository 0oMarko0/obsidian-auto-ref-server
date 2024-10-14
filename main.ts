import {OpenaiApi} from "./openai.ts";

const chromePath = process.env.CHROME_EXECUTABLE_PATH || '/sbin/google-chrome-stable';
const openAiApi = new OpenaiApi(chromePath)

const server = Bun.serve({
    async fetch(req) {
        const path = new URL(req.url).pathname;

        const responseHeaders = new Headers();
        responseHeaders.set("Access-Control-Allow-Origin", "*");
        responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        responseHeaders.set("Access-Control-Allow-Headers", "Content-Type");
        responseHeaders.set("Content-Type", "application/json");

        if (req.method === "POST" && path === "/api/reference") {
            const data = await req.json();
            if(!('url' in data)) {
                return Response.json({type: "MISSING_URL", msg: "You must provide a valid URL."});
            }

            const result = await openAiApi.referenceFromUrl(data.url)
            return Response.json(result, {headers: responseHeaders});
        }

        return new Response("Page not found", { status: 404, headers: responseHeaders});
    },
});

console.log(`Listening on: ${server.url}`)