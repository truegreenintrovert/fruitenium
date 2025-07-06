// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

// Modular admin table components
import UsersTable from "./UsersTable";
import ProductsTable from "./ProductsTable";
import OrdersTable from "./OrdersTable";
import TicketsTable from "./TicketsTable";
import ProjectsTable from "./ProjectsTable";
import ContactsTable from "./ContactsTable";
import AnalyticsPanel from "./AnalyticsPanel";

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Filters state
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [ticketStatusFilter, setTicketStatusFilter] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("");
  const [contactStatusFilter, setContactStatusFilter] = useState("");

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, [
    orderStatusFilter,
    userSearch,
    productSearch,
    ticketStatusFilter,
    projectStatusFilter,
    contactStatusFilter,
  ]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Metrics
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      const { data: ordersData } = await supabase.from("orders").select("*");
      const { count: activeProjects } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");
      const totalRevenue =
        ordersData?.reduce((sum, o) => sum + (o.amount || 0), 0) || 0;
      setMetrics({
        totalUsers: totalUsers || 0,
        totalOrders: ordersData?.length || 0,
        totalRevenue: totalRevenue || 0,
        activeProjects: activeProjects || 0,
      });

      // Orders with optional filter
      let { data: ordersList } = await supabase
        .from("orders")
        .select("*, profiles:user_id(full_name), products:product_id(name)")
        .order("created_at", { ascending: false });
      if (orderStatusFilter)
        ordersList = ordersList.filter((o) => o.status === orderStatusFilter);
      setOrders(ordersList || []);

      // Users with optional search
      let { data: usersList } = await supabase.from("profiles").select("*");
      if (userSearch)
        usersList = usersList.filter(
          (u) =>
            (u.full_name &&
              u.full_name.toLowerCase().includes(userSearch.toLowerCase())) ||
            (u.email &&
              u.email.toLowerCase().includes(userSearch.toLowerCase()))
        );
      setUsers(usersList || []);

      // Products with optional search
      let { data: productsList } = await supabase.from("products").select("*");
      if (productSearch)
        productsList = productsList.filter((p) =>
          p.name
            ? p.name.toLowerCase().includes(productSearch.toLowerCase())
            : false
        );
      setProducts(productsList || []);

      // Tickets with optional filter
      let { data: ticketsList } = await supabase.from("tickets").select("*");
      if (ticketStatusFilter)
        ticketsList = ticketsList.filter((t) => t.status === ticketStatusFilter);
      setTickets(ticketsList || []);

      // Projects with optional filter
      let { data: projectsList } = await supabase.from("projects").select("*");
      if (projectStatusFilter)
        projectsList = projectsList.filter(
          (p) => p.status === projectStatusFilter
        );
      setProjects(projectsList || []);

      // Contact submissions with optional filter
      let { data: contactList } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (contactStatusFilter)
        contactList = contactList.filter(
          (c) => c.status === contactStatusFilter
        );
      setContactSubmissions(contactList || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch dashboard data",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handlers for filters/search to pass down to children
  const handleOrderStatusFilter = (status) => setOrderStatusFilter(status);
  const handleUserSearch = (s) => setUserSearch(s);
  const handleProductSearch = (s) => setProductSearch(s);
  const handleTicketStatusFilter = (status) => setTicketStatusFilter(status);
  const handleProjectStatusFilter = (status) => setProjectStatusFilter(status);
  const handleContactStatusFilter = (status) => setContactStatusFilter(status);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrdersTable
              orders={orders}
              statusFilter={orderStatusFilter}
              onStatusFilter={handleOrderStatusFilter}
              refresh={fetchDashboardData}
              loading={loading}
            />
          </TabsContent>
          <TabsContent value="users">
            <UsersTable
              users={users}
              onSearch={handleUserSearch}
              refresh={fetchDashboardData}
              loading={loading}
            />
          </TabsContent>
          <TabsContent value="products">
            <ProductsTable
              products={products}
              onSearch={handleProductSearch}
              refresh={fetchDashboardData}
              loading={loading}
            />
          </TabsContent>
          <TabsContent value="tickets">
            <TicketsTable
              tickets={tickets}
              statusFilter={ticketStatusFilter}
              onStatusFilter={handleTicketStatusFilter}
              refresh={fetchDashboardData}
              loading={loading}
            />
          </TabsContent>
          <TabsContent value="projects">
            <ProjectsTable
              projects={projects}
              users={users}
              statusFilter={projectStatusFilter}
              onStatusFilter={handleProjectStatusFilter}
              refresh={fetchDashboardData}
              loading={loading}
            />
          </TabsContent>
          <TabsContent value="contacts">
            <ContactsTable
              contacts={contactSubmissions}
              statusFilter={contactStatusFilter}
              onStatusFilter={handleContactStatusFilter}
              loading={loading}
              refresh={fetchDashboardData}
            />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsPanel metrics={metrics} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
