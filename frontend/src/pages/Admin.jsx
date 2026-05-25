import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { useAuth } from "../context/useAuth";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // Open modal
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      quantity: "",
      image: "",
    });
    setImageFile(null);
    setShowModal(true);
  };

  // Open existing item modal
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      quantity: product.quantity,
      image: product.image || "",
    });
    setImageFile(null);
    setShowModal(true);
  };

  // Delete
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = formData.image;

      // Upload image to cloudinary
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);
        const uploadResponse = await api.post(
          "/products/upload",
          imageFormData,
        );
        imageUrl = uploadResponse.data.imageUrl;
      }

      const productData = { ...formData, image: imageUrl };

      // existing
      if (editingProduct) {
        const response = await api.put(
          `/products/${editingProduct.id}`,
          productData,
        );
        setProducts(
          products.map((p) => (p.id === editingProduct.id ? response.data : p)),
        );
      } else {
        // create new
        const response = await api.post("/products", productData);
        setProducts([...products, response.data]);
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // loading
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          className="btn btn-primary rounded-md"
          onClick={handleAddProduct}
        >
          + Add Product
        </button>
      </div>

      {/* Products table */}
      <div className="overflow-x-auto rounded-lg border border-base-300">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover">
                <td>
                  <img
                    src={
                      product.image ||
                      "https://placehold.co/60x60?text=No+Image"
                    }
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                </td>
                <td className="font-medium">{product.name}</td>
                <td className="text-base-content/70">{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  {product.quantity === 0 ? (
                    <span className="badge badge-error badge-sm">
                      Out of Stock
                    </span>
                  ) : (
                    product.quantity
                  )}
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-secondary btn-xs rounded-md"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error btn-xs rounded-md"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View orders report */}
      <div className="mt-6">
        <button
          className="btn btn-outline rounded-md"
          onClick={() => navigate("/admin/report")}
        >
          View Orders Report
        </button>
      </div>

      {/* Add/Edit product modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  className="input input-bordered w-full rounded-md"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  className="textarea textarea-bordered w-full rounded-md"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Price</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    className="input input-bordered w-full rounded-md"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    className="input input-bordered w-full rounded-md"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Category</label>
                <select
                  name="category"
                  className="select select-bordered w-full rounded-md"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Cakes">Cakes</option>
                  <option value="Cookies">Cookies</option>
                  <option value="Pies">Pies</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                {/* Show current image if editing */}
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Current"
                    className="w-20 h-20 object-cover rounded-md mt-2"
                  />
                )}
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost rounded-md"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary rounded-md">
                  {editingProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
