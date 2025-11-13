// src/logic/webglBackground.ts
export interface WebGLBackgroundOptions {
    canvas: HTMLCanvasElement;
    fpsCap?: number;
    randomColor?: boolean;
}

export function createWebGLBackground({ canvas, fpsCap = 30, randomColor = true }: WebGLBackgroundOptions) {
    let gl: WebGLRenderingContext;
    let program: WebGLProgram;
    let animationId: number;
    let startTime: number;
    let lastFrameTime = 0;
    let frameInterval = 1000 / fpsCap;

    // uniforms
    let u_resolution_loc: WebGLUniformLocation | null = null;
    let u_time_loc: WebGLUniformLocation | null = null;
    let u_speed_loc: WebGLUniformLocation | null = null;
    let u_warp_loc: WebGLUniformLocation | null = null;
    let u_color_loc: WebGLUniformLocation | null = null;
    let u_contrast_loc: WebGLUniformLocation | null = null;

    // params
    let speed = 0.15;
    let warp = 0.30;
    let contrast = 2.5;
    let colorR = 1.0, colorG = 0.0, colorB = 0.0;
    let currentColor = [0, 0, 0];
    let randomTarget = [0, 0, 0];
    let firstColorSet = false;
    const colorTransitionTime = 120; // seconds per transition

    // random color generator
    function randomSafeColor() {
        let r, g, b;
        do {
            const min = 0.15;
            const max = 0.65;
            r = min + Math.random() * (max - min);
            g = min + Math.random() * (max - min);
            b = min + Math.random() * (max - min);
        } while ((r + g > 1.0 && b < 0.3) || (Math.abs(r - g) < 0.15 && b < 0.3));
        return [r, g, b];
    }

    function updateRandomColor(dt: number) {
        if (!firstColorSet) {
            currentColor = randomSafeColor();
            randomTarget = randomSafeColor();
            firstColorSet = true;
        }
        const t = dt / colorTransitionTime;
        for (let i = 0; i < 3; i++) {
            currentColor[i] += (randomTarget[i] - currentColor[i]) * t;
        }
        const dist = Math.sqrt(
            (currentColor[0] - randomTarget[0]) ** 2 +
            (currentColor[1] - randomTarget[1]) ** 2 +
            (currentColor[2] - randomTarget[2]) ** 2
        );
        if (dist < 0.02) randomTarget = randomSafeColor();
    }

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = /* your full shader */ `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_speed;
      uniform float u_warp;
      uniform vec3 u_color;
      uniform float u_contrast;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                            -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                       + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                                dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_resolution.x / u_resolution.y;
        float t = u_time * u_speed;
        vec2 offset1 = vec2(
          snoise(p * 1.2 + vec2(t * 0.4, t * 0.3)),
          snoise(p * 1.2 + vec2(t * 0.3, -t * 0.4))
        );
        vec2 offset2 = vec2(
          snoise(p * 1.5 + vec2(-t * 0.25, t * 0.35)),
          snoise(p * 1.5 + vec2(t * 0.35, t * 0.25))
        );
        vec2 distorted = p + offset1 * u_warp + offset2 * u_warp;
        float noise1 = snoise(distorted * 1.5 + t * 0.1);
        float noise2 = snoise(distorted * 2.0 - t * 0.08);
        float mixAmt = (noise1 * 0.6 + noise2 * 0.4 + 1.0) * 0.5;
        mixAmt = clamp(mixAmt, 0.0, 1.0);
        vec3 base = u_color;
        vec3 color = base * (0.5 + mixAmt * 0.5);
        color *= (0.9 + 0.1 * vec3(
          snoise(distorted * 0.8 + t * 0.2),
          snoise(distorted * 1.1 - t * 0.15),
          snoise(distorted * 0.6 + t * 0.25)
        ));
        float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
        vec3 contrasted = mix(vec3(0.5), color, clamp(u_contrast * (lum / 0.5), 0.0, 2.0));
        vec3 finalColor = clamp(contrasted, 0.0, 1.0);
        float vignette = 1.0 - length(p) * 0.25;
        finalColor *= vignette;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile error');
        return shader;
    }

    function init() {
        const context = canvas.getContext('webgl');
        if (!context) throw new Error('WebGL not supported');
        gl = context;
        const v = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const f = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        program = gl.createProgram()!;
        gl.attachShader(program, v);
        gl.attachShader(program, f);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
            throw new Error(gl.getProgramInfoLog(program) || 'Link error');

        const pos = gl.getAttribLocation(program, 'a_position');
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

        u_resolution_loc = gl.getUniformLocation(program, 'u_resolution');
        u_time_loc = gl.getUniformLocation(program, 'u_time');
        u_speed_loc = gl.getUniformLocation(program, 'u_speed');
        u_warp_loc = gl.getUniformLocation(program, 'u_warp');
        u_color_loc = gl.getUniformLocation(program, 'u_color');
        u_contrast_loc = gl.getUniformLocation(program, 'u_contrast');

        startTime = Date.now();
        requestAnimationFrame(render);
    }

    function render(currentTime: number) {
        if (!gl || !program) return;
        if (currentTime - lastFrameTime < frameInterval) {
            animationId = requestAnimationFrame(render);
            return;
        }
        const dt = (currentTime - lastFrameTime) / 1000;
        lastFrameTime = currentTime;
        if (randomColor) updateRandomColor(dt);

        const width = (canvas.width = window.innerWidth);
        const height = (canvas.height = window.innerHeight);
        gl.viewport(0, 0, width, height);
        gl.useProgram(program);
        gl.uniform2f(u_resolution_loc!, width, height);
        gl.uniform1f(u_time_loc!, (Date.now() - startTime) / 1000);
        gl.uniform1f(u_speed_loc!, speed);
        gl.uniform1f(u_warp_loc!, warp);
        const [r, g, b] = randomColor ? currentColor : [colorR, colorG, colorB];
        gl.uniform3f(u_color_loc!, r, g, b);
        gl.uniform1f(u_contrast_loc!, contrast);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        animationId = requestAnimationFrame(render);
    }

    function destroy() {
        if (animationId) cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
    }

    function handleResize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', handleResize);

    return { init, destroy, setFPSCap(fps: number) { fpsCap = fps; frameInterval = 1000 / fps; } };
}
