import React from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";


const TicketsTable = ({ tickets, statusFilter, onStatusFilter, refresh, loading }) => {
  const handleCloseTicket = async (ticketId) => {
    await supabase.from("tickets").update({ status: "closed" }).eq("id", ticketId);
    refresh();
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {["", "open", "in_progress", "closed"].map(status => (
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
              <th className="px-6 py-3">Ticket ID</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Subject</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-6">Loading...</td></tr>
            ) : tickets.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-6">No tickets found.</td></tr>
            ) : (
              tickets.map(ticket => (
                <tr key={ticket.id} className="bg-white border-b">
                  <td className="px-6 py-4">{ticket.id}</td>
                  <td className="px-6 py-4">{ticket.user_id}</td>
                  <td className="px-6 py-4">{ticket.subject}</td>
                  <td className="px-6 py-4">{ticket.status}</td>
                  <td className="px-6 py-4">
                    {ticket.status !== "closed" && (
                      <Button variant="outline" size="sm" onClick={() => handleCloseTicket(ticket.id)}>
                        Close
                      </Button>
                    )}
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

export default TicketsTable;
