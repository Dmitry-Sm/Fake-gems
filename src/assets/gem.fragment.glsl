precision highp float;
uniform float uTime;
uniform sampler2D uRenderTexture;
uniform sampler2D uBackDistanceMap;
uniform sampler2D uFrontDistanceMap;
uniform sampler2D uNormalMap;
uniform vec3 uColor;
uniform vec3 uPosition;
uniform vec3 uLightPosition;
varying vec2 vUv;

void main() {
    vec2 uv = vec2(1. - vUv.y, 1. - vUv.x);
    vec4 r = texture2D(uRenderTexture, uv);

    if (r.a < 0.1) {
        discard;
    }

    vec3 n = texture2D(uNormalMap, uv).rgb;

    float li = dot(n, uLightPosition - uPosition);
    li *= smoothstep(15., 0., length(uLightPosition - uPosition));
    li = smoothstep(0., 1., li);
    
    vec3 col = r.rgb * li * 0.9 + (vec3(li) * 0.05) + r.rgb * 0.1;
    float bt = texture2D(uBackDistanceMap, uv).r - uPosition.z;
    float ft = texture2D(uFrontDistanceMap, uv).r - uPosition.z;

    // float f = smoothstep(0.2, 1., sin(uTime));
    float t = fract(uTime * 0.05) * 80. - 8.;
    float bb = smoothstep(t - 0.4, t, bt) - smoothstep(t, t + 2.2, bt);
    float fb = smoothstep(t - 0.4, t, ft) - smoothstep(t, t + 2.2, ft);
    vec3 c1 = mix(col, uColor, bb) * 0.4;
    vec3 c2 = mix(col, uColor, fb);
    vec3 c3 = max(c1, c2);
    col = max(c3, col);

    gl_FragColor.rgb = col;
    gl_FragColor.a = r.a;
}