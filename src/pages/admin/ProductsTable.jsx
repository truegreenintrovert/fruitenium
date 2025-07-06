import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";


const ProductsTable = ({ products, onSearch, refresh, loading }) => {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const defaultProduct = {
    name: "",
    price: 0,
    status: "active",
    description: "",
    features: "",
  };

  const [newProduct, setNewProduct] = useState(defaultProduct);
  const [editProduct, setEditProduct] = useState({ ...defaultProduct, id: "" });
  const [featuresError, setFeaturesError] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  const handleAdd = async () => {
    setFeaturesError("");
    let featuresJson = null;
    if (newProduct.features) {
      try {
        featuresJson = JSON.parse(newProduct.features);
      } catch {
        setFeaturesError("Features must be valid JSON!");
        return;
      }
    }
    await supabase.from("products").insert([{
      name: newProduct.name,
      price: newProduct.price,
      status: newProduct.status,
      description: newProduct.description,
      features: featuresJson,
    }]);
    setShowAddModal(false);
    setNewProduct(defaultProduct);
    refresh();
  };

  const handleEdit = async () => {
    setFeaturesError("");
    let featuresJson = null;
    if (editProduct.features) {
      try {
        featuresJson = JSON.parse(editProduct.features);
      } catch {
        setFeaturesError("Features must be valid JSON!");
        return;
      }
    }
    await supabase.from("products").update({
      name: editProduct.name,
      price: editProduct.price,
      status: editProduct.status,
      description: editProduct.description,
      features: featuresJson,
    }).eq("id", editProduct.id);
    setShowEditModal(false);
    refresh();
  };

  const handleDelete = async (productId) => {
    await supabase.from("products").delete().eq("id", productId);
    refresh();
  };

  return (
    <div>
      <div className="flex items-center mb-4 gap-2">
        <input
          type="search"
          className="border px-3 py-2 rounded w-full max-w-xs"
          placeholder="Search by product name"
          value={search}
          onChange={handleSearch}
        />
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="bg-white border-b">
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">{product.status}</td>
                  <td className="px-6 py-4">{product.description || <span className="text-gray-400 italic">No description</span>}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditProduct({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            status: product.status,
                            description: product.description || "",
                            features: product.features
                              ? typeof product.features === "string"
                                ? product.features
                                : JSON.stringify(product.features, null, 2)
                              : "",
                          });
                          setShowEditModal(true);
                          setFeaturesError("");
                        }}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-xs">
            <h3 className="mb-4 font-bold text-lg">Add Product</h3>
            <input
              type="text"
              className="w-full border p-2 mb-2"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={e => setNewProduct({...newProduct, name: e.target.value})}
            />
            <input
              type="number"
              className="w-full border p-2 mb-2"
              placeholder="Price"
              value={newProduct.price}
              onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
            />
            <select
              className="w-full border p-2 mb-2"
              value={newProduct.status}
              onChange={e => setNewProduct({...newProduct, status: e.target.value})}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <textarea
              className="w-full border p-2 mb-2"
              placeholder="Description"
              value={newProduct.description}
              onChange={e => setNewProduct({...newProduct, description: e.target.value})}
            />
            <textarea
              className="w-full border p-2 mb-4"
              placeholder='Features (JSON format, e.g. {"color":"red"})'
              value={newProduct.features}
              onChange={e => setNewProduct({...newProduct, features: e.target.value})}
            />
            {featuresError && <div className="text-red-500 mb-2">{featuresError}</div>}
            <Button onClick={handleAdd}>Add</Button>
            <Button variant="ghost" className="ml-2" onClick={() => setShowAddModal(false)}>Cancel</Button>
          </div>
        </div>
      )}
      {/* Edit Product Modal */}
     {showEditModal && (
           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md max-h-[95vh] overflow-y-auto">
              <h3 className="mb-4 font-bold text-lg">Edit Product</h3>
              <div className="space-y-3">
               <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  placeholder="Product Name"
                  value={editProduct.name}
                  onChange={e => setEditProduct({...editProduct, name: e.target.value})}
                />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                className="w-full border p-2 rounded"
                placeholder="Price"
                value={editProduct.price}
                onChange={e => setEditProduct({...editProduct, price: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="w-full border p-2 rounded"
                value={editProduct.status}
                onChange={e => setEditProduct({...editProduct, status: e.target.value})}
              >
               <option value="active">Active</option>
               <option value="inactive">Inactive</option>
             </select>
           </div>
           <div>
               <label className="block text-sm font-medium mb-1">Description</label>
               <textarea
                 className="w-full border p-2 rounded min-h-[90px] resize-y"
                 placeholder="Description"
                 value={editProduct.description}
                 onChange={e => setEditProduct({...editProduct, description: e.target.value})}
                 rows={4}
               />
             </div>
             <div>
                 <label className="block text-sm font-medium mb-1">Features (JSON)</label>
                 <textarea
                   className="w-full border p-2 rounded min-h-[90px] resize-y"
                   placeholder='Features (JSON format, e.g. {"color":"red"})'
                   value={editProduct.features}
                   onChange={e => setEditProduct({...editProduct, features: e.target.value})}
                   rows={4}
                 />
             </div>
            {featuresError && (
             <div className="text-red-500 mb-2">{featuresError}</div>
          )}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleEdit}>Save</Button>
              <Button
                variant="ghost"
                onClick={() => setShowEditModal(false)}
              >
               Cancel
              </Button>
           </div>
        </div>
      </div>
      </div>
     )}
     </div>
  );
};

export default ProductsTable;
