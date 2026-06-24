import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Navbar from "@/components/SharedComponents/Navbar";
import { Footer } from "@/components/SharedComponents/Footer";
import { useUserQuery } from "@/hooks/useUserQuery";
import { useGetAllUsers } from "@/hooks/useAdminQuery";
import { ArrowLeft, Users, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { data: currentUser, isLoading: userLoading } = useUserQuery();
  const { data: users, isLoading: usersLoading } = useGetAllUsers();

  if (!isSignedIn) {
    navigate("/sign-in");
    return null;
  }

  if (userLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex justify-center items-center">
          <p className="text-gray-500">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (currentUser?.role !== "admin") {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <button 
              onClick={() => navigate("/admin/dashboard")}
              className="p-2 bg-white text-gray-500 hover:text-indigo-600 rounded-full shadow-sm border hover:shadow transition-all cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="text-indigo-600" /> Registered Users
              </h1>
              <p className="text-gray-500 mt-1">Directory of all customers registered on Pixenbuy.</p>
            </div>
          </div>

          {/* Table Content */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Phone</th>
                    <th className="p-4 font-medium">Address</th>
                    <th className="p-4 font-medium">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {usersLoading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        <div className="flex justify-center mb-2">
                          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        Loading users...
                      </td>
                    </tr>
                  ) : !users || users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        No registered users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{u.name || "N/A"}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Mail size={14} className="text-gray-400" />
                            {u.email}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Phone size={14} className="text-gray-400" />
                            {u.phone || "N/A"}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate max-w-[200px]" title={u.address}>{u.address || "N/A"}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Calendar size={14} className="text-gray-400" />
                            {format(new Date(u.createdAt), "MMM d, yyyy")}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminUsers;
