
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">About Us</h3>
            <p className="text-sm text-gray-600">
              Fruitenium Technologies Pvt Ltd provides professional website development, software solutions, and mobile app development services worldwide.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <div className="text-sm text-gray-600">
              <p>Email: support@fruitenium.com</p>
              <p>Phone: +91 9131637345</p>
              <p>Address: Mungeli Bilaspur CGH India</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><Link to="/privacy-policy" className="hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-gray-900">Refund Policy</Link></li>
              <li><Link to="/cancellation-policy" className="hover:text-gray-900">Cancellation Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gray-900">Terms & Conditions</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Services</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>Website Development</li>
              <li>Software Solutions</li>
              <li>Mobile App Development</li>
              <li>Custom Solutions</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Fruitenium Technologies Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
