import * as THREE from 'three';

class ClientModel{
    constructor(options={}){// options could be shape, color//TODO:Add in a switch statement
        this.SPEED = 0.3;
        let geometry = new THREE.BoxGeometry(1,1,1);//TODO:will be an option later
        let material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x000000});//TODO: will also be an option
        this.AXISHEIGHT = 1.0;
        this.AXISRAD = 1.0;
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.set(0,0,0);
        this.keydict = {};
        this.mesh.name = "C_client";
    }
    initKeyControls(){
        try{
            document.addEventListener("keydown", (event) => { //TODO: add ac6-esque controls
                this.keydict[event.key] = true;
            });
            document.addEventListener("keyup", (event) => {
                this.keydict[event.key] = false;
            });
        }catch(e){
            console.error(e.message);
        }
    }
    update(mousedata, delta){
        let speed_vec = new THREE.Vector3();
        if(this.keydict['w']){speed_vec.z -= this.SPEED}
        if(this.keydict['a']){speed_vec.x -= this.SPEED}
        if(this.keydict['s']){speed_vec.z += this.SPEED}
        if(this.keydict['d']){speed_vec.x += this.SPEED}

        let rotation_alongX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), document.mouse.x*-0.005);
        this.mesh.quaternion.copy(rotation_alongX);

        speed_vec.applyQuaternion(this.mesh.quaternion);
        this.mesh.position.lerp(this.mesh.position.add(speed_vec), delta);
    }
    attach(target){//can be a group or a scene
        this.parent = target;
        target.add(this.mesh);
    }
}

export { ClientModel }