import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../utils/api.js";

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "");

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;

        const response = await api.get("/products", { params });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [search, category]);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if item already exists
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      // Increase quantity if already in cart
      existingItem.quantity += 1;
    } else {
      // Add new item to cart
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  // Page starts

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Baked Goods</h1>

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          className="input input-bordered w-full md:w-auto flex-1 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category dropdown  */}
        <select
          className="select select-bordered w-full md:w-48 rounded-md"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Cakes">Cakes</option>
          <option value="Cookies">Cookies</option>
          <option value="Pies">Pies</option>
        </select>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-base-content/70 py-12">
          No products found.
        </p>
      ) : (
        // Product grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="card bg-base-100 shadow hover:shadow-md transition"
            >
              {/* Product image */}
              <figure>
                <img
                  src={
                    product.image ||
                    "https://placehold.co/400x300?text=No+Image"
                  }
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <div className="flex justify-between w-full items-center gap-2">
                  <h2 className="card-title flex-50 min-w-0">{product.name}</h2>
                  <p className="text-lg font-bold shrink-0">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                <p className="text-sm text-base-content/70">
                  {product.category}
                </p>

                {/* Show out of stock if quantity is 0 */}
                {product.quantity === 0 && (
                  <span className="badge badge-error">Out of Stock</span>
                )}

                <div className="card-actions justify-between items-center mt-2">
                  <Link to={`/product/${product.id}`} className="font-medium">
                    View Details
                  </Link>
                  <button
                    className="btn btn-primary btn-sm rounded-md"
                    onClick={() => addToCart(product)}
                    disabled={product.quantity === 0}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
