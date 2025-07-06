
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import aboutBanner from "@/assets/about-us-banner.jpeg";

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">About Fruitenium Technologies Pvt Ltd</h1>
          
          {/* Hero Section */}
          <div className="mb-16">
            <img  
              className="w-full h-[400px] object-cover rounded-lg mb-8"
              alt="Fruitenium Technologies office"
             src={aboutBanner}/>
            <p className="text-xl text-gray-600 text-center">
              Transforming ideas into powerful digital solutions since 2023
            </p>
          </div>

          {/* Mission & Vision */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              At Fruitenium Technologies Pvt Ltd, we're dedicated to empowering businesses worldwide with cutting-edge digital solutions. 
              Our mission is to transform innovative ideas into powerful, scalable, and user-friendly applications 
              that drive business growth and enhance user experience.
            </p>

            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-lg text-gray-600">
              To be the global leader in digital transformation, recognized for our innovative solutions, 
              exceptional service, and commitment to client success. We envision a world where every business, 
              regardless of size, has access to world-class digital solutions.
            </p>
          </section>

          {/* What Sets Us Apart */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">What Sets Us Apart</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">Innovation First</h3>
                  <p className="text-gray-600">
                    We stay ahead of technological trends to deliver cutting-edge solutions that give our clients a competitive edge.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">Client-Centric</h3>
                  <p className="text-gray-600">
                    Your success is our priority. We work closely with you to understand your needs and deliver solutions that exceed expectations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">Global Reach</h3>
                  <p className="text-gray-600">
                    With clients worldwide, we bring diverse perspectives and international best practices to every project.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Our Services */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Our Services</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Web Development</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Custom Website Development</li>
                  <li>E-commerce Solutions</li>
                  <li>Web Applications</li>
                  <li>CMS Development</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Mobile Development</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>iOS Applications</li>
                  <li>Android Applications</li>
                  <li>Cross-platform Solutions</li>
                  <li>Mobile App Maintenance</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Software Solutions</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Custom Software Development</li>
                  <li>Enterprise Solutions</li>
                  <li>Cloud Applications</li>
                  <li>API Development</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Digital Services</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>UI/UX Design</li>
                  <li>Digital Strategy</li>
                  <li>Technical Consulting</li>
                  <li>Maintenance & Support</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gray-50 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-lg text-gray-600 mb-6">
              Let's discuss how we can help you achieve your digital goals.
            </p>
            <div className="space-y-2">
              <p className="text-gray-600">Email: support@fruitenium.com</p>
              <p className="text-gray-600">Phone: +91 9131637345</p>
              <p className="text-gray-600">Address: Mungeli Bilaspur CGH India</p>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;
