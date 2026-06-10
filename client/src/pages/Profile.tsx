import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Navbar from "@/components/SharedComponents/Navbar";
import { Footer } from "@/components/SharedComponents/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserQuery, useUpdateUser } from "@/hooks/useUserQuery";
import { useOrderHistory } from "@/hooks/useOrderQuery";
import type { Order } from "@/hooks/useOrderQuery";
import { ChevronDown, ChevronUp, Package, User, MapPin, Phone, Mail } from "lucide-react";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { data: user, isLoading: userLoading } = useUserQuery();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const [page, setPage] = useState(1);
  const { data: orderData, isLoading: ordersLoading } = useOrderHistory(page);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (!isSignedIn) {
    navigate("/sign-in");
    return null;
  }

  const handleEdit = () => {
    setName(user?.name || "");
    setPhone(user?.phone || "");
    setAddress(user?.address || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    updateUser(
      { name, phone, address },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-16">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <User size={24} /> My Profile
              </h1>
              {!isEditing && (
                <Button onClick={handleEdit} variant="outline" className="cursor-pointer">
                  Edit Profile
                </Button>
              )}
            </div>

            {userLoading ? (
              <p className="text-gray-500">Loading profile...</p>
            ) : isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1">Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <Label className="mb-1">Email</Label>
                  <Input value={user?.email || ""} disabled className="bg-gray-100" />
                </div>
                <div>
                  <Label className="mb-1">Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 8901" />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-1">Address</Label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Your address"
                    className="w-full border px-3 py-2 rounded text-sm resize-none"
                  />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <Button onClick={handleSave} disabled={isUpdating} className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer">
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" className="cursor-pointer">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={16} className="text-gray-400" />
                  <span className="font-medium">Name:</span> {user?.name || "Not set"}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail size={16} className="text-gray-400" />
                  <span className="font-medium">Email:</span> {user?.email}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone size={16} className="text-gray-400" />
                  <span className="font-medium">Phone:</span> {user?.phone || "Not set"}
                </div>
                <div className="flex items-center gap-2 text-gray-700 md:col-span-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="font-medium">Address:</span> {user?.address || "Not set"}
                </div>
              </div>
            )}
          </div>

          {/* Purchase History */}
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <Package size={24} /> Purchase History
            </h2>

            {ordersLoading ? (
              <p className="text-gray-500">Loading orders...</p>
            ) : !orderData || orderData.orders.length === 0 ? (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No purchases yet</p>
                <p className="text-gray-400 text-sm mt-1">Your order history will appear here</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {orderData.orders.map((order: Order) => (
                    <div key={order._id} className="border rounded-xl overflow-hidden transition-shadow hover:shadow-md">
                      {/* Accordion Header */}
                      <button
                        onClick={() => toggleOrder(order._id)}
                        className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-white cursor-pointer"
                      >
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-gray-500">Order</span>
                            <p className="font-mono font-semibold text-xs">#{order._id.slice(-8).toUpperCase()}</p>
                          </div>
                          <div className="hidden sm:block">
                            <span className="text-gray-500">Date</span>
                            <p className="font-medium">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Items</span>
                            <p className="font-medium">{order.totalItems}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Total</span>
                            <p className="font-bold text-indigo-600">${(order.totalPrice + order.shippingCost).toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "placed" ? "bg-yellow-100 text-yellow-700" : order.status === "delivered" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          {expandedOrder === order._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </button>

                      {/* Accordion Body */}
                      {expandedOrder === order._id && (
                        <div className="px-6 py-4 border-t bg-white">
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm py-2 border-b last:border-0">
                                <div>
                                  <p className="font-medium">{item.title}</p>
                                  <p className="text-gray-500 text-xs">{item.brand} • Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-3 border-t text-sm space-y-1">
                            <div className="flex justify-between text-gray-600">
                              <span>Subtotal</span>
                              <span>${order.totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>Shipping</span>
                              <span>${order.shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-base pt-1">
                              <span>Total</span>
                              <span className="text-indigo-600">${(order.totalPrice + order.shippingCost).toFixed(2)}</span>
                            </div>
                            <p className="text-gray-400 text-xs pt-2">
                              <MapPin size={12} className="inline mr-1" />
                              {order.shippingAddress}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {orderData.pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-8">
                    <Button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {orderData.pagination.currentPage} of {orderData.pagination.totalPages}
                    </span>
                    <Button
                      onClick={() => setPage((p) => Math.min(orderData.pagination.totalPages, p + 1))}
                      disabled={page === orderData.pagination.totalPages}
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
