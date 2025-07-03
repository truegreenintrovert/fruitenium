
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Package, 
  FileCheck,
  Calendar,
  IndianRupee
} from "lucide-react";

const OrderStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled"
};

const StatusIcon = ({ status }) => {
  switch (status) {
    case OrderStatus.PENDING:
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case OrderStatus.PROCESSING:
      return <Package className="h-5 w-5 text-blue-500" />;
    case OrderStatus.IN_PROGRESS:
      return <FileCheck className="h-5 w-5 text-purple-500" />;
    case OrderStatus.COMPLETED:
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case OrderStatus.CANCELLED:
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.getUserOrders();
      setOrders(response.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load orders.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case OrderStatus.PROCESSING:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.IN_PROGRESS:
        return "bg-purple-100 text-purple-800";
      case OrderStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Order History</h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600">No Orders Yet</h3>
              <p className="text-gray-500 mt-2">Your order history will appear here</p>
              <Button className="mt-6" onClick={() => navigate("/products")}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Order #{order.id}</CardTitle>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          ₹{order.amount}
                        </span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      <div className="flex items-center space-x-1">
                        <StatusIcon status={order.status} />
                        <span className="capitalize">{order.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">{order.product_name}</h3>
                      <p className="text-gray-600">{order.description}</p>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Order Timeline</h4>
                      <div className="relative pl-8 space-y-6">
                        {order.timeline?.map((event, index) => (
                          <div key={index} className="relative">
                            <div className="absolute -left-8 mt-1.5 h-3 w-3 rounded-full border-2 border-primary bg-white"></div>
                            {index !== order.timeline.length - 1 && (
                              <div className="absolute -left-7 mt-3 h-full w-0.5 bg-gray-200"></div>
                            )}
                            <div>
                              <p className="font-medium">{event.title}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(event.timestamp).toLocaleString()}
                              </p>
                              {event.description && (
                                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button variant="outline" onClick={() => window.open(`/invoice/${order.id}`, '_blank')}>
                        Download Invoice
                      </Button>
                      <Button onClick={() => navigate(`/support/ticket/create/${order.id}`)}>
                        Get Support
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OrderHistory;
