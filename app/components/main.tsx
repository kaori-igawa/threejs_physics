'use client'

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { phy } from 'phy-engine';

export default function Main() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Object3D | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera( 75, innerWidth / innerHeight, 0.1, 1000 );
    rendererRef.current = new THREE.WebGLRenderer({
      canvas: canvasRef.current || undefined,
      antialias: true,
      alpha: true
    });

    // サイズ
    const sizes = {
      width: innerWidth,
      height: innerHeight
    }

    rendererRef.current.setSize( sizes.width, sizes.height );
    rendererRef.current.setPixelRatio(window.devicePixelRatio);

    // ボックスジオメトリー
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
    const boxMaterial = new THREE.MeshLambertMaterial({
      color: '#2497f0'
    })
    const box = new THREE.Mesh(boxGeometry, boxMaterial)
    box.position.z = -5
    box.rotation.set(10, 10, 10)
    sceneRef.current.add(box)

    // ライト
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    sceneRef.current.add(ambientLight)
    const pointLight = new THREE.PointLight(0xffffff, 0.2)
    pointLight.position.set(1, 2, 3)
    sceneRef.current.add(pointLight)

    // アニメーション
    const clock = new THREE.Clock()
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      box.rotation.x = elapsedTime
      box.rotation.y = elapsedTime
      window.requestAnimationFrame(tick)
      if(rendererRef.current && sceneRef.current && cameraRef.current) rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
    tick()

    // ブラウザのリサイズ処理
    window.addEventListener('resize', () => {

      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      if(!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = sizes.width / sizes.height
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(sizes.width, sizes.height)
      rendererRef.current.setPixelRatio(window.devicePixelRatio)
    })
  }, []);

  return (
    <>
      <canvas ref={canvasRef} id="canvas"></canvas>
    </>
  )
}
