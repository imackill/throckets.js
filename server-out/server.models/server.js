"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrocketServer = void 0;
const ws_1 = require("ws");
const uuid_1 = require("uuid");
const collection_1 = require("./collection");
class ThrocketServer extends ws_1.Server {
    constructor(server) {
        super({ server });
        this.id = `ths-${(0, uuid_1.v4)()}`;
        this.sockets = new collection_1.ThrocketCollection();
        this.objects = new collection_1.ThrocketCollection();
        this.init();
    }
    init() {
        this.on("connection", (ws, request) => {
            console.log(`Connected to Socket`);
            ws.id = (0, uuid_1.v4)();
            ws.on("message", (data) => {
                this.sockets.addSocket(ws);
                data = JSON.parse(data.toString());
                let obj_data = data.data;
                switch (data.meta) {
                    case 'connection':
                        obj_data.id = ws.id;
                        obj_data.position = [0, 0, 0];
                        obj_data.rotation = [0, 0, 0, 1];
                        this.objects.addSocket(obj_data);
                        ws.send(JSON.stringify({
                            meta: 'connection_response',
                            payload: ws.id,
                        }));
                        break;
                    case 'update':
                        if (obj_data.id == '')
                            return; //before id is assigned
                        let obj_to_update = this.objects.getSocketById(obj_data.id);
                        obj_to_update.position = obj_data.position;
                        obj_to_update.rotation = obj_data.rotation;
                        break;
                    default:
                        break;
                }
                this.clients.forEach((ws) => {
                    let temp_collection = new collection_1.ThrocketCollection().copy(this.objects);
                    let data = {
                        meta: 'update_package',
                        id: ws.id,
                        payload: temp_collection,
                    };
                    ws.send(JSON.stringify(data));
                });
            });
            ws.on("close", (code, reason) => {
                this.sockets.rmSocketByID(ws.id);
                this.objects.rmSocketByID(ws.id);
                console.log(`[${new Date(Date.now()).toTimeString()}] Websocket Closed: ${code}\n${reason.toString()}\nWebsocket ID: ${ws.id}`);
            });
        });
    }
}
exports.ThrocketServer = ThrocketServer;
//# sourceMappingURL=server.js.map