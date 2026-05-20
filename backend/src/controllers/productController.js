import { PrismaClient } from "@prisma/client";
import { ProductModel } from "../models/ProductModel.js";

const prisma = new PrismaClient();

const productModel = new ProductModel(prisma);

// Get all products
export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    // Passing search and category filters to model
    const products = await productModel.findAll({ search, category });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new product - Admin Only
export const createProduct = async (req, res) => {
  try {
    const product = await productModel.create(req.body);

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product - Admin only
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = await productModel.update(id, req.body);

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product - Admin only
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await productModel.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await productModel.delete(id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
