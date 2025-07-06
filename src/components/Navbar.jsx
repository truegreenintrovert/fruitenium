
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";
import logo from '../../assets/logo.png';
import { supabase } from "@/lib/supabase";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

   useEffect(() => {
    const checkAdmin = async () => {
      if (currentUser) {
        const { data } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", currentUser.id)
          .single();
        setIsAdmin(data?.is_admin === true);
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [currentUser]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={logo} 
              alt="Fruitenium Technologies" 
              className="h-10 w-10"
            />
            <span className="text-xl font-bold hidden sm:block">Fruitenium Technologies</span>
            <span className="text-xl font-bold sm:hidden">Fruitenium</span>
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              About Us
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-gray-900">
              Services
            </Link>
             {isAdmin && (
            <Link to="/admin" className="text-primary font-semibold">
               Admin Dashboard
             </Link>
              )}
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={currentUser.photoURL || undefined} />
                    <AvatarFallback>
                      {currentUser.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/about" 
                className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md"
                onClick={toggleMenu}
              >
                About Us
              </Link>
              <Link 
                to="/products" 
                className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md"
                onClick={toggleMenu}
              >
                Services
              </Link>
              {currentUser?.role === "admin" && (
                <Link 
                  to="/admin" 
                  className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md"
                  onClick={toggleMenu}
                >
                  Admin
                </Link>
              )}
              {currentUser ? (
                <div className="border-t pt-4">
                  <Link 
                    to="/profile" 
                    className="block text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md"
                    onClick={toggleMenu}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="block text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <Button 
                    variant="outline" 
                    className="mt-4 w-full"
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Link to="/login" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={toggleMenu}>
                    <Button className="w-full">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
