import { Transform } from 'ogl-typescript';
import { Engine } from './engine';
import Gem from './gem';

export class Game {
    engine: Engine;
    gems: Array<Gem>;
    time: number;

    constructor(engine: Engine) {
        this.engine = engine;
        this.gems = []
        this.time = 0

        for (let i = 0; i < 2000; i++) {    
            const gem = new Gem(engine);
            this.gems.push(gem);
            gem.container.position.set(
                (Math.random() - 0.5) * 20, 
                Math.random() - 2., 
                -Math.random() * 100 + 40)
            const gemsContainer = new Transform()
            engine.scene.addChild(gemsContainer)
            gemsContainer.addChild(gem.container)
        }

        this.update();
    }

    private update() {
        requestAnimationFrame(() => { this.update() });

        this.gems.forEach(gem => {

            if (gem.container.position.z > -50) {
                gem.container.position.z -= 0.01 + gem.id * 0.01
                gem.container.position.y = -gem.container.position.z * 0.2 + gem.id
            }
            else {
                gem.container.position.z = 20 + Math.random() * 10
            }
        });
        this.time += 0.01;
    }
}