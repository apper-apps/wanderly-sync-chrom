import { motion } from 'framer-motion'

const Loading = ({ type = 'cards' }) => {
  const shimmer = {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
    },
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "linear"
    }
  }

  const SkeletonCard = () => (
    <motion.div 
      className="card-clay p-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image skeleton */}
      <motion.div
        className="h-48 rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 bg-[length:200%_100%]"
        variants={shimmer}
        animate="animate"
      />
      
      {/* Content skeleton */}
      <div className="space-y-3">
        <motion.div
          className="h-6 w-3/4 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 bg-[length:200%_100%]"
          variants={shimmer}
          animate="animate"
        />
        <motion.div
          className="h-4 w-full rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 bg-[length:200%_100%]"
          variants={shimmer}
          animate="animate"
        />
        <motion.div
          className="h-4 w-2/3 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 bg-[length:200%_100%]"
          variants={shimmer}
          animate="animate"
        />
      </div>
      
      {/* Button skeleton */}
      <motion.div
        className="h-12 w-full rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 bg-[length:200%_100%]"
        variants={shimmer}
        animate="animate"
      />
    </motion.div>
  )

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (type === 'detail') {
    return (
      <div className="space-y-8">
        {/* Hero skeleton */}
        <motion.div
          className="h-96 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 bg-[length:200%_100%]"
          variants={shimmer}
          animate="animate"
        />
        
        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="card-clay p-6 space-y-4">
                <motion.div
                  className="h-6 w-1/2 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 bg-[length:200%_100%]"
                  variants={shimmer}
                  animate="animate"
                />
                <motion.div
                  className="h-4 w-full rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 bg-[length:200%_100%]"
                  variants={shimmer}
                  animate="animate"
                />
                <motion.div
                  className="h-4 w-3/4 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 bg-[length:200%_100%]"
                  variants={shimmer}
                  animate="animate"
                />
              </div>
            ))}
          </div>
          
          <div className="space-y-6">
            <div className="card-clay p-6 space-y-4">
              <motion.div
                className="h-8 w-full rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 bg-[length:200%_100%]"
                variants={shimmer}
                animate="animate"
              />
              <motion.div
                className="h-12 w-full rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 bg-[length:200%_100%]"
                variants={shimmer}
                animate="animate"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <motion.div
          className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-primary to-accent"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.p
          className="text-primary font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading amazing destinations...
        </motion.p>
      </div>
    </div>
  )
}

export default Loading