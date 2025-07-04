import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const BookingConfirmation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { booking, package: pkg, group } = location.state || {}

  useEffect(() => {
    if (!booking) {
      navigate('/')
    }
  }, [booking, navigate])

  if (!booking) {
    return null
  }

  const handleGoHome = () => {
    navigate('/')
  }

  const handleViewPackage = () => {
    navigate(`/package/${pkg.Id}`)
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-success to-info flex items-center justify-center shadow-clay-lg"
          >
            <ApperIcon name="CheckCircle" size={48} className="text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-display text-gray-800 mb-4"
          >
            Booking Confirmed! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mb-8 font-body"
          >
            Your adventure is all set! We've sent a confirmation email with all the details.
          </motion.p>

          {/* Booking Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-clay p-8 text-left mb-8"
          >
            <h2 className="text-xl font-display text-gray-800 mb-6">Booking Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={pkg.images[0]}
                  alt={pkg.title}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-800">{pkg.title}</h3>
                  <p className="text-gray-600">{pkg.destination}</p>
                  <p className="text-sm text-gray-500">{pkg.duration.days}D {pkg.duration.nights}N</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <span className="text-sm text-gray-600">Booking ID</span>
                  <p className="font-medium text-gray-800">WDR{booking.Id?.toString().padStart(6, '0')}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Departure Date</span>
                  <p className="font-medium text-gray-800">
                    {new Date(booking.departureDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Travelers</span>
                  <p className="font-medium text-gray-800">{booking.travelers.length} people</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Total Amount</span>
                  <p className="font-medium text-primary">₹{booking.totalPrice.toLocaleString()}</p>
                </div>
              </div>

              {group && (
                <div className="bg-success/10 rounded-xl p-4 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ApperIcon name="Users" size={16} className="text-success" />
                    <span className="font-medium text-success">Group Booking</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    You've joined {group.leader.name}'s group. You'll receive group coordination details via email.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-clay p-6 mb-8"
          >
            <h3 className="text-lg font-display text-gray-800 mb-4">What's Next?</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <ApperIcon name="Mail" size={16} className="text-primary mt-0.5" />
                <span>Check your email for detailed booking confirmation and itinerary</span>
              </div>
              <div className="flex items-start gap-3">
                <ApperIcon name="Phone" size={16} className="text-primary mt-0.5" />
                <span>Our travel coordinator will contact you 48 hours before departure</span>
              </div>
              <div className="flex items-start gap-3">
                <ApperIcon name="Calendar" size={16} className="text-primary mt-0.5" />
                <span>Add the travel dates to your calendar and start packing!</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleGoHome}
              className="btn-clay bg-gradient-to-r from-primary to-accent text-white px-8 py-3 font-medium hover:from-primary/90 hover:to-accent/90 focus-clay"
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="Home" size={20} />
                Back to Home
              </div>
            </button>
            
            <button
              onClick={handleViewPackage}
              className="btn-clay bg-surface text-gray-800 px-8 py-3 font-medium hover:bg-surface/80 focus-clay"
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="Eye" size={20} />
                View Package
              </div>
            </button>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-600 mb-2">Need help? We're here for you!</p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <ApperIcon name="Phone" size={14} className="text-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Mail" size={14} className="text-primary" />
                <span>support@wanderly.com</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation