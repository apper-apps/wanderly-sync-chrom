import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry, showRetry = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <motion.div
        className="w-24 h-24 rounded-full bg-gradient-to-br from-error to-error/80 flex items-center justify-center mb-6 shadow-clay"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <ApperIcon name="AlertCircle" size={48} className="text-white" />
      </motion.div>
      
      <h3 className="text-2xl font-display text-gray-800 mb-3">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md font-body">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <motion.button
          onClick={onRetry}
          className="btn-clay bg-gradient-to-r from-primary to-accent text-white px-8 py-3 font-medium hover:from-primary/90 hover:to-accent/90 focus-clay"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-2">
            <ApperIcon name="RefreshCw" size={20} />
            Try Again
          </div>
        </motion.button>
      )}
    </motion.div>
  )
}

export default Error