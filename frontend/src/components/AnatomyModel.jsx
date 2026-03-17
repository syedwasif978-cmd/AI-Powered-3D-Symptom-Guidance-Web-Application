import { useRef, useEffect, useState } from 'react'
import '../styles/AnatomyModel.css'

function AnatomyModel({ onAreaSelected }) {
  const canvasRef = useRef(null)
  const [hoveredArea, setHoveredArea] = useState(null)

  // Simple 2D body representation - using backend-supported region IDs
  const bodyAreas = [
    { id: 'neck', name: 'Neck', x: 150, y: 80, radius: 25 },
    { id: 'shoulder', name: 'Shoulder', x: 150, y: 120, radius: 30 },
    { id: 'abdomen', name: 'Abdomen', x: 150, y: 180, radius: 35 },
    { id: 'lower_back_left', name: 'Lower Back (Left)', x: 130, y: 220, radius: 20 },
    { id: 'right_knee', name: 'Right Knee', x: 180, y: 280, radius: 25 },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    canvas.width = width
    canvas.height = height

    // Clear canvas
    ctx.fillStyle = 'rgba(15, 20, 25, 0.5)'
    ctx.fillRect(0, 0, width, height)

    // Draw body outline (simplified)
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)'
    ctx.lineWidth = 2

    // Head
    ctx.beginPath()
    ctx.arc(150, 50, 30, 0, Math.PI * 2)
    ctx.stroke()

    // Body (chest + stomach)
    ctx.fillStyle = 'rgba(14, 165, 168, 0.05)'
    ctx.fillRect(120, 90, 60, 140)
    ctx.strokeRect(120, 90, 60, 140)

    // Arms
    ctx.beginPath()
    ctx.moveTo(120, 120)
    ctx.lineTo(70, 140)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(180, 120)
    ctx.lineTo(230, 140)
    ctx.stroke()

    // Legs
    ctx.beginPath()
    ctx.moveTo(130, 230)
    ctx.lineTo(120, 300)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(170, 230)
    ctx.lineTo(180, 300)
    ctx.stroke()

    // Draw interactive areas
    bodyAreas.forEach((area) => {
      const isHovered = hoveredArea === area.id

      if (isHovered) {
        ctx.fillStyle = 'rgba(124, 58, 237, 0.3)'
        ctx.beginPath()
        ctx.arc(area.x, area.y, area.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.strokeStyle = isHovered ? 'rgba(124, 58, 237, 0.8)' : 'rgba(124, 58, 237, 0.3)'
      ctx.lineWidth = isHovered ? 3 : 2
      ctx.beginPath()
      ctx.arc(area.x, area.y, area.radius, 0, Math.PI * 2)
      ctx.stroke()

      // Label
      ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)'
      ctx.font = `bold 12px Poppins`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(area.name, area.x, area.y)
    })
  }, [hoveredArea])

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if click is on any body area
    bodyAreas.forEach((area) => {
      const distance = Math.sqrt((x - area.x) ** 2 + (y - area.y) ** 2)
      if (distance < area.radius) {
        onAreaSelected(area.id)
      }
    })
  }

  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    let found = null

    // Check if cursor is on any body area
    bodyAreas.forEach((area) => {
      const distance = Math.sqrt((x - area.x) ** 2 + (y - area.y) ** 2)
      if (distance < area.radius) {
        found = area.id
      }
    })

    setHoveredArea(found)
    canvas.style.cursor = found ? 'pointer' : 'default'
  }

  const handleCanvasMouseLeave = () => {
    setHoveredArea(null)
  }

  return (
    <div className="anatomy-model">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={handleCanvasMouseLeave}
        className="anatomy-canvas"
      />
      {hoveredArea && (
        <div className="area-hint">
          Click to select <strong>{bodyAreas.find(a => a.id === hoveredArea)?.name}</strong>
        </div>
      )}
    </div>
  )
}

export default AnatomyModel
