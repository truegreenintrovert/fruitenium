
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Basic Website Package",
    price: "$999",
    description: "Perfect for small businesses and startups",
    status: "Active"
  },
  {
    id: 2,
    name: "Professional Website Package",
    price: "$2,499",
    description: "Ideal for growing businesses",
    status: "Active"
  },
  {
    id: 3,
    name: "E-commerce Package",
    price: "$4,999",
    description: "Complete online store solution",
    status: "Active"
  }
];

const AdminProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEdit = (product) => {
    setSelectedProduct(product);
  };

  const handleDelete = (productId) => {
    // Implement delete functionality
    console.log("Delete product:", productId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-4">Name</th>
                    <th className="pb-4">Price</th>
                    <th className="pb-4">Description</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="py-2">{product.name}</td>
                      <td>{product.price}</td>
                      <td>{product.description}</td>
                      <td>{product.status}</td>
                      <td>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminProducts;
