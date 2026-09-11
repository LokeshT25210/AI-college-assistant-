import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeDTelemetryOrb: 3D Administrative Operations & Telemetry Globe
 * Lightweight 60 FPS WebGL sphere with wireframe meridians,
 * orbiting departmental nodes (Academics, Exams, Finance, Hostel),
 * and dynamic telemetry rings.
 * Pauses automatically via IntersectionObserver when off-screen.
 */
export default function ThreeDTelemetryOrb({ 
  size = 72, 
  className = '' 
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = size;
    const height = size;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    camera.position.set(0, 0, 3.8);

    // 2. Renderer (Low power, Clamped Pixel Ratio)
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: 'low-power' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xa855f7, 3.0, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x38bdf8, 2.5, 10);
    pointLight2.position.set(-2, -2, 2);
    scene.add(pointLight2);

    // 4. Central Telemetry Globe (Wireframe Sphere)
    const globeGeo = new THREE.SphereGeometry(1.0, 16, 12);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globeMesh);

    // Inner Glowing Core
    const innerGeo = new THREE.IcosahedronGeometry(0.55, 1);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x4f46e5,
      emissive: 0x312e81,
      specular: 0xc084fc,
      shininess: 80,
      flatShading: true
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // 5. Equatorial SLA Ring
    const ring1Geo = new THREE.TorusGeometry(1.4, 0.02, 8, 36);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.5;
    scene.add(ring1);

    // Secondary Polar Orbit Ring
    const ring2Geo = new THREE.TorusGeometry(1.5, 0.018, 8, 36);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.6
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3;
    scene.add(ring2);

    // 6. Departmental Telemetry Satellites
    // - Academics (Cyan), Exams (Emerald), Finance (Amber), Hostel (Purple)
    const satColors = [0x38bdf8, 0x10b981, 0xf59e0b, 0xc084fc];
    const satellites = [];
    const satGeo = new THREE.SphereGeometry(0.09, 8, 8);

    satColors.forEach((col, idx) => {
      const satMat = new THREE.MeshBasicMaterial({ color: col });
      const sat = new THREE.Mesh(satGeo, satMat);
      sat.userData = {
        angle: (idx / satColors.length) * Math.PI * 2,
        speed: 0.025 + idx * 0.006,
        radius: 1.45,
        elevation: (idx - 1.5) * 0.35
      };
      scene.add(sat);
      satellites.push({ mesh: sat, mat: satMat });
    });

    // 7. Visibility Tracking (Stop RAF loop when off-screen)
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

    // 8. Interactive Hover & Animation Loop
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
      const speed = isHovered ? 2.4 : 1.0;

      // Globe continuous rotation
      globeMesh.rotation.y += 0.008 * speed;
      globeMesh.rotation.x = Math.sin(elapsed * 0.5) * 0.1;

      // Inner core counter rotation
      innerMesh.rotation.y -= 0.015 * speed;
      innerMesh.rotation.z += 0.01 * speed;
      const corePulse = 1.0 + Math.sin(elapsed * 3) * 0.05;
      innerMesh.scale.set(corePulse, corePulse, corePulse);

      // Rings rotation
      ring1.rotation.z += 0.012 * speed;
      ring2.rotation.z -= 0.01 * speed;

      // Orbiting satellites
      satellites.forEach(({ mesh }) => {
        mesh.userData.angle += mesh.userData.speed * speed;
        mesh.position.x = Math.cos(mesh.userData.angle) * mesh.userData.radius;
        mesh.position.z = Math.sin(mesh.userData.angle) * mesh.userData.radius;
        mesh.position.y = Math.sin(mesh.userData.angle * 2) * 0.35 + mesh.userData.elevation;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(reqId);
      if (observer) observer.disconnect();
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);

      globeGeo.dispose();
      globeMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      satGeo.dispose();
      satellites.forEach(s => s.mat.dispose());
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
      title="3D Autonomous Operations & Telemetry Globe"
    />
  );
}
