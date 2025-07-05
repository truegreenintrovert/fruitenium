
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // In ProductDetail.jsx (replace api.getProduct with supabase call)
useEffect(() => {
  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load product details.",
      });
      navigate("/products");
    } else {
      setProduct(data);
    }
    setLoading(false);
  };
  fetchProduct();
}, [id, navigate, toast]);


  const handleOrder = () => {
    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to place an order.",
      });
      navigate("/login");
      return;
    }
    navigate(`/checkout/${id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <Button className="mt-4" onClick={() => navigate("/products")}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="outline"
          className="mb-8"
          onClick={() => navigate("/products")}
        >
          ← Back to Products
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <p className="text-gray-600">{product.description}</p>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold mb-6">{product.price}</p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Features</h3>
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
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Process</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li>Initial consultation and requirements gathering</li>
                    <li>Project proposal and timeline</li>
                    <li>Design and development phase</li>
                    <li>Review and revisions</li>
                    <li>Testing and quality assurance</li>
                    <li>Launch and deployment</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">What's Included</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Free consultation</li>
                  <li>✓ Project timeline</li>
                  <li>✓ Technical support</li>
                  <li>✓ Source code access</li>
                  <li>✓ Post-launch support</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Payment Terms</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 50% upfront payment</li>
                  <li>• 50% upon completion</li>
                  <li>• Secure payment gateway</li>
                  <li>• Money-back guarantee</li>
                </ul>
              </div>

              <Button
                className="w-full mt-8"
                size="lg"
                onClick={handleOrder}
              >
                Order Now
              </Button>

              <p className="text-sm text-gray-500 text-center mt-4">
                By proceeding, you agree to our terms and conditions
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
