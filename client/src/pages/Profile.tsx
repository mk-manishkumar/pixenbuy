import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Navbar from "@/components/SharedComponents/Navbar";
import { Footer } from "@/components/SharedComponents/Footer";
import { Button } from "@/components/ui/button";
import { useUserQuery, useUpdateUser } from "@/hooks/useUserQuery";
import { useOrderHistory } from "@/hooks/useOrderQuery";
import { Package, User } from "lucide-react";
import ProfileDetailsCard from "@/components/ProfileComponents/ProfileDetailsCard";
import ProfileOrderHistory from "@/components/ProfileComponents/ProfileOrderHistory";

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

            <ProfileDetailsCard
              userLoading={userLoading}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              name={name}
              setName={setName}
              phone={phone}
              setPhone={setPhone}
              address={address}
              setAddress={setAddress}
              user={user}
              handleSave={handleSave}
              isUpdating={isUpdating}
            />
          </div>

          {/* Purchase History */}
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <Package size={24} /> Purchase History
            </h2>

            <ProfileOrderHistory
              ordersLoading={ordersLoading}
              orderData={orderData}
              setPage={setPage}
              expandedOrder={expandedOrder}
              toggleOrder={toggleOrder}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
