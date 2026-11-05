"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef, useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
export type World = "synaptic" | "aero" | "microscopic" | "notes";
function Network({
  accent,
  reduced,
  world,
}: {
  accent: string;
  reduced: boolean;
  world: World;
}) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(window.innerWidth < 700);
  }, []);
  const lineMaterial = useRef<THREE.LineBasicMaterial>(null);
  const pointerTarget = useRef(new THREE.Vector2(20, 20));
  useEffect(() => {
    const move = (e: PointerEvent) =>
      pointerTarget.current.set(
        (e.clientX / window.innerWidth - 0.5) * 23,
        (0.5 - e.clientY / window.innerHeight) * 16,
      );
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  const group = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Points>(null);
  const cells = useRef<THREE.InstancedMesh>(null);
  const paths = useMemo(() => {
    let seed = 42;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const curves: THREE.CatmullRomCurve3[] = [];
    const centers: THREE.Vector3[] = [];
    for (let n = 0; n < (mobile ? 6 : 11); n++) {
      const center = new THREE.Vector3(
        (rnd() - 0.35) * 21,
        (rnd() - 0.5) * 15,
        (rnd() - 0.5) * 7,
      );
      centers.push(center);
      for (let a = 0; a < (mobile ? 5 : 7); a++) {
        let angle = (a / 7) * Math.PI * 2 + rnd() * 0.5;
        const length = 1.7 + rnd() * 2.7;
        const end = center
          .clone()
          .add(
            new THREE.Vector3(
              Math.cos(angle) * length,
              Math.sin(angle) * length,
              (rnd() - 0.5) * 2,
            ),
          );
        const mid = center
          .clone()
          .lerp(end, 0.5)
          .add(new THREE.Vector3((rnd() - 0.5) * 0.7, (rnd() - 0.5) * 0.7, 0));
        curves.push(new THREE.CatmullRomCurve3([center, mid, end]));
        for (let b = 0; b < 3; b++) {
          const start = center.clone().lerp(end, 0.45 + b * 0.18);
          const direction = angle + (b % 2 ? 1 : -1) * (0.35 + rnd() * 0.8);
          const tip = start
            .clone()
            .add(
              new THREE.Vector3(
                Math.cos(direction) * (0.4 + rnd()),
                Math.sin(direction) * (0.4 + rnd()),
                (rnd() - 0.5) * 0.5,
              ),
            );
          curves.push(
            new THREE.CatmullRomCurve3([
              start,
              start
                .clone()
                .lerp(tip, 0.5)
                .add(new THREE.Vector3(0.1, 0.12, 0)),
              tip,
            ]),
          );
        }
      }
    }
    return { curves, centers };
  }, [mobile]);
  const geometry = useMemo(() => {
    const pos: number[] = [];
    for (const c of paths.curves) {
      const pts = c.getPoints(24);
      for (let i = 0; i < 24; i++)
        pos.push(...pts[i].toArray(), ...pts[i + 1].toArray());
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.userData.original = new Float32Array(pos);
    return g;
  }, [paths]);
  const pulseGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(new Float32Array(30 * 3), 3),
    );
    return g;
  }, []);
  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = reduced ? 0 : clock.elapsedTime;
    const scroll = window.scrollY / window.innerHeight;
    const field = pointerTarget.current;
    if (lineMaterial.current) {
      const section = Math.min(1, scroll / 3);
      lineMaterial.current.opacity =
        world === "notes" ? 0.2 : 0.18 + section * 0.16;
      lineMaterial.current.color.lerp(
        new THREE.Color(scroll > 7 ? "#bbd7be" : accent),
        0.03,
      );
    }
    group.current.rotation.z = Math.sin(t * 0.06) * 0.025;
    const positions = geometry.attributes.position;
    const original = geometry.userData.original as Float32Array;
    for (let i = 0; i < positions.count; i++) {
      const x = original[i * 3],
        y = original[i * 3 + 1];
      const d = Math.hypot(x - field.x, y - field.y);
      const influence = Math.exp(-d * d * 0.45) * 0.12;
      positions.setXY(
        i,
        x + (field.x - x) * influence,
        y + (field.y - y) * influence,
      );
    }
    positions.needsUpdate = true;
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      pointer.x * 0.18,
      0.025,
    );
    group.current.position.y = -scroll * 0.3 + Math.sin(t * 0.12) * 0.08;
    if (pulse.current) {
      const attr = pulseGeometry.attributes.position;
      for (let i = 0; i < 30; i++) {
        const c = paths.curves[(i * 9) % paths.curves.length];
        const p = c.getPoint((t * 0.13 + i * 0.17) % 1);
        attr.setXYZ(i, p.x, p.y, p.z);
      }
      attr.needsUpdate = true;
    }
    if (cells.current) {
      const dummy = new THREE.Object3D();
      paths.centers.forEach((p, i) => {
        dummy.position.copy(p);
        const distance = Math.hypot(p.x - field.x, p.y - field.y);
        const excitation = Math.max(0, 1 - distance / 2);
        dummy.scale.setScalar(
          0.11 + Math.sin(t * 0.7 + i) * 0.015 + excitation * 0.1,
        );
        cells.current!.setColorAt(
          i,
          new THREE.Color(accent).lerp(new THREE.Color("#ffffff"), excitation),
        );
        if (cells.current!.instanceColor)
          cells.current!.instanceColor.needsUpdate = true;
        dummy.updateMatrix();
        cells.current!.setMatrixAt(i, dummy.matrix);
      });
      cells.current.instanceMatrix.needsUpdate = true;
    }
  });
  useEffect(
    () => () => {
      geometry.dispose();
      pulseGeometry.dispose();
    },
    [geometry, pulseGeometry],
  );
  return (
    <group ref={group}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          ref={lineMaterial}
          color={world === "notes" ? "#4770a3" : accent}
          transparent
          opacity={world === "notes" ? 0.22 : 0.25}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <instancedMesh
        ref={cells}
        args={[undefined, undefined, paths.centers.length]}
      >
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color={accent} />
      </instancedMesh>
      <points ref={pulse} geometry={pulseGeometry}>
        <pointsMaterial
          color={accent}
          size={0.075}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <Sparkles
        count={mobile ? 35 : 100}
        scale={[24, 18, 12]}
        size={1.2}
        speed={reduced ? 0 : 0.15}
        color={accent}
      />
    </group>
  );
}
function Water({ reduced }: { reduced: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ time: { value: 0 }, pointer: { value: new THREE.Vector2() } }),
    [],
  );
  useFrame(({ clock, pointer }) => {
    if (material.current) {
      uniforms.time.value = reduced ? 0 : clock.elapsedTime;
      uniforms.pointer.value.lerp(pointer, 0.04);
    }
  });
  return (
    <mesh position={[0, -5, -5]} rotation={[-0.8, 0, 0]}>
      <planeGeometry args={[40, 16, 1, 1]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        transparent
        vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
        fragmentShader={`varying vec2 vUv;uniform float time;uniform vec2 pointer;void main(){float wave=sin(vUv.y*130.+sin(vUv.x*25.+time*.3)*2.+time+pointer.x*3.);float ripple=sin(length(vUv-(pointer*.3+.5))*90.-time*2.);float light=pow(max(0.,wave*.5+.5),14.);gl_FragColor=vec4(vec3(.55,.95,1.)+light*.3,.08+light*.2+ripple*.015);}`}
      />
    </mesh>
  );
}
function Aero({ reduced }: { reduced: boolean }) {
  return (
    <>
      <Water reduced={reduced} />
      <ambientLight intensity={2} />
      <directionalLight position={[5, 5, 5]} intensity={3} />
      {Array.from({ length: 12 }, (_, i) => (
        <Float
          key={i}
          speed={reduced ? 0 : 0.6 + i * 0.03}
          rotationIntensity={0.1}
          floatIntensity={1.2}
        >
          <mesh
            position={[Math.sin(i * 7) * 9, Math.cos(i * 4) * 5, -2 - (i % 3)]}
            scale={0.2 + (i % 4) * 0.16}
          >
            <sphereGeometry args={[1, 24, 24]} />
            <MeshTransmissionMaterial
              resolution={128}
              samples={3}
              thickness={0.35}
              roughness={0.08}
              transmission={0.95}
              ior={1.2}
              color={i % 3 ? "#c4faff" : "#7ce6ab"}
              background={new THREE.Color("#6ec8e5")}
            />
          </mesh>
        </Float>
      ))}
      <Sparkles
        count={60}
        scale={[22, 15, 10]}
        size={3}
        speed={reduced ? 0 : 0.3}
        color="#e9ffff"
      />
    </>
  );
}
function Microscope({ reduced }: { reduced: boolean }) {
  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[2, 4, 5]} color="#c5a0ff" intensity={25} />
      {Array.from({ length: 18 }, (_, i) => (
        <Float key={i} speed={reduced ? 0 : 0.35} floatIntensity={0.8}>
          <mesh
            position={[Math.sin(i * 8) * 10, Math.cos(i * 3) * 6, -4 + (i % 4)]}
            scale={0.3 + (i % 3) * 0.3}
          >
            <sphereGeometry args={[1, 24, 24]} />
            <meshPhysicalMaterial
              color={i % 2 ? "#a790bc" : "#4c9c9b"}
              transparent
              opacity={0.22}
              roughness={0.2}
              metalness={0.15}
              wireframe={i % 4 === 0}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}
export default function Environment({
  world,
  accent,
}: {
  world: World;
  accent: string;
}) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const update = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return (
    <div className={"environment " + world} aria-hidden="true">
      {world === "aero" && (
        <div className="aero-landscape">
          <div className="cloud cloud-one" />
          <div className="cloud cloud-two" />
          <div className="hill" />
          <div className="water" />
        </div>
      )}
      {world === "notes" && (
        <div className="notations">
          <span>Ψ(x,t)</span>
          <span>C₆H₁₂O₆</span>
          <span>observation → possibility</span>
          <span>∇ · E = ρ / ε₀</span>
        </div>
      )}
      {!failed && (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 14], fov: 52 }}
          frameloop={active && !reduced ? "always" : "demand"}
          gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
          onCreated={({ gl }) => {
            document.documentElement.classList.add("webgl-ready");
            gl.domElement.addEventListener("webglcontextlost", () => {
              setFailed(true);
              document.documentElement.classList.remove("webgl-ready");
            });
          }}
          fallback={<div className="canvas-fallback" />}
        >
          {world === "aero" ? (
            <Aero reduced={reduced} />
          ) : world === "microscopic" ? (
            <Microscope reduced={reduced} />
          ) : (
            <Network world={world} accent={accent} reduced={reduced} />
          )}
        </Canvas>
      )}
      <div className="environment-shade" />
    </div>
  );
}
