import * as THREE from 'three';
import { PlayerModel } from './player.model.js';
import { SockAssigner } from '../addons/scripts/sock_labels.js';

class ThreeWorld{
    constructor(client, sock){
        this.CAMERASPEED = 0.17;
        this.CAMERAQSPEED = 0.3;
        this.PLAYERDATA = {};

        this.sock = sock;

        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        document.mouse = new THREE.Vector2(0,0);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.name = "camera";

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        document.body.appendChild(this.renderer.domElement);
        this.canvas = document.getElementsByTagName('canvas')[0];
        
        document.addEventListener("pointerlockchange", () => {
            if(document.pointerLockElement != null){
                document.addEventListener("mousemove", this.updateMouse, false);
            }else{
                document.removeEventListener("mousemove", this.updateMouse, false);
            }
        }, false);

        document.addEventListener("mousedown", (e) => document.body.requestPointerLock());
        document.addEventListener("keydown", (e) => {
            if(e.key == "esc")document.exitPointerLock();
        });

        this.terrain = new THREE.Group();
        this.terrain.position.set(0,0,0);
        
        //add light
        let light = new THREE.AmbientLight(0x404040);
        this.terrain.add(light);

        //add floor
        let floor_mat = new THREE.MeshBasicMaterial({color: 0x808080, side: THREE.DoubleSide, wireframe: true});
        let floor_geom = new THREE.PlaneGeometry(100,100, 20, 20);
        let floor = new THREE.Mesh(floor_geom, floor_mat);
        floor.rotation.x = Math.PI/2;
        floor.position.set(0,-1,0);
        this.terrain.add(floor);
        this.terrain.name = "C_terrain";

        this.scene.add(this.terrain);

        this.client = client;
        this.client.initKeyControls();
        this.client.attach(this.scene);
        this.client.mesh.add( this.camera );
        this.camera.position.set(0, 1, 3);
        this.labels = new SockAssigner();

        //Animation Frame Loop
        this.renderer.setAnimationLoop(() => {
            let delta = this.clock.getDelta();
            this.client.update(document.mouse, delta);

            let rotation_alongY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), document.mouse.y*-0.005);
            this.camera.quaternion.copy(rotation_alongY);

            this.receivePlayerData(sock.global_players);
            this.renderer.render(this.scene, this.camera);

        });
    }
    receivePlayerData(data){ //TODO: add other players in
        if(!data)return;

        //check for disconnects
        if((this.scene.children.length-2) > Object.keys(data.dict)){
            let objs_in_scene = this.scene.children.map(x => x.name);
            //remove disconnects
            objs_in_scene.forEach(elem => {
                if((elem.slice(0,2) == 'C_') || (Object.keys(data.dict).includes(elem)))return;//client-side and existing players, don't want to remove
                this.labels.removeLabel(this.scene.getObjectByName(elem));
                this.scene.remove(this.scene.getObjectByName(elem));
            });
        }

        Object.entries(data.dict).forEach(player => {
            let player_obj = new PlayerModel(player[0], player[1]);
            //check if playobj is already in scene
            let scene_obj_arr = this.scene.children.map(mesh => mesh.name);
            if(player_obj.id == data.id)return player_obj.detach(this.scene);
            if(scene_obj_arr.includes(player_obj.id)){
                //is in scene
                let player_mesh = this.scene.getObjectByName(player_obj.id);
                player_mesh.position.copy(player_obj.mesh.position);
                player_mesh.quaternion.copy(player_obj.mesh.quaternion);
                return;
            }else if(!(scene_obj_arr.includes(player_obj.id))){
                //not in scene
                return player_obj.attach(this.scene);
            }
        });
        this.labels.assign(this.scene);
    }
    updateMouse(e){
        this.mouse.x += e.movementX;
        this.mouse.y += e.movementY;
    }
}

export { ThreeWorld }