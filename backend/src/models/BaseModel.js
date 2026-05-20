// Base model demonstrating Encapsulation
export class BaseModel {
  // Private client instance
  #prisma;
  #modelName;

  constructor(prisma, modelName) {
    // Store prisma client and model name as private
    this.#prisma = prisma;
    this.#modelName = modelName;
  }

  // Access prisma client
  get prisma() {
    return this.#prisma;
  }

  // Access model name
  get modelName() {
    return this.#modelName;
  }

  // method to find a record by ID - demonstrating polymorphism as child classes can override this method
  async findById(id) {
    return await this.#prisma[this.#modelName].findUnique({
      where: { id: parseInt(id) },
    });
  }

  // Find all records - Can be overridden by child classes
  async findAll() {
    return await this.#prisma[this.#modelName].findMany();
  }

  // Base method - delete by id
  async delete(id) {
    return await this.#prisma[this.#modelName].delete({
      where: { id: parseInt(id) },
    });
  }

  // Validate required fields
  validate(data, requiredFields) {
    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    return true;
  }
}
