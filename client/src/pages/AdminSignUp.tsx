import React, { useState } from "react";
import { SignUp, useAuth, useUser } from "@clerk/clerk-react";
import Navbar from "@/components/SharedComponents/Navbar";
import { Footer } from "@/components/SharedComponents/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAdmin } from "@/hooks/useUserQuery";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

const AdminSignUp: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const { mutate: createAdmin, isPending, isSuccess, isError, error } = useCreateAdmin();
  const [secretKey, setSecretKey] = useState("");
  const [step, setStep] = useState<"clerk" | "secret">(isSignedIn ? "secret" : "clerk");

  // Once signed in via Clerk, show the secret key step
  if (isSignedIn && step === "clerk") {
    setStep("secret");
  }

  const handleAdminCreate = () => {
    if (!secretKey.trim()) return;
    createAdmin({
      email: clerkUser?.primaryEmailAddress?.emailAddress || "",
      name: clerkUser?.fullName || "",
      secretKey,
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm border max-w-md">
            <Shield size={48} className="mx-auto text-emerald-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Admin Account Created!</h2>
            <p className="text-gray-600 mb-6">You now have admin access to Pixenbuy.</p>
            <Button onClick={() => navigate("/admin/dashboard")} className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer">
              Go to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        {step === "clerk" ? (
          <div>
            <div className="text-center mb-6">
              <Shield size={36} className="mx-auto text-indigo-500 mb-2" />
              <h2 className="text-xl font-bold">Admin Registration</h2>
              <p className="text-gray-500 text-sm">Step 1: Create your Clerk account</p>
            </div>
            <SignUp signInUrl="/sign-in" afterSignUpUrl="/admin/sign-up" />
          </div>
        ) : (
          <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border">
            <div className="text-center mb-6">
              <Shield size={36} className="mx-auto text-indigo-500 mb-2" />
              <h2 className="text-xl font-bold">Admin Verification</h2>
              <p className="text-gray-500 text-sm">Step 2: Enter your admin secret key</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="mb-1">Email</Label>
                <Input
                  value={clerkUser?.primaryEmailAddress?.emailAddress || ""}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div>
                <Label className="mb-1">Admin Secret Key</Label>
                <Input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter your admin secret key"
                />
              </div>

              {isError && (
                <p className="text-red-500 text-sm">
                  {(error as Error)?.message || "Failed to create admin account"}
                </p>
              )}

              <Button
                onClick={handleAdminCreate}
                disabled={isPending || !secretKey.trim()}
                className="w-full bg-indigo-500 hover:bg-indigo-600 cursor-pointer"
              >
                {isPending ? "Verifying..." : "Activate Admin Access"}
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminSignUp;
