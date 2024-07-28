"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrocketCollection = void 0;
const uuid_1 = require("uuid");
class ThrocketCollection {
    constructor() {
        this.id = `thc-${(0, uuid_1.v4)()}`;
        this.dict = {};
    }
    addThrocket(ws) {
        return this.dict[ws.id] = ws;
    }
    rmThrocket(ws) {
        return delete this.dict[ws.id];
    }
    rmThrocketbyID(id) {
        return delete this.dict[id];
    }
    map(func) {
        let thr_arr = Object.values(this.dict);
        thr_arr.forEach(elem => func(elem));
        return thr_arr;
    }
}
exports.ThrocketCollection = ThrocketCollection;
//# sourceMappingURL=throcket.js.map