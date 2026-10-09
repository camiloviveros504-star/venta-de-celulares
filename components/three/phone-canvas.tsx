"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  OrbitControls,
  PerformanceMonitor,
  RoundedBox,
  Sparkles,
} from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdditiveBlending, CanvasTexture, Color, MathUtils, Shape, ShapeGeometry, SRGBColorSpace, type Group, type Mesh } from "three";
import type { Brand, ProductColor } from "@/lib/types";

const W = 1.5;
const H = 3.1;
const D = 0.16;
/** Constante a nivel de módulo: R3F no la reaplica en cada render. */
const INTRO_ROTATION: [number, number, number] = [0, -Math.PI * 1.5, 0];

type Bump = { kind: "rect"; x: number; y: number; w: number; h: number } | { kind: "circle"; x: number; y: number; r: number };

interface CameraLayout {
  bump?: Bump;
  lenses: readonly [number, number][];
  lensRadius: number;
}

/** Coordenadas vistas desde el reverso (x se refleja al construir la malla). */
const CAMERA_LAYOUTS: Record<Brand, CameraLayout> = {
  Apple: {
    bump: { kind: "rect", x: -0.37, y: 1.12, w: 0.66, h: 0.66 },
    lenses: [[-0.52, 1.27], [-0.52, 0.97], [-0.22, 1.12]],
    lensRadius: 0.12,
  },
  Samsung: { lenses: [[-0.5, 1.25], [-0.5, 0.95], [-0.5, 0.65]], lensRadius: 0.11 },
  Google: {
    bump: { kind: "rect", x: 0, y: 0.95, w: W - 0.02, h: 0.36 },
    lenses: [[-0.45, 0.95], [-0.15, 0.95], [0.15, 0.95]],
    lensRadius: 0.12,
  },
  Xiaomi: {
    bump: { kind: "circle", x: 0, y: 0.95, r: 0.46 },
    lenses: [[-0.18, 1.13], [0.18, 1.13], [-0.18, 0.77], [0.18, 0.77]],
    lensRadius: 0.13,
  },
  Motorola: {
    bump: { kind: "rect", x: -0.42, y: 1.0, w: 0.5, h: 0.8 },
    lenses: [[-0.42, 1.18], [-0.42, 0.82]],
    lensRadius: 0.13,
  },
  OnePlus: {
    bump: { kind: "circle", x: -0.3, y: 1.0, r: 0.38 },
    lenses: [[-0.3, 1.17], [-0.45, 0.88], [-0.15, 0.88]],
    lensRadius: 0.1,
  },
};

function roundedRectGeometry(w: number, h: number, r: number): ShapeGeometry {
  const s = new Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  const geometry = new ShapeGeometry(s, 12);
  // Normaliza las UV a [0, 1] para mapear la textura de pantalla completa.
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) - x) / w, (pos.getY(i) - y) / h);
  }
  return geometry;
}

function createScreenTexture(accent: string): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1060;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createLinearGradient(0, 0, 512, 1060);
    g.addColorStop(0, accent);
    g.addColorStop(0.5, "#3b0764");
    g.addColorStop(1, "#020617");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 1060);
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.roundRect(196, 30, 120, 34, 17);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "600 120px system-ui, sans-serif";
    ctx.fillText("9:41", 256, 260);
    ctx.font = "500 30px system-ui, sans-serif";
    ctx.fillText("CelluStore", 256, 310);
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.roundRect(48 + i * 216, 760, 200, 200, 40);
      ctx.fill();
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

interface ModelProps {
  color: ProductColor;
  brand: Brand;
  followPointer: boolean;
}

function PhoneModel({ color, brand, followPointer }: ModelProps) {
  const group = useRef<Group>(null);
  const screenGeometry = useMemo(() => roundedRectGeometry(W - 0.1, H - 0.1, 0.18), []);
  const screenTexture = useMemo(() => createScreenTexture(color.accent), [color.accent]);
  const bodyColor = useMemo(() => new Color(color.hex), [color.hex]);
  const layout = CAMERA_LAYOUTS[brand];
  const backZ = -D / 2;

  useEffect(() => () => screenTexture.dispose(), [screenTexture]);
  useEffect(() => () => screenGeometry.dispose(), [screenGeometry]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    // Entrada: escala desde 0.5 con un giro amortiguado.
    const s = MathUtils.damp(g.scale.x, 1, 4, delta);
    g.scale.setScalar(s);
    if (!followPointer) {
      g.rotation.y = MathUtils.damp(g.rotation.y, -0.5, 3, delta);
      return;
    }
    const t = state.clock.elapsedTime;
    const targetY = t * 0.35 + state.pointer.x * 0.9;
    const targetX = -state.pointer.y * 0.35;
    g.rotation.y = MathUtils.damp(g.rotation.y, targetY, 2.5, delta);
    g.rotation.x = MathUtils.damp(g.rotation.x, targetX, 3, delta);
  });

  return (
    <group ref={group} rotation={INTRO_ROTATION} scale={0.5}>
      {/* Chasis */}
      <RoundedBox args={[W, H, D]} radius={0.075} smoothness={6}>
        <meshPhysicalMaterial color={bodyColor} metalness={0.55} roughness={0.28} clearcoat={1} clearcoatRoughness={0.15} />
      </RoundedBox>

      {/* Pantalla */}
      <mesh geometry={screenGeometry} position={[0, 0, D / 2 + 0.002]}>
        <meshStandardMaterial map={screenTexture} emissive="#ffffff" emissiveMap={screenTexture} emissiveIntensity={0.55} roughness={0.15} />
      </mesh>

      {/* Módulo de cámara */}
      <group position={[0, 0, backZ]} rotation={[0, Math.PI, 0]}>
        {layout.bump?.kind === "rect" && (
          <RoundedBox args={[layout.bump.w, layout.bump.h, 0.06]} radius={0.025} position={[layout.bump.x, layout.bump.y, 0.03]}>
            <meshPhysicalMaterial color={bodyColor} metalness={0.7} roughness={0.2} clearcoat={1} />
          </RoundedBox>
        )}
        {layout.bump?.kind === "circle" && (
          <mesh position={[layout.bump.x, layout.bump.y, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[layout.bump.r, layout.bump.r, 0.06, 48]} />
            <meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} />
          </mesh>
        )}
        {layout.lenses.map(([x, y]) => (
          <group key={`${x}-${y}`} position={[x, y, layout.bump ? 0.08 : 0.03]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[layout.lensRadius, layout.lensRadius, 0.06, 40]} />
              <meshStandardMaterial color="#c0c4cc" metalness={1} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.032, 0]}>
              <cylinderGeometry args={[layout.lensRadius * 0.75, layout.lensRadius * 0.75, 0.01, 40]} />
              <meshPhysicalMaterial color="#05060a" metalness={0.2} roughness={0.05} clearcoat={1} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/** Anillos de energía que orbitan detrás del teléfono (solo en el hero). */
function EnergyRings({ color }: { color: string }) {
  const a = useRef<Mesh>(null);
  const b = useRef<Mesh>(null);
  const c = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (a.current) a.current.rotation.z += delta * 0.4;
    if (b.current) {
      b.current.rotation.x += delta * 0.25;
      b.current.rotation.y += delta * 0.15;
    }
    if (c.current) c.current.rotation.y -= delta * 0.3;
  });

  const material = (opacity: number, tint: string) => (
    <meshBasicMaterial color={tint} transparent opacity={opacity} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
  );

  return (
    <group position={[0, 0, -1.2]}>
      <mesh ref={a}>
        <torusGeometry args={[2.3, 0.012, 8, 160]} />
        {material(0.9, color)}
      </mesh>
      <mesh ref={b} rotation={[1.1, 0.3, 0]}>
        <torusGeometry args={[2.7, 0.008, 8, 160]} />
        {material(0.6, "#8b5cf6")}
      </mesh>
      <mesh ref={c} rotation={[0.4, 0, 0.9]}>
        <torusGeometry args={[3.1, 0.006, 8, 160]} />
        {material(0.45, "#22d3ee")}
      </mesh>
    </group>
  );
}

export interface PhoneCanvasProps {
  color: ProductColor;
  brand: Brand;
  /** `hero`: sigue al puntero, flota y muestra efectos. `viewer`: el usuario lo gira con arrastre. */
  mode: "hero" | "viewer";
  active: boolean;
  /** `false` cuando el usuario prefiere movimiento reducido. */
  animate: boolean;
  onReady?: () => void;
}

export default function PhoneCanvas({ color, brand, mode, active, animate, onReady }: PhoneCanvasProps) {
  const isHero = mode === "hero";
  // Resolución adaptativa: baja si los FPS caen, sube si hay margen.
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      onCreated={onReady}
      dpr={dpr}
      camera={{ position: [0, 0, 6.2], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <PerformanceMonitor
        bounds={() => [45, 60]}
        onChange={({ factor }) => setDpr(Math.round((1 + factor) * 10) / 10)}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />

      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <pointLight position={[-4, -2, -3]} intensity={30} color={color.accent} />

      <Float enabled={isHero && animate} speed={1.6} rotationIntensity={0.25} floatIntensity={0.6}>
        <PhoneModel color={color} brand={brand} followPointer={isHero && animate} />
      </Float>

      {isHero && (
        <>
          <EnergyRings color={color.accent} />
          <Sparkles count={60} scale={[6, 5, 3]} size={2.5} speed={animate ? 0.4 : 0} opacity={0.7} color={color.accent} />
          <Sparkles count={30} scale={[7, 6, 2]} size={4} speed={animate ? 0.2 : 0} opacity={0.4} color="#22d3ee" />
        </>
      )}

      <ContactShadows
        position={[0, -1.9, 0]}
        opacity={0.5}
        scale={8}
        blur={2.6}
        far={3}
        resolution={256}
        frames={isHero && animate ? Infinity : 30}
      />

      {/* Entorno de reflejos generado localmente (sin descargar HDRs). */}
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={4} position={[0, 4, 3]} scale={[8, 1, 1]} />
        <Lightformer form="rect" intensity={2} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color={color.accent} />
        <Lightformer form="rect" intensity={2} position={[5, 1, -2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={3} position={[0, 0, -6]} scale={4} color="#8b5cf6" />
      </Environment>

      {!isHero && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          autoRotate={animate}
          autoRotateSpeed={1.2}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(2 * Math.PI) / 3}
        />
      )}
    </Canvas>
  );
}
