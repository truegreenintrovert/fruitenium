
import React from "react";
import { motion } from "framer-motion";

const RefundPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="prose max-w-none"
      >
        <h1 className="text-3xl font-bold mb-8">Refund Policy</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Refund Eligibility</h2>
            <p>We offer refunds under the following circumstances:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Service not initiated within agreed timeframe</li>
              <li>Major discrepancy in delivered services</li>
              <li>Technical inability to deliver promised features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Refund Process</h2>
            <p>To request a refund:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Contact our support team within 30 days of purchase</li>
              <li>Provide order details and reason for refund</li>
              <li>Allow up to 7 business days for review</li>
              <li>Refund will be processed to original payment method</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Non-Refundable Items</h2>
            <p>The following are not eligible for refund:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Completed custom development work</li>
              <li>Deployed websites or applications</li>
              <li>Domain registration fees</li>
              <li>Third-party service charges</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Contact Information</h2>
            <p>For refund requests or questions, contact us at:</p>
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

export default RefundPolicy;
