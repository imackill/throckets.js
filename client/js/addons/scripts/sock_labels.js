import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

class SockAssigner{
    constructor(){
        this.labels = {};
    }
    assign(scene){
        let label_targets = [...scene.children];
        label_targets = label_targets.filter(elem => !(elem.name.slice(0,2) == "C_"));
        label_targets.forEach(player => {
            if(!(this.hasLabel(player))){ //no label—create new
                let display_name = player.nickname || player.name
                let label_parts = {
                    geometry: null,
                    material: null,
                }
                const loader = new FontLoader();
                loader.load('fonts/Minecraft.typeface.json', (font) => {
                    label_parts.geometry = new TextGeometry(display_name, {
                        font: font,
                        size: 0.1,
                        depth: 0.01,
                        curveSegments: 12,
                        bevelEnabled: false,
                    });
                    label_parts.material = new THREE.MeshBasicMaterial({color: 0x000000});
                    let label_mesh = new THREE.Mesh(label_parts.geometry, label_parts.material);
                    label_mesh.name = `L_${display_name}`;
                    label_mesh.position.set(-1.5,1,0);
                    this.labels[label_mesh.name] = label_mesh;
                    player.add(label_mesh);
                });
            }
        });
    }
    hasLabel(player){
        return (Object.keys(this.labels).includes(player.name));
    }
    removeLabel(player){
        delete this.labels[`L_${player.name}`];
    }
}

export {SockAssigner};