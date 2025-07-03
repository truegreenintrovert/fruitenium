
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Basic Website Package",
    description: "Perfect for small businesses and startups",
    price: "RS 8000",
    features: [
      "5 Pages Website",
      "Mobile Responsive",
      "Contact Form",
      "Basic SEO",
      "3 Rounds of Revisions"
    ]
  },
  {
    id: 2,
    name: "Professional Website Package",
    description: "Ideal for growing businesses",
    price: "RS 12000",
    features: [
      "10 Pages Website",
      "Mobile Responsive",
      "Advanced SEO",
      "Content Management System",
      "5 Rounds of Revisions",
      "Social Media Integration"
    ]
  },
  {
    id: 3,
    name: "E-commerce Package",
    description: "Complete online store solution",
    price: "RS 14000",
    features: [
      "Unlimited Products",
      "Payment Gateway Integration",
      "Inventory Management",
      "Order Management",
      "Customer Dashboard",
      "Advanced Analytics"
    ]
  },
  {
    id: 4,
    name: "Custom Software Development",
    description: "Tailored software solutions",
    price: "Custom Quote",
    features: [
      "Custom Requirements Analysis",
      "Scalable Architecture",
      "Database Design",
      "API Integration",
      "Testing & QA",
      "Maintenance Support"
    ]
  },
  {
    id: 5,
    name: "Mobile App Development",
    description: "Native and cross-platform apps",
    price: "Starting at RS 12,000",
    features: [
      "iOS & Android Apps",
      "User-friendly Interface",
      "Push Notifications",
      "Analytics Integration",
      "App Store Submission",
      "Regular Updates"
    ]
  }
];

const Products = () => {
  const navigate = useNavigate();

  const handleOrder = (productId) => {
    navigate(`/checkout/${productId}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center mb-12">Our Services</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <p className="text-gray-600">{product.description}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-3xl font-bold mb-6">{product.price}</p>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleOrder(product.id)}
                  >
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Products;
