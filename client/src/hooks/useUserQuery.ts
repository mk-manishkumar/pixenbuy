import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import backendApi from "@/api/backendApi";

interface UserProfile {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

interface CreateUserPayload {
  email: string;
  name?: string;
}


interface UpdateUserPayload {
  name?: string;
  phone?: string;
  address?: string;
}

const fetchUser = async (): Promise<UserProfile> => {
  const { data } = await backendApi.get("/api/v1/user/me");
  return data;
};

/**
 * Fetches the current user's profile from the backend.
 * Only runs when signed in. Retries once on failure (user may not exist yet).
 */
export const useUserQuery = () => {
  const { isSignedIn } = useAuth();

  return useQuery<UserProfile>({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: !!isSignedIn,
    retry: 1,
  });
};

/**
 * Creates a user profile in the backend (called after Clerk sign-up).
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, CreateUserPayload>({
    mutationFn: async (payload) => {
      const { data } = await backendApi.post("/api/v1/user", payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
    },
  });
};


/**
 * Updates the current user's profile.
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, UpdateUserPayload>({
    mutationFn: async (payload) => {
      const { data } = await backendApi.patch("/api/v1/user/me", payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
    },
  });
};

/**
 * Deletes the current user's account.
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await backendApi.delete("/api/v1/user/me");
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.removeQueries({ queryKey: ["cart"] });
      queryClient.removeQueries({ queryKey: ["orders"] });
    },
  });
};

export type { UserProfile };
