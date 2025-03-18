import pool from "../config/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface iPreUser {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

class UserModel {
  async createUser(preUser: iPreUser): Promise<any> {
    const { name, lastname, email, password } = preUser;
    const activationToken = crypto.randomBytes(32).toString('hex');

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      "INSERT INTO users (name, lastname, email, password,activation_token) VALUES (?, ?, ?, ?, ?)",
      [name, lastname, email, hashedPassword,activationToken]
    );
    return {token: activationToken, result};
  }

  async activateUser(token: string): Promise<any> {
    const [result] = await pool.execute(
      'UPDATE users SET activated = 1, activation_token = NULL WHERE activation_token = ?',
      [token]
    );
    return result;
  }

  async getUserByEmail(email: string): Promise<any> {
    const [rows]: any = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows.length ? rows[0] : null;
  }
}

export default new UserModel();
