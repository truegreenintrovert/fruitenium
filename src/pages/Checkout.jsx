import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const EDGE_BASE = import.meta.env.VITE_SUPABASE_EDGE_URL;
const CREATE_ORDER_URL = `${EDGE_BASE}/create-razorpay-order`;
const VERIFY_PAYMENT_URL = `${EDGE_BASE}/verify-razorpay-payment`;

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
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
  const [product, setProduct] = useState(null);

  // Fetch product from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();
      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Product not found",
          description: "Returning to product list.",
        });
        navigate("/products");
        return;
      }
      setProduct(data);
    };
    fetchProduct();
    // eslint-disable-next-line
  }, [productId]);

  // Handle "must be logged in"
  useEffect(() => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Please login",
        description: "You need to be logged in to make a purchase.",
      });
      navigate("/login");
    }
    // eslint-disable-next-line
  }, [currentUser]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Razorpay payment handler
  const handlePayment = async () => {
    setLoading(true);
    try {
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        toast({
          variant: "destructive",
          title: "Razorpay SDK failed to load",
          description: "Please check your internet connection.",
        });
        setLoading(false);
        return;
      }
        // --- get the current user access token for auth header ---
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

      // 1. Create order with Supabase Edge Function
      const orderRes = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
        body: JSON.stringify({
          amount: product.price, // amount in rupees
          productId: product.id,
          userId: currentUser.id,
        }),
      });
      const orderData = await orderRes.json();

      if (!orderData?.order_id) {
        throw new Error(orderData?.error || "Could not create order");
      }

      // 2. Launch Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: product.price * 100,
        currency: "INR",
        name: "Fruitenium Technologies",
        description: `Payment for ${product.name}`,
        order_id: orderData.order_id,
        handler: async function (response) {
          // 3. Verify payment with Supabase Edge Function
          const verifyRes = await fetch(VERIFY_PAYMENT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: currentUser.id,
              productId: product.id,
              amount: product.price,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast({
              title: "Payment successful!",
              description: "Your order has been placed.",
            });
            navigate("/dashboard");
          } else {
            toast({
              variant: "destructive",
              title: "Payment verification failed",
              description: verifyData?.error || "Payment could not be verified.",
            });
          }
        },
        prefill: {
          name: currentUser.displayName,
          email: currentUser.email,
        },
        theme: { color: "#4F46E5" },
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
                    {product.features?.map((feature, index) => (
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
