import { BaseModel } from "./BaseModel.js";
import bcrypt, { hash } from "bcryptjs";

// Demonstrates Inheritance - UserModel inherits from BaseModel
export class UserModel extends BaseModel {
  constructor(prisma) {
    super(prisma, "user");
  }

  // Demonstrates polymorphism - Override findById to exclude password
  async findById(id) {
    return await this.prisma.user.findUnique({
      where: { id: parseInt(id) },

      // No password
      select: {
        id: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
    });
  }

  // Find user with email (login)
  async findByEmail(email) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Create new user
  async create(data) {
    // validate required fields
    this.validate(data, ["email", "password"]);

    // validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("Invalid email format");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        isAdmin: false,
      },
    });
  }

  // Check if user exists
  async exists(email) {
    const user = await this.findByEmail(email);
    return !!user;
  }
}
