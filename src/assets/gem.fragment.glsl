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

// cosine based palette, 4 vec3 params
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b * cos(6.28318 * (c * t + d));
}

vec3 rainbow(float t) {
    return palette(t, vec3(0.5), vec3(0.5), vec3(1), vec3(0.0, 0.33, 0.67));
}

void main() {
    vec2 uv = vec2(1. - vUv.y, 1. - vUv.x);
    vec4 r = texture2D(uRenderTexture, uv);

    if (r.a < 0.1) {
        discard;
    }

    vec3 n = texture2D(uNormalMap, uv).rgb;

    vec3 pos = uPosition + vec3(uv.x - 0.5, uv.y - 0.5, 0.) * 2.;
    float li = dot(n, uLightPosition - pos);
    li *= smoothstep(4., 0., length(uLightPosition - pos));
    li = smoothstep(0.6, 0.9, li);
    
    vec3 col = vec3(0);
    col = vec3(li) * 0.4;
    float bt = texture2D(uBackDistanceMap, uv).r - uPosition.z;
    float ft = texture2D(uFrontDistanceMap, uv).r - uPosition.z;

    vec2 waveWidth = vec2(0.6, 0.6);
    float t = 0.5;
    float ff = ft;
    float bf = ft;
    ft = fract(ft * 4. - uTime * 0.4);
    bt = fract(bt * 4. - uTime * 0.4);
    float bb = smoothstep(t - waveWidth.y, t, bt) - smoothstep(t, t + waveWidth.x, bt);
    float fb = smoothstep(t - waveWidth.y, t, ft) - smoothstep(t, t + waveWidth.x, ft);
    vec3 c1 = rainbow(bf * 2. - uTime * 0.1) * 0.05 * bb;
    vec3 c2 = rainbow(ff * 2. - uTime * 0.1) * fb;
    vec3 c3 = mix(c1, c2, max(li, r.r));
    col = max(col, c3);

    gl_FragColor.rgb = col;
    gl_FragColor.a = r.a;
}