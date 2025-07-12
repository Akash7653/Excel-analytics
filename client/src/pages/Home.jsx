import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center"
      >
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 mb-8"
        >
          Welcome to Excel-Pro
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-12"
        >
          Your ultimate data management solution with powerful analytics and visualization tools.
        </motion.p>
        
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            {
              title: "Upload Data",
              description: "Import your Excel files in seconds",
              icon: "📊",
              color: "from-blue-500 to-blue-600"
            },
            {
              title: "Visualize",
              description: "Create beautiful charts and graphs",
              icon: "📈",
              color: "from-purple-500 to-purple-600"
            },
            {
              title: "Analyze",
              description: "Get powerful insights from your data",
              icon: "🔍",
              color: "from-pink-500 to-pink-600"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -5 }}
              className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all ${index === 1 ? 'md:transform md:scale-105' : ''}`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>
    </div>
  );
}