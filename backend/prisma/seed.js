import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Products
  await prisma.product.createMany({
    data: [
      {
        name: "Chocolate Cake",
        description: "A rich and moist chocolate cake with chocolate frosting.",
        price: 32.99,
        category: "Cakes",
        quantity: 10,
        image: "https://placehold.co/400x300?text=Chocolate+Cake",
      },
      {
        name: "Vanilla Cake",
        description: "A classic vanilla cake with buttercream frosting.",
        price: 28.99,
        category: "Cakes",
        quantity: 8,
        image: "https://placehold.co/400x300?text=Vanilla+Cake",
      },
      {
        name: "Chocolate Chip Cookies",
        description: "A dozen freshly baked chocolate chip cookies.",
        price: 12.99,
        category: "Cookies",
        quantity: 20,
        image: "https://placehold.co/400x300?text=Chocolate+Chip+Cookies",
      },
      {
        name: "Sugar Cookies",
        description: "A dozen decorated sugar cookies.",
        price: 10.99,
        category: "Cookies",
        quantity: 15,
        image: "https://placehold.co/400x300?text=Sugar+Cookies",
      },
      {
        name: "Apple Pie",
        description: "A classic homestyle apple pie with a flaky crust.",
        price: 18.99,
        category: "Pies",
        quantity: 6,
        image: "https://placehold.co/400x300?text=Apple+Pie",
      },
      {
        name: "Pecan Pie",
        description: "A rich and sweet pecan pie.",
        price: 20.99,
        category: "Pies",
        quantity: 5,
        image: "https://placehold.co/400x300?text=Pecan+Pie",
      },
    ],
  });

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
