import React, { useRef, useEffect } from 'react';

const ThreatGlobe3D = ({ markers = [], isScanning = false }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let rotationAngle = 0;
    
    // Scale for high density screens
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;

    // Standard list of geographic coordinates to draw earth outlines dynamically
    const mockLandmassPoints = [];
    for (let i = 0; i < 400; i++) {
      const lat = (Math.sin(i * 0.1) * 70 * Math.PI) / 180;
      const lon = (i * 1.5 * Math.PI) / 180;
      mockLandmassPoints.push({ lat, lon });
    }

    const drawGlobe = () => {
      ctx.clearRect(0, 0, width, height);

      // Globe Glow Background
      const radialGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.4, centerX, centerY, radius * 1.2);
      radialGlow.addColorStop(0, 'rgba(17, 24, 39, 0.9)');
      radialGlow.addColorStop(0.7, 'rgba(13, 27, 42, 0.8)');
      radialGlow.addColorStop(0.9, 'rgba(59, 130, 246, 0.2)');
      radialGlow.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.1, 0, 2 * Math.PI);
      ctx.fill();

      // Outer atmosphere ring
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw Orbiting Satellite Ring
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
      ctx.lineWidth = 1;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(1, 0.3);
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.25, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();

      // Draw Grid Lines (Latitudes and Longitudes)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)';
      ctx.lineWidth = 0.8;
      
      // Longitudes
      for (let j = 0; j < 6; j++) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotationAngle + (j * Math.PI) / 6);
        ctx.scale(1, 0.15);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
      }

      // Latitudes
      for (let latVal = -radius * 0.8; latVal <= radius * 0.8; latVal += radius * 0.3) {
        const latRad = Math.sqrt(radius * radius - latVal * latVal);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.06)';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + latVal, latRad, latRad * 0.2, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Draw simulated continents rotating
      ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
      mockLandmassPoints.forEach((pt) => {
        const theta = pt.lon + rotationAngle;
        const x3d = radius * Math.cos(pt.lat) * Math.sin(theta);
        const y3d = radius * Math.sin(pt.lat);
        const z3d = radius * Math.cos(pt.lat) * Math.cos(theta); // depth

        if (z3d > 0) { // Render only front hemisphere points
          ctx.beginPath();
          ctx.arc(centerX + x3d, centerY + y3d, 1.2, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      // Draw Scan Nodes (Geographical markers)
      markers.forEach((marker, index) => {
        // Convert mock lat/lon coordinates to 3D rotating coordinates
        const latRad = (marker.lat * Math.PI) / 180;
        const lonRad = (marker.lon * Math.PI) / 180;
        
        const theta = lonRad + rotationAngle;
        const x3d = radius * Math.cos(latRad) * Math.sin(theta);
        const y3d = radius * Math.sin(latRad);
        const z3d = radius * Math.cos(latRad) * Math.cos(theta);

        if (z3d > 0) {
          const sizeMultiplier = 1 + (z3d / radius); // Bigger if closer to viewer
          const finalX = centerX + x3d;
          const finalY = centerY + y3d;

          // Target node styling
          const isThreat = marker.type === 'url' || marker.type === 'file';
          const nodeColor = isThreat ? '239, 68, 68' : '16, 185, 129'; // Red vs Green

          // Pulse ring
          const pulse = (Date.now() / 1000 + index) % 2;
          ctx.strokeStyle = `rgba(${nodeColor}, ${0.8 - pulse * 0.4})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(finalX, finalY, 3 + pulse * 12 * sizeMultiplier, 0, 2 * Math.PI);
          ctx.stroke();

          // Node center dot
          ctx.fillStyle = `rgb(${nodeColor})`;
          ctx.beginPath();
          ctx.arc(finalX, finalY, 4 * sizeMultiplier, 0, 2 * Math.PI);
          ctx.fill();

          // Connected text label
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.font = '9px monospace';
          ctx.fillText(marker.city, finalX + 8, finalY - 4);
        }
      });

      // If scanner is active, project scanning beam sweeps
      if (isScanning) {
        const sweepAngle = (Date.now() / 300) % (2 * Math.PI);
        const beamGrad = ctx.createLinearGradient(centerX, centerY, centerX + Math.cos(sweepAngle) * radius, centerY + Math.sin(sweepAngle) * radius);
        beamGrad.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
        beamGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');
        
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, sweepAngle - 0.2, sweepAngle + 0.2);
        ctx.closePath();
        ctx.fill();

        // Scanning ring pulse
        const scanRing = (Date.now() / 800) % 1;
        ctx.strokeStyle = `rgba(59, 130, 246, ${1 - scanRing})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * scanRing, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Smooth rotate speed
      rotationAngle += isScanning ? 0.015 : 0.003;
      animationId = requestAnimationFrame(drawGlobe);
    };

    drawGlobe();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [markers, isScanning]);

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto flex items-center justify-center">
      {/* Outer border glow elements */}
      <div className="absolute inset-0 border border-blue-500/10 rounded-full animate-[pulse_6s_infinite]"></div>
      <canvas ref={canvasRef} className="w-full h-full" style={{ maxWidth: '100%', maxHeight: '100%' }} />
    </div>
  );
};

export default ThreatGlobe3D;
