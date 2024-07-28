import { v4 } from "uuid";

interface ThrocketCollection{
    id: string,
    dict: object,
    readonly length: number,
}

class ThrocketCollection{
    constructor(){
        this.id = `thc-${v4()}`;
        this.dict = {};
        Object.defineProperty(this, 'length', {
                get: function(){
                    return Object.entries(this.dict).length;
                }
            }
        );
    }
    getSocketById(id){
        if(!Object.keys(this.dict).includes(id))return -1;
        return this.dict[id];
    }
    addSocket(ws: any){
        return this.dict[ws.id] = ws;
    }
    rmSocketByID(id: string){
        return delete this.dict[id];
    }
    map(func: Function){
        let thr_arr = Object.values(this.dict);
        thr_arr.forEach(elem => func(elem));
        return thr_arr;
    }
    copy(collection: ThrocketCollection): ThrocketCollection{
        this.dict = structuredClone(collection.dict);
        return this;
    }
}

export { ThrocketCollection };