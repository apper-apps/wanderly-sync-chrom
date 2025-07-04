import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { packageService } from '@/services/api/packageService'
import { groupService } from '@/services/api/groupService'
import { bookingService } from '@/services/api/bookingService'

const Booking = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [package_details, setPackageDetails] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    travelers: [{ name: '', email: '', phone: '', age: '' }],
    departureDate: '',
    specialRequests: '',
    emergencyContact: { name: '', phone: '', relation: '' }
  })

  const groupId = searchParams.get('groupId')
  const isCreatingGroup = searchParams.get('createGroup') === 'true'

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const packageData = await packageService.getById(parseInt(id))
      setPackageDetails(packageData)
      
      if (groupId) {
        const groupData = await groupService.getById(parseInt(groupId))
        setSelectedGroup(groupData)
        setBookingData(prev => ({ ...prev, departureDate: groupData.departureDate }))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id, groupId])

  const addTraveler = () => {
    setBookingData(prev => ({
      ...prev,
      travelers: [...prev.travelers, { name: '', email: '', phone: '', age: '' }]
    }))
  }

  const removeTraveler = (index) => {
    if (bookingData.travelers.length > 1) {
      setBookingData(prev => ({
        ...prev,
        travelers: prev.travelers.filter((_, i) => i !== index)
      }))
    }
  }

  const updateTraveler = (index, field, value) => {
    setBookingData(prev => ({
      ...prev,
      travelers: prev.travelers.map((traveler, i) => 
        i === index ? { ...traveler, [field]: value } : traveler
      )
    }))
  }

  const calculateTotal = () => {
    if (!package_details) return 0
    const basePrice = package_details.price * bookingData.travelers.length
    const taxes = basePrice * 0.18 // 18% GST
    return Math.round(basePrice + taxes)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const booking = {
        packageId: parseInt(id),
        groupId: selectedGroup?.Id || null,
        travelers: bookingData.travelers,
        departureDate: bookingData.departureDate,
        specialRequests: bookingData.specialRequests,
        emergencyContact: bookingData.emergencyContact,
        totalPrice: calculateTotal(),
        bookingDate: new Date().toISOString()
      }

      await bookingService.create(booking)
      toast.success('Booking confirmed successfully!')
      navigate('/booking-confirmation', { 
        state: { 
          booking, 
          package: package_details, 
          group: selectedGroup 
        } 
      })
    } catch (err) {
      toast.error('Failed to create booking')
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

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
        <Error message={error} onRetry={loadData} />
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
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-clay p-6 mb-8"
          >
            <div className="flex items-center gap-4">
              <img
                src={package_details.images[0]}
                alt={package_details.title}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <h1 className="text-2xl font-display text-gray-800">{package_details.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <span>{package_details.destination}</span>
                  <span>•</span>
                  <span>{package_details.duration.days}D {package_details.duration.nights}N</span>
                  {selectedGroup && (
                    <>
                      <span>•</span>
                      <span className="text-success font-medium">Group Booking</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Progress Steps */}
          <div className="card-clay p-6 mb-8">
            <div className="flex items-center justify-between">
              {['Travelers', 'Details', 'Payment'].map((stepName, index) => (
                <div key={stepName} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step > index + 1 
                      ? 'bg-success text-white' 
                      : step === index + 1 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > index + 1 ? <ApperIcon name="Check" size={16} /> : index + 1}
                  </div>
                  <span className={`ml-2 ${step === index + 1 ? 'text-primary font-medium' : 'text-gray-500'}`}>
                    {stepName}
                  </span>
                  {index < 2 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      step > index + 1 ? 'bg-success' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card-clay p-6"
                  >
                    <h2 className="text-xl font-display text-gray-800 mb-6">Traveler Information</h2>
                    
                    {bookingData.travelers.map((traveler, index) => (
                      <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-800">Traveler {index + 1}</h3>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeTraveler(index)}
                              className="text-error hover:text-error/80"
                            >
                              <ApperIcon name="Trash2" size={20} />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={traveler.name}
                              onChange={(e) => updateTraveler(index, 'name', e.target.value)}
                              className="input-clay w-full px-4 py-3 focus-clay"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Age
                            </label>
                            <input
                              type="number"
                              value={traveler.age}
                              onChange={(e) => updateTraveler(index, 'age', e.target.value)}
                              className="input-clay w-full px-4 py-3 focus-clay"
                              min="1"
                              max="100"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              value={traveler.email}
                              onChange={(e) => updateTraveler(index, 'email', e.target.value)}
                              className="input-clay w-full px-4 py-3 focus-clay"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone
                            </label>
                            <input
                              type="tel"
                              value={traveler.phone}
                              onChange={(e) => updateTraveler(index, 'phone', e.target.value)}
                              className="input-clay w-full px-4 py-3 focus-clay"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addTraveler}
                      className="btn-clay bg-surface text-gray-800 px-4 py-2 font-medium hover:bg-surface/80 focus-clay mb-6"
                    >
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Plus" size={16} />
                        Add Traveler
                      </div>
                    </button>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn-clay bg-gradient-to-r from-primary to-accent text-white px-6 py-3 font-medium hover:from-primary/90 hover:to-accent/90 focus-clay"
                      >
                        Next Step
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card-clay p-6"
                  >
                    <h2 className="text-xl font-display text-gray-800 mb-6">Trip Details</h2>
                    
                    {!selectedGroup && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Departure Date
                        </label>
                        <input
                          type="date"
                          value={bookingData.departureDate}
                          onChange={(e) => setBookingData(prev => ({ ...prev, departureDate: e.target.value }))}
                          className="input-clay w-full px-4 py-3 focus-clay"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        value={bookingData.emergencyContact.name}
                        onChange={(e) => setBookingData(prev => ({ 
                          ...prev, 
                          emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                        }))}
                        className="input-clay w-full px-4 py-3 focus-clay"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Emergency Contact Phone
                        </label>
                        <input
                          type="tel"
                          value={bookingData.emergencyContact.phone}
                          onChange={(e) => setBookingData(prev => ({ 
                            ...prev, 
                            emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                          }))}
                          className="input-clay w-full px-4 py-3 focus-clay"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Relationship
                        </label>
                        <input
                          type="text"
                          value={bookingData.emergencyContact.relation}
                          onChange={(e) => setBookingData(prev => ({ 
                            ...prev, 
                            emergencyContact: { ...prev.emergencyContact, relation: e.target.value }
                          }))}
                          className="input-clay w-full px-4 py-3 focus-clay"
                          placeholder="e.g., Spouse, Parent, Sibling"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        value={bookingData.specialRequests}
                        onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                        className="input-clay w-full px-4 py-3 focus-clay"
                        rows="4"
                        placeholder="Dietary restrictions, accessibility needs, special occasions, etc."
                      />
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn-clay bg-surface text-gray-800 px-6 py-3 font-medium hover:bg-surface/80 focus-clay"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn-clay bg-gradient-to-r from-primary to-accent text-white px-6 py-3 font-medium hover:from-primary/90 hover:to-accent/90 focus-clay"
                      >
                        Review & Pay
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card-clay p-6"
                  >
                    <h2 className="text-xl font-display text-gray-800 mb-6">Payment</h2>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-800 mb-4">Select Payment Method</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="radio" name="payment" value="card" className="text-primary" defaultChecked />
                          <div className="flex items-center gap-2">
                            <ApperIcon name="CreditCard" size={20} />
                            <span>Credit/Debit Card</span>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="radio" name="payment" value="upi" className="text-primary" />
                          <div className="flex items-center gap-2">
                            <ApperIcon name="Smartphone" size={20} />
                            <span>UPI</span>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="radio" name="payment" value="netbanking" className="text-primary" />
                          <div className="flex items-center gap-2">
                            <ApperIcon name="Building" size={20} />
                            <span>Net Banking</span>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn-clay bg-surface text-gray-800 px-6 py-3 font-medium hover:bg-surface/80 focus-clay"
                      >
                        Previous
                      </button>
                      <button
                        type="submit"
                        className="btn-clay bg-gradient-to-r from-success to-info text-white px-6 py-3 font-medium hover:from-success/90 hover:to-info/90 focus-clay"
                      >
                        <div className="flex items-center gap-2">
                          <ApperIcon name="CreditCard" size={20} />
                          Pay ₹{calculateTotal().toLocaleString()}
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Summary */}
              <div className="card-clay p-6 sticky top-24">
                <h3 className="text-lg font-display text-gray-800 mb-4">Booking Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package Price</span>
                    <span className="font-medium">₹{package_details.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travelers</span>
                    <span className="font-medium">×{bookingData.travelers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{(package_details.price * bookingData.travelers.length).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">₹{Math.round(package_details.price * bookingData.travelers.length * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-display text-gray-800">Total</span>
                      <span className="text-lg font-display text-primary">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {selectedGroup && (
                  <div className="bg-success/10 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ApperIcon name="Users" size={16} className="text-success" />
                      <span className="font-medium text-success">Group Booking</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Leader: {selectedGroup.leader.name}</div>
                      <div>Departure: {new Date(selectedGroup.departureDate).toLocaleDateString()}</div>
                      <div>Group Size: {selectedGroup.currentMembers + bookingData.travelers.length}/{selectedGroup.maxMembers}</div>
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Shield" size={12} />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="RefreshCw" size={12} />
                    <span>Free cancellation up to 48 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Phone" size={12} />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking