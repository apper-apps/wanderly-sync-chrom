import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { bookingService } from '@/services/api/bookingService'
import { packageService } from '@/services/api/packageService'

const MyTrips = () => {
  const [bookings, setBookings] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('bookingDate')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showCancelConfirm, setShowCancelConfirm] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [bookingsData, packagesData] = await Promise.all([
        bookingService.getAll(),
        packageService.getAll()
      ])
      
      setBookings(bookingsData)
      setPackages(packagesData)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load your trips')
    } finally {
      setLoading(false)
    }
  }

  const getPackageDetails = (packageId) => {
    return packages.find(pkg => pkg.Id === packageId)
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService.delete(bookingId)
      setBookings(prev => prev.filter(booking => booking.Id !== bookingId))
      toast.success('Booking cancelled successfully')
      setShowCancelConfirm(null)
    } catch (err) {
      toast.error('Failed to cancel booking')
    }
  }

  const handleViewDetails = (bookingId) => {
    navigate(`/booking-confirmation?bookingId=${bookingId}`)
  }

  const handleEditBooking = (bookingId) => {
    const booking = bookings.find(b => b.Id === bookingId)
    if (booking) {
      navigate(`/booking/${booking.packageId}?edit=${bookingId}`)
    }
  }

  const filteredAndSortedBookings = bookings
    .filter(booking => {
      const packageDetails = getPackageDetails(booking.packageId)
      const matchesSearch = !searchQuery || 
        packageDetails?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        packageDetails?.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.travelers.some(traveler => 
          traveler.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'bookingDate':
          aValue = new Date(a.bookingDate)
          bValue = new Date(b.bookingDate)
          break
        case 'departureDate':
          aValue = new Date(a.departureDate)
          bValue = new Date(b.departureDate)
          break
        case 'totalPrice':
          aValue = a.totalPrice
          bValue = b.totalPrice
          break
        case 'destination':
          const packageA = getPackageDetails(a.packageId)
          const packageB = getPackageDetails(b.packageId)
          aValue = packageA?.destination || ''
          bValue = packageB?.destination || ''
          break
        default:
          return 0
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success text-white'
      case 'pending':
        return 'bg-warning text-white'
      case 'cancelled':
        return 'bg-error text-white'
      default:
        return 'bg-info text-white'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return 'CheckCircle'
      case 'pending':
        return 'Clock'
      case 'cancelled':
        return 'XCircle'
      default:
        return 'Info'
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            className="text-4xl font-display text-primary mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            My Trips
          </motion.h1>
          <p className="text-gray-600 font-body">
            Manage your travel bookings and upcoming adventures
          </p>
        </div>

        {/* Search and Filters */}
        <motion.div 
          className="card-clay p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-clay pl-10 w-full"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-clay"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-clay"
            >
              <option value="bookingDate">Booking Date</option>
              <option value="departureDate">Departure Date</option>
              <option value="totalPrice">Price</option>
              <option value="destination">Destination</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="btn-clay bg-surface hover:bg-primary hover:text-white px-4 py-2 flex items-center justify-center space-x-2"
            >
              <ApperIcon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={16} />
              <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
            </button>
          </div>
        </motion.div>

        {/* Bookings List */}
        {filteredAndSortedBookings.length === 0 ? (
          <Empty 
            icon="Calendar"
            title="No trips found"
            description="You haven't booked any trips yet, or no trips match your search criteria."
            actionText="Explore Destinations"
            onAction={() => navigate('/destinations')}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAndSortedBookings.map((booking, index) => {
              const packageDetails = getPackageDetails(booking.packageId)
              
              return (
                <motion.div
                  key={booking.Id}
                  className="card-clay overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Package Image */}
                  <div className="relative h-48 bg-gradient-to-r from-primary to-accent">
                    <img 
                      src={packageDetails?.image} 
                      alt={packageDetails?.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        <ApperIcon name={getStatusIcon(booking.status)} size={16} className="inline mr-1" />
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-display text-primary mb-1">
                          {packageDetails?.name}
                        </h3>
                        <p className="text-gray-600 font-body flex items-center">
                          <ApperIcon name="MapPin" size={16} className="mr-1" />
                          {packageDetails?.destination}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-display text-primary">
                          ₹{booking.totalPrice.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.travelers.length} traveler{booking.travelers.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Travel Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Departure Date</p>
                        <p className="font-medium flex items-center">
                          <ApperIcon name="Calendar" size={16} className="mr-1" />
                          {format(new Date(booking.departureDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Booking Date</p>
                        <p className="font-medium flex items-center">
                          <ApperIcon name="Clock" size={16} className="mr-1" />
                          {format(new Date(booking.bookingDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>

                    {/* Travelers */}
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-2">Travelers</p>
                      <div className="flex flex-wrap gap-2">
                        {booking.travelers.map((traveler, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-surface rounded-full text-sm font-medium"
                          >
                            {traveler.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewDetails(booking.Id)}
                        className="btn-clay bg-primary text-white hover:bg-primary/90 px-4 py-2 flex items-center space-x-2"
                      >
                        <ApperIcon name="Eye" size={16} />
                        <span>View Details</span>
                      </button>
                      
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleEditBooking(booking.Id)}
                          className="btn-clay bg-accent text-white hover:bg-accent/90 px-4 py-2 flex items-center space-x-2"
                        >
                          <ApperIcon name="Edit" size={16} />
                          <span>Edit</span>
                        </button>
                      )}
                      
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => setShowCancelConfirm(booking.Id)}
                          className="btn-clay bg-error text-white hover:bg-error/90 px-4 py-2 flex items-center space-x-2"
                        >
                          <ApperIcon name="X" size={16} />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="card-clay max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="text-center">
              <ApperIcon name="AlertTriangle" size={48} className="mx-auto text-warning mb-4" />
              <h3 className="text-xl font-display text-primary mb-2">
                Cancel Booking
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCancelConfirm(null)}
                  className="btn-clay bg-surface hover:bg-gray-100 px-4 py-2 flex-1"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => handleCancelBooking(showCancelConfirm)}
                  className="btn-clay bg-error text-white hover:bg-error/90 px-4 py-2 flex-1"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default MyTrips