// controllers/UserController.ts
import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import transporter from "../config/mailer";

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { PreUser } = req.body;
      if (!PreUser) {
        res.status(400).json({ error: "PreUser es requerido" });
        return;
      }
      const { name, lastname, email, password } = PreUser;
      if (!name || !lastname || !email || !password) {
        res.status(400).json({ error: "Todos los campos son obligatorios" });
        return;
      }

      const { token } = await UserModel.createUser(PreUser);
      const activationLink = `http://localhost:3000/users/activate/${token}`;
      res.status(201).json({ message: "Usuario creado" });

      await transporter.sendMail({
        from: '"Mi Aplicación" <no-reply@miapp.com>',
        to: email,
        subject: 'Activa tu cuenta',
        html: `<h1>Hola ${name}!</h1>
               <p>Gracias por registrarte. Activa tu cuenta haciendo clic en el siguiente enlace:</p>
               <a href="${activationLink}">Activar cuenta</a>`,
      });
    } catch (error) {
      res.status(500).json({ error: "Error al crear usuario" });
      console.error(error);
    }
  }
  async activateUser(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const result = await UserModel.activateUser(token);

      if (result.affectedRows === 0) {
        res.status(400).json({ error: 'Token inválido o ya utilizado' });
        return;
      }

      res.json({ message: 'Cuenta activada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al activar cuenta' });
    }
  }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.getUserByEmail(email);

      if (!user) {
        res.status(401).json({ error: "Usuario no encontrado" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ error: "Datos incorrectos" });
        return;
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.json({ message: "Login exitoso", token, user });
    } catch (error) {
      res.status(500).json({ error: "Error en el login" });
    }
  }
}

export default new UserController();
