import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ onSearch, placeholder = "Search destinations..." }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <motion.div
        className="relative"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="input-clay w-full pl-12 pr-4 py-3 text-gray-800 placeholder-gray-500 font-body"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <ApperIcon name="Search" size={20} className="text-gray-400" />
        </div>
        {query && (
          <motion.button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="X" size={16} />
          </motion.button>
        )}
      </motion.div>
    </form>
  )
}

export default SearchBar