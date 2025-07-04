import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const FilterSidebar = ({ filters, onFiltersChange, isOpen, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleRangeChange = (key, min, max) => {
    const newFilters = { ...localFilters, [key]: { min, max } }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      duration: { min: 3, max: 15 },
      budget: { min: 5000, max: 50000 },
      destination: 'all',
      travelStyle: 'all',
      groupSize: 'all'
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const FilterSection = ({ title, children, isCollapsible = true }) => {
    const [isExpanded, setIsExpanded] = useState(true)

    return (
      <div className="mb-6">
        {isCollapsible ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full mb-3 text-left"
          >
            <h3 className="font-display text-gray-800">{title}</h3>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ApperIcon name="ChevronDown" size={20} className="text-gray-600" />
            </motion.div>
          </button>
        ) : (
          <h3 className="font-display text-gray-800 mb-3">{title}</h3>
        )}
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed left-0 top-0 h-full w-80 bg-background shadow-clay-lg z-50 lg:static lg:w-full lg:h-auto lg:shadow-none lg:bg-transparent lg:translate-x-0"
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-display text-gray-800">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-surface text-gray-600 hover:text-gray-800"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <h2 className="text-xl font-display text-gray-800">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Clear All
            </button>
          </div>

          {/* Duration Filter */}
          <FilterSection title="Duration">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{localFilters.duration.min} days</span>
                <span>{localFilters.duration.max} days</span>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Min Days</label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={localFilters.duration.min}
                  onChange={(e) => handleRangeChange('duration', parseInt(e.target.value), localFilters.duration.max)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Max Days</label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={localFilters.duration.max}
                  onChange={(e) => handleRangeChange('duration', localFilters.duration.min, parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </FilterSection>

          {/* Budget Filter */}
          <FilterSection title="Budget">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>₹{localFilters.budget.min.toLocaleString()}</span>
                <span>₹{localFilters.budget.max.toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Min Budget</label>
                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="1000"
                  value={localFilters.budget.min}
                  onChange={(e) => handleRangeChange('budget', parseInt(e.target.value), localFilters.budget.max)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Max Budget</label>
                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="1000"
                  value={localFilters.budget.max}
                  onChange={(e) => handleRangeChange('budget', localFilters.budget.min, parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </FilterSection>

          {/* Destination Type Filter */}
          <FilterSection title="Destination Type">
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Destinations' },
                { value: 'mountains', label: 'Mountains' },
                { value: 'beaches', label: 'Beaches' },
                { value: 'cities', label: 'Cities' },
                { value: 'wildlife', label: 'Wildlife' },
                { value: 'heritage', label: 'Heritage' },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="destination"
                    value={option.value}
                    checked={localFilters.destination === option.value}
                    onChange={(e) => handleFilterChange('destination', e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary/30"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Travel Style Filter */}
          <FilterSection title="Travel Style">
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Styles' },
                { value: 'adventure', label: 'Adventure' },
                { value: 'relaxation', label: 'Relaxation' },
                { value: 'cultural', label: 'Cultural' },
                { value: 'luxury', label: 'Luxury' },
                { value: 'budget', label: 'Budget' },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="travelStyle"
                    value={option.value}
                    checked={localFilters.travelStyle === option.value}
                    onChange={(e) => handleFilterChange('travelStyle', e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary/30"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Group Size Filter */}
          <FilterSection title="Group Size">
            <div className="space-y-2">
              {[
                { value: 'all', label: 'Any Size' },
                { value: 'small', label: 'Small (2-6 people)' },
                { value: 'medium', label: 'Medium (7-12 people)' },
                { value: 'large', label: 'Large (13+ people)' },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="groupSize"
                    value={option.value}
                    checked={localFilters.groupSize === option.value}
                    onChange={(e) => handleFilterChange('groupSize', e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary/30"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Mobile Clear Button */}
          <div className="lg:hidden">
            <button
              onClick={clearFilters}
              className="btn-clay w-full bg-gradient-to-r from-primary to-accent text-white py-3 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default FilterSidebar