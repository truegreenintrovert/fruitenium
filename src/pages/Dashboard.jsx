import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import OrderHistory from "./OrderHistory";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [orderCount, setOrderCount] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const [tickets, setTickets] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  // Fetch user's full_name from profiles table
  useEffect(() => {
    const fetchFullName = async () => {
      if (currentUser && currentUser.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", currentUser.id)
          .single();

        if (error) {
          console.warn("Supabase fetch full_name error:", error);
        } else {
          console.log("Supabase fetch full_name data:", data);
        }

        if (data && data.full_name && data.full_name.trim().length > 0) {
          setFullName(data.full_name.trim());
        } else {
          setFullName("");
        }
      }
    };
    fetchFullName();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
    // eslint-disable-next-line
  }, [currentUser]);

  const fetchDashboardData = async () => {
    let { count: ordersCount, error: orderError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", currentUser.id);

    let { count: activeProjectsCount } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", currentUser.id)
      .eq("status", "active");

    let { count: ticketCount } = await supabase
      .from("tickets")
      .select("*", { count: "exact", head: true })
      .eq("user_id", currentUser.id);

    let { data: orders, error: orderDataError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false })
      .limit(5);

    setOrderCount(ordersCount || 0);
    setActiveProjects(activeProjectsCount || 0);
    setTickets(ticketCount || 0);
    setRecentOrders(orders || []);

    if (orderError || orderDataError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">
          Welcome, {fullName ? fullName : currentUser?.email}!
        </h1>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Active Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{activeProjects}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{orderCount}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{tickets}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center">
                        <div className="ml-4">
                          <p className="text-sm font-medium">
                            Order #{order.id} placed
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">No recent orders</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <OrderHistory userId={currentUser?.id} />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-gray-500">{currentUser?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-gray-500">
                      {fullName ? fullName : <span className="italic text-gray-400">Not set</span>}
                    </p>
                  </div>
                  <div>
                    <Button onClick={() => navigate("/profile")}>
                      Go to Profile
                    </Button>
                  </div>
                </div>
                {/* Debug only: remove after confirming it works */}
                {/* <div>Debug: {JSON.stringify({ id: currentUser?.id, fullName })}</div> */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Dashboard;
