import { Transform, Vec3 } from 'ogl-typescript';
import { Engine } from './engine';
import Gem from './gem';

export class Game {
    engine: Engine;
    gems: Array<Gem>;
    time: number;
    lightPosition: Vec3

    constructor(engine: Engine) {
        this.engine = engine;
        this.gems = []
        this.time = 0
    }

    async start() {

        const num = 1
        this.lightPosition = new Vec3(0)

        const gem = new Gem(this.engine);
        await gem.create();
        this.gems.push(gem);
        this.engine.scene.addChild(gem.container);

        this.update();
    }

    private update() {
        requestAnimationFrame(() => { this.update() });
        this.lightPosition.set(
            Math.sin(this.time) * 0.5, 
            Math.cos(this.time * 0.85) * 1 - 0,
            Math.sin(this.time * 0.15) * 0. + 1.2
        )

        this.gems.forEach(gem => {
            gem.update();
            gem.mesh.program.uniforms.uLightPosition.value = this.lightPosition
        //     gem.container.position.y = this.getY(gem.container.position);
        });

        this.time += 0.02;
    }

    private getY(pos: Vec3): number {

        return Math.pow(
            Math.sin(pos.x / 2 + pos.z) -
            Math.sin(-this.time * 1. + pos.z / 4), 10.) * 0.01 - 3;
    }
}