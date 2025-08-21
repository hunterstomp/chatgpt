import { useState } from 'react';
import { motion } from 'framer-motion';
import { PhotoAlbum } from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { FiExternalLink, FiGithub, FiEye, FiFileText } from 'react-icons/fi';

const ProjectGallery = () => {
  const [index, setIndex] = useState(-1);

  const projects = [
    {
      id: 1,
      title: 'Work Essentials to Office Live Blue Sky Vision',
      category: 'UX Case Study',
      description: 'A comprehensive UX case study showcasing the transformation from Work Essentials to Office Live, including user research, wireframing, and prototype development.',
      technologies: ['Figma', 'Sketch', 'Axure RP', 'Adobe Suite', 'Invision'],
      images: [
        {
          src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
          width: 800,
          height: 600,
          alt: 'Work Essentials Case Study'
        },
        {
          src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
          width: 800,
          height: 600,
          alt: 'Work Essentials Case Study Detail'
        }
      ],
      links: {
        live: 'https://example.com',
        github: 'https://github.com',
        caseStudy: '/case-study/work-essentials'
      }
    },
    {
      id: 2,
      title: 'E-Commerce Platform',
      category: 'Web Application',
      description: 'A modern e-commerce platform with advanced filtering, search, and payment integration.',
      technologies: ['React', 'Node.js', 'Stripe', 'MongoDB'],
      images: [
        {
          src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
          width: 800,
          height: 600,
          alt: 'E-Commerce Platform'
        },
        {
          src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
          width: 800,
          height: 600,
          alt: 'E-Commerce Platform Detail'
        }
      ],
      links: {
        live: 'https://example.com',
        github: 'https://github.com',
        caseStudy: 'https://example.com/case-study'
      }
    },
    {
      id: 3,
      title: 'Mobile Banking App',
      category: 'Mobile Application',
      description: 'A secure and intuitive mobile banking application with biometric authentication.',
      technologies: ['React Native', 'Firebase', 'Biometrics', 'Redux'],
      images: [
        {
          src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
          width: 800,
          height: 600,
          alt: 'Mobile Banking App'
        },
        {
          src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
          width: 800,
          height: 600,
          alt: 'Mobile Banking App Detail'
        }
      ],
      links: {
        live: 'https://example.com',
        github: 'https://github.com',
        caseStudy: 'https://example.com/case-study'
      }
    },
    {
      id: 4,
      title: 'Design System',
      category: 'Design System',
      description: 'A comprehensive design system with reusable components and design tokens.',
      technologies: ['Figma', 'Storybook', 'React', 'TypeScript'],
      images: [
        {
          src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
          width: 800,
          height: 600,
          alt: 'Design System'
        },
        {
          src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
          width: 800,
          height: 600,
          alt: 'Design System Detail'
        }
      ],
      links: {
        live: 'https://example.com',
        github: 'https://github.com',
        caseStudy: 'https://example.com/case-study'
      }
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

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-800">
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
            Featured Projects
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore some of our recent work that showcases our expertise in design and development.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-16"
        >
          {projects.map((project, projectIndex) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className={`flex flex-col ${projectIndex % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-center`}
            >
              {/* Project Images */}
              <div className="lg:w-1/2">
                <div className="relative group">
                  <PhotoAlbum
                    photos={project.images}
                    layout="rows"
                    targetRowHeight={300}
                    onClick={({ index }) => setIndex(index + projectIndex * 2)}
                    componentsProps={{
                      imageProps: {
                        className: 'rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105',
                      },
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg" />
                </div>
              </div>

              {/* Project Info */}
              <div className="lg:w-1/2 space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                    {project.category}
                  </span>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {project.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Links */}
                <div className="flex flex-wrap gap-3">
                  <motion.a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    Live Demo
                  </motion.a>
                  <motion.a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <FiGithub className="w-4 h-4" />
                    View Code
                  </motion.a>
                  <motion.a
                    href={project.links.caseStudy}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <FiFileText className="w-4 h-4" />
                    View Case Study
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox */}
        <Lightbox
          slides={projects.flatMap(project => project.images)}
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
        />
      </div>
    </section>
  );
};

export default ProjectGallery; 