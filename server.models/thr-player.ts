import { WebSocket } from "ws"
import { v4 } from "uuid";

interface Player{
    id: string;
}

class Player{
    constructor(ws: WebSocket){
        this.id = v4();
    }
}

export { Player };