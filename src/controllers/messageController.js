import { createMessage, getMessagesByRoom } from "../models/messageModel.js"

// Enviar mensagem
export const sendMessage = async (req, res) => {
  try {
    const { room_id, content, image_url } = req.body
    const user_id = req.userId   // vem do JWT

    if (!room_id || !content) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" })
    }

    const message = await createMessage({ room_id, user_id, content, image_url })
    res.status(201).json(message)
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error)
    res.status(500).json({ message: "Erro interno", error: error.message })
  }
}




// Buscar mensagens de uma sala
export const getRoomMessages = async (req, res) => {
  try {
    const { room_id } = req.params

    const messages = await getMessagesByRoom(room_id)

    res.json(messages)
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error)
    res.status(500).json({ message: "Erro interno", error: error.message })
  }
}

