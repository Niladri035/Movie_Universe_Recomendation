import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { Environment, Float, Preload } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import { vertexShader, fragmentShader } from './shaders/BackgroundShader';

// Error Boundary for the 3D Scene
class SceneErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="hero-3d-error">Visualizer paused. Check internet connection.</div>;
    return this.props.children;
  }
}

const CustomBackground = () => {
  const shaderRef = React.useRef();
  const { size, viewport } = useThree();

  const uniforms = React.useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0, 0) }
    }),
    [size]
  );

  useFrame((state) => {
    if (shaderRef.current && shaderRef.current.uniforms) {
      // Handle both Clock (elapsedTime) and Timer (using the internal delta/elapsed update)
      // R3F's state.clock is already updated in the loop
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime || (state.clock.getElapsed ? state.clock.getElapsed() : 0);
      
      const mouseX = (state.pointer.x * 0.5 + 0.5) * size.width;
      const mouseY = (state.pointer.y * 0.5 + 0.5) * size.height;
      
      if (shaderRef.current.uniforms.uMouse) {
        shaderRef.current.uniforms.uMouse.value.x += (mouseX - shaderRef.current.uniforms.uMouse.value.x) * 0.05;
        shaderRef.current.uniforms.uMouse.value.y += (mouseY - shaderRef.current.uniforms.uMouse.value.y) * 0.05;
      }
    }
  });

  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        transparent={true}
      />
    </mesh>
  );
};

const Starfield = ({ count = 2000 }) => {
  const points = React.useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return p;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#ffffff" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
};

const MouseLight = () => {
  const lightRef = React.useRef();
  const { viewport } = useThree();

  useFrame((state) => {
    if (lightRef.current) {
      const x = (state.pointer.x * viewport.width) / 2;
      const y = (state.pointer.y * viewport.height) / 2;
      lightRef.current.position.x += (x - lightRef.current.position.x) * 0.1;
      lightRef.current.position.y += (y - lightRef.current.position.y) * 0.1;
    }
  });

  return <pointLight ref={lightRef} intensity={2.5} color="#00f0ff" distance={15} decay={2} />;
};

const MoviePoster = ({ movie, position, rotation, scale, index }) => {
  const meshRef = React.useRef();
  const groupRef = React.useRef();
  const [hovered, setHovered] = React.useState(false);
  
  const posterUrl = `${import.meta.env.VITE_TMDB_IMAGE_BASE}/w500${movie.poster_path}?v=1`;
  
  const texture = useLoader(THREE.TextureLoader, posterUrl, (loader) => {
    loader.setCrossOrigin('anonymous');
  });
  
  const { viewport } = useThree();

  useGSAP(() => {
    if (groupRef.current) {
      gsap.from(groupRef.current.position, {
        y: -5,
        z: -10,
        opacity: 0,
        duration: 1.8,
        ease: "expo.out",
        delay: index * 0.15
      });
      gsap.from(groupRef.current.rotation, {
        x: Math.PI / 4,
        y: Math.PI / 4,
        duration: 2,
        ease: "power4.out",
        delay: index * 0.15
      });
    }
  });

  useFrame((state) => {
    if (groupRef.current) {
      const mouseX = (state.pointer.x * viewport.width) / 8;
      const mouseY = (state.pointer.y * viewport.height) / 8;
      
      const targetX = position[0] + (hovered ? mouseX * 1.5 : mouseX);
      const targetY = position[1] + (hovered ? mouseY * 1.5 : mouseY);
      
      groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.08;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.08;
      
      const targetRotationX = rotation[0] - state.pointer.y * (hovered ? 0.3 : 0.1);
      const targetRotationY = rotation[1] + state.pointer.x * (hovered ? 0.3 : 0.1);
      
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
      
      const targetScale = scale * (hovered ? 1.1 : 1);
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation} 
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Float speed={hovered ? 4 : 2} rotationIntensity={0.4} floatIntensity={1.2}>
        <mesh ref={meshRef}>
          <planeGeometry args={[2, 3]} />
          <meshPhysicalMaterial 
            map={texture} 
            roughness={0} 
            metalness={0.6}
            clearcoat={1}
            clearcoatRoughness={0}
            emissive={hovered ? new THREE.Color("#111") : new THREE.Color("#000")}
            reflectivity={1}
          />
        </mesh>
      </Float>
    </group>
  );
};

const HeroCamera = () => {
  useFrame((state) => {
    state.camera.position.x += (state.pointer.x * 0.5 - state.camera.position.x) * 0.05;
    state.camera.position.y += (state.pointer.y * 0.5 - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

const Hero3D = ({ movies = [] }) => {
  const timer = React.useMemo(() => new THREE.Timer(), []);
  
  if (!movies || movies.length === 0) return <div className="hero-loading">Scanning Galaxy...</div>;

  const posterPositions = [
    { pos: [0, 0, 2.5], rot: [0, 0, 0], scale: 1.3 },
    { pos: [-3.8, 0.4, 0.5], rot: [0, 0.5, 0], scale: 0.95 },
    { pos: [3.8, 0.4, 0.5], rot: [0, -0.5, 0], scale: 0.95 },
    { pos: [-7, -0.6, -1.5], rot: [0, 0.7, 0], scale: 0.75 },
    { pos: [7, -0.6, -1.5], rot: [0, -0.7, 0], scale: 0.75 },
  ];

  const topMovies = movies.slice(0, 5);

  const handleExplore = () => {
    const element = document.getElementById('movie-content');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hero-3d-container">
      <SceneErrorBoundary>
        <Canvas 
          clock={timer}
          camera={{ position: [0, 0, 6], fov: 60 }} 
          dpr={[1, 2]} 
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color('#050505'));
          }}
        >
          <CustomBackground />
          <Starfield />
          <ambientLight intensity={0.4} />
          <MouseLight />
          <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-10, 5, 0]} intensity={1.5} color="#e50914" />
          <HeroCamera />
          
          {topMovies.map((movie, index) => (
            <React.Suspense fallback={null} key={movie.id || index}>
              <MoviePoster 
                movie={movie} 
                position={posterPositions[index].pos}
                rotation={posterPositions[index].rot}
                scale={posterPositions[index].scale}
                index={index}
              />
            </React.Suspense>
          ))}
          
          <Environment preset="night" />
          <Preload all />
        </Canvas>
      </SceneErrorBoundary>

      <div className="hero-overlay-content">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="premium-badge"
          style={{ 
            background: 'var(--accent-primary)', 
            padding: '4px 12px', 
            borderRadius: '4px', 
            fontSize: '0.8rem', 
            fontWeight: '700', 
            letterSpacing: '2px',
            marginBottom: '15px',
            display: 'inline-block'
          }}
        >
          PREMIUM SPOTLIGHT
        </motion.div>
        
        <motion.h1 
          className="heading-xl hero-title text-gradient"
          initial="hidden"
          animate="visible"
        >
          {(topMovies[0]?.title || "Discover The Universe").split("").map((char, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
              }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.03, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'inline-block' }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {topMovies[0]?.overview ? `${topMovies[0].overview.substring(0, 150)}...` : "Experience the future of cinema in immersive 3D"}
        </motion.p>
        
        <motion.button 
          className="btn-primary hero-btn" 
          onClick={handleExplore}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          Explore Now
        </motion.button>
      </div>
    </div>
  );
};

export default Hero3D;
