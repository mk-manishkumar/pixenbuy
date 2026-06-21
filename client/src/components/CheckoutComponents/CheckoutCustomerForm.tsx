import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  errors: Record<string, string>;
}

const CheckoutCustomerForm: React.FC<Props> = ({
  name, setName,
  email, setEmail,
  phone, setPhone,
  address, setAddress,
  errors
}) => {
  return (
    <div className="flex-1">
      <h2 className="text-2xl font-bold mb-6">Customer Details</h2>
      <form className="grid grid-cols-1 gap-4">
        <div>
          <Label className="block mb-2">Name</Label>
          <Input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <Label className="block mb-2">Email</Label>
          <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <Label className="block mb-2">Mobile Number</Label>
          <Input type="tel" placeholder="+1 234 567 8901" value={phone} onChange={(e) => setPhone(e.target.value)} />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <Label className="block mb-2">Address</Label>
          <textarea rows={5} className="w-full border px-3 py-2 rounded text-sm resize-none" placeholder="123 Street, City, Country" value={address} onChange={(e) => setAddress(e.target.value)} />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>
      </form>
    </div>
  );
};

export default CheckoutCustomerForm;
