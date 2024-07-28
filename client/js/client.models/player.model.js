import * as THREE from 'three';

class PlayerModel{
    constructor(id, data){
        this.id = id;
        this.geometry = new THREE.BoxGeometry(1,1,1);
        this.material = new THREE.MeshBasicMaterial({
            color:0x000000,
            wireframe: true
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = this.id;
        this.mesh.quaternion.fromArray(data.rotation);
        this.mesh.position.copy(data.position);
    }
    attach(target){
        target.add(this.mesh);
    }
    detach(target){
        target.remove(this.mesh);
    }
}

export { PlayerModel }