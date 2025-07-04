import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import PackageCard from '@/components/molecules/PackageCard'
import FilterSidebar from '@/components/molecules/FilterSidebar'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { packageService } from '@/services/api/packageService'

const Destinations = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [packages, setPackages] = useState([])
  const [filteredPackages, setFilteredPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('popular')
  const [filters, setFilters] = useState({
    duration: { min: 3, max: 15 },
    budget: { min: 5000, max: 50000 },
    destination: 'all',
    travelStyle: 'all',
    groupSize: 'all'
  })

  const loadPackages = async () => {
    try {
      setLoading(true)
      setError(null)
      const allPackages = await packageService.getAll()
      setPackages(allPackages)
      setFilteredPackages(allPackages)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPackages()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [packages, filters, searchParams])

  const applyFilters = () => {
    let filtered = [...packages]
    
    // Search filter
    const searchQuery = searchParams.get('search')
    if (searchQuery) {
      filtered = filtered.filter(pkg => 
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    const category = searchParams.get('category')
    if (category) {
      filtered = filtered.filter(pkg => 
        pkg.category?.toLowerCase() === category.toLowerCase()
      )
    }

    // Duration filter
    filtered = filtered.filter(pkg => 
      pkg.duration.days >= filters.duration.min && 
      pkg.duration.days <= filters.duration.max
    )

    // Budget filter
    filtered = filtered.filter(pkg => 
      pkg.price >= filters.budget.min && 
      pkg.price <= filters.budget.max
    )

    // Destination type filter
    if (filters.destination !== 'all') {
      filtered = filtered.filter(pkg => 
        pkg.category?.toLowerCase() === filters.destination
      )
    }

    // Travel style filter
    if (filters.travelStyle !== 'all') {
      filtered = filtered.filter(pkg => 
        pkg.travelStyle?.toLowerCase() === filters.travelStyle
      )
    }

    // Group size filter
    if (filters.groupSize !== 'all') {
      filtered = filtered.filter(pkg => {
        const hasGroups = pkg.groupsAvailable > 0
        switch (filters.groupSize) {
          case 'small':
            return hasGroups && pkg.maxGroupSize <= 6
          case 'medium':
            return hasGroups && pkg.maxGroupSize > 6 && pkg.maxGroupSize <= 12
          case 'large':
            return hasGroups && pkg.maxGroupSize > 12
          default:
            return true
        }
      })
    }

    // Sort packages
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'duration-short':
        filtered.sort((a, b) => a.duration.days - b.duration.days)
        break
      case 'duration-long':
        filtered.sort((a, b) => b.duration.days - a.duration.days)
        break
      case 'popular':
      default:
        filtered.sort((a, b) => b.groupsAvailable - a.groupsAvailable)
        break
    }

    setFilteredPackages(filtered)
  }

  const handleSearch = (query) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      if (query) {
        newParams.set('search', query)
      } else {
        newParams.delete('search')
      }
      return newParams
    })
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const clearAllFilters = () => {
    setFilters({
      duration: { min: 3, max: 15 },
      budget: { min: 5000, max: 50000 },
      destination: 'all',
      travelStyle: 'all',
      groupSize: 'all'
    })
    setSearchParams({})
  }

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
        <Error message={error} onRetry={loadPackages} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-surface to-secondary/20 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-display text-gray-800 mb-4"
            >
              Explore Destinations
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 mb-6 font-body"
            >
              Discover amazing places across India with our curated travel packages
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl"
            >
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search destinations, places, or experiences..."
              />
            </motion.div>
          </div>
        </div>
      </div>

{/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="card-clay p-6 sticky top-8 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isOpen={true}
                onClose={() => {}}
              />
            </div>
          </div>

          {/* Mobile Filter Sidebar */}
          <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
            <div className="relative z-10">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden btn-clay bg-surface text-gray-800 px-4 py-2 font-medium hover:bg-surface/80 focus-clay"
                >
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Filter" size={20} />
                    Filters
                  </div>
                </button>
                
                <div className="text-gray-600 font-body">
                  {filteredPackages.length} packages found
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-600 font-body">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-clay px-3 py-2 text-sm focus-clay"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="duration-short">Duration: Short to Long</option>
                  <option value="duration-long">Duration: Long to Short</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchParams.get('search') || searchParams.get('category') || 
              filters.destination !== 'all' || filters.travelStyle !== 'all' || 
              filters.groupSize !== 'all') && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchParams.get('search') && (
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      Search: {searchParams.get('search')}
                      <button
                        onClick={() => handleSearch('')}
                        className="hover:text-primary/80"
                      >
                        <ApperIcon name="X" size={14} />
                      </button>
                    </div>
                  )}
                  {searchParams.get('category') && (
                    <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      Category: {searchParams.get('category')}
                      <button
                        onClick={() => setSearchParams(prev => {
                          const newParams = new URLSearchParams(prev)
                          newParams.delete('category')
                          return newParams
                        })}
                        className="hover:text-accent/80"
                      >
                        <ApperIcon name="X" size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Package Grid */}
            {filteredPackages.length === 0 ? (
              <Empty
                title="No packages found"
                description="Try adjusting your filters or search for different destinations."
                actionText="Clear Filters"
                onAction={clearAllFilters}
                icon="Search"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPackages.map((pkg, index) => (
                  <PackageCard key={pkg.Id} package={pkg} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Destinations