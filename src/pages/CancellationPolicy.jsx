
import React from "react";
import { motion } from "framer-motion";

const CancellationPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="prose max-w-none"
      >
        <h1 className="text-3xl font-bold mb-8">Cancellation Policy</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Cancellation Terms</h2>
            <p>Our cancellation policy includes the following terms:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Projects can be cancelled within 48 hours of order placement</li>
              <li>Ongoing projects require 30 days notice for cancellation</li>
              <li>Custom development work may have specific cancellation terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Cancellation Process</h2>
            <p>To cancel a service:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Submit a cancellation request via email or dashboard</li>
              <li>Include order details and reason for cancellation</li>
              <li>Wait for confirmation from our team</li>
              <li>Receive applicable refund as per refund policy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Non-Cancellable Services</h2>
            <p>The following services cannot be cancelled:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Completed development work</li>
              <li>Deployed websites or applications</li>
              <li>Domain registrations</li>
              <li>Used licenses or subscriptions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Contact Information</h2>
            <p>For cancellation requests or questions, contact us at:</p>
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

export default CancellationPolicy;
