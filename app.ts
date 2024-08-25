import { createServer } from "http";
import { ThrocketServer } from "./index";
import * as fs from 'fs';
import * as path from 'path';

const mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "svg": "image/svg+xml",
    "json": "application/json",
    "js": "text/javascript",
    "css": "text/css"
  };

const server = createServer((req, res) => {
    let uri = `client/${req.url}`;
    let filename = path.join(process.cwd(), uri);

    if(!fs.existsSync(filename)){
        res.writeHead(404, {"Content-Type" : "text/plain"});
        res.write(`404 Not Found\n`);
        res.end();
        return;
    }

    if(fs.statSync(filename).isDirectory()){
        filename += `html/index.html`;
    }

    fs.readFile(filename, "binary", (err, file) => {
        if(err){
            res.writeHead(500, {"Content-Type":"text/plain"});
            res.write(`${err}\n`);
            res.end();
            return;
        }

        let mimeType = mimeTypes[filename.split('.').pop()];
        if(!mimeType){
            mimeType = 'text/plain';
        }

        res.writeHead(200, { "Content-Type": mimeType });
        res.write(file, 'binary');
        res.end();
    });
}); //http Server

const thss = new ThrocketServer(server); //WebSocket Server

server.listen( process.env.PORT, () => {
    console.log(`WebSocket Server Running at Port ${process.env.PORT}`);
});