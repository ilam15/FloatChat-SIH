import React, { useState, useEffect } from 'react';
import { FaExchangeAlt, FaDatabase, FaCloudDownloadAlt, FaSearch, FaGlobe, FaChartBar, FaArrowRight, FaTemperatureLow, FaWater, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

export const Homepage = () => {
  const [dataPoints, setDataPoints] = useState(0);
  const [argoFloats, setArgoFloats] = useState(0);
  const [parameters, setParameters] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints(prev => prev < 2500000 ? prev + 125000 : 2500000);
      setArgoFloats(prev => prev < 1200 ? prev + 25 : 1200);
      setParameters(prev => prev < 20 ? prev + 1 : 20);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      name: "NetCDF to CSV Conversion",
      icon: <FaExchangeAlt className="text-4xl text-blue-500" />,
      desc: "Convert Indian Ocean data from NetCDF format to accessible CSV files for easier processing.",
      color: "from-blue-50 to-blue-100"
    },
    {
      name: "RAG Pipeline",
      icon: <FaDatabase className="text-4xl text-green-500" />,
      desc: "Retrieval-Augmented Generation system for handling Indian Ocean datasets efficiently.",
      color: "from-green-50 to-green-100"
    },
    {
      name: "Intelligent Data Fetching",
      icon: <FaCloudDownloadAlt className="text-4xl text-purple-500" />,
      desc: "Fetch Indian Ocean data using NLP APIs with text-to-query capabilities.",
      color: "from-purple-50 to-purple-100"
    },
    {
      name: "PostgreSQL Storage",
      icon: <FaDatabase className="text-4xl text-indigo-500" />,
      desc: "Secure storage for both NetCDF metadata and CSV files in PostgreSQL database.",
      color: "from-indigo-50 to-indigo-100"
    },
    {
      name: "Advanced Query Analyzer",
      icon: <FaSearch className="text-4xl text-red-500" />,
      desc: "Process complex queries with conditional clauses for detailed Indian Ocean data analysis.",
      color: "from-red-50 to-red-100"
    },
    {
      name: "Multilingual Support",
      icon: <FaGlobe className="text-4xl text-teal-500" />,
      desc: "Interact with Indian Ocean data in multiple languages for regional accessibility.",
      color: "from-teal-50 to-teal-100"
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: "Data Conversion",
      desc: "Indian Ocean NetCDF files are converted to CSV format for easier processing",
      details: "Our system processes standard NetCDF oceanographic data files from the Indian Ocean and converts them into accessible CSV format while preserving all metadata and measurement information."
    },
    {
      step: 2,
      title: "RAG Pipeline",
      desc: "Processes both sample and target datasets for intelligent retrieval",
      details: "The Retrieval-Augmented Generation pipeline indexes both your specific datasets and our extensive Indian Ocean database for comprehensive context-aware responses."
    },
    {
      step: 3,
      title: "Query Processing",
      desc: "NLP APIs transform natural language into data queries",
      details: "Natural language queries are parsed, interpreted, and converted into precise database queries using our specialized Indian Ocean-trained language models."
    },
    {
      step: 4,
      title: "Result Delivery",
      desc: "Responses are generated with appropriate visualizations",
      details: "Query results are presented with appropriate visualizations, statistical summaries, and explanatory text to maximize understanding and insight."
    }
  ];

  const dataTypes = [
    {
      icon: <FaTemperatureLow className="text-3xl text-blue-500" />,
      name: "Temperature",
      value: "650K+",
      description: "Water temperature measurements at various depths in the Indian Ocean"
    },
    {
      icon: <FaWater className="text-3xl text-blue-500" />,
      name: "Salinity",
      value: "580K+",
      description: "Salinity measurements across the Indian Ocean"
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl text-blue-500" />,
      name: "Location Data",
      value: "1.2K+",
      description: "Geographic positions of Argo floats in the Indian Ocean"
    },
    {
      icon: <FaChartBar className="text-3xl text-blue-500" />,
      name: "Pressure",
      value: "700K+",
      description: "Water pressure measurements at different depths in the Indian Ocean"
    }
  ];

  const indianOceanRegions = [
    "Arabian Sea", "Bay of Bengal", "Southwest Indian Ocean",
    "Southeast Indian Ocean", "Andaman Sea", "Red Sea",
    "Persian Gulf", "Mozambique Channel"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 w-full overflow-x-hidden">
      {/* Hero Section - Full Screen */}
      <section className="min-h-screen w-full flex items-center justify-center relative px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-20 top-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute right-20 bottom-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute left-1/2 top-1/2 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto text-center z-10 w-full"
        >
          <motion.h1
            className="text-6xl lg:text-8xl font-extrabold mb-8 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-500 bg-clip-text text-transparent"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            Welcome to <span className="text-blue-800">FloatChat</span>
          </motion.h1>
          <motion.p
            className="text-xl lg:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            An intelligent ocean data platform exclusively for <span className="font-semibold text-blue-800">Indian Ocean data</span>, transforming Argo float data into accessible insights through AI-powered conversation.
          </motion.p>

          <div className="flex justify-center gap-8">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="#services"
              className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 text-lg"
            >
              Explore Features
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="#process"
              className="px-10 py-5 border-2 border-blue-600 text-blue-700 font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-all duration-300 text-lg"
            >
              How It Works
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="animate-bounce flex flex-col items-center">
            <span className="text-gray-600 mb-2 text-lg">Scroll to explore</span>
            <div className="w-8 h-12 border-2 border-gray-500 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-4 bg-gray-500 rounded-full mt-2"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Data Types Section */}
      <section className="py-24 px-8 bg-gradient-to-b from-blue-100 to-blue-200 w-full">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-800 mb-6">Exclusive Indian Ocean Data Collection</h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">FloatChat processes and analyzes diverse ocean parameters from Argo floats exclusively in the Indian Ocean</p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-10">
            {dataTypes.map((data, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.7 }}
                className="bg-white rounded-2xl p-8 shadow-lg text-center"
              >
                <div className="flex justify-center mb-6">
                  {data.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{data.name}</h3>
                <div className="text-3xl font-bold text-blue-600 mb-3">{data.value}</div>
                <p className="text-gray-600 text-base">{data.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-20 bg-white rounded-2xl p-10 shadow-lg"
          >
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">Indian Ocean Regional Coverage</h3>
            <div className="grid grid-cols-4 gap-6">
              {indianOceanRegions.map((region, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-4 text-center">
                  <span className="text-blue-700 font-medium text-lg">{region}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 mt-8 text-lg">
              Comprehensive coverage of all Indian Ocean sub-regions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Data Visualization Showcase */}
      <section className="py-24 px-8 bg-gradient-to-b from-blue-200 to-blue-100 w-full">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-800 mb-6">Transform Indian Ocean Data into Insights</h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">FloatChat processes complex Argo float data from the Indian Ocean and presents it in intuitive visual formats</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-white rounded-3xl p-8 shadow-xl"
            >
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-80 rounded-2xl flex items-center justify-center">
                <div className="text-center p-6">
                  <FaChartBar className="text-7xl text-blue-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-800">Indian Ocean Trends</h3>
                  <p className="text-gray-600 mt-3 text-lg">Visualize how Indian Ocean parameters change across seasons and years</p>
                </div>
              </div>
              <h3 className="text-3xl font-bold mt-8 mb-4">Indian Ocean Parameter Trends</h3>
              <p className="text-gray-600 text-lg">Visualize temperature, salinity, and other parameters across different depths and regions of the Indian Ocean with interactive charts.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-xl"
            >
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-80 rounded-2xl flex items-center justify-center">
                <div className="text-center p-6">
                  <FaGlobe className="text-7xl text-blue-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-800">Regional Data Coverage</h3>
                  <p className="text-gray-600 mt-3 text-lg">Explore data points across the Indian Ocean basin</p>
                </div>
              </div>
              <h3 className="text-3xl font-bold mt-8 mb-4">Indian Ocean Float Distribution</h3>
              <p className="text-gray-600 text-lg">Explore the geographical distribution of Argo floats and their measurement locations across the Indian Ocean.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section - Full Screen */}
      <section id="services" className="min-h-screen w-full flex items-center py-24 px-8 bg-gradient-to-b from-blue-100 to-blue-200">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-800 mb-6">Technical Features</h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">Advanced data processing capabilities for Indian Ocean research.</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-10">
            {services.map((service, idx) => (
              <motion.div
                key={service.name}
                whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className={`group p-10 bg-gradient-to-br ${service.color} rounded-3xl shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.7 }}
              >
                <div className="flex items-center justify-center mb-8 h-16">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.name}</h3>
                <p className="text-gray-600 flex-grow text-lg">{service.desc}</p>
                <div className="mt-6 text-blue-600 font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Indian Ocean Focus</span>
                  <FaArrowRight className="ml-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Explanation Section - Full Screen */}
      <section id="process" className="min-h-screen w-full flex items-center py-24 px-8 bg-gradient-to-b from-blue-200 to-blue-100">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-800 mb-6">How FloatChat Works</h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">Transforming complex Indian Ocean data into accessible insights through a streamlined process</p>
          </motion.div>

          <div className="space-y-16">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-10 bg-white p-10 rounded-3xl shadow-lg"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.7 }}
              >
                <div className="flex-shrink-0 w-28 h-28 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  {step.step}
                </div>
                <div className="flex-grow">
                  <h3 className="text-3xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-xl text-blue-600 font-medium mb-4">{step.desc}</p>
                  <p className="text-gray-600 text-lg">{step.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Access Section */}
      <section className="py-24 px-8 bg-gradient-to-b from-blue-100 to-blue-200 w-full">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-800 mb-6">Access Indian Ocean Data Instantly</h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">Query Indian Ocean data with natural language and get immediate, visualized responses</p>
          </motion.div>

          <div className="bg-white rounded-3xl p-10 shadow-xl">
            <div className="grid lg:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaSearch className="text-3xl text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Simple Queries</h3>
                <p className="text-gray-600 text-lg">Ask questions in plain English about Indian Ocean data</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaDatabase className="text-3xl text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Complex Analysis</h3>
                <p className="text-gray-600 text-lg">Perform sophisticated Indian Ocean data analysis with simple commands</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaGlobe className="text-3xl text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Regional Insights</h3>
                <p className="text-gray-600 text-lg">Explore data from different regions of the Indian Ocean</p>
              </div>
            </div>

            <div className="mt-12 p-8 bg-blue-50 rounded-2xl">
              <h4 className="text-xl font-semibold text-gray-800 mb-6">Example Queries for Indian Ocean:</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 text-xl">•</span>
                  <span className="text-lg">"Show me temperature trends in the Arabian Sea over the last 5 years"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 text-xl">•</span>
                  <span className="text-lg">"Compare salinity levels between the Bay of Bengal and the Southern Indian Ocean at 200m depth"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 text-xl">•</span>
                  <span className="text-lg">"Show monsoon effects on Indian Ocean surface temperatures"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 text-xl">•</span>
                  <span className="text-lg">"What are the current patterns in the Indian Ocean Dipole?"</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-20 px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-4xl font-bold mb-6">FloatChat</h3>
              <p className="text-blue-200 mb-6 text-lg">Transforming Indian Ocean data into actionable insights through AI-powered conversation and advanced visualization.</p>
              <div className="flex space-x-6">
                <a href="#" className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path></svg>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div>
                <h4 className="text-xl font-semibold mb-4">Resources</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-lg">Documentation</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-lg">API Reference</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-lg">Tutorials</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-lg">Blog</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-4">Company</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-lg">About Us</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-lg">Careers</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-lg">Contact</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-lg">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-blue-700 text-center">
            <p className="text-blue-300 text-lg">© {new Date().getFullYear()} FloatChat. All rights reserved.</p>
            <p className="text-blue-400 mt-2 text-lg">Specializing exclusively in Indian Ocean data</p>
          </div>
         </div>
      </footer>
    </div>
  );
};