precision highp float;
uniform float uTime;
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
    vec4 t = texture2D(uTexture, vUv);

    if (t.a < 0.1) {
        discard;
    }

    gl_FragColor.rgb = t.rgb;
    gl_FragColor.a = 1.;
}