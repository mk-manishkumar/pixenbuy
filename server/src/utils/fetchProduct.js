import axios from "axios";

const FAKESTORE_BASE_URL = "https://fakestoreapi.com";

/**
 * Fetches a product from FakeStoreAPI by ID.
 * Used for price verification at checkout.
 */
const fetchProductById = async (productId) => {
  try {
    const response = await axios.get(
      `${FAKESTORE_BASE_URL}/products/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error.message);
    return null;
  }
};

export { fetchProductById };
