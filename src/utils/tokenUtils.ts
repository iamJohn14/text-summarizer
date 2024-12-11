import jwt, { JwtPayload } from "jsonwebtoken";

export function validateToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );

    if (typeof decoded === "string") {
      throw new Error("Invalid token format");
    }

    return decoded;
  } catch (error) {
    throw new Error(`Invalid token: ${error}`);
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
