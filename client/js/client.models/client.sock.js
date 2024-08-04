

class ClientSock{
    constructor(obj, HEARTBEAT){
        this.id = '';
        this.sock = new WebSocket(`${window.origin}`, ['update', 'connection']);
        this.sock.onopen = (ev) => {
            this.sock.send(JSON.stringify({
                meta: 'connection',
                data: obj,
            }));
        }
        this.sock.onmessage = (ev) => {
            let data = JSON.parse(ev.data);
            switch(data.meta){
                case 'connection_response':
                    this.id = data.payload;
                    break;
                case 'update_package':
                    delete data.payload.dict[data.id];
                    this.global_players = data.payload;
                    break;
                default:
                    break;
            }
        }
        this.init(obj)
    }
    init(obj){
        setInterval(() => {
            if(this.sock.readyState == 0)return;
            let data = {
                meta: 'update',
                data: {
                    position: obj.mesh.position,
                    rotation: obj.mesh.quaternion,
                    id: this.id
                }
            };
            this.sock.send(JSON.stringify(data));
        }, this.HEARTBEAT);
    }
    close(){
        this.sock.close();
    }
}

export { ClientSock }