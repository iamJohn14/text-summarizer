import jwt, { JwtPayload } from "jsonwebtoken";

export function validateToken(token: string): JwtPayload {
  try {
    // Decode and verify the JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );

    // Check if the decoded token is not a string (jwt.verify can return either an object or a string)
    if (typeof decoded === "string") {
      throw new Error("Invalid token format");
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(`JWT Error: ${error.message}`);
    } else {
      throw new Error(
        `Invalid token: ${error instanceof Error ? error.message : error}`
      );
    }
  }
}

export function generateToken(payload: object, expiresIn = "1h") {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET || "your_jwt_secret", {
      expiresIn,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Token generation failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during token generation");
  }
}
