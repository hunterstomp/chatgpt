import { motion } from 'framer-motion';
import { 
  FiCode, 
  FiPalette, 
  FiSmartphone, 
  FiDatabase, 
  FiCloud, 
  FiZap,
  FiShield,
  FiTrendingUp
} from 'react-icons/fi';

const ToolsIntegration = () => {
  const tools = [
    {
      id: 1,
      name: 'Frontend Development',
      icon: FiCode,
      description: 'Modern React applications with TypeScript, Tailwind CSS, and responsive design principles.',
      features: ['React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      name: 'UI/UX Design',
      icon: FiPalette,
      description: 'User-centered design with prototyping, user research, and accessibility best practices.',
      features: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 3,
      name: 'Mobile Development',
      icon: FiSmartphone,
      description: 'Cross-platform mobile applications with React Native and native performance.',
      features: ['React Native', 'iOS', 'Android', 'PWA'],
      color: 'from-green-500 to-green-600'
    },
    {
      id: 4,
      name: 'Backend & APIs',
      icon: FiDatabase,
      description: 'Robust backend systems with modern APIs and database design.',
      features: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB'],
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 5,
      name: 'Cloud & DevOps',
      icon: FiCloud,
      description: 'Scalable cloud infrastructure and automated deployment pipelines.',
      features: ['AWS', 'Docker', 'CI/CD', 'Kubernetes'],
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 6,
      name: 'Performance',
      icon: FiZap,
      description: 'Optimized applications with lightning-fast loading times and smooth interactions.',
      features: ['Webpack', 'Lazy Loading', 'Caching', 'CDN'],
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 7,
      name: 'Security',
      icon: FiShield,
      description: 'Enterprise-grade security with authentication, authorization, and data protection.',
      features: ['OAuth', 'JWT', 'HTTPS', 'Data Encryption'],
      color: 'from-red-500 to-red-600'
    },
    {
      id: 8,
      name: 'Analytics',
      icon: FiTrendingUp,
      description: 'Data-driven insights with comprehensive analytics and user behavior tracking.',
      features: ['Google Analytics', 'Mixpanel', 'A/B Testing', 'Heatmaps'],
      color: 'from-teal-500 to-teal-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="tools" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Tools & Technologies
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We leverage cutting-edge tools and technologies to deliver exceptional digital experiences that scale.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {tools.map((tool) => (
            <motion.div
              key={tool.id}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4`}>
                <tool.icon className="w-6 h-6 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {tool.name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                {tool.description}
              </p>

              {/* Features */}
              <div className="space-y-2">
                {tool.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${tool.color} mr-3`} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Explore Our Tech Stack
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ToolsIntegration; 