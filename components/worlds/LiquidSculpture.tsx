"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const vertex = `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
const fragment = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uPulse;
uniform vec2 uPointer;
uniform vec2 uSize;
uniform vec3 uTint;
mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
float smoothMin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float shape(vec3 p){
 p.xz=rot(.35+uPointer.x*.35+uTime*.12)*p.xz;
 p.yz=rot(.95+uPointer.y*.25)*p.yz;
 p.xy=rot(-.38+sin(uTime*.16)*.12)*p.xy;
 float a=atan(p.y,p.x);
 float swell=sin(a*3.+uTime*.45)*.085+cos(a*5.-uTime*.2)*.025;
 vec2 q=vec2(length(p.xy)-(.85+swell),p.z);
 float torus=length(q)-(.34+sin(a*2.+uTime*.3)*.055+uPulse*.045);
 vec3 b=p-vec3(.85*sin(uTime*.24),.75*cos(uTime*.3),.15);
 return smoothMin(torus,length(b)-.43,.4);
}
vec3 normalAt(vec3 p){vec2 e=vec2(.001,0.);return normalize(vec3(shape(p+e.xyy)-shape(p-e.xyy),shape(p+e.yxy)-shape(p-e.yxy),shape(p+e.yyx)-shape(p-e.yyx)));}
vec3 environment(vec3 r){
 vec3 base=mix(vec3(.06,.2,.2),vec3(.88,1.,.77),smoothstep(-.7,.8,r.y));
 float studio=pow(max(0.,dot(r,normalize(vec3(-.7,1.,1.)))),18.);
 float window=pow(max(0.,dot(r,normalize(vec3(.5,.45,1.)))),90.);
 float ribbon=pow(max(0.,sin(r.x*3.+r.y*2.)),24.)*.38;
 return base+studio*vec3(1.4,1.5,1.1)+window*vec3(2.)+ribbon*vec3(.1,.65,.9);
}
void main(){
 vec2 uv=(vUv-.5)*2.;uv.x*=uSize.x/uSize.y;
 vec3 ro=vec3(0.,0.,4.4),rd=normalize(vec3(uv*1.6,-3.));
 float travel=0.;vec3 p;bool hit=false;
 for(int i=0;i<80;i++){p=ro+rd*travel;float d=shape(p);if(d<.0015){hit=true;break;}travel+=d*.85;if(travel>7.)break;}
 if(!hit){gl_FragColor=vec4(0.);return;}
 vec3 n=normalAt(p);vec3 r=reflect(rd,n);float fresnel=pow(1.-max(dot(-rd,n),0.),3.);
 vec3 env=environment(r);vec3 tint=mix(uTint,vec3(.02,.55,.6),smoothstep(-.9,.8,p.y)*.35);
 vec3 col=tint*.25+env*tint*.75;
 float diffuse=max(dot(n,normalize(vec3(-2.,3.,4.))),0.);
 col+=tint*diffuse*.18;
 col=mix(col,environment(r)*.95,fresnel*.65);
 float spec=pow(max(dot(reflect(normalize(vec3(2.,-3.,-4.)),n),-rd),0.),100.);
 col+=spec*vec3(1.7,1.6,1.3);
 float band=pow(max(0.,sin(n.y*8.+n.x*4.)),30.);col+=band*.12;
 col=pow(col,vec3(.83));
 gl_FragColor=vec4(col,1.);
}`;

function Sculpture({
  paused,
  energy,
  palette,
}: {
  paused: boolean;
  energy: number;
  palette: number;
}) {
  const reduced = useReducedMotion();
  const material = useRef<THREE.ShaderMaterial>(null);
  const time = useRef(0);
  const pulse = useRef(0);
  const target = useRef(0);
  useEffect(() => {
    target.current = energy;
    pulse.current = 1;
  }, [energy]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uSize: { value: new THREE.Vector2(1, 1) },
      uTint: { value: new THREE.Color("#ceff35") },
    }),
    [],
  );
  useFrame(({ pointer, size }, delta) => {
    if (!material.current) return;
    if (!reduced && !paused) time.current += Math.min(delta, 0.05);
    uniforms.uTime.value = time.current;
    pulse.current *= 0.965;
    uniforms.uPulse.value = reduced
      ? 0
      : pulse.current * Math.sin(time.current * 12);
    uniforms.uPointer.value.lerp(
      reduced ? new THREE.Vector2() : pointer,
      0.035,
    );
    uniforms.uSize.value.set(size.width, size.height);
    uniforms.uTint.value.lerp(
      new THREE.Color(
        palette === 1 ? "#ff944e" : palette === 2 ? "#ae87ff" : "#cbff40",
      ),
      0.06,
    );
  });
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
class GraphicsBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
function SculptureFallback() {
  return (
    <div className="sculpture-fallback">
      <i />
      <i />
      <i />
    </div>
  );
}
export default function LiquidSculpture({
  paused,
  energy,
  palette,
}: {
  paused: boolean;
  energy: number;
  palette: number;
}) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(true);
  useEffect(() => {
    const visibility = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);
  return (
    <GraphicsBoundary fallback={<SculptureFallback />}>
      <Canvas
        className="sculpture-canvas"
        dpr={[1, 1.35]}
        orthographic
        camera={{ position: [0, 0, 1] }}
        frameloop={active && !paused && !reduced ? "always" : "demand"}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        fallback={<SculptureFallback />}
      >
        <Sculpture paused={paused} energy={energy} palette={palette} />
      </Canvas>
    </GraphicsBoundary>
  );
}
