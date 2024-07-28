import { v4 } from "uuid";

interface Player{
    id: string;
}

class Player{
    constructor(ws: any){
        this.id = v4();
    }
}

export { Player };