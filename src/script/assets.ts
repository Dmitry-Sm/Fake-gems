import { OGLRenderingContext, Texture } from 'ogl-typescript';

export default class Assets {
    
    private static loadedTextures: Map<string, Texture> = new Map()

    static async getTexture(gl: OGLRenderingContext, src: string): Promise<Texture> {
        
        if (!this.loadedTextures.has(src)) {            
            this.loadedTextures.set(src, await this.loadTexture(gl, src));
        }

        return this.loadedTextures.get(src);
    }

    private static async loadTexture(gl: OGLRenderingContext, src: string): Promise<Texture> {
        const texture = new Texture(gl);
        const img = new Image();
        img.src = src;
        await new Promise((resolve) => {
            img.onload = () => {
                texture.image = img;
                resolve(true);
            }
        })

        return texture;
    }
}