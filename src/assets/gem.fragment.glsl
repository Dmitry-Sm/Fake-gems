precision highp float;
uniform float uTime;
uniform sampler2D uRenderTexture;
uniform sampler2D uBackDistanceMap;
uniform sampler2D uFrontDistanceMap;
uniform sampler2D uNormalMap;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
    vec2 uv = vec2(1. - vUv.y, 1. - vUv.x);
    vec4 r = texture2D(uRenderTexture, uv);

    if (r.a < 0.1) {
        discard;
    }

    vec3 col = r.rgb;
    vec4 b = texture2D(uBackDistanceMap, uv);

    float f = smoothstep(0.2, 1., sin(uTime));
    col = mix(col, b.rgb * uColor, f);

    gl_FragColor.rgb = col;
    gl_FragColor.a = r.a;
}