import { createUser, getUserByEmail, getUserById, updateUserById } from "../models/userModel.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"
import { successResponse, errorResponse } from "../utils/response.js"
import { v2 as cloudinary } from "cloudinary"

//Cloudinary Configuracao
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})



// Signup
export const signup = async (req, res) => {
  try {
    const { email, username, password } = req.body || {}

    if (!email || !username || !password) {
      return errorResponse(res, "Campos obrigatórios faltando", 400)
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return errorResponse(res, "Email já cadastrado", 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await createUser({
      email,
      username,
      password: hashedPassword
    })

    if (!user || !user.id) {
      return errorResponse(res, "Erro ao criar usuário no banco", 500)
    }

    const token = generateToken(user.id, res)

    return successResponse(
      res,
      { user, token },
      "Usuário criado com sucesso",
      201
    )
  } catch (error) {
    console.error("Erro em signup:", error)
    return errorResponse(res, "Erro ao registrar usuário", 500, error.message)
  }
}

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {}

    if (!email || !password) {
      return errorResponse(res, "Campos obrigatórios faltando", 400)
    }

    const user = await getUserByEmail(email)
    if (!user) {
      return errorResponse(res, "Usuário não encontrado", 404)
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return errorResponse(res, "Senha incorreta", 400)
    }

    const token = generateToken(user.id, res)

    return successResponse(
      res,
      { user, token },
      "Login realizado com sucesso"
    )
  } catch (error) {
    console.error("Erro em login:", error)
    return errorResponse(res, "Erro ao fazer login", 500, error.message)
  }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId // ✅ corrigido — vem do middleware

    console.log("req.file:", req.file)
    console.log("req.body:", req.body)
    console.log("Content-Type:", req.headers["content-type"])




    const { username } = req.body

    let updates = {}
    if (username) updates.username = username

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(req.file.buffer)
      })
      updates.photo = result.secure_url
    } else {
      console.log("Nenhum arquivo recebido")
    }

    const updatedUser = await updateUserById(userId, updates)

    // ✅ resposta no formato que o frontend espera: res.data.data.user
    res.json({
      data: {
        user: updatedUser
      }
    })

  } catch (err) {
    console.error("Erro em updateProfile:", err)
    res.status(500).json({ error: "Erro ao atualizar perfil" })
  }
}






// Logout
export const logout = (req, res) => {
  res.clearCookie("jwt")
  return successResponse(res, null, "Logout realizado com sucesso")
}