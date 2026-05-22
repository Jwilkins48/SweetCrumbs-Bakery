import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { useAuth } from "../context/useAuth";

const CartPage = () => {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load cart on page load
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  });

  // Save to localstorage
  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Remove from cart
  const removeItem = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    saveCart(updatedCart);
  };

  // Increase quantity
  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
    );

    saveCart(updatedCart);
  };

  // Decrease quantity
  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item,
    );
    saveCart(updatedCart);
  };

  // Calculate total
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Place order
  const placeOrder = async () => {
    // No user signed in
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      await api.post("/orders", { items });

      // Clear cart
      localStorage.removeItem("cart");
      setCart([]);
      setOrderPlaced(true);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Confirm after placing order
  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <h2 className="text-2xl font-bold">Order Placed!</h2>
        <p className="text-base-content/70">
          Thank you for your order. We will have it ready for you soon!
        </p>
        <button
          className="btn btn-primary rounded-md"
          onClick={() => navigate("/catalog")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-base-content/70 mb-4">Your cart is empty.</p>
          <button
            className="btn btn-primary rounded-md"
            onClick={() => navigate("/catalog")}
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="card bg-base-100 shadow flex flex-row items-center p-4 gap-4"
              >
                {/* Item image */}
                <img
                  src={item.image || "https://placehold.co/80x80?text=No+Image"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />

                {/* Item details */}
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-base-content/70">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-outline btn-xs"
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    -
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    className="btn btn-outline btn-xs"
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </button>
                </div>

                {/* Item total */}
                <p className="font-medium w-16 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

                {/* Remove button */}
                <button
                  className="btn btn-ghost btn-xs text-error"
                  onClick={() => removeItem(item.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="card bg-base-100 shadow p-6 h-fit flex flex-col gap-4">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <div className="divider my-0"></div>
            <div className="flex justify-between text-sm">
              <span className="text-base-content/70">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-base-content/70">Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="divider my-0"></div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              className="btn btn-primary rounded-md w-full mt-2"
              onClick={placeOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
