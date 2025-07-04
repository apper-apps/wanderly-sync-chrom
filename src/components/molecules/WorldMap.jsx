import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const WorldMap = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Animation variants for floating dots
  const dotVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: [0, 1, 0.7, 1],
      scale: [0, 1, 1.2, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  }

  // Locations for animated dots (approximate coordinates)
  const locations = [
    { x: 15, y: 35, delay: 0 }, // Europe
    { x: 25, y: 45, delay: 0.5 }, // India
    { x: 35, y: 30, delay: 1 }, // East Asia
    { x: 45, y: 55, delay: 1.5 }, // Australia
    { x: 70, y: 40, delay: 2 }, // North America
    { x: 80, y: 60, delay: 2.5 }, // South America
    { x: 20, y: 55, delay: 3 }, // Africa
  ]

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        viewBox="0 0 100 70"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Simplified world map paths */}
        <motion.g
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.2"
          className="text-primary"
        >
          {/* North America */}
          <motion.path
            d="M5 20 Q10 15 15 20 Q20 25 25 20 Q30 15 35 25 Q40 30 35 35 Q30 40 25 35 Q20 30 15 35 Q10 30 5 25 Z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 0.5 }}
          />
          
          {/* South America */}
          <motion.path
            d="M25 35 Q30 40 28 50 Q26 60 24 65 Q22 60 20 55 Q18 45 22 40 Q24 35 25 35 Z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 1 }}
          />
          
          {/* Europe */}
          <motion.path
            d="M45 20 Q50 18 55 22 Q58 25 56 28 Q54 30 52 28 Q50 25 48 27 Q46 25 45 20 Z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 1.5 }}
          />
          
          {/* Africa */}
          <motion.path
            d="M48 30 Q52 35 54 45 Q56 55 52 60 Q48 58 46 50 Q44 40 46 35 Q47 30 48 30 Z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 2 }}
          />
          
          {/* Asia */}
          <motion.path
            d="M55 15 Q65 12 75 20 Q80 25 78 30 Q75 35 70 32 Q65 28 60 30 Q58 25 55 15 Z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 2.5 }}
          />
          
          {/* Australia */}
          <motion.path
            d="M70 50 Q75 48 80 52 Q82 55 78 57 Q74 55 70 50 Z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 3 }}
          />
        </motion.g>

        {/* Animated location dots */}
        {locations.map((location, index) => (
          <motion.circle
            key={index}
            cx={location.x}
            cy={location.y}
            r="0.8"
            fill="currentColor"
            className="text-accent"
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: location.delay }}
          />
        ))}

        {/* Animated connection lines */}
        <motion.g
          stroke="currentColor"
          strokeWidth="0.1"
          className="text-accent opacity-50"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, delay: 4 }}
        >
          <path d={`M${locations[0].x} ${locations[0].y} Q30 25 ${locations[1].x} ${locations[1].y}`} fill="none" />
          <path d={`M${locations[1].x} ${locations[1].y} Q40 35 ${locations[2].x} ${locations[2].y}`} fill="none" />
          <path d={`M${locations[2].x} ${locations[2].y} Q50 45 ${locations[3].x} ${locations[3].y}`} fill="none" />
          <path d={`M${locations[4].x} ${locations[4].y} Q60 30 ${locations[0].x} ${locations[0].y}`} fill="none" />
        </motion.g>
      </motion.svg>
    </div>
  )
}

export default WorldMap