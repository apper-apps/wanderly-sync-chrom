import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import PackageCard from '@/components/molecules/PackageCard'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { packageService } from '@/services/api/packageService'

const Home = () => {
  const [featuredPackages, setFeaturedPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const loadFeaturedPackages = async () => {
    try {
      setLoading(true)
      setError(null)
      const packages = await packageService.getAll()
      setFeaturedPackages(packages.slice(0, 6))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeaturedPackages()
  }, [])

  const handleSearch = (query) => {
    navigate(`/destinations?search=${encodeURIComponent(query)}`)
  }

  const handleExploreAll = () => {
    navigate('/destinations')
  }

  const handleViewGroupTravel = () => {
    navigate('/group-travel')
  }

  const categories = [
    { name: 'Mountains', icon: 'Mountain', color: 'from-primary to-accent' },
    { name: 'Beaches', icon: 'Waves', color: 'from-accent to-info' },
    { name: 'Cities', icon: 'Building', color: 'from-secondary to-warning' },
    { name: 'Wildlife', icon: 'TreePine', color: 'from-success to-primary' },
    { name: 'Heritage', icon: 'Castle', color: 'from-warning to-error' },
    { name: 'Adventure', icon: 'Zap', color: 'from-error to-primary' },
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
        <Error message={error} onRetry={loadFeaturedPackages} />
      </div>
    )
  }

return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-background via-surface to-secondary/20 hero-bg-travelers">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-display text-gray-800 mb-6"
            >
              Discover Your Perfect
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}Holiday
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 font-body"
            >
              Explore amazing destinations across India with curated packages for 3+ days.
              Travel solo or join groups heading to the same amazing places.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <SearchBar onSearch={handleSearch} placeholder="Where do you want to go?" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display text-gray-800 mb-4">
              Explore by Category
            </h2>
            <p className="text-gray-600 font-body">
              Choose your adventure style and discover amazing destinations
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-clay p-6 text-center cursor-pointer group"
                onClick={() => navigate(`/destinations?category=${category.name.toLowerCase()}`)}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-clay group-hover:scale-110 transition-transform`}>
                  <ApperIcon name={category.icon} size={32} className="text-white" />
                </div>
                <h3 className="font-display text-gray-800 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-16 bg-gradient-to-br from-surface/20 to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display text-gray-800 mb-4">
              Featured Packages
            </h2>
            <p className="text-gray-600 font-body">
              Handpicked destinations perfect for your next adventure
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredPackages.map((pkg, index) => (
              <PackageCard key={pkg.Id} package={pkg} index={index} />
            ))}
          </div>

          <div className="text-center">
            <motion.button
              onClick={handleExploreAll}
              className="btn-clay bg-gradient-to-r from-primary to-accent text-white px-8 py-3 font-medium hover:from-primary/90 hover:to-accent/90 focus-clay"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="Compass" size={20} />
                Explore All Destinations
              </div>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Group Travel Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="card-clay p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-success to-info flex items-center justify-center shadow-clay">
                <ApperIcon name="Users" size={48} className="text-white" />
              </div>
              
              <h2 className="text-3xl font-display text-gray-800 mb-4">
                Travel with Amazing People
              </h2>
              
              <p className="text-gray-600 mb-8 font-body">
                Join existing groups heading to your dream destination or create your own group 
                and let others join you. Make new friends and share unforgettable experiences!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={handleViewGroupTravel}
                  className="btn-clay bg-gradient-to-r from-success to-info text-white px-8 py-3 font-medium hover:from-success/90 hover:to-info/90 focus-clay"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <ApperIcon name="UserPlus" size={20} />
                    Join a Group
                  </div>
                </motion.button>

                <motion.button
                  onClick={handleViewGroupTravel}
                  className="btn-clay bg-surface text-gray-800 px-8 py-3 font-medium hover:bg-surface/80 focus-clay"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Plus" size={20} />
                    Create Group
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home