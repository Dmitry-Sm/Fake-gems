import { Geometry, Mesh, Program, Texture } from 'ogl-typescript';
import { Engine } from './engine';
import { Game } from './game';
import txt from '../assets/1-r.png'
import fragment from '../assets/gem.fragment.glsl'
import vertex from '../assets/gem.vertex.glsl' 

const engine = new Engine();
const game = new Game(engine);

const gl = engine.gl
const scene = engine.scene

const texture = new Texture(engine.gl);
const img = new Image();
img.src = txt;
img.onload = () => (texture.image = img);

const geometry = new Geometry(gl, {
    position: { size: 3, data: new Float32Array([-0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, 0.5, 0, 0.5, -0.5, 0]) },
    uv: { size: 2, data: new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]) },
    index: { data: new Uint16Array([0, 1, 2, 1, 3, 2]) },
});

const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture }
    },
    transparent: true
});

const rect = new Mesh(gl, { mode: gl.TRIANGLES, geometry, program });
rect.setParent(scene);
rect.scale.set(4, 4);