import express from "express"
import { signup, login, logout, updateProfile } from "../controllers/authController.js"
import protectRoute from "../middleware/authMiddleware.js" // único middleware
import { getUserById } from "../models/userModel.js"
import { successResponse, errorResponse } from "../utils/response.js"
import multer from "multer"

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() })

// Signup
router.post("/signup", signup)

// Login
router.post("/login", login)

// Logout
router.post("/logout", logout)

// Update profile com upload de foto
router.put("/update-profile", protectRoute, upload.single("profilePic"), updateProfile) //  protectRoute no lugar de protect

// Check auth
router.get("/check", protectRoute, async (req, res) => {
  try {
    const user = await getUserById(req.userId)
    if (!user) {
      return errorResponse(res, "Usuário não encontrado", 404)
    }
    return successResponse(res, { user }, "Usuário autenticado")
  } catch (error) {
    return errorResponse(res, "Erro ao verificar autenticação", 500)
  }
})

export default router
