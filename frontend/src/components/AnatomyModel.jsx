import { useRef, useEffect, useState } from 'react'
import '../styles/AnatomyModel.css'
import * as THREE from 'three'

function AnatomyModel({ onAreaSelected }) {
  const containerRef = useRef(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x081218)

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 6)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const amb = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(amb)
    const key = new THREE.DirectionalLight(0xffc6c6, 1)
    key.position.set(5, 10, 7)
    scene.add(key)

    // Heart shape using a parametric path (stylized)
    const x = 0, y = 0
    const heartShape = new THREE.Shape()
    heartShape.moveTo(x, y + 1.2)
    heartShape.bezierCurveTo(x - 1.1, y + 2.2, x - 2.4, y + 1.2, x, y - 0.6)
    heartShape.bezierCurveTo(x + 2.4, y + 1.2, x + 1.1, y + 2.2, x, y + 1.2)

    const extrudeSettings = { depth: 0.8, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4 }
    const geo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings)
    geo.rotateX(Math.PI)
    geo.translate(0, -0.6, 0)

    const mat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, metalness: 0.2, roughness: 0.5 })
    const heart = new THREE.Mesh(geo, mat)
    heart.castShadow = true
    heart.position.set(0, 0, 0)
    scene.add(heart)

    // simple hotspot in front of the heart for click interaction
    const hotspotMat = new THREE.MeshStandardMaterial({ color: 0xff7f7f, emissive: 0x220000 })
    const hotspot = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), hotspotMat)
    hotspot.position.set(0, 0.2, 0.9)
    hotspot.userData = { id: 'heart', name: 'Heart' }
    scene.add(hotspot)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    let isDragging = false
    let prevX = 0
    let rotationY = 0

    function onPointerDown(e) {
      isDragging = true
      prevX = e.clientX
    }
    function onPointerUp() {
      isDragging = false
    }
    function onPointerMove(e) {
      const rect = container.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      if (isDragging) {
        const delta = (e.clientX - prevX) / rect.width
        rotationY += delta * Math.PI * 0.6
        prevX = e.clientX
      }
    }
    function onClick(e) {
      const rect = container.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects([hotspot], true)
      if (hits.length > 0) {
        const obj = hits[0].object
        setSelected(obj.userData)
        if (typeof onAreaSelected === 'function') onAreaSelected(obj.userData)
      }
    }

    container.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('click', onClick)

    function resize() {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', resize)

    const clock = new THREE.Clock()
    function animate() {
      requestAnimationFrame(animate)
      const dt = clock.getDelta()
      heart.rotation.y = rotationY * 0.5
      hotspot.rotation.y = rotationY * 0.5
      renderer.render(scene, camera)
    }
    animate()

    camera.lookAt(0, 0, 0)

    return () => {
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('click', onClick)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="anatomy-model" style={{ position: 'relative' }}>
      <div ref={containerRef} className="three-container" style={{ width: '100%', height: '520px' }} />
      <div className="anatomy-label" style={{ position: 'absolute', left: 12, bottom: 12, color: '#fff', background: 'rgba(0,0,0,0.45)', padding: '8px 12px', borderRadius: 8 }}>
        {selected ? <div><strong>{selected.name}</strong><div style={{ fontSize: 12, opacity: 0.9 }}>{selected.id}</div></div> : <div>Click the heart to select it</div>}
      </div>
    </div>
  )
}

export default AnatomyModel
