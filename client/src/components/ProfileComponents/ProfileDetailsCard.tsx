import React from "react";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/hooks/useUserQuery";

interface Props {
  userLoading: boolean;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  user: UserProfile | undefined;
  handleSave: () => void;
  isUpdating: boolean;
}

const ProfileDetailsCard: React.FC<Props> = ({
  userLoading, isEditing, setIsEditing,
  name, setName, phone, setPhone, address, setAddress,
  user, handleSave, isUpdating
}) => {
  if (userLoading) {
    return <p className="text-gray-500">Loading profile...</p>;
  }

  if (isEditing) {
    return (
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
    );
  }

  return (
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
  );
};

export default ProfileDetailsCard;
