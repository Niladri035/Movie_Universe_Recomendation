export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  varying vec2 vUv;

  // Cinematic Dark Nebula Shader
  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y;

    vec2 mouse = uMouse / uResolution;
    
    // Parallax & Time
    float t = uTime * 0.2;
    
    vec3 color = vec3(0.02, 0.02, 0.03); // Deep space background

    // Center glow (follows mouse slightly)
    vec2 center = vec2(0.5 * (uResolution.x/uResolution.y), 0.5) + (mouse - 0.5) * 0.1;
    float dist = length(st - center);
    
    // Abstract cinematic nebula colors (deep reds and dark blues)
    vec3 redFilm = vec3(0.6, 0.0, 0.1) * smoothstep(1.2, 0.0, dist);
    vec3 blueCyber = vec3(0.0, 0.1, 0.3) * smoothstep(1.5, 0.2, length(st - vec2(0.2, 0.8)));
    
    // Add noise/stars effect
    float noise = fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    
    color += redFilm * 0.4 + blueCyber * 0.5 + (noise * 0.02);

    gl_FragColor = vec4(color, 1.0);
  }
`;
