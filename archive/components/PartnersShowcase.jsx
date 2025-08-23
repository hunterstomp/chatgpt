import { motion } from 'framer-motion';
import { FiQuote, FiStar } from 'react-icons/fi';

const PartnersShowcase = () => {
  const partners = [
    {
      id: 1,
      name: 'TechCorp',
      logo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=100&fit=crop',
      industry: 'Technology',
      testimonial: 'Quentin delivered an exceptional user experience that exceeded our expectations. The attention to detail and user-centered approach made all the difference.',
      author: 'Sarah Johnson',
      role: 'CTO',
      rating: 5
    },
    {
      id: 2,
      name: 'DesignStudio',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop',
      industry: 'Design',
      testimonial: 'Working with Quentin was a game-changer for our design process. His expertise in UX design helped us create products that users actually love.',
      author: 'Michael Chen',
      role: 'Creative Director',
      rating: 5
    },
    {
      id: 3,
      name: 'StartupHub',
      logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=100&fit=crop',
      industry: 'Startup',
      testimonial: 'Quentin helped us build a product that users couldn\'t stop talking about. His strategic thinking and technical skills are unmatched.',
      author: 'Emily Rodriguez',
      role: 'Founder',
      rating: 5
    },
    {
      id: 4,
      name: 'Enterprise Solutions',
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=100&fit=crop',
      industry: 'Enterprise',
      testimonial: 'The level of professionalism and technical expertise Quentin brought to our project was outstanding. He delivered beyond our expectations.',
      author: 'David Thompson',
      role: 'VP of Product',
      rating: 5
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const renderStars = (rating) => {
    return Array.from({ length: rating }, (_, index) => (
      <FiStar key={index} className="w-4 h-4 text-yellow-400 fill-current" />
    ));
  };

  return (
    <section id="partners" className="py-20 bg-gray-50 dark:bg-gray-900">
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
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We've had the privilege of working with amazing companies and teams across various industries.
          </p>
        </motion.div>

        {/* Partners Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Partner Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {partner.industry}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {renderStars(partner.rating)}
                </div>
              </div>

              {/* Testimonial */}
              <div className="mb-6">
                <FiQuote className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
                <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  "{partner.testimonial}"
                </blockquote>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {partner.author}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {partner.role}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  View Case Study
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2"
            >
              50+
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400">Projects Completed</p>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2"
            >
              25+
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400">Happy Clients</p>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2"
            >
              5+
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400">Years Experience</p>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2"
            >
              100%
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400">Client Satisfaction</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersShowcase; 