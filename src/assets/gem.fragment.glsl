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
    li *= smoothstep(3., 0., length(uLightPosition - pos));
    li = smoothstep(0., 1., li);
    
    vec3 col = vec3(0);
    col = r.rgb * li * 1.;
    // col += (vec3(li) * 0.05);
    // col += r.rgb * 0.1;
    float bt = texture2D(uBackDistanceMap, uv).r - uPosition.z;
    float ft = texture2D(uFrontDistanceMap, uv).r - uPosition.z;
    // float ft = 1. - bt;

    // float f = smoothstep(0.2, 1., sin(uTime));
    vec2 waveWidth = vec2(0.4, 0.4);
    float t = fract(uTime * 0.2) * (1. + waveWidth.x + waveWidth.y) - waveWidth.x;
    t = fract(uTime);
    t = 0.5;
    // bt = fract(bt * 4.);
    float ff = ft;
    float bf = ft;
    ft = fract(ft * 4. - uTime * 0.4);
    bt = fract(bt * 4. - uTime * 0.4);
    // t = fract(uTime * 0.5);
    // t = fract(t * 4.) / 4. + floor(t / 4.);
    // float t = fract(uTime * 0.2) * 2. - 0.;
    // float t = fract(uTime * 1.) * 1. + 0.5;
    // float t = fract(uTime);
    float bb = smoothstep(t - waveWidth.y, t, bt) - smoothstep(t, t + waveWidth.x, bt);
    float fb = smoothstep(t - waveWidth.y, t, ft) - smoothstep(t, t + waveWidth.x, ft);
    // vec3 rb = rainbow(bb);
    // vec3 c1 = mix(col, rb, bb) * 0.2;
    // vec3 c2 = mix(col, rb, fb) * 0.2;
    vec3 c1 = rainbow(bf * 2.) * 0.5 * bb;
    vec3 c2 = rainbow(ff * 2.) * fb;
    vec3 c3 = mix(c1, c2, 0.5);\
    // c3 = vec3(ft);
    // col = max(c3 * r.a, col);
    col = c3 * (0.1 + col.r);
    // col = mix(col, r.rgb * uColor, bb * 0.5);
    // col = mix(col, r.rgb, fb);

    gl_FragColor.rgb = col;
    gl_FragColor.a = r.a;
}