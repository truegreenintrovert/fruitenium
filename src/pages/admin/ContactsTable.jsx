// src/pages/admin/ContactsTable.jsx

import React from "react";
import { Button } from "@/components/ui/button";

const statusColors = {
  new: "text-yellow-500",
  in_progress: "text-blue-500",
  resolved: "text-green-500",
};

const ContactsTable = ({ contacts, statusFilter, onStatusFilter, loading, refresh }) => (
  <div>
    <div className="flex gap-2 mb-4">
      {["", "new", "in_progress", "resolved"].map(status => (
        <Button
          key={status}
          size="sm"
          variant={statusFilter === status ? "default" : "outline"}
          onClick={() => onStatusFilter(status)}
        >
          {status === "" ? "All" : status.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
        </Button>
      ))}
    </div>
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Subject</th>
            <th className="px-6 py-3">Message</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-6">
                Loading...
              </td>
            </tr>
          ) : contacts.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-6">
                No contacts found.
              </td>
            </tr>
          ) : (
            contacts.map((c) => (
              <tr key={c.id} className="bg-white border-b">
                <td className="px-6 py-4">{c.name}</td>
                <td className="px-6 py-4">{c.email}</td>
                <td className="px-6 py-4">{c.subject}</td>
                <td className="px-6 py-4">{c.message}</td>
                <td className={`px-6 py-4 font-medium ${statusColors[c.status] || ""}`}>
                  {c.status}
                </td>
                <td className="px-6 py-4">
                  {c.created_at ? new Date(c.created_at).toLocaleString() : ""}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default ContactsTable;
