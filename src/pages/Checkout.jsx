
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const products = {
  1: {
    name: "Basic Website Package",
    price: 999,
    description: "Perfect for small businesses and startups",
    features: [
      "5 Pages Website",
      "Mobile Responsive",
      "Contact Form",
      "Basic SEO",
      "3 Rounds of Revisions"
    ]
  },
  2: {
    name: "Professional Website Package",
    price: 2499,
    description: "Ideal for growing businesses",
    features: [
      "10 Pages Website",
      "Mobile Responsive",
      "Advanced SEO",
      "Content Management System",
      "5 Rounds of Revisions",
      "Social Media Integration"
    ]
  },
  3: {
    name: "E-commerce Package",
    price: 4999,
    description: "Complete online store solution",
    features: [
      "Unlimited Products",
      "Payment Gateway Integration",
      "Inventory Management",
      "Order Management",
      "Customer Dashboard",
      "Advanced Analytics"
    ]
  },
  4: {
    name: "Custom Software Development",
    price: 9999,
    description: "Tailored software solutions",
    features: [
      "Custom Requirements Analysis",
      "Scalable Architecture",
      "Database Design",
      "API Integration",
      "Testing & QA",
      "Maintenance Support"
    ]
  },
  5: {
    name: "Mobile App Development",
    price: 9999,
    description: "Native and cross-platform apps",
    features: [
      "iOS & Android Apps",
      "User-friendly Interface",
      "Push Notifications",
      "Analytics Integration",
      "App Store Submission",
      "Regular Updates"
    ]
  }
};

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const product = products[productId];

  if (!product) {
    navigate("/products");
    return null;
  }

  const handlePayment = async () => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Please login",
        description: "You need to be logged in to make a purchase.",
      });
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await loadRazorpay();

      if (!res) {
        toast({
          variant: "destructive",
          title: "Razorpay SDK failed to load",
          description: "Please check your internet connection.",
        });
        return;
      }

      // Create order on the backend
      const response = await fetch(`${process.env.BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          productId,
          amount: product.price
        })
      });

      const data = await response.json();

      if (data.status !== 'success') {
        throw new Error(data.message);
      }

      const options = {
        key: data.data.key,
        amount: data.data.amount * 100,
        currency: "INR",
        name: "Fruitenium Technologies",
        description: `Payment for ${product.name}`,
        order_id: data.data.razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch(`${process.env.BACKEND_URL}/api/orders/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.status === 'success') {
              toast({
                title: "Payment successful!",
                description: "Your order has been placed successfully.",
              });
              navigate("/dashboard");
            } else {
              throw new Error(verifyData.message);
            }
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Error verifying payment",
              description: error.message,
            });
          }
        },
        prefill: {
          name: currentUser.displayName,
          email: currentUser.email,
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error initiating payment",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
                <div>
                  <h4 className="font-medium">Features:</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-gray-600">{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold">₹{product.price}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Secure payment powered by Razorpay. Your payment information is encrypted
                  and securely processed.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium">What happens next?</h4>
                  <ul className="list-decimal pl-5 space-y-1 text-gray-600">
                    <li>Complete the secure payment</li>
                    <li>Receive confirmation email</li>
                    <li>Our team will contact you within 24 hours</li>
                    <li>Project kickoff meeting will be scheduled</li>
                  </ul>
                </div>
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full mt-6"
                >
                  {loading ? "Processing..." : "Pay Now"}
                </Button>
                <p className="text-sm text-gray-500 text-center mt-2">
                  By proceeding, you agree to our terms and conditions
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
