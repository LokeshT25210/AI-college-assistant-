import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeDAssistantCore: 3D Holographic AI Neural Core
 * Ultra-fast, lightweight 60 FPS WebGL core with pulsating nucleus,
 * wireframe orbital cage, and responsive neural particles.
 * Pauses automatically via IntersectionObserver when off-screen.
 */
export default function ThreeDAssistantCore({ 
  size = 54, 
  isThinking = false, 
  glowColor = '#38bdf8', 
  className = '' 
}) {
  const mountRef = useRef(null);
  const thinkingRef = useRef(isThinking);

  useEffect(() => {
    thinkingRef.current = isThinking;
  }, [isThinking]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = size;
    const height = size;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    camera.position.set(0, 0, 3.4);

    // 2. Renderer (Low-power, Clamped Pixel Ratio)
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: 'low-power' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // 3. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 3.0, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const accentLight = new THREE.PointLight(0xa855f7, 2.5, 10);
    accentLight.position.set(-2, -2, 2);
    scene.add(accentLight);

    // 4. Central Pulsating AI Nucleus
    const nucleusGeo = new THREE.OctahedronGeometry(0.7, 0);
    const nucleusMat = new THREE.MeshPhongMaterial({
      color: 0x2563eb,
      emissive: 0x1e3a8a,
      specular: 0x93c5fd,
      shininess: 100,
      flatShading: true
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    scene.add(nucleusMesh);

    // 5. Outer Geodesic Holographic Wireframe Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.25, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    scene.add(cageMesh);

    // 6. Orbiting Equatorial Ring
    const ringGeo = new THREE.TorusGeometry(1.4, 0.025, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.7
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // 7. Orbiting Quantum Nodes
    const nodes = [];
    const nodeGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x34d399 }); // Emerald node
    const nodeMat2 = new THREE.MeshBasicMaterial({ color: 0xf59e0b }); // Gold node

    const node1 = new THREE.Mesh(nodeGeo, nodeMat);
    const node2 = new THREE.Mesh(nodeGeo, nodeMat2);
    scene.add(node1);
    scene.add(node2);
    nodes.push(node1, node2);

    // 8. Visibility Tracking (0% CPU when not in viewport)
    let isVisible = true;
    let observer;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.1 });
      observer.observe(container);
    }

    // 9. Interactive Hover & Animation Loop
    let isHovered = false;
    const onEnter = () => { isHovered = true; };
    const onLeave = () => { isHovered = false; };
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    let reqId;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();
      const thinking = thinkingRef.current;
      const speedMultiplier = thinking ? 3.2 : (isHovered ? 2.0 : 1.0);

      // Core rotation
      nucleusMesh.rotation.y += 0.02 * speedMultiplier;
      nucleusMesh.rotation.x += 0.01 * speedMultiplier;

      // Dynamic breathing pulse
      const pulseFreq = thinking ? 8.0 : 2.5;
      const pulseAmp = thinking ? 0.14 : 0.06;
      const scale = 1.0 + Math.sin(elapsed * pulseFreq) * pulseAmp;
      nucleusMesh.scale.set(scale, scale, scale);

      // Outer wireframe counter-rotation
      cageMesh.rotation.y -= 0.012 * speedMultiplier;
      cageMesh.rotation.z += 0.008 * speedMultiplier;

      // Orbiting ring wobble
      ringMesh.rotation.z += 0.015 * speedMultiplier;
      ringMesh.rotation.y = Math.sin(elapsed * speedMultiplier) * 0.25;

      // Orbiting node positions
      const orbitSpeed = elapsed * 2.2 * speedMultiplier;
      node1.position.x = Math.cos(orbitSpeed) * 1.4;
      node1.position.z = Math.sin(orbitSpeed) * 1.4;
      node1.position.y = Math.sin(orbitSpeed * 2) * 0.4;

      const orbitSpeed2 = orbitSpeed + Math.PI;
      node2.position.x = Math.cos(orbitSpeed2) * 1.4;
      node2.position.z = Math.sin(orbitSpeed2) * 1.4;
      node2.position.y = -Math.sin(orbitSpeed * 2) * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(reqId);
      if (observer) observer.disconnect();
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);

      nucleusGeo.dispose();
      nucleusMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      nodeMat2.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size]);

  return (
    <div 
      ref={mountRef} 
      style={{ width: size, height: size }} 
      className={`inline-block shrink-0 cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 ${className}`}
      title={isThinking ? "AI Core Processing Request..." : "3D AI Holographic Neural Core"}
    />
  );
}
