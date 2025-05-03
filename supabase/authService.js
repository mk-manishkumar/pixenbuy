import { supabase } from "./supabase-client";

/**
 * Sign up a new user and insert them into the appropriate role table.
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @param {'buyer' | 'seller'} role
 */

export const signUpUser = async (email, password, fullname, role, avatar = null) => {
  try {
    // Check if email already exists in the respective table
    const table = role === "buyer" ? "buyer" : "seller";
    const { data: existingUser, error: checkError } = await supabase.from(table).select("email").eq("email", email).single();

    if (existingUser) {
      return { error: "Email already exists. Please use a different email address." };
    }

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" error which is expected if email doesn't exist
      console.error("[signUpUser] Error checking email uniqueness:", checkError);
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;

    const user = signUpData.user;
    if (!user) throw new Error("User not returned after signup");

    const insertTable = role === "buyer" ? "buyer" : "seller";

    const { error: insertError } = await supabase.from(insertTable).insert([
      {
        id: user.id,
        email,
        fullname,
        avatar,
      },
    ]);

    if (insertError) throw insertError;

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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

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

    if (userError) throw userError;
    if (!user) return { role: null };

    // First check in buyer
    const { data: buyer, error: buyerError } = await supabase.from("buyer").select("id").eq("id", user.id).maybeSingle();

    /*
    const { data: buyer, error: buyerError } = ... - This unpacks the result:
      - data is renamed to buyer (contains the user record or null)
      - error is renamed to buyerError (contains any error that occurred)
    */

    if (buyerError) throw buyerError;
    if (buyer) return { role: "buyer" };
    /*
    .maybeSingle() - This tells Supabase to return:
      - A single record if one is found
      - Null if no record is found
      - An error if multiple records are found
      */

    // Then check in seller  (eq === equal)
    const { data: seller, error: sellerError } = await supabase.from("seller").select("id").eq("id", user.id).maybeSingle();

    if (sellerError) throw sellerError;
    if (seller) return { role: "seller" };

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
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("[signOutUser] Error:", err.message);
    return { error: err.message };
  }
};


/**
 * Upload profile iamge
 */
export const uploadProfileImage = async (userId, file) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}.${fileExt}`;
  const { data, error } = await supabase.storage.from("profile-images").upload(fileName, file, { upsert: true });

  if (error) return { error };

  const { data: publicUrlData } = supabase.storage.from("profile-images").getPublicUrl(data.path);

  return { url: publicUrlData.publicUrl };
};
