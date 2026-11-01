import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Box3, Group, Mesh, OrthographicCamera, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomPoster } from './RoomPoster';
import styles from './RoomStudy.module.css';

export type RoomAtmosphere = 'natural' | 'warm' | 'cool';
interface RoomStudyProps { atmosphere: RoomAtmosphere; reducedMotion: boolean; evening?: boolean }
interface LookPosition { x: number; y: number }

const lighting = {
  natural: { ambient: '#fff8ef', key: '#fff1d8', fill: '#dce8ff' },
  warm: { ambient: '#ffe2bf', key: '#ffd0a0', fill: '#eee2ce' },
  cool: { ambient: '#e2ebff', key: '#e1eaff', fill: '#b9ceff' },
};

function Diorama({ look, reducedMotion, evening, onReady, onUnavailable }: {
  look: RefObject<LookPosition>; reducedMotion: boolean; evening: boolean; onReady: () => void; onUnavailable: () => void;
}) {
  const gltf = useLoader(GLTFLoader, '/models/tiny-room/room.glb');
  // Clone transforms, not GPU resources: the loader cache survives route changes.
  const model = useMemo(() => {
    const clone = gltf.scene.clone(true);
    const rays = clone.getObjectByName('ray');
    // The transparent rays are flat sheets, so a second back-face pass is unnecessary.
    if (rays instanceof Mesh && !Array.isArray(rays.material)) rays.material.forceSinglePass = true;
    return clone;
  }, [gltf.scene]);
  const root = useRef<Group>(null);
  const firstFrame = useRef(true);
  const { camera, size, invalidate, gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      firstFrame.current = true;
      onUnavailable();
    };
    const restored = () => invalidate();
    canvas.addEventListener('webglcontextlost', lost);
    canvas.addEventListener('webglcontextrestored', restored);
    return () => {
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.removeEventListener('webglcontextrestored', restored);
    };
  }, [gl, invalidate, onUnavailable]);

  useLayoutEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const extent = new Box3().setFromObject(model).applyMatrix4(camera.matrixWorldInverse).getSize(new Vector3());
    camera.zoom = Math.min(size.width / (extent.x * 1.12), size.height / (extent.y * 1.22));
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, model, size.width, size.height, invalidate]);

  useEffect(() => {
    const rays = model.getObjectByName('ray');
    if (rays) rays.visible = !evening;
    invalidate();
  }, [model, evening, invalidate]);

  useFrame((_, delta) => {
    if (gl.getContext().isContextLost()) return;
    if (firstFrame.current) {
      firstFrame.current = false;
      onReady();
    }
    if (!root.current) return;
    const targetY = reducedMotion ? 0 : look.current.x * 0.12;
    const targetX = reducedMotion ? 0 : look.current.y * 0.035;
    const smoothing = 1 - Math.exp(-10 * Math.min(delta, 0.05));
    root.current.rotation.y += (targetY - root.current.rotation.y) * smoothing;
    root.current.rotation.x += (targetX - root.current.rotation.x) * smoothing;
    if (Math.abs(targetY - root.current.rotation.y) > 0.0005 || Math.abs(targetX - root.current.rotation.x) > 0.0005) invalidate();
  });

  return <group ref={root} dispose={null}><primitive object={model} /></group>;
}

export default function RoomStudy({ atmosphere, reducedMotion, evening = false }: RoomStudyProps) {
  const container = useRef<HTMLDivElement>(null);
  const look = useRef({ x: 0, y: 0 });
  const invalidate = useRef<(() => void) | null>(null);
  const [active, setActive] = useState(!document.hidden);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => setReady(false), []);
  const light = lighting[atmosphere];

  useEffect(() => {
    let inView = true;
    const update = () => {
      const visible = inView && !document.hidden;
      setActive(visible);
      if (visible) invalidate.current?.();
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    if (container.current) observer.observe(container.current);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);

  return <div ref={container} className={styles.scene} role="img"
    aria-label="Supplied textured isometric bedroom with a bed, desk, window, shelving, and plants"
    onPointerMove={(event) => {
      if (!active || reducedMotion || event.pointerType === 'touch') return;
      const bounds = event.currentTarget.getBoundingClientRect();
      look.current = { x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 2, y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 2 };
      invalidate.current?.();
    }}
    onPointerLeave={() => { look.current = { x: 0, y: 0 }; if (active) invalidate.current?.(); }}>
    <Canvas orthographic dpr={[1, 1.5]} frameloop={active ? 'demand' : 'never'}
      camera={{ position: [9, 7.2, 10], near: 0.1, far: 60, zoom: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      onCreated={(state) => { invalidate.current = state.invalidate; }}
      fallback={<RoomPoster />}>
      <Suspense fallback={null}>
        <ambientLight color={evening ? '#b3bed8' : light.ambient} intensity={evening ? 1.1 : 2.1} />
        <directionalLight position={[-3, 6, 4]} color={evening ? '#ffc18b' : light.key} intensity={evening ? 1.4 : 2.2} />
        <directionalLight position={[4, 2, 3]} color={light.fill} intensity={evening ? 0.3 : 0.7} />
        <Diorama look={look} reducedMotion={reducedMotion} evening={evening} onReady={onReady} onUnavailable={onUnavailable} />
      </Suspense>
    </Canvas>
    {!ready && <RoomPoster />}
  </div>;
}
