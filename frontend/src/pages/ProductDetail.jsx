import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api.js";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  // Add to cart w quantity
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  // Decrease - don't go below 0
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // Increase - don't go above quantity
  const increaseQuantity = () => {
    if (quantity < product.quantity) setQuantity(quantity + 1);
  };

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // No product
  if (!product) {
    return (
      <div className="text-center py-20">
        <p>Product not found.</p>
        <Link to="/catalog" className="btn btn-primary mt-4">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div>
          <img
            src={product.image || "https://placehold.co/600x500?text=No+Image"}
            alt={product.name}
            className="w-full h-100 rounded-md object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-4 justify-center">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <span className="bade badge-outline w-fit">{product.category}</span>
          <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
          <p className="text-base-content/70">{product.description}</p>

          {/* Out of stock */}
          {product.quantity === 0 && (
            <span className="badge badge-error">Out of Stock</span>
          )}

          {/* Quantity */}
          {product.quantity > 0 && (
            <div className="flex items-center gap-3">
              <button
                className="btn btn-outline btn-sm"
                onClick={decreaseQuantity}
              >
                -
              </button>
              <span className="text-lg font-medium w-6 text-center">
                {quantity}
              </span>
              <button
                className="btn btn-outline btn-sm"
                onClick={increaseQuantity}
              >
                +
              </button>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              className="btn btn-primary rounded-md"
              onClick={addToCart}
              disabled={product.quantity === 0}
            >
              Add to Cart
            </button>

            <Link to="/catalog" className="btn btn-outline rounded-md">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
