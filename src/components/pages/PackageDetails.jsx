import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import GroupCard from '@/components/molecules/GroupCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { packageService } from '@/services/api/packageService'
import { groupService } from '@/services/api/groupService'

const PackageDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [package_details, setPackageDetails] = useState(null)
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const loadPackageDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [packageData, groupsData] = await Promise.all([
        packageService.getById(parseInt(id)),
        groupService.getByPackageId(parseInt(id))
      ])
      
      setPackageDetails(packageData)
      setGroups(groupsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPackageDetails()
  }, [id])

  const handleBookNow = () => {
    navigate(`/booking/${id}`)
  }

  const handleCreateGroup = () => {
    navigate(`/booking/${id}?createGroup=true`)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'itinerary', label: 'Itinerary', icon: 'Calendar' },
    { id: 'inclusions', label: 'Inclusions', icon: 'CheckCircle' },
    { id: 'groups', label: 'Groups', icon: 'Users' },
  ]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading type="detail" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Error message={error} onRetry={loadPackageDetails} />
      </div>
    )
  }

  if (!package_details) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Error message="Package not found" showRetry={false} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={package_details.images[currentImageIndex]}
            alt={package_details.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        
        {/* Image Navigation */}
        {package_details.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {package_details.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-gray-800">
                  {package_details.duration.days}D {package_details.duration.nights}N
                </div>
                {package_details.groupsAvailable > 0 && (
                  <div className="bg-success/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-white flex items-center gap-2">
                    <ApperIcon name="Users" size={16} />
                    {package_details.groupsAvailable} Groups Available
                  </div>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-display text-white mb-4">
                {package_details.title}
              </h1>
              
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <ApperIcon name="MapPin" size={20} />
                  <span className="font-body">{package_details.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Star" size={20} className="text-warning" />
                  <span>4.8 (124 reviews)</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <ApperIcon name={tab.icon} size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="card-clay p-6">
                  <h2 className="text-2xl font-display text-gray-800 mb-4">About This Package</h2>
                  <p className="text-gray-600 font-body leading-relaxed">
                    {package_details.description}
                  </p>
                </div>
                
                <div className="card-clay p-6">
                  <h3 className="text-xl font-display text-gray-800 mb-4">Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {package_details.highlights?.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <ApperIcon name="CheckCircle" size={20} className="text-success mt-1" />
                        <span className="text-gray-700 font-body">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'itinerary' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {package_details.itinerary?.map((day, index) => (
                  <div key={index} className="card-clay p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-display text-gray-800">{day.title}</h3>
                        <p className="text-gray-600 font-body">{day.location}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 font-body ml-16">{day.description}</p>
                    {day.activities && (
                      <div className="ml-16 mt-4">
                        <h4 className="font-medium text-gray-800 mb-2">Activities:</h4>
                        <ul className="space-y-1">
                          {day.activities.map((activity, actIndex) => (
                            <li key={actIndex} className="text-gray-600 font-body flex items-center gap-2">
                              <ApperIcon name="Dot" size={16} />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'inclusions' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="card-clay p-6">
                  <h2 className="text-2xl font-display text-gray-800 mb-6">What's Included</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {package_details.inclusions?.map((inclusion, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <ApperIcon name="CheckCircle" size={20} className="text-success mt-1" />
                        <span className="text-gray-700 font-body">{inclusion}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {package_details.exclusions && (
                  <div className="card-clay p-6">
                    <h2 className="text-2xl font-display text-gray-800 mb-6">What's Not Included</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {package_details.exclusions.map((exclusion, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <ApperIcon name="X" size={20} className="text-error mt-1" />
                          <span className="text-gray-700 font-body">{exclusion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'groups' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="card-clay p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display text-gray-800">Available Groups</h2>
                    <button
                      onClick={handleCreateGroup}
                      className="btn-clay bg-gradient-to-r from-success to-info text-white px-4 py-2 font-medium hover:from-success/90 hover:to-info/90 focus-clay"
                    >
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Plus" size={16} />
                        Create Group
                      </div>
                    </button>
                  </div>
                  
                  {groups.length === 0 ? (
                    <div className="text-center py-8">
                      <ApperIcon name="Users" size={48} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-body">No groups available yet. Be the first to create one!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groups.map((group, index) => (
                        <GroupCard key={group.Id} group={group} index={index} />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="card-clay p-6 sticky top-32">
              <div className="text-center mb-6">
                <div className="text-3xl font-display text-primary mb-2">
                  ₹{package_details.price.toLocaleString()}
                </div>
                <div className="text-gray-600 font-body">per person</div>
              </div>
              
              <div className="space-y-4">
                <motion.button
                  onClick={handleBookNow}
                  className="btn-clay w-full bg-gradient-to-r from-primary to-accent text-white py-3 font-medium hover:from-primary/90 hover:to-accent/90 focus-clay"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Book Now
                </motion.button>
                
                {groups.length > 0 && (
                  <motion.button
                    onClick={() => setActiveTab('groups')}
                    className="btn-clay w-full bg-surface text-gray-800 py-3 font-medium hover:bg-surface/80 focus-clay"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ApperIcon name="Users" size={20} />
                      Join Group ({groups.length})
                    </div>
                  </motion.button>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{package_details.duration.days} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Group Size:</span>
                    <span className="font-medium">2-{package_details.maxGroupSize || 12} people</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Available Groups:</span>
                    <span className="font-medium">{package_details.groupsAvailable}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="card-clay p-6">
              <h3 className="text-xl font-display text-gray-800 mb-4">Need Help?</h3>
              <p className="text-gray-600 font-body mb-4">
                Our travel experts are here to help you plan your perfect trip.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <ApperIcon name="Phone" size={16} className="text-primary" />
                  <span className="text-gray-700 font-body">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <ApperIcon name="Mail" size={16} className="text-primary" />
                  <span className="text-gray-700 font-body">help@wanderly.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PackageDetails