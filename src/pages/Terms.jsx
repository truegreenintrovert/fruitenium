
import React from "react";
import { motion } from "framer-motion";

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="prose max-w-none"
      >
        <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Service Agreement</h2>
            <p>By using our services, you agree to:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Provide accurate information for project requirements</li>
              <li>Respond to queries in a timely manner</li>
              <li>Pay agreed amounts according to payment schedule</li>
              <li>Respect intellectual property rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Project Delivery</h2>
            <p>Our delivery terms include:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Agreed timeline for project milestones</li>
              <li>Review and revision periods</li>
              <li>Final delivery and handover process</li>
              <li>Post-delivery support terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
            <p>Regarding intellectual property:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Client retains rights to their content</li>
              <li>We retain rights to our development frameworks</li>
              <li>Third-party assets are subject to their licenses</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Contact Information</h2>
            <p>For any questions about these terms, contact us at:</p>
            <ul className="list-none mt-2">
              <li>Email: support@fruitenium.com</li>
              <li>Phone: +91 9131637345</li>
              <li>Address: Mungeli Bilaspur CGH India</li>
            </ul>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;
