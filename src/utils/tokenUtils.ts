import { TokenPayload } from "@/types/types";
import jwt, { JwtPayload } from "jsonwebtoken";

// Validate the token and return decoded payload
export function validateToken(token: string): JwtPayload | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string") {
      throw new Error("Invalid token format");
    }

    return decoded;
  } catch (error) {
    // Handle different types of JWT errors here
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("JWT Error: ", error.message);
    } else {
      // Catch any other errors
      console.error("Token validation error: ", error);
    }

    return null;
  }
}

// Generate a token with a payload and expiration time
export function generateToken(payload: TokenPayload, expiresIn = "1h") {
  return jwt.sign(payload, process.env.JWT_SECRET || "your_jwt_secret", {
    expiresIn,
  });
}
