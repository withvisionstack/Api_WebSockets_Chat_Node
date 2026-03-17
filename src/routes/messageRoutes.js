import express from "express"
import  protectRoute  from "../middleware/authMiddleware.js"
import { createMessage, getMessagesByRoom } from "../models/messageModel.js"

const router = express.Router()

// Criar mensagem (rota protegida)
router.post("/send", protectRoute, async (req, res) => {
  const { room_id, content } = req.body

  try {
    const message = await createMessage({
      room_id,
      user_id: req.userId, // vem do middleware
      content,
    })
    res.status(201).json(message)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao enviar mensagem" })
  }
})

// Buscar mensagens de uma sala (rota protegida)
router.get("/:roomId", protectRoute, async (req, res) => {
  try {
    const messages = await getMessagesByRoom(req.params.roomId)
    res.json(messages)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao buscar mensagens" })
  }
})

export default router

