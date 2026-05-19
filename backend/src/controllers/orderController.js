import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Place new order
export const placeOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    // Validate array
    if (!items || items === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // Calc total
    let total = 0;

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      // check if product exists
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.productId} not found` });
      }

      // Check stock
      if (product.quantity < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.name}` });
      }

      total += product.price * item.quantity;
    }

    // Create order
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          orderItems: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { orderItems: true },
      });

      // Update inventory levels
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }
      return newOrder;
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Orders - Admin only
export const getOrders = async (req, res) => {
  try {
    // Include user details
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { email: true },
        },
        // Include order items and product details
        orderItems: {
          include: {
            product: {
              select: { name: true, price: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get orders for logged in user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        // Include order items and product details
        orderItems: {
          include: {
            product: {
              select: { name: true, price: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
