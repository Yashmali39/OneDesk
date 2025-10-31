import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import myImage from "../assets/myImage.png";
import Createac from "../assets/Createac.svg";
import Searchw from "../assets/Searchw.svg";
import Saveapp from "../assets/Saveapp.svg";
import second from "../assets/second.png";
import Slider from "./Slider";
import { NavLink } from "react-router-dom";
import { fadeIn, slideIn, zoomIn } from "../animations"; // Import animation settings
import { useAuth } from "./AuthContext";
import FreelancerHome from "./FreelancerHome";
import DepartmentHome from "./DepartmentHome";

const Home = () => {
  const {isLoggedIn, user} = useAuth();
  if(isLoggedIn){
    if(user.role === "citizen"){
      return <FreelancerHome/>
    }else{
      return <DepartmentHome/>
    }
  }else{
    return (
      <div className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <motion.div 
          className="flex flex-col lg:flex-row bg-gradient-to-br from-blue-600 to-purple-700 justify-evenly items-center"
          initial="hidden" animate="visible" variants={fadeIn}
        >
          <motion.img 
            src={myImage} alt="Complaint Management System" 
            className="w-[90%] lg:w-[600px] h-auto object-cover mb-8 lg:mb-0"
            variants={slideIn("left")}
          />
          <motion.section 
            className="text-white py-10 px-6 lg:py-20 min-h-[60vh] flex items-center"
            variants={slideIn("right")}
          >
            <div className="flex flex-col gap-5">
              <div className="lg:w-[500px] text-left">
                <h2 className="text-3xl lg:text-5xl font-bold mb-4 leading-snug">Citizen Complaint Management System</h2>
                <p className="text-lg lg:text-xl text-blue-100 mb-8">
                  Report issues, track resolutions, and help improve your community. Fast, efficient, and transparent complaint resolution for all citizens.
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <button className="bg-white text-blue-600 font-medium px-6 py-3 rounded-full shadow hover:bg-gray-100">
                  <NavLink to="/login">Start</NavLink>
                </button>
              </motion.div>
            </div>
          </motion.section>
        </motion.div>

        {/* Features Section */}
        <motion.section className="py-16" initial="hidden" animate="visible" variants={fadeIn}>
          <div className="container mx-auto pt-3 px-6 w-[90%] lg:w-[80vw] shadow-2xl lg:h-[380px]">
            <h2 className="text-3xl font-bold text-center mb-12 mt-4">How It Works?</h2>
            <div className="flex flex-col lg:flex-row justify-evenly gap-8">
              {[
                { 
                  img: Createac, 
                  title: "Create Account", 
                  desc: "Sign up as a citizen to start reporting community issues." 
                },
                { 
                  img: Searchw, 
                  title: "Report Issue", 
                  desc: "Submit complaints with details, location, and department." 
                },
                { 
                  img: Saveapp, 
                  title: "Track Progress", 
                  desc: "Monitor your complaint status and receive updates." 
                }
              ].map((item, index) => (
                <motion.div
                  key={index} 
                  className="bg-white p-6 rounded-lg shadow flex flex-col justify-center items-center gap-4"
                  variants={zoomIn}
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={item.img} alt={item.title} className="w-28 h-28 object-cover" />
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-center">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Info Section */}
        <motion.section className="py-12 px-6 lg:px-0" initial="hidden" animate="visible" variants={fadeIn}>
          <div className="flex flex-col lg:flex-row justify-evenly items-center gap-12">
            <motion.img 
              src={second} alt="Community Service" 
              className="w-[90%] lg:w-[600px] h-auto object-cover scale-x-[-1]"
              variants={slideIn("left")}
            />
            <motion.div className="lg:w-[450px]" variants={slideIn("right")}>
              <h2 className="text-3xl lg:text-5xl leading-snug mb-4">
                Efficient <span className="text-blue-600">Complaint Resolution</span> for Better Communities
              </h2>
              <p className="text-[gray]">
                Our platform connects citizens with municipal departments to quickly address and resolve community issues. From street lights to sanitation, we've got you covered.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Departments Section */}
        <motion.section className="bg-gray-100 py-16" initial="hidden" animate="visible" variants={fadeIn}>
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Supported Departments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { name: "Electricity", issues: "Street lights, Power outages, Electrical hazards" },
                { name: "Water Supply", issues: "Leakages, Water quality, Supply issues" },
                { name: "Road Maintenance", issues: "Potholes, Road repairs, Traffic signals" },
                { name: "Sanitation", issues: "Garbage collection, Cleanliness, Public toilets" },
                { name: "Public Works", issues: "Parks, Public spaces, Infrastructure" },
                { name: "Traffic", issues: "Traffic management, Signage, Road safety" }
              ].map((dept, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-xl font-bold text-blue-600 mb-3">{dept.name}</h3>
                  <p className="text-gray-600">{dept.issues}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Recent Complaints Section */}
        <motion.section className="bg-white py-16" initial="hidden" animate="visible" variants={fadeIn}>
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Recently Resolved Issues</h2>
            <div className="flex justify-center">
              <motion.div className="w-[90%] lg:w-[600px] shadow-2xl" variants={zoomIn}>
                <Slider />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section className="bg-gradient-to-r from-blue-600 to-purple-700 py-16 text-white" initial="hidden" animate="visible" variants={fadeIn}>
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-12">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="text-4xl font-bold mb-2">10,000+</h3>
                <p>Complaints Resolved</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold mb-2">24h</h3>
                <p>Average Response Time</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold mb-2">95%</h3>
                <p>Citizen Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Newsletter Section */}
        <motion.section className="bg-slate-800 py-12" initial="hidden" animate="visible" variants={fadeIn}>
          <div className="container mx-auto px-6 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
            <p className="mb-6">Get updates on complaint resolutions and community improvements.</p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <input 
                type="email" 
                className="w-full md:w-1/3 rounded-lg px-4 py-2 text-gray-800" 
                placeholder="Enter your email" 
              />
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Footer Section */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-6 text-center">
            <p>&copy; 2025 Citizen Complaint Management System. All rights reserved.</p>
            <p className="mt-2 text-gray-400">Building better communities together</p>
          </div>
        </footer>
      </div>
    );
  }
};

export default Home;