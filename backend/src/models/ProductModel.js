import { BaseModel } from "./BaseModel.js";

// Demonstrates Inheritance by inheriting from BaseModel
export class ProductModel extends BaseModel {
  constructor(prisma) {
    // parent constructor with client and model name
    super(prisma, "product");
  }

  // Demonstrates polymorphism by overriding base findAll method to add search and category filtering
  async findAll(filters = {}) {
    const { search, category } = filters;

    const where = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    return await this.prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  // Demonstrates Polymorphism by overriding findById to include related cart and order items
  async findById(id) {
    return await this.prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
  }

  // Create product and validate
  async create(data) {
    // Use the base class validate method to check required fields
    this.validate(data, [
      "name",
      "description",
      "price",
      "category",
      "quantity",
    ]);

    return await this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        image: data.image,
        category: data.category,
        quantity: parseInt(data.quantity),
      },
    });
  }

  // Update product
  async update(id, data) {
    return await this.prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        image: data.image,
        category: data.category,
        quantity: parseInt(data.quantity),
      },
    });
  }

  // Check if product is in stock
  async isInStock(id) {
    const product = await this.findById(id);
    return product && product.quantity > 0;
  }
}
