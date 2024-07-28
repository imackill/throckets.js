import { ClientModel } from "./client.models/client.model.js";
import { ThreeWorld } from "./client.models/world.js"
import { ClientSock } from "./client.models/client.sock.js";

const MS_PER_FRAME = 50; //ms network refresh rate

//TODO: HUD is a possibility

const client = new ClientModel({
    //options go here
});

const io = new ClientSock(client, MS_PER_FRAME);

const world = new ThreeWorld(client, io);