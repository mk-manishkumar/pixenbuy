import { supabase } from "./supabase-client";

/**
 * Sign up a new user and insert them into the appropriate role table.
 * @param {string} email
 * @param {string} password
 * @param {string} fullname
 * @param {'buyer' | 'seller'} role
 * @param {File} [avatar=null] Optional avatar file
 */
export const signUpUser = async (email, password, fullname, role, avatar = null) => {
  try {
    console.log(`Starting signUpUser for ${email} with role ${role}`);

    // Check if email already exists in the respective table
    const table = role === "buyer" ? "buyer" : "seller";
    const { data: existingUser, error: checkError } = await supabase.from(table).select("email").eq("email", email).single();

    if (existingUser) {
      console.log("Email already exists in", table, "table");
      return { error: "Email already exists. Please use a different email address." };
    }

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" error which is expected if email doesn't exist
      console.error("[signUpUser] Error checking email uniqueness:", checkError);
    }

    // Sign up user with Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role }, // Store role in user metadata
      },
    });

    if (signUpError) {
      console.error("[signUpUser] Sign up error:", signUpError);
      throw signUpError;
    }

    const user = signUpData.user;
    if (!user) {
      console.error("[signUpUser] User not returned after signup");
      throw new Error("User not returned after signup");
    }

    console.log("[signUpUser] User created with ID:", user.id);

    // Handle avatar upload if provided
    let avatarUrl = null;
    if (avatar) {
      const fileExt = avatar.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;

      console.log("[signUpUser] Uploading avatar:", fileName);
      const { data: uploadData, error: uploadError } = await supabase.storage.from("profile-images").upload(fileName, avatar, {
        cacheControl: "3600",
        upsert: true,
      });

      if (uploadError) {
        console.error("[signUpUser] Avatar upload error:", uploadError);
      } else {
        const { data: publicUrlData } = supabase.storage.from("profile-images").getPublicUrl(uploadData.path);

        avatarUrl = publicUrlData.publicUrl;
        console.log("[signUpUser] Avatar URL:", avatarUrl);
      }
    }

    // Insert user profile into respective table
    console.log(`[signUpUser] Adding user to ${table} table`);
    const { error: insertError } = await supabase.from(table).insert([
      {
        id: user.id,
        email,
        fullname,
        avatar: avatarUrl,
      },
    ]);

    if (insertError) {
      console.error(`[signUpUser] Error inserting into ${table}:`, insertError);
      throw insertError;
    }

    // Verify the record was created
    const { data: verifyData, error: verifyError } = await supabase.from(table).select("*").eq("id", user.id).single();

    if (verifyError) {
      console.error("[signUpUser] Verification error:", verifyError);
    } else {
      console.log(`[signUpUser] ${role} record created and verified:`, verifyData);
    }

    return { user, role };
  } catch (err) {
    console.error("[signUpUser] Error:", err.message);
    return { error: err.message };
  }
};

/**
 * Sign in an existing user using email and password.
 * @param {string} email
 * @param {string} password
 */
export const signInUser = async (email, password) => {
  try {
    console.log("[signInUser] Attempting login for:", email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[signInUser] Login error:", error);
      throw error;
    }

    console.log("[signInUser] Login successful for user:", data.user.id);
    return { user: data.user };
  } catch (err) {
    console.error("[signInUser] Error:", err.message);
    return { error: err.message };
  }
};

/**
 * Get the current user's role by checking the buyer and seller tables.
 */
export const getUserRole = async () => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("[getUserRole] Error getting user:", userError);
      throw userError;
    }

    if (!user) {
      console.log("[getUserRole] No authenticated user found");
      return { role: null };
    }

    console.log("[getUserRole] Checking role for user:", user.id);

    // First check in buyer table
    const { data: buyer, error: buyerError } = await supabase.from("buyer").select("*").eq("id", user.id).maybeSingle();

    if (buyerError && buyerError.code !== "PGRST116") {
      console.error("[getUserRole] Error checking buyer table:", buyerError);
      throw buyerError;
    }

    if (buyer) {
      console.log("[getUserRole] Found buyer record:", buyer);
      return { role: "buyer", profile: buyer };
    }

    // Then check in seller table
    const { data: seller, error: sellerError } = await supabase.from("seller").select("*").eq("id", user.id).maybeSingle();

    if (sellerError && sellerError.code !== "PGRST116") {
      console.error("[getUserRole] Error checking seller table:", sellerError);
      throw sellerError;
    }

    if (seller) {
      console.log("[getUserRole] Found seller record:", seller);
      return { role: "seller", profile: seller };
    }

    // If no role found in tables, check user metadata as fallback
    if (user.user_metadata && user.user_metadata.role) {
      const roleFromMetadata = user.user_metadata.role;
      console.log("[getUserRole] Found role in user metadata:", roleFromMetadata);

      // This is a recovery path - we should recreate the record in the appropriate table
      console.log("[getUserRole] Attempting to recreate missing role record");
      const table = roleFromMetadata === "buyer" ? "buyer" : "seller";

      try {
        await supabase.from(table).insert([
          {
            id: user.id,
            email: user.email,
            fullname: user.user_metadata.fullname || user.email.split("@")[0],
          },
        ]);

        console.log(`[getUserRole] Created missing ${roleFromMetadata} record`);
        return { role: roleFromMetadata };
      } catch (recreateError) {
        console.error("[getUserRole] Failed to recreate role record:", recreateError);
        // Continue to return the role anyway
        return { role: roleFromMetadata };
      }
    }

    console.log("[getUserRole] No role found for user:", user.id);
    return { role: null };
  } catch (err) {
    console.error("[getUserRole] Error:", err.message);
    return { error: err.message };
  }
};

/**
 * Sign out the currently logged-in user.
 */
export const signOutUser = async () => {
  try {
    console.log("[signOutUser] Signing out user");
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log("[signOutUser] Sign out successful");
    return { success: true };
  } catch (err) {
    console.error("[signOutUser] Error:", err.message);
    return { error: err.message };
  }
};

/**
 * Upload profile image
 */
export const uploadProfileImage = async (userId, file) => {
  try {
    console.log("[uploadProfileImage] Uploading profile image for user:", userId);

    if (!file) {
      console.error("[uploadProfileImage] No file provided");
      return { error: "No file provided" };
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`;

    const { data, error } = await supabase.storage.from("profile-images").upload(fileName, file, { upsert: true });

    if (error) {
      console.error("[uploadProfileImage] Upload error:", error);
      return { error };
    }

    const { data: publicUrlData } = supabase.storage.from("profile-images").getPublicUrl(data.path);

    console.log("[uploadProfileImage] Upload successful, URL:", publicUrlData.publicUrl);
    return { url: publicUrlData.publicUrl };
  } catch (err) {
    console.error("[uploadProfileImage] Error:", err.message);
    return { error: err.message };
  }
};
