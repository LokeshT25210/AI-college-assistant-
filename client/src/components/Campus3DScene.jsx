import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Sparkles, 
  RotateCw, 
  Eye, 
  Layers, 
  Maximize2, 
  Compass, 
  Radio,
  Zap,
  GraduationCap
} from 'lucide-react';

export default function Campus3DScene({ className = '', height = '340px' }) {
  const mountRef = useRef(null);
  const [modelType, setModelType] = useState('cap'); // 'cap', 'ai_core', 'landmark'
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [interactiveMode, setInteractiveMode] = useState('Orbit & Tilt');
  const [fps, setFps] = useState(60);

  // References to communicate with animation loop
  const sceneContextRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    rootGroup: null,
    modelGroups: {},
    particles: null,
    materials: [],
    geometries: [],
    targetRotX: 0,
    targetRotY: 0,
    currRotX: 0,
    currRotY: 0,
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    zoom: 5.5,
    autoRotate: true,
    wireframe: false,
    activeModel: 'cap',
    tasselAngle: 0
  });

  // Sync state into ref for 60fps loop
  useEffect(() => {
    sceneContextRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    sceneContextRef.current.wireframe = wireframe;
    sceneContextRef.current.materials.forEach(mat => {
      if (mat && 'wireframe' in mat && !mat.userData?.keepSolid) {
        mat.wireframe = wireframe;
      }
    });
  }, [wireframe]);

  useEffect(() => {
    sceneContextRef.current.activeModel = modelType;
    const { modelGroups } = sceneContextRef.current;
    if (modelGroups) {
      Object.entries(modelGroups).forEach(([key, grp]) => {
        if (grp) {
          grp.visible = (key === modelType);
        }
      });
    }
  }, [modelType]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const heightPx = container.clientHeight || 340;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneContextRef.current.scene = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(0, 1.2, 5.5);
    sceneContextRef.current.camera = camera;

    // 3. Renderer with antialiasing and alpha (optimized for low-power and fast 60fps)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);
    sceneContextRef.current.renderer = renderer;

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 1.4); // soft cool light
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const blueRimLight = new THREE.PointLight(0x38bdf8, 3.5, 15);
    blueRimLight.position.set(-4, -2, -3);
    scene.add(blueRimLight);

    const goldAccentLight = new THREE.PointLight(0xf59e0b, 3.0, 12);
    goldAccentLight.position.set(3, -2, 2);
    scene.add(goldAccentLight);

    // Track disposables
    const materials = [];
    const geometries = [];
    const registerMat = (mat) => { materials.push(mat); return mat; };
    const registerGeo = (geo) => { geometries.push(geo); return geo; };
    sceneContextRef.current.materials = materials;
    sceneContextRef.current.geometries = geometries;

    // Master Root Group (rotates with mouse)
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    sceneContextRef.current.rootGroup = rootGroup;

    // ----------------------------------------------------
    // MODEL 1: 🎓 3D Graduation Cap, Diploma Scroll & Gyro Rings
    // ----------------------------------------------------
    const capGroup = new THREE.Group();
    rootGroup.add(capGroup);

    // Mortarboard Diamond Top
    const mortarboardGeo = registerGeo(new THREE.BoxGeometry(2.3, 0.08, 2.3));
    const capMat = registerMat(new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // Navy Blue
      metalness: 0.35,
      roughness: 0.45
    }));
    const mortarboard = new THREE.Mesh(mortarboardGeo, capMat);
    mortarboard.position.y = 0.55;
    mortarboard.rotation.y = Math.PI / 4;
    mortarboard.castShadow = true;
    capGroup.add(mortarboard);

    // Beveled Gold Border on Cap
    const borderMat = registerMat(new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2
    }));
    const borderEdgeGeo = registerGeo(new THREE.TorusGeometry(1.6, 0.02, 16, 4));
    const borderEdge = new THREE.Mesh(borderEdgeGeo, borderMat);
    borderEdge.position.y = 0.58;
    borderEdge.rotation.x = Math.PI / 2;
    borderEdge.rotation.z = Math.PI / 4;
    capGroup.add(borderEdge);

    // Skull Cap underneath
    const skullCapGeo = registerGeo(new THREE.CylinderGeometry(0.85, 0.95, 0.65, 32));
    const skullCap = new THREE.Mesh(skullCapGeo, capMat);
    skullCap.position.y = 0.22;
    capGroup.add(skullCap);

    // Cap Golden Center Button
    const buttonGeo = registerGeo(new THREE.CylinderGeometry(0.12, 0.14, 0.08, 24));
    const button = new THREE.Mesh(buttonGeo, borderMat);
    button.position.y = 0.62;
    capGroup.add(button);

    // Golden Tassel Cord & Hanging Drop
    const tasselGroup = new THREE.Group();
    tasselGroup.position.set(0, 0.62, 0);
    capGroup.add(tasselGroup);
    capGroup.userData.tasselGroup = tasselGroup;

    const cordGeo = registerGeo(new THREE.CylinderGeometry(0.02, 0.02, 1.1, 12));
    const cord = new THREE.Mesh(cordGeo, borderMat);
    cord.position.set(0.65, -0.2, 0.65);
    cord.rotation.z = -Math.PI / 4;
    cord.rotation.x = Math.PI / 4;
    tasselGroup.add(cord);

    const tasselDropGeo = registerGeo(new THREE.ConeGeometry(0.1, 0.35, 16));
    const tasselDrop = new THREE.Mesh(tasselDropGeo, borderMat);
    tasselDrop.position.set(1.0, -0.65, 1.0);
    tasselDrop.rotation.x = Math.PI;
    tasselGroup.add(tasselDrop);

    // Academic Diploma Scroll
    const scrollMat = registerMat(new THREE.MeshStandardMaterial({
      color: 0xfef08a, // Soft parchment
      roughness: 0.6,
      metalness: 0.1
    }));
    const scrollGeo = registerGeo(new THREE.CylinderGeometry(0.2, 0.2, 2.2, 24));
    const scroll = new THREE.Mesh(scrollGeo, scrollMat);
    scroll.position.set(0, -0.8, 0);
    scroll.rotation.z = Math.PI / 2.8;
    scroll.rotation.x = Math.PI / 6;
    scroll.castShadow = true;
    capGroup.add(scroll);

    // Red Ribbon on Scroll
    const ribbonMat = registerMat(new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.3,
      metalness: 0.3
    }));
    const ribbonGeo = registerGeo(new THREE.CylinderGeometry(0.22, 0.22, 0.35, 24));
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    scroll.add(ribbon);

    // Holographic Gyroscope Orbit Rings around Cap
    const ringMat1 = registerMat(new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85
    }));
    const ring1Geo = registerGeo(new THREE.TorusGeometry(2.1, 0.025, 16, 90));
    const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    capGroup.add(ring1);
    capGroup.userData.ring1 = ring1;

    const ringMat2 = registerMat(new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.75
    }));
    const ring2Geo = registerGeo(new THREE.TorusGeometry(2.35, 0.02, 16, 90));
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.x = Math.PI / 3;
    capGroup.add(ring2);
    capGroup.userData.ring2 = ring2;

    // ----------------------------------------------------
    // MODEL 2: 🌐 AI Quantum Knowledge Core & Cyber Spheres
    // ----------------------------------------------------
    const aiGroup = new THREE.Group();
    rootGroup.add(aiGroup);
    aiGroup.visible = false;

    // Glowing Inner Crystal
    const coreMat = registerMat(new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      emissive: 0x2563eb,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2
    }));
    const coreGeo = registerGeo(new THREE.OctahedronGeometry(1.0, 1));
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    aiGroup.add(coreMesh);
    aiGroup.userData.coreMesh = coreMesh;

    // Outer Geodesic Icosahedron Wireframe Cage
    const cageMat = registerMat(new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      metalness: 0.5,
      roughness: 0.2
    }));
    cageMat.userData = { keepSolid: false };
    const cageGeo = registerGeo(new THREE.IcosahedronGeometry(1.8, 1));
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    aiGroup.add(cageMesh);
    aiGroup.userData.cageMesh = cageMesh;

    // Satellite Nodes orbiting
    const satelliteCount = 5;
    const satellites = [];
    const satMat = registerMat(new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.5,
      metalness: 0.7
    }));
    for (let i = 0; i < satelliteCount; i++) {
      const satGeo = registerGeo(new THREE.SphereGeometry(0.12, 16, 16));
      const satMesh = new THREE.Mesh(satGeo, satMat);
      const angle = (i / satelliteCount) * Math.PI * 2;
      satMesh.userData = { angle, speed: 0.02 + i * 0.005, radius: 2.2 + (i % 2) * 0.4, yOffset: (i - 2) * 0.35 };
      aiGroup.add(satMesh);
      satellites.push(satMesh);
    }
    aiGroup.userData.satellites = satellites;

    // ----------------------------------------------------
    // MODEL 3: 🏛️ Autonomous Campus Landmark & Clock Gate
    // ----------------------------------------------------
    const landmarkGroup = new THREE.Group();
    rootGroup.add(landmarkGroup);
    landmarkGroup.visible = false;

    const marbleMat = registerMat(new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.2,
      roughness: 0.4
    }));
    const goldTrimMat = registerMat(new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2
    }));

    // Base Steps
    const step1Geo = registerGeo(new THREE.BoxGeometry(3.4, 0.15, 2.0));
    const step1 = new THREE.Mesh(step1Geo, marbleMat);
    step1.position.y = -1.2;
    landmarkGroup.add(step1);

    const step2Geo = registerGeo(new THREE.BoxGeometry(3.0, 0.15, 1.8));
    const step2 = new THREE.Mesh(step2Geo, marbleMat);
    step2.position.y = -1.05;
    landmarkGroup.add(step2);

    // 4 Columns
    const colGeo = registerGeo(new THREE.CylinderGeometry(0.12, 0.14, 1.8, 20));
    const colPositions = [-1.1, -0.37, 0.37, 1.1];
    colPositions.forEach((x) => {
      const col = new THREE.Mesh(colGeo, marbleMat);
      col.position.set(x, -0.05, 0);
      landmarkGroup.add(col);

      // Column golden rings
      const colRingGeo = registerGeo(new THREE.TorusGeometry(0.15, 0.02, 12, 24));
      const colRing = new THREE.Mesh(colRingGeo, goldTrimMat);
      colRing.rotation.x = Math.PI / 2;
      colRing.position.set(x, 0.75, 0);
      landmarkGroup.add(colRing);
    });

    // Architrave & Pediment
    const architraveGeo = registerGeo(new THREE.BoxGeometry(3.1, 0.22, 0.8));
    const architrave = new THREE.Mesh(architraveGeo, marbleMat);
    architrave.position.y = 0.95;
    landmarkGroup.add(architrave);

    // Autonomous Clock Spire in the center
    const towerGeo = registerGeo(new THREE.BoxGeometry(0.9, 0.9, 0.7));
    const tower = new THREE.Mesh(towerGeo, marbleMat);
    tower.position.y = 1.5;
    landmarkGroup.add(tower);

    // Glowing Autonomous Clock Dial
    const clockDialGeo = registerGeo(new THREE.CircleGeometry(0.28, 32));
    const clockDialMat = registerMat(new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8
    }));
    const clockDial = new THREE.Mesh(clockDialGeo, clockDialMat);
    clockDial.position.set(0, 1.5, 0.36);
    landmarkGroup.add(clockDial);

    // Spire Pyramid Roof
    const roofGeo = registerGeo(new THREE.ConeGeometry(0.65, 0.75, 4));
    const roofMat = registerMat(new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      metalness: 0.6,
      roughness: 0.3
    }));
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 2.25;
    roof.rotation.y = Math.PI / 4;
    landmarkGroup.add(roof);

    // Store model groups
    sceneContextRef.current.modelGroups = {
      cap: capGroup,
      ai_core: aiGroup,
      landmark: landmarkGroup
    };

    // ----------------------------------------------------
    // Stardust Particle Constellation in 3D Space
    // ----------------------------------------------------
    const particleCount = 750;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x38bdf8); // Sky Blue
    const color2 = new THREE.Color(0xf59e0b); // Gold
    const color3 = new THREE.Color(0xa855f7); // Purple

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * 12;
      particlePositions[idx + 1] = (Math.random() - 0.5) * 10;
      particlePositions[idx + 2] = (Math.random() - 0.5) * 10;

      const mixedColor = color1.clone().lerp(i % 2 === 0 ? color2 : color3, Math.random());
      particleColors[idx] = mixedColor.r;
      particleColors[idx + 1] = mixedColor.g;
      particleColors[idx + 2] = mixedColor.b;
    }

    const particleGeo = registerGeo(new THREE.BufferGeometry());
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = registerMat(new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    }));

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    sceneContextRef.current.particles = particles;

    // ----------------------------------------------------
    // Interactive Mouse & Touch Listeners
    // ----------------------------------------------------
    const onPointerDown = (e) => {
      sceneContextRef.current.isDragging = true;
      sceneContextRef.current.prevMouseX = e.clientX;
      sceneContextRef.current.prevMouseY = e.clientY;
    };

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (sceneContextRef.current.isDragging) {
        const deltaX = e.clientX - sceneContextRef.current.prevMouseX;
        const deltaY = e.clientY - sceneContextRef.current.prevMouseY;
        sceneContextRef.current.targetRotY += deltaX * 0.01;
        sceneContextRef.current.targetRotX += deltaY * 0.01;
        sceneContextRef.current.prevMouseX = e.clientX;
        sceneContextRef.current.prevMouseY = e.clientY;
      } else {
        // Smooth subtle tilt following cursor
        sceneContextRef.current.targetRotY = normX * 0.5;
        sceneContextRef.current.targetRotX = -normY * 0.35;
      }
    };

    const onPointerUp = () => {
      sceneContextRef.current.isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      sceneContextRef.current.zoom = THREE.MathUtils.clamp(
        sceneContextRef.current.zoom + e.deltaY * 0.003,
        3.5,
        8.0
      );
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Visibility Tracking (Pauses WebGL rendering when off-screen)
    let isVisible = true;
    let observer;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    // ----------------------------------------------------
    // Animation Loop (60 FPS)
    // ----------------------------------------------------
    let reqId;
    let clock = new THREE.Clock();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // FPS Calculation
      frameCount++;
      if (performance.now() - lastFpsUpdate >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastFpsUpdate = performance.now();
      }

      const ctx = sceneContextRef.current;

      // Auto rotation when enabled
      if (ctx.autoRotate && !ctx.isDragging) {
        rootGroup.rotation.y += 0.008;
      }

      // Smooth camera/model interpolation (lerp)
      ctx.currRotX += (ctx.targetRotX - ctx.currRotX) * 0.08;
      ctx.currRotY += (ctx.targetRotY - ctx.currRotY) * 0.08;
      rootGroup.rotation.x = ctx.currRotX;

      if (!ctx.autoRotate) {
        rootGroup.rotation.y = ctx.currRotY;
      }

      camera.position.z += (ctx.zoom - camera.position.z) * 0.1;

      // Dynamic model internal animations
      if (ctx.activeModel === 'cap') {
        if (capGroup.userData.ring1) {
          capGroup.userData.ring1.rotation.z += 0.015;
          capGroup.userData.ring1.rotation.y += 0.01;
        }
        if (capGroup.userData.ring2) {
          capGroup.userData.ring2.rotation.x += 0.012;
          capGroup.userData.ring2.rotation.z -= 0.008;
        }
        if (capGroup.userData.tasselGroup) {
          capGroup.userData.tasselGroup.rotation.y = Math.sin(elapsedTime * 2.5) * 0.15;
        }
      } else if (ctx.activeModel === 'ai_core') {
        if (aiGroup.userData.coreMesh) {
          aiGroup.userData.coreMesh.rotation.y += 0.02;
          aiGroup.userData.coreMesh.rotation.z += 0.01;
          const scale = 1.0 + Math.sin(elapsedTime * 3) * 0.06;
          aiGroup.userData.coreMesh.scale.set(scale, scale, scale);
        }
        if (aiGroup.userData.cageMesh) {
          aiGroup.userData.cageMesh.rotation.x -= 0.01;
          aiGroup.userData.cageMesh.rotation.y -= 0.015;
        }
        if (aiGroup.userData.satellites) {
          aiGroup.userData.satellites.forEach((sat) => {
            sat.userData.angle += sat.userData.speed;
            sat.position.x = Math.cos(sat.userData.angle) * sat.userData.radius;
            sat.position.z = Math.sin(sat.userData.angle) * sat.userData.radius;
            sat.position.y = Math.sin(sat.userData.angle * 2) * 0.6 + sat.userData.yOffset;
          });
        }
      } else if (ctx.activeModel === 'landmark') {
        landmarkGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
      }

      // Rotate particle constellation
      if (particles) {
        particles.rotation.y -= 0.001;
        particles.rotation.x += 0.0005;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ----------------------------------------------------
    // Cleanup on unmount
    // ----------------------------------------------------
    return () => {
      cancelAnimationFrame(reqId);
      if (observer) observer.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);

      geometries.forEach(geo => geo.dispose());
      materials.forEach(mat => mat.dispose());
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-700/60 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl ${className}`}>
      
      {/* 3D WebGL Canvas Container */}
      <div 
        ref={mountRef} 
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Top HUD Overlay: Badges & Model Switcher */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Live Telemetry Pill */}
        <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/60 text-[10px] text-slate-300 font-mono shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-bold">3D WEBGL ENGINE</span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-slate-400">{fps} FPS</span>
        </div>

        {/* Model Switcher Buttons (Pointer events active) */}
        <div className="pointer-events-auto flex items-center p-0.5 bg-slate-900/80 backdrop-blur-md rounded-lg border border-slate-700/60 shadow-sm text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setModelType('cap')}
            className={`px-2 py-1 rounded-md transition-all flex items-center space-x-1 ${
              modelType === 'cap'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Graduation Cap & Crest"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Crest</span>
          </button>

          <button
            type="button"
            onClick={() => setModelType('ai_core')}
            className={`px-2 py-1 rounded-md transition-all flex items-center space-x-1 ${
              modelType === 'ai_core'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="AI Knowledge Core"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Core</span>
          </button>

          <button
            type="button"
            onClick={() => setModelType('landmark')}
            className={`px-2 py-1 rounded-md transition-all flex items-center space-x-1 ${
              modelType === 'landmark'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Autonomous Campus Arch"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Campus</span>
          </button>
        </div>
      </div>

      {/* Bottom HUD Overlay: Controls (Rotate, Wireframe, Reset) */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-slate-400 pointer-events-none">
        <div className="flex items-center space-x-1.5 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-700/60">
          <Compass className="w-3 h-3 text-blue-400" />
          <span className="hidden sm:inline">Drag to Orbit &bull; Scroll to Zoom</span>
          <span className="sm:hidden">Drag 360&deg;</span>
        </div>

        <div className="pointer-events-auto flex items-center space-x-1.5">
          {/* Wireframe Toggle */}
          <button
            type="button"
            onClick={() => setWireframe(!wireframe)}
            className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition-all flex items-center space-x-1 ${
              wireframe
                ? 'bg-blue-600/30 border-blue-400 text-blue-300'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-white'
            }`}
            title="Toggle Holographic Wireframe"
          >
            <Eye className="w-3 h-3" />
            <span>Wireframe</span>
          </button>

          {/* Auto-Rotation Toggle */}
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition-all flex items-center space-x-1 ${
              autoRotate
                ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-white'
            }`}
            title="Toggle Continuous Rotation"
          >
            <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>{autoRotate ? 'Auto' : 'Paused'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
