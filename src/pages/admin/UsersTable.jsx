// src/pages/admin/UsersTable.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { supabase } from "@/lib/supabase";


const UsersTable = ({ users, onSearch, refresh, loading }) => {
  const [search, setSearch] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // Handle search and pass up to parent for filtering
  const handleSearch = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  // For modals: async role change or delete (direct supabase call)
  const handleRoleChange = async (user) => {
    await supabase
      .from("profiles")
      .update({ is_admin: !user.is_admin })
      .eq("id", user.id);
    setShowRoleModal(null);
    refresh();
  };

  const handleDelete = async (user) => {
    await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id);
    setShowDeleteModal(null);
    refresh();
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <input
          type="search"
          className="border px-3 py-2 rounded w-full max-w-xs"
          placeholder="Search by name or email"
          value={search}
          onChange={handleSearch}
        />
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="bg-white border-b">
                  <td className="px-6 py-4">{user.full_name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.is_admin ? "Admin" : "User"}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowRoleModal(user)}
                        title={user.is_admin ? "Revoke admin" : "Make admin"}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteModal(user)}
                        title="Delete user"
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

      {/* Change Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-xs">
            <h3 className="mb-4 font-bold text-lg">Change User Role</h3>
            <p>
              Current role: <b>{showRoleModal.is_admin ? "Admin" : "User"}</b>
            </p>
            <Button
              onClick={() => handleRoleChange(showRoleModal)}
              className="mt-4"
            >
              {showRoleModal.is_admin ? "Revoke Admin" : "Make Admin"}
            </Button>
            <Button
              variant="ghost"
              className="ml-2"
              onClick={() => setShowRoleModal(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-xs">
            <h3 className="mb-4 font-bold text-lg text-red-600">
              Delete User?
            </h3>
            <p>
              Are you sure you want to delete{" "}
              <b>{showDeleteModal.full_name}</b>?
            </p>
            <div className="flex mt-4 gap-2">
              <Button
                variant="destructive"
                onClick={() => handleDelete(showDeleteModal)}
              >
                Yes, Delete
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowDeleteModal(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
