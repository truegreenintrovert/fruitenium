
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "@/components/UserMenu";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="#" 
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
            {currentUser?.role === "admin" && (
              <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                Admin
              </Link>
            )}
            {currentUser ? (
              <UserMenu />
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
