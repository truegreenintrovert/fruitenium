import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";


const ProjectsTable = ({ projects, users, statusFilter, onStatusFilter, refresh, loading }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", user_id: "", status: "active" });

  const handleAdd = async () => {
    if (!newProject.title || !newProject.user_id) return;
    await supabase.from("projects").insert([newProject]);
    setShowAddModal(false);
    setNewProject({ title: "", user_id: "", status: "active" });
    refresh();
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {["", "active", "completed"].map(status => (
          <Button
            key={status}
            size="sm"
            variant={statusFilter === status ? "default" : "outline"}
            onClick={() => onStatusFilter(status)}
          >
            {status === "" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center py-6">Loading...</td></tr>
            ) : projects.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-6">No projects found.</td></tr>
            ) : (
              projects.map(project => (
                <tr key={project.id} className="bg-white border-b">
                  <td className="px-6 py-4">{project.title}</td>
                  <td className="px-6 py-4">
                    {users.find(u => u.id === project.user_id)?.full_name || project.user_id}
                  </td>
                  <td className="px-6 py-4">{project.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-xs">
            <h3 className="mb-4 font-bold text-lg">Add Project</h3>
            <input
              type="text"
              className="w-full border p-2 mb-2"
              placeholder="Title"
              value={newProject.title}
              onChange={e => setNewProject({ ...newProject, title: e.target.value })}
            />
            <select
              className="w-full border p-2 mb-2"
              value={newProject.user_id}
              onChange={e => setNewProject({ ...newProject, user_id: e.target.value })}
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.full_name}</option>
              ))}
            </select>
            <select
              className="w-full border p-2 mb-4"
              value={newProject.status}
              onChange={e => setNewProject({ ...newProject, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <Button onClick={handleAdd}>Add</Button>
            <Button variant="ghost" className="ml-2" onClick={() => setShowAddModal(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;
