import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import GroupCard from '@/components/molecules/GroupCard'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { groupService } from '@/services/api/groupService'
import { packageService } from '@/services/api/packageService'

const GroupTravel = () => {
  const [groups, setGroups] = useState([])
  const [filteredGroups, setFilteredGroups] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('join')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    packageId: '',
    departureDate: '',
    maxMembers: 6,
    description: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: ''
  })
  const navigate = useNavigate()

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [groupsData, packagesData] = await Promise.all([
        groupService.getAll(),
        packageService.getAll()
      ])
      
      setGroups(groupsData)
      setFilteredGroups(groupsData)
      setPackages(packagesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [groups, searchQuery, filterStatus])

  const applyFilters = () => {
    let filtered = [...groups]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(group =>
        group.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.leader.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(group => {
        const spotsLeft = group.maxMembers - group.currentMembers
        switch (filterStatus) {
          case 'available':
            return spotsLeft > 0
          case 'almost-full':
            return spotsLeft > 0 && spotsLeft <= 2
          case 'full':
            return spotsLeft === 0
          default:
            return true
        }
      })
    }

    setFilteredGroups(filtered)
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    
    try {
      const selectedPackage = packages.find(pkg => pkg.Id === parseInt(createFormData.packageId))
      if (!selectedPackage) {
        toast.error('Please select a package')
        return
      }

      const newGroup = {
        packageId: parseInt(createFormData.packageId),
        destination: selectedPackage.destination,
        departureDate: createFormData.departureDate,
        maxMembers: parseInt(createFormData.maxMembers),
        currentMembers: 1,
        leader: {
          name: createFormData.leaderName,
          email: createFormData.leaderEmail,
          phone: createFormData.leaderPhone
        },
        description: createFormData.description,
        status: 'open'
      }

      await groupService.create(newGroup)
      toast.success('Group created successfully!')
      setShowCreateForm(false)
      setCreateFormData({
        packageId: '',
        departureDate: '',
        maxMembers: 6,
        description: '',
        leaderName: '',
        leaderEmail: '',
        leaderPhone: ''
      })
      loadData()
    } catch (err) {
      toast.error('Failed to create group')
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const tabs = [
    { id: 'join', label: 'Join Groups', icon: 'UserPlus' },
    { id: 'create', label: 'Create Group', icon: 'Plus' },
  ]

  const statusFilters = [
    { value: 'all', label: 'All Groups' },
    { value: 'available', label: 'Available' },
    { value: 'almost-full', label: 'Almost Full' },
    { value: 'full', label: 'Full' },
  ]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading type="cards" />
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-success/10 to-info/10 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-display text-gray-800 mb-4"
            >
              Travel with Amazing People
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 mb-8 font-body"
            >
              Join existing groups or create your own and let others join your adventure.
              Make new friends and share unforgettable experiences together.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex space-x-1 p-1 bg-surface rounded-2xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-clay'
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
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'join' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search by destination or group leader..."
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="input-clay px-4 py-3 focus-clay"
                >
                  {statusFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Groups Grid */}
            {filteredGroups.length === 0 ? (
              <Empty
                title="No groups found"
                description="No groups match your search criteria. Try adjusting your filters or create a new group."
                actionText="Create Group"
                onAction={() => setActiveTab('create')}
                icon="Users"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group, index) => (
                  <GroupCard key={group.Id} group={group} index={index} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'create' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="card-clay p-8">
              <h2 className="text-2xl font-display text-gray-800 mb-6">Create New Group</h2>
              
              <form onSubmit={handleCreateGroup} className="space-y-6">
                {/* Package Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Package
                  </label>
                  <select
                    value={createFormData.packageId}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, packageId: e.target.value }))}
                    className="input-clay w-full px-4 py-3 focus-clay"
                    required
                  >
                    <option value="">Choose a destination package</option>
                    {packages.map(pkg => (
                      <option key={pkg.Id} value={pkg.Id}>
                        {pkg.title} - {pkg.destination} ({pkg.duration.days}D {pkg.duration.nights}N)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Departure Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={createFormData.departureDate}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, departureDate: e.target.value }))}
                    className="input-clay w-full px-4 py-3 focus-clay"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {/* Max Members */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Group Size
                  </label>
                  <select
                    value={createFormData.maxMembers}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                    className="input-clay w-full px-4 py-3 focus-clay"
                    required
                  >
                    {[...Array(11)].map((_, i) => (
                      <option key={i + 2} value={i + 2}>
                        {i + 2} people
                      </option>
                    ))}
                  </select>
                </div>

                {/* Leader Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={createFormData.leaderName}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, leaderName: e.target.value }))}
                      className="input-clay w-full px-4 py-3 focus-clay"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={createFormData.leaderPhone}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, leaderPhone: e.target.value }))}
                      className="input-clay w-full px-4 py-3 focus-clay"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={createFormData.leaderEmail}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, leaderEmail: e.target.value }))}
                    className="input-clay w-full px-4 py-3 focus-clay"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Description (Optional)
                  </label>
                  <textarea
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="input-clay w-full px-4 py-3 focus-clay"
                    rows="4"
                    placeholder="Tell potential group members about your travel style, interests, or what you're looking for in travel companions..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    className="btn-clay flex-1 bg-gradient-to-r from-success to-info text-white py-3 font-medium hover:from-success/90 hover:to-info/90 focus-clay"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ApperIcon name="Plus" size={20} />
                      Create Group
                    </div>
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => setActiveTab('join')}
                    className="btn-clay px-6 bg-surface text-gray-800 py-3 font-medium hover:bg-surface/80 focus-clay"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default GroupTravel