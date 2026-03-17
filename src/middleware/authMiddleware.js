import jwt from "jsonwebtoken"
import { getUserById } from "../models/userModel.js"

const protectRoute = async (req, res, next) => {
  try {
    console.log("Cookies recebidos:", req.cookies)

    const token = req.cookies.jwt

    if (!token) {
      return res.status(401).json({ message: "Não autorizado - token ausente" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await getUserById(decoded.userId)
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" })
    }

    req.userId = decoded.userId
    req.user = user

    next()
  } catch (error) {
    console.error("Erro JWT:", error.message)
    return res.status(401).json({ message: "Não autorizado - token inválido" })
  }
}

export default protectRoute