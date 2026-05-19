import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Generating report - Admin Only
export const generateOrderReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // filter by date
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Get matching orders
    const orders = await prisma.order.findMany({
      where: dateFilter,
      include: {
        user: {
          select: { email: true },
        },
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

    // Format report
    const reportData = orders.map((order) => ({
      orderId: order.id,
      customerEmail: order.user.email,
      items: order.orderItems.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total,
      // Format datetime stamp
      orderDate: new Date(order.createdAt).toLocaleString(),
    }));

    // Build report
    const report = {
      title: "Sweet Crumbs Bakery - Order Report",
      generatedAt: new Date().toLocaleString(),
      totalOrders: orders.length,
      totalRevenue: orders
        .reduce((sum, order) => sum + order.total, 0)
        .toFixed(2),
      orders: reportData,
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
