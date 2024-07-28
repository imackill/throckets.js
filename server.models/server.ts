import { Server, WebSocket } from "ws";
import { v4 } from "uuid";
import { ThrocketCollection } from "./collection";
import { IncomingMessage} from "http";


interface ThrocketServer extends Server{
    id: string,
    port: number,
    sockets: ThrocketCollection,
    objects: ThrocketCollection,
}

class ThrocketServer extends Server{
    constructor(server: any){
        super({server});
        this.id = `ths-${v4()}`;
        this.sockets = new ThrocketCollection();
        this.objects = new ThrocketCollection();
        this.init();
    }
    init(){
        this.on("connection", (ws: any, request: IncomingMessage) => {
            console.log(`Connected to Socket`);
            ws.id = v4();
            
            ws.on("message", (data: any) => {
                this.sockets.addSocket(ws);
                data = JSON.parse(data.toString());
                let obj_data = data.data;
                switch(data.meta){
                    case 'connection':
                        obj_data.id = ws.id;
                        obj_data.position = [0,0,0];
                        obj_data.rotation = [0,0,0,1];
                        this.objects.addSocket(obj_data);
                        ws.send(JSON.stringify({
                            meta: 'connection_response',
                            payload: ws.id,
                        }));
                        break;
                    case 'update':
                        if(obj_data.id == '')return;//before id is assigned
                        let obj_to_update = this.objects.getSocketById(obj_data.id);
                        obj_to_update.position = obj_data.position;
                        obj_to_update.rotation = obj_data.rotation;
                        break;
                    default:
                        break;
                }
                this.clients.forEach((ws) => {
                    let temp_collection = new ThrocketCollection().copy(this.objects);
                    let data = {
                        meta: 'update_package',
                        id: ws.id,
                        payload: temp_collection,
                    }
                    ws.send(JSON.stringify(data));
                });
            });

            ws.on("close", (code: number, reason: Buffer) => {
                this.sockets.rmSocketByID(ws.id);
                this.objects.rmSocketByID(ws.id);
                console.log(`[${new Date(Date.now()).toTimeString()}] Websocket Closed: ${code}\n${reason.toString()}\nWebsocket ID: ${ws.id}`);
            });

        });
    }
}

export { ThrocketServer };