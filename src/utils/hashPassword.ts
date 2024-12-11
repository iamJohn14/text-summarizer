import bcrypt from "bcryptjs";

export default async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10); // Generate salt
  const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt
  return hashedPassword;
}
