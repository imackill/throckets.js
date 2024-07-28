"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrocketCollection = void 0;
const uuid_1 = require("uuid");
class ThrocketCollection {
    constructor() {
        this.id = `thc-${(0, uuid_1.v4)()}`;
        this.dict = {};
        Object.defineProperty(this, 'length', {
            get: function () {
                return Object.entries(this.dict).length;
            }
        });
    }
    getSocketById(id) {
        if (!Object.keys(this.dict).includes(id))
            return -1;
        return this.dict[id];
    }
    addSocket(ws) {
        return this.dict[ws.id] = ws;
    }
    rmSocketByID(id) {
        return delete this.dict[id];
    }
    map(func) {
        let thr_arr = Object.values(this.dict);
        thr_arr.forEach(elem => func(elem));
        return thr_arr;
    }
    copy(collection) {
        this.dict = structuredClone(collection.dict);
        return this;
    }
}
exports.ThrocketCollection = ThrocketCollection;
//# sourceMappingURL=collection.js.map