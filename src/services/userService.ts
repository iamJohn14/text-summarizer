import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import hashPassword from "@/utils/hashPassword";
import { generateToken } from "@/utils/tokenUtils";

const prisma = new PrismaClient();

// Add a new user
export async function addUser(
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  email: string
) {
  // Hash password before storing it in the database
  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
    },
  });

  return newUser;
}

// Login function to authenticate the user and generate JWT
export async function login(username: string, password: string) {
  try {
    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Destructure user object to exclude password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    // Generate JWT token
    const token = generateToken({
      id: user.id.toString(),
      username: user.username,
    });

    // Return the token and user data
    return {
      token,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error(
      "Login error:",
      error instanceof Error ? error.message : error
    );
    throw new Error("An error occurred during login. Please try again.");
  }
}

// Logout function to clear user session
export async function logout() {
  return { message: "Logged out successfully" };
}

// Get user by ID
export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
  });
}

// Update user password by ID
export async function updateUserPassword(id: number, password: string) {
  const hashedPassword = await hashPassword(password); // Hash the new password
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
  return updatedUser;
}

// Delete user by ID
export async function deleteUser(id: number) {
  return prisma.user.delete({
    where: { id },
  });
}
