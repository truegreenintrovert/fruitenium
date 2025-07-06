import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";


const statusColors = {
  pending: "text-yellow-500",
  processing: "text-blue-500",
  completed: "text-green-500",
  cancelled: "text-red-500",
};

const OrdersTable = ({ orders, statusFilter, onStatusFilter, refresh, loading }) => {
  const handleStatusChange = async (orderId, newStatus) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    refresh();
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {["", "pending", "processing", "completed", "cancelled"].map(status => (
          <Button
            key={status}
            size="sm"
            variant={statusFilter === status ? "default" : "outline"}
            onClick={() => onStatusFilter(status)}
          >
            {status === "" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-6">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-6">No orders found.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="bg-white border-b">
                  <td className="px-6 py-4">{order.id}</td>
                  <td className="px-6 py-4">{order.profiles?.full_name || order.user_id}</td>
                  <td className="px-6 py-4">{order.products?.name || order.product_id}</td>
                  <td className="px-6 py-4">₹{order.amount}</td>
                  <td className={`px-6 py-4 font-medium ${statusColors[order.status] || "text-gray-500"}`}>{order.status}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleStatusChange(order.id, "completed")}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleStatusChange(order.id, "cancelled")}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
