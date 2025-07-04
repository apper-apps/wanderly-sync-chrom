import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const PackageCard = ({ package: pkg, index = 0 }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/package/${pkg.Id}`)
  }

  const handleBookNow = (e) => {
    e.stopPropagation()
    navigate(`/booking/${pkg.Id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-clay overflow-hidden cursor-pointer group"
      onClick={handleClick}
      whileHover={{ y: -5 }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={pkg.images[0]}
          alt={pkg.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Duration Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-800 shadow-clay">
            {pkg.duration.days}D {pkg.duration.nights}N
          </div>
        </div>
        
        {/* Group Badge */}
        {pkg.groupsAvailable > 0 && (
          <div className="absolute top-4 right-4">
            <div className="bg-success/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-white shadow-clay flex items-center gap-1">
              <ApperIcon name="Users" size={14} />
              {pkg.groupsAvailable} Groups
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-display text-gray-800 mb-2 group-hover:text-primary transition-colors">
          {pkg.title}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <ApperIcon name="MapPin" size={16} />
          <span className="font-body">{pkg.destination}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <ApperIcon name="Calendar" size={14} />
              <span>{pkg.duration.days} Days</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Star" size={14} className="text-warning" />
              <span>4.8</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-display text-primary">
              ₹{pkg.price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">per person</div>
          </div>
        </div>
        
        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {pkg.inclusions.slice(0, 3).map((inclusion, idx) => (
            <div
              key={idx}
              className="bg-surface/50 rounded-full px-3 py-1 text-xs font-medium text-gray-700"
            >
              {inclusion}
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <motion.button
          onClick={handleBookNow}
          className="btn-clay w-full bg-gradient-to-r from-primary to-accent text-white py-3 font-medium hover:from-primary/90 hover:to-accent/90 focus-clay"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Book Now
        </motion.button>
      </div>
    </motion.div>
  )
}

export default PackageCard