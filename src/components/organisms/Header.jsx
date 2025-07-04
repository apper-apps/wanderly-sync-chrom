import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const navItems = [
    { name: 'Destinations', path: '/destinations', icon: 'MapPin' },
    { name: 'Group Travel', path: '/group-travel', icon: 'Users' },
    { name: 'My Trips', path: '/my-trips', icon: 'Calendar' },
  ]

  const handleSearch = (query) => {
    navigate(`/destinations?search=${encodeURIComponent(query)}`)
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-clay"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Compass" size={24} className="text-white" />
            </motion.div>
            <span className="text-2xl font-display text-primary">Wanderly</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-clay'
                      : 'text-gray-700 hover:bg-surface hover:text-primary'
                  }`
                }
              >
                <ApperIcon name={item.icon} size={20} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-xl bg-surface text-primary shadow-clay"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
          </motion.button>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-t border-white/20"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                        isActive
                          ? 'bg-gradient-to-r from-primary to-accent text-white shadow-clay'
                          : 'text-gray-700 hover:bg-surface hover:text-primary'
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ApperIcon name={item.icon} size={20} />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header