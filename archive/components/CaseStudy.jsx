import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiDownload, FiEye, FiCalendar, FiUsers, FiTool } from 'react-icons/fi';

const CaseStudy = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const caseStudy = {
    title: "Work Essentials to Office Live Blue Sky Vision",
    subtitle: "Q10UX CASE STUDY: Q10Bulb",
    role: "User Experience Designer",
    client: "Microsoft Corporation",
    duration: "3 months",
    team: "Work Essentials (1 Exec, 1 PM, 1 UR, 2 SMEs)",
    
    summary: "In 2006, I joined Work Essentials full-time to drive Office adoption. To show value, we invested in high-end custom templates tailored to specific roles (HR, Finance, Sales) and industries (healthcare, dog walking—you name it). As Web 2.0 began shifting focus to user-driven communities, I teamed up with two SMEs to blueprint a platform of our own. We built a working demo that gained traction internally, showcased our innovation, and helped reinforce our value during a major Office Live reorg.",
    
    problem: "Just an exercise in Blue Sky Vision",
    goal: "To envision better logistics and leverage community by making an inspiring North Star.",
    
    tools: {
      design: ["Figma", "Sketch", "Axure RP", "Adobe Suite", "Invision", "Protopie", "Abstrakt", "Zeplin", "Proto.io", "Principle", "After Effects"],
      collaboration: ["Trello", "Jira", "Slack", "Atlassian", "Github"],
      productivity: ["Microsoft Office", "Office 365"],
      platform: ["Apple", "Macbook Pro", "iPad Pro with iPad Pencil", "PC", "Flash Prototype"]
    },
    
    deliverables: [
      "Heuristic Evaluation",
      "Terminology and Navigation Explorations",
      "Explorations",
      "Wireframes",
      "Prototype",
      "Responsive Shopify Dev Handoff",
      "Wordpress",
      "Google Analytics Implementation",
      "Asset Library for Production Assets",
      "Expansion of site",
      "Iteration and Improvements"
    ],
    
    research: {
      team: "1 PM, 1 Dev, 2 SMEs + Me (UX)",
      highlights: [
        "Journey Mapping Highlight 1",
        "Journey Mapping Highlight 2"
      ]
    },
    
    uxApproach: {
      flows: ["Visioning", "Wireframing", "Pixel Perfects"],
      images: {
        visioning: ["Image 1", "Image 2", "Image 3"],
        wireframing: ["Image 1", "Image 2", "Image 3"],
        pixelPerfects: ["Image 1", "Image 2", "Image 3"]
      }
    },
    
    outcomes: {
      before: "Dying subweb",
      after: "Merged to Office Live",
      change: "Goal was to offer our expertise in the reorg."
    },
    
    keyWins: "The demo had legs, and was shown all around Office Live and other",
    testimonial: "I'd buy that for a dollar",
    lessonsLearned: "Lessons Learned",
    improvements: "What I'd Improve",
    
    downloads: [
      { name: "Vision Smoke and Mirror prototype", size: "6.56MB", type: "zip" },
      { name: "Work Essentials to Office Live Blue Sky Vision - Case Study Downloadable", size: "56MB", type: "exe" }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {caseStudy.subtitle}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                UX Portfolio for Quentin Little
              </p>
            </div>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Home</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Case Studies</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">About</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Blog</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Contact</a>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {caseStudy.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {caseStudy.summary}
              </p>
            </motion.div>

            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300"><strong>Role:</strong> {caseStudy.role}</span>
                  </div>
                  <div className="flex items-center">
                    <FiEye className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300"><strong>Client:</strong> {caseStudy.client}</span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300"><strong>Duration:</strong> {caseStudy.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300"><strong>Team:</strong> {caseStudy.team}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Problem & Goal</h3>
                <div className="space-y-3">
                  <div>
                    <strong className="text-gray-900 dark:text-white">Problem:</strong>
                    <p className="text-gray-700 dark:text-gray-300">{caseStudy.problem}</p>
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Goal:</strong>
                    <p className="text-gray-700 dark:text-gray-300">{caseStudy.goal}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tools Used */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tools Used</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Design:</h4>
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.tools.design.map((tool, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Collaboration:</h4>
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.tools.collaboration.map((tool, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Productivity:</h4>
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.tools.productivity.map((tool, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Platform:</h4>
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.tools.platform.map((tool, index) => (
                      <span key={index} className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm rounded-full">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Deliverables */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deliverables</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {caseStudy.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">{deliverable}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Research & Discovery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🔍 Research & Discovery</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{caseStudy.research.team}</p>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Highlights:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                {caseStudy.research.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </motion.div>

            {/* UX Approach */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">UX Approach</h3>
              <div className="space-y-6">
                {caseStudy.uxApproach.flows.map((flow, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">{flow}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {caseStudy.uxApproach.images[flow.toLowerCase().replace(/\s+/g, '')].map((image, imgIndex) => (
                        <div key={imgIndex} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
                          <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{image}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Outcomes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Outcomes</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 text-gray-900 dark:text-white">KPI</th>
                      <th className="text-left py-2 text-gray-900 dark:text-white">Before</th>
                      <th className="text-left py-2 text-gray-900 dark:text-white">After</th>
                      <th className="text-left py-2 text-gray-900 dark:text-white">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 text-gray-700 dark:text-gray-300">Goal</td>
                      <td className="py-2 text-gray-700 dark:text-gray-300">{caseStudy.outcomes.before}</td>
                      <td className="py-2 text-gray-700 dark:text-gray-300">{caseStudy.outcomes.after}</td>
                      <td className="py-2 text-gray-700 dark:text-gray-300">{caseStudy.outcomes.change}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Key Wins */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">✨ Key UX Wins</h3>
              <p className="text-gray-700 dark:text-gray-300">{caseStudy.keyWins}</p>
            </motion.div>

            {/* Testimonials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💬 Testimonials</h3>
              <blockquote className="text-gray-700 dark:text-gray-300 italic">"{caseStudy.testimonial}"</blockquote>
            </motion.div>

            {/* Lessons Learned & Improvements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🧭 Lessons Learned</h3>
                <p className="text-gray-700 dark:text-gray-300">{caseStudy.lessonsLearned}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🧪 What I'd Improve</h3>
                <p className="text-gray-700 dark:text-gray-300">{caseStudy.improvements}</p>
              </div>
            </motion.div>

            {/* Downloads */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Downloadables:</h3>
              <div className="space-y-3">
                {caseStudy.downloads.map((download, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <FiDownload className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">{download.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({download.size})</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex justify-between items-center"
            >
              <button className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                <FiArrowLeft className="w-5 h-5 mr-2" />
                Previous Project
              </button>
              <button className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                Next Project
                <FiArrowRight className="w-5 h-5 ml-2" />
              </button>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Problem:</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{caseStudy.problem}</p>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🎯 Goal:</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{caseStudy.goal}</p>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🔍 Research & Discovery:</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{caseStudy.research.team}</p>
                
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Highlights:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 mb-6">
                  {caseStudy.research.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">UX Approach:</h3>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Flows:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 mb-6">
                  {caseStudy.uxApproach.flows.map((flow, index) => (
                    <li key={index}>{flow}</li>
                  ))}
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🛠️ Tools Used</h3>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p><strong>Photoshop, Macromedia Flash, Visio</strong></p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudy; 