
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Shield, 
  Clock,
  FileText,
  Bell,
  Settings,
  Key
} from "lucide-react";

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    company: currentUser?.company || "",
    address: currentUser?.address || "",
    bio: currentUser?.bio || "",
    notifications: currentUser?.notifications || {
      email: true,
      sms: false,
      push: true
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.updateProfile(formData);
      await updateUserProfile(formData);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setEditing(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      await api.sendPasswordResetEmail(currentUser.email);
      toast({
        title: "Password reset email sent",
        description: "Please check your email to reset your password.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send password reset email.",
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          {!editing && (
            <Button onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-primary" />
                  )}
                </div>
                <h2 className="text-xl font-semibold">{currentUser?.displayName}</h2>
                <p className="text-gray-500">{currentUser?.email}</p>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    activeTab === "personal" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Personal Info</span>
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    activeTab === "security" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Security</span>
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    activeTab === "notifications" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </button>
                <button
                  onClick={() => setActiveTab("billing")}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    activeTab === "billing" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Billing</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {activeTab === "personal" && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows="3"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows="4"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        ></textarea>
                      </div>
                      <div className="flex space-x-4 pt-4">
                        <Button type="submit" disabled={loading}>
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditing(false)}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Name</p>
                          <p className="mt-1">{currentUser?.displayName}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="mt-1">{currentUser?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone</p>
                          <p className="mt-1">{currentUser?.phone || "Not set"}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Company</p>
                          <p className="mt-1">{currentUser?.company || "Not set"}</p>
                        </div>
                      </div>
                      {currentUser?.address && (
                        <div className="pt-4 border-t">
                          <p className="text-sm font-medium text-gray-500">Address</p>
                          <p className="mt-1">{currentUser.address}</p>
                        </div>
                      )}
                      {currentUser?.bio && (
                        <div className="pt-4 border-t">
                          <p className="text-sm font-medium text-gray-500">Bio</p>
                          <p className="mt-1">{currentUser.bio}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Password</h3>
                    <p className="text-gray-500 mt-1">
                      Change your password to keep your account secure
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={handlePasswordChange}
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <p className="text-gray-500 mt-1">
                      Add an extra layer of security to your account
                    </p>
                    <Button className="mt-4">
                      <Shield className="w-4 h-4 mr-2" />
                      Enable 2FA
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-gray-500 text-sm">
                          Receive updates about your orders and account
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name="email"
                        checked={formData.notifications.email}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-gray-500 text-sm">
                          Get important updates via text message
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name="sms"
                        checked={formData.notifications.sms}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-gray-500 text-sm">
                          Receive notifications in your browser
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name="push"
                        checked={formData.notifications.push}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "billing" && (
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Payment Methods</h3>
                      <p className="text-gray-500 mt-1">
                        Manage your payment methods and billing details
                      </p>
                      <Button className="mt-4">
                        Add Payment Method
                      </Button>
                    </div>
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-medium">Billing History</h3>
                      <div className="mt-4">
                        {currentUser?.orders?.length > 0 ? (
                          <div className="space-y-4">
                            {currentUser.orders.map((order) => (
                              <div key={order.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium">{order.productName}</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">₹{order.amount}</p>
                                  <Button variant="ghost" size="sm">
                                    View Invoice
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No billing history available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
