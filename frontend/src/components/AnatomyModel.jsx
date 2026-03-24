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
    scene.background = new THREE.Color(0xfaf8f7)

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(0, 1, 6)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const amb = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(amb)
    const key = new THREE.DirectionalLight(0xffffff, 0.8)
    key.position.set(5, 10, 7)
    scene.add(key)

    // Simplified stylized human body anatomy
    const bodyParts = []

    // Head
    const headGeo = new THREE.SphereGeometry(0.35, 32, 32)
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xe8b4a0, metalness: 0.1, roughness: 0.8 })
    const head = new THREE.Mesh(headGeo, skinMat)
    head.position.set(0, 2.5, 0)
    head.castShadow = true
    head.userData = { id: 'head', name: 'Head' }
    scene.add(head)
    bodyParts.push(head)

    // Torso / Chest
    const torsoGeo = new THREE.BoxGeometry(0.6, 1.2, 0.4)
    const torso = new THREE.Mesh(torsoGeo, skinMat)
    torso.position.set(0, 1.3, 0)
    torso.castShadow = true
    torso.userData = { id: 'chest', name: 'Chest' }
    scene.add(torso)
    bodyParts.push(torso)

    // Left Arm
    const armGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 16)
    const leftArm = new THREE.Mesh(armGeo, skinMat)
    leftArm.position.set(-0.55, 1.3, 0)
    leftArm.castShadow = true
    leftArm.userData = { id: 'left_arm', name: 'Left Arm' }
    scene.add(leftArm)
    bodyParts.push(leftArm)

    // Right Arm
    const rightArm = new THREE.Mesh(armGeo, skinMat)
    rightArm.position.set(0.55, 1.3, 0)
    rightArm.castShadow = true
    rightArm.userData = { id: 'right_arm', name: 'Right Arm' }
    scene.add(rightArm)
    bodyParts.push(rightArm)

    // Abdomen / Lower Back area
    const abdominalGeo = new THREE.BoxGeometry(0.5, 0.8, 0.35)
    const abdomen = new THREE.Mesh(abdominalGeo, skinMat)
    abdomen.position.set(0, 0.4, 0)
    abdomen.castShadow = true
    abdomen.userData = { id: 'lower_back_left', name: 'Abdomen/Lower Back' }
    scene.add(abdomen)
    bodyParts.push(abdomen)

    // Left Leg
    const legGeo = new THREE.CylinderGeometry(0.18, 0.15, 1.5, 16)
    const leftLeg = new THREE.Mesh(legGeo, skinMat)
    leftLeg.position.set(-0.25, -0.95, 0)
    leftLeg.castShadow = true
    leftLeg.userData = { id: 'left_leg', name: 'Left Leg' }
    scene.add(leftLeg)
    bodyParts.push(leftLeg)

    // Right Leg
    const rightLeg = new THREE.Mesh(legGeo, skinMat)
    rightLeg.position.set(0.25, -0.95, 0)
    rightLeg.castShadow = true
    rightLeg.userData = { id: 'right_leg', name: 'Right Leg' }
    scene.add(rightLeg)
    bodyParts.push(rightLeg)

    // Heart hotspot (internal, non-visible mesh for click detection)
    const heartHotspotMat = new THREE.MeshStandardMaterial({
      color: 0xc41e3a,
      emissive: 0x660000,
      metalness: 0.3,
      roughness: 0.6
    })
    const heartShape = new THREE.Shape()
    heartShape.moveTo(0, 0.2)
    heartShape.bezierCurveTo(-0.25, 0.5, -0.55, 0.3, 0, -0.15)
    heartShape.bezierCurveTo(0.55, 0.3, 0.25, 0.5, 0, 0.2)
    const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 }
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings)
    const heart = new THREE.Mesh(heartGeo, heartHotspotMat)
    heart.position.set(0, 1.4, 0.25)
    heart.scale.set(0.35, 0.35, 1)
    heart.castShadow = true
    heart.userData = { id: 'heart', name: 'Heart' }
    scene.add(heart)
    bodyParts.push(heart)

    // Animation loop
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseMove = (evt) => {
      const rect = container.getBoundingClientRect()
      mouse.x = ((evt.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((evt.clientY - rect.top) / rect.height) * 2 + 1
    }

    const onMouseClick = () => {
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(bodyParts)
      if (intersects.length > 0) {
        const obj = intersects[0].object
        if (onAreaSelected) {
          onAreaSelected(obj.userData.id)
        }
        setSelected(obj.userData)
      }
    }

    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('click', onMouseClick)

    const animate = () => {
      requestAnimationFrame(animate)

      // Subtle rotation
      bodyParts.forEach((part) => {
        part.rotation.y += 0.001
      })

      // Label hover effects
      bodyParts.forEach((part) => {
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects([part])
        if (intersects.length > 0) {
          part.material.emissive?.setHex(0x330000)
        } else {
          part.material.emissive?.setHex(0x000000)
        }
      })

      // Highlight selected part
      bodyParts.forEach((part) => {
        if (part.userData.id === selected?.id) {
          part.material.color.setHex(0xa01818)
        } else {
          part.material.color.setHex(0xe8b4a0)
          if (part.userData.id === 'heart') {
            part.material.color.setHex(0xc41e3a)
          }
        }
      })

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('click', onMouseClick)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [onAreaSelected])

  return (
    <div className="anatomy-model" style={{ position: 'relative' }}>
      <div ref={containerRef} className="three-container" style={{ width: '100%', height: '520px' }} />
      <div className="anatomy-label" style={{ position: 'absolute', left: 12, bottom: 12, color: '#1a1a1a', background: 'rgba(255, 255, 255, 0.8)', padding: '8px 12px', borderRadius: 8 }}>
        {selected ? <div><strong>{selected.name}</strong><div style={{ fontSize: 12, opacity: 0.8 }}>{selected.id}</div></div> : <div>Click any body part to select</div>}
      </div>
    </div>
  )
}

export default AnatomyModel
