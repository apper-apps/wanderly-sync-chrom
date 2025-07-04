import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'

const GroupCard = ({ group, index = 0 }) => {
  const navigate = useNavigate()

  const handleJoinGroup = () => {
    navigate(`/booking/${group.packageId}?groupId=${group.Id}`)
  }

  const spotsLeft = group.maxMembers - group.currentMembers
  const isAlmostFull = spotsLeft <= 2
  const isFull = spotsLeft === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-clay p-6 group hover:shadow-clay-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-display text-gray-800 mb-1">
            {group.destination}
          </h3>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <ApperIcon name="Calendar" size={14} />
            <span>{format(new Date(group.departureDate), 'MMM dd, yyyy')}</span>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isFull 
            ? 'bg-error text-white' 
            : isAlmostFull 
              ? 'bg-warning text-white' 
              : 'bg-success text-white'
        }`}>
          {isFull ? 'Full' : isAlmostFull ? 'Almost Full' : 'Available'}
        </div>
      </div>
      
      {/* Group Leader */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
          <ApperIcon name="User" size={20} className="text-white" />
        </div>
        <div>
          <div className="font-medium text-gray-800">{group.leader.name}</div>
          <div className="text-sm text-gray-600">Group Leader</div>
        </div>
      </div>
      
      {/* Members Count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ApperIcon name="Users" size={16} className="text-gray-600" />
          <span className="text-gray-600">
            {group.currentMembers} / {group.maxMembers} members
          </span>
        </div>
        
        <div className="text-sm text-gray-600">
          {spotsLeft} spots left
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-surface rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-primary to-accent rounded-full h-2 transition-all duration-300"
          style={{ width: `${(group.currentMembers / group.maxMembers) * 100}%` }}
        />
      </div>
      
      {/* Join Button */}
      <motion.button
        onClick={handleJoinGroup}
        disabled={isFull}
        className={`btn-clay w-full py-3 font-medium focus-clay ${
          isFull
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90'
        }`}
        whileHover={!isFull ? { scale: 1.02 } : {}}
        whileTap={!isFull ? { scale: 0.98 } : {}}
      >
        {isFull ? 'Group Full' : 'Join Group'}
      </motion.button>
    </motion.div>
  )
}

export default GroupCard