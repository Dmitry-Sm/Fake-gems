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

        const num = 2000
        const rows = 32
        this.lightPosition = new Vec3(0)

        for (let i = 0; i < num; i++) {    
            const gem = new Gem(this.engine);
            await gem.create();
            this.gems.push(gem);
            gem.container.position.set(
                (i % rows - (rows - 1) / 2) * 1., 
                0, 
                -Math.floor(i / rows) * 2 + 4)
            const gemsContainer = new Transform()
            this.engine.scene.addChild(gemsContainer)
            gemsContainer.addChild(gem.container)
        }

        this.update();
    }

    private update() {
        requestAnimationFrame(() => { this.update() });
        this.lightPosition.set(
            Math.sin(this.time) * 12, 
            Math.cos(this.time * 0.85) * 0 + 6,
            Math.sin(this.time * 0.15) * 20 - 20
        )

        this.gems.forEach(gem => {
            gem.update();
            gem.mesh.program.uniforms.uLightPosition.value = this.lightPosition
            gem.container.position.y = this.getY(gem.container.position);
        });

        this.time += 0.01;
    }

    private getY(pos: Vec3): number {

        return Math.pow(
            Math.sin(pos.x / 2 + pos.z) -
            Math.sin(-this.time * 1. + pos.z / 4), 10.) * 0.01 - 3;
    }
}