import { Geometry, Mesh, Program, Texture, Transform, Vec3 } from "ogl-typescript";
import { Engine } from "./engine";
import renderTexture from '../assets/1-r.png';
import backDistMapTexture from '../assets/1-bd.png';
import frontDistMapTexture from '../assets/1-fd.png';
import normalMapTexture from '../assets/1-n.png';
import fragment from '../assets/gem.fragment.glsl';
import vertex from '../assets/gem.vertex.glsl';

export default class Gem {

    engine: Engine
    mesh: Mesh
    container: Transform
    time: number
    id: number

    constructor(engine: Engine) {
        
        this.engine = engine
        this.container = new Transform()
        this.time = Math.random() * 100
        this.id = Math.random()

        const geometry = new Geometry(this.engine.gl, {
            position: { size: 3, data: new Float32Array([-0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, 0.5, 0, 0.5, -0.5, 0]) },
            uv: { size: 2, data: new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]) },
            index: { data: new Uint16Array([0, 1, 2, 1, 3, 2]) },
        });

        const program = new Program(this.engine.gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uRenderTexture: { value: this.loadTexture(renderTexture) },
                uBackDistanceMap: { value: this.loadTexture(backDistMapTexture) },
                uFrontDistanceMap: { value: this.loadTexture(frontDistMapTexture) },
                uColor: { value: new Vec3(Math.random(), Math.random(), Math.random()) },
                uNormalMap: { value: this.loadTexture(normalMapTexture) },
            },
            transparent: true
        });

        this.mesh = new Mesh(this.engine.gl, { mode: this.engine.gl.TRIANGLES, geometry, program });
        this.container.addChild(this.mesh);
        this.mesh.rotation.z = Math.random() * Math.PI * 2
        this.mesh.scale.set(Math.random() * 0.5 + 0.5)

        this.update();
    }

    private loadTexture(src: string): Texture {
        const texture = new Texture(this.engine.gl);
        const img = new Image();
        img.src = src;
        img.onload = () => (texture.image = img);

        return texture;
    }

    private update() {
        requestAnimationFrame(() => { this.update() });

        this.mesh.program.uniforms.uTime.value = this.time;
        this.time += 0.01;
    }
}