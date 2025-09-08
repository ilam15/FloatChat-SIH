
import { FaRobot, FaChartBar, FaLanguage, FaGlobe, FaImage } from "react-icons/fa";
import { motion } from "framer-motion";

const services = [
  {
    name: "Chatbot",
    icon: <FaRobot className="text-4xl text-gray-500 group-hover:scale-110 transition-transform duration-300" />,
    desc: "Conversational AI for ocean data queries.",
    color: "from-gray-100 to-gray-200"
  },
  {
    name: "Analyzer",
    icon: <FaChartBar className="text-4xl text-gray-500 group-hover:scale-110 transition-transform duration-300" />,
    desc: "Analyze and visualize marine datasets.",
    color: "from-gray-100 to-gray-200"
  },
  {
    name: "NLP",
    icon: <FaLanguage className="text-4xl text-gray-500 group-hover:scale-110 transition-transform duration-300" />,
    desc: "Natural language processing for marine science.",
    color: "from-gray-100 to-gray-200"
  },
  {
    name: "Multilanguage Support",
    icon: <FaGlobe className="text-4xl text-gray-500 group-hover:scale-110 transition-transform duration-300" />,
    desc: "Interact in multiple languages.",
    color: "from-gray-100 to-gray-200"
  },
  {
    name: "Pictorial Representation",
    icon: <FaImage className="text-4xl text-gray-500 group-hover:scale-110 transition-transform duration-300" />,
    desc: "Visualize data with stunning graphics.",
    color: "from-gray-100 to-gray-200"
  },
];

const users = [
  {
    name: "Students",
    img: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Mariners",
    img: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    name: "Researchers",
    img: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    name: "Scientists",
    img: "https://randomuser.me/api/portraits/women/43.jpg"
  },
];

export const HomePage = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen flex flex-col items-center justify-center">
      {/* Hero Section */}
  <section className="relative overflow-hidden flex flex-col items-center justify-center py-28 px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl text-center z-10"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 bg-clip-text text-transparent drop-shadow-lg"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            Welcome to <span className="text-gray-700">FloatChat</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            An intelligent ocean data chatbot bringing <span className="font-semibold text-gray-700">marine knowledge</span> to your fingertips.
          </motion.p>
          <div className="flex justify-center gap-6">
            <motion.a
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              href="#services"
              className="px-8 py-3 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900 font-bold rounded-xl shadow-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300"
            >
              Explore Services
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              href="#users"
              className="px-8 py-3 border-2 border-gray-500 text-gray-700 font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-all duration-300"
            >
              Who Can Use?
            </motion.a>
          </div>
        </motion.div>
        {/* Floating shapes for visual interest */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="absolute left-10 top-10 w-32 h-32 bg-gray-200 rounded-full blur-2xl opacity-40 animate-pulse" />
          <div className="absolute right-10 bottom-10 w-40 h-40 bg-gray-300 rounded-full blur-2xl opacity-40 animate-pulse" />
          <div className="absolute left-1/2 top-1/3 w-24 h-24 bg-gray-100 rounded-full blur-2xl opacity-30 animate-pulse" />
        </motion.div>
      </section>

      {/* Services Section */}
  <section id="services" className="py-20 px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">Our Services</h2>
          <p className="text-gray-500 text-lg">Empowering you with intelligent, interactive, and visual marine insights.</p>
        </motion.div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {services.map((service, idx) => (
            <motion.div
              key={service.name}
              whileHover={{ scale: 1.06, boxShadow: "0 8px 32px 0 rgba(0,0,0,0.15)" }}
              className={`group p-8 bg-gradient-to-br ${service.color} rounded-3xl shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.7 }}
            >
              <div className="flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 drop-shadow">{service.name}</h3>
              <p className="text-gray-600 text-lg">{service.desc}</p>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-gray-200 rounded-full blur-sm animate-pulse" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Users Section */}
  <section id="users" className="py-20 px-4 md:px-0 bg-gradient-to-r from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">Who Uses FloatChat?</h2>
          <p className="text-gray-500 text-lg">Designed for anyone who wants to understand the oceans better.</p>
        </motion.div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {users.map((user, idx) => (
            <motion.div
              key={user.name}
              whileHover={{ scale: 1.07, boxShadow: "0 8px 32px 0 rgba(0,0,0,0.12)" }}
              className="group p-8 bg-white rounded-3xl shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.7 }}
            >
              <motion.img
                src={user.img}
                alt={user.name}
                className="w-20 h-20 rounded-full border-4 border-gray-200 mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 6 }}
              />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h3>
              <p className="text-gray-500">{user.name === "Students" ? "Learn & Explore" : user.name === "Mariners" ? "Navigate & Discover" : user.name === "Researchers" ? "Analyze & Innovate" : "Advance Science"}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

