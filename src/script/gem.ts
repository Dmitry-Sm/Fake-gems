import { Geometry, Mesh, OGLRenderingContext, Program, Texture, Transform, Vec3 } from "ogl-typescript";
import { Engine } from './engine';
import renderTexture from '../assets/1-r.png';
import backDistMapTexture from '../assets/1-bd.png';
import frontDistMapTexture from '../assets/1-fd.png';
import normalMapTexture from '../assets/1-n.png';
import fragment from '../assets/gem.fragment.glsl';
import vertex from '../assets/gem.vertex.glsl';
import Assets from './assets';

export default class Gem {

    engine: Engine
    mesh: Mesh
    container: Transform
    time: number
    id: number
    static program: Program
    static geometry: Geometry

    constructor(engine: Engine) {
        
        this.engine = engine
        this.container = new Transform()
        this.time = Math.random() * 100
        this.id = Math.random()
    }

    async create() {

        const geometry = Gem.getGeometry(this.engine.gl)
        const program = await this.getProgram(this.engine.gl)

        this.mesh = new Mesh(this.engine.gl, { mode: this.engine.gl.TRIANGLES, geometry, program });
        this.container.addChild(this.mesh);
        // this.mesh.rotation.z = Math.random() * Math.PI * 2
        // this.mesh.scale.set(Math.random() * 0.5 + 0.5)
        this.mesh.scale.set(3)

        this.update();
    }

    private async getProgram(gl: OGLRenderingContext): Promise<Program> {

        // if (Gem.program === undefined) {
            // Gem.program = 
        // }

        return new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uRenderTexture: { value: await Assets.getTexture(gl, renderTexture) },
                uBackDistanceMap: { value: await Assets.getTexture(gl, backDistMapTexture) },
                uFrontDistanceMap: { value: await Assets.getTexture(gl, frontDistMapTexture) },
                uColor: { value: new Vec3(Math.random(), Math.random(), Math.random()) },
                uNormalMap: { value: await Assets.getTexture(gl, normalMapTexture) },
                uPosition: { value: new Vec3(0) },
                uLightPosition: { value: new Vec3(0, 0, 0) }
            },
            transparent: true
        });
    }

    private static getGeometry(gl: OGLRenderingContext) {

        if (Gem.geometry === undefined) {
            Gem.geometry = new Geometry(gl, {
                position: { size: 3, data: new Float32Array([-0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, 0.5, 0, 0.5, -0.5, 0]) },
                uv: { size: 2, data: new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]) },
                index: { data: new Uint16Array([0, 1, 2, 1, 3, 2]) },
            });
        }

        return Gem.geometry;
    }

    update() {
        this.mesh.program.uniforms.uTime.value = this.time;
        this.mesh.program.uniforms.uPosition.value = this.container.position
        this.time += 0.01;
    }
}