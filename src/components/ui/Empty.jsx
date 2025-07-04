import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No results found", 
  description = "Try adjusting your search filters or explore different destinations.",
  actionText = "Explore Destinations",
  onAction,
  icon = "MapPin"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <motion.div
        className="w-32 h-32 rounded-full bg-gradient-to-br from-surface to-secondary/50 flex items-center justify-center mb-6 shadow-clay"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <ApperIcon name={icon} size={64} className="text-primary" />
      </motion.div>
      
      <h3 className="text-2xl font-display text-gray-800 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md font-body">
        {description}
      </p>
      
      {onAction && (
        <motion.button
          onClick={onAction}
          className="btn-clay bg-gradient-to-r from-primary to-accent text-white px-8 py-3 font-medium hover:from-primary/90 hover:to-accent/90 focus-clay"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-2">
            <ApperIcon name="Compass" size={20} />
            {actionText}
          </div>
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty