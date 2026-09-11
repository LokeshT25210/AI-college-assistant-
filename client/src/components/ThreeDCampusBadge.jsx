import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeDCampusBadge({ size = 44, color = '#3b82f6', className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = size;
    const height = size;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x60a5fa, 2.5, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    // 3. Central 3D Faceted Diamond / Crest
    const coreGeo = new THREE.OctahedronGeometry(0.85, 0);
    const coreMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(0x1e3a8a),
      specular: 0x93c5fd,
      shininess: 90,
      flatShading: true
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Wireframe overlay for tech feel
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xbfdbfe, wireframe: true, transparent: true, opacity: 0.6 });
    const wireMesh = new THREE.Mesh(coreGeo, wireMat);
    scene.add(wireMesh);

    // 4. Orbiting Ring
    const ringGeo = new THREE.TorusGeometry(1.2, 0.035, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // Small orbital satellite
    const satGeo = new THREE.SphereGeometry(0.09, 8, 8);
    const satMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const satMesh = new THREE.Mesh(satGeo, satMat);
    scene.add(satMesh);

    // 5. Visibility Tracking (Only render when visible!)
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

    // 6. Animation Loop
    let reqId;
    let clock = new THREE.Clock();
    let isHovered = false;

    const onEnter = () => { isHovered = true; };
    const onLeave = () => { isHovered = false; };
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();
      const speed = isHovered ? 2.8 : 1.0;

      coreMesh.rotation.y += 0.015 * speed;
      coreMesh.rotation.x += 0.008 * speed;
      wireMesh.rotation.copy(coreMesh.rotation);

      ringMesh.rotation.z += 0.02 * speed;
      ringMesh.rotation.y = Math.sin(elapsed * speed) * 0.2;

      satMesh.position.x = Math.cos(elapsed * 2 * speed) * 1.2;
      satMesh.position.z = Math.sin(elapsed * 2 * speed) * 1.2;
      satMesh.position.y = Math.sin(elapsed * 4 * speed) * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(reqId);
      if (observer) observer.disconnect();
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);

      coreGeo.dispose();
      coreMat.dispose();
      wireMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      satGeo.dispose();
      satMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size, color]);

  return (
    <div 
      ref={mountRef} 
      style={{ width: size, height: size }} 
      className={`inline-block shrink-0 cursor-pointer transition-transform hover:scale-110 active:scale-95 ${className}`}
      title="3D Autonomous Crest"
    />
  );
}
