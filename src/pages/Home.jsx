
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="md:w-1/2 mb-10 md:mb-0"
            >
              <h1 className="text-5xl font-bold mb-6">
                Transform Your Digital Presence
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Professional website development, software solutions, and mobile apps tailored to your needs.
              </p>
              <Link to="/products">
                <Button size="lg" className="mr-4">View Our Services</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">Contact Us</Button>
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="md:w-1/2"
            >
              <img  
                className="rounded-lg shadow-2xl"
                alt="Digital solutions showcase"
               src="https://images.unsplash.com/photo-1648134859182-98df6e93ef58" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-bold mb-4">Website Development</h3>
              <p className="text-gray-600">Custom websites that perfectly represent your brand and engage your audience.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-bold mb-4">Software Solutions</h3>
              <p className="text-gray-600">Powerful software applications that streamline your business operations.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-bold mb-4">Mobile Apps</h3>
              <p className="text-gray-600">Intuitive mobile applications that keep your users engaged on the go.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
