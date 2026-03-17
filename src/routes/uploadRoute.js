// routes/uploadRoute.js
import express from "express"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { supabase } from "../lib/lib.js"

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // Upload para Cloudinary
    cloudinary.uploader.upload_stream(
      { folder: "chat_uploads" },
      async (error, result) => {
        if (error) return res.status(400).json({ error: error.message })

        // Salva metadados no Supabase
        const { data, error: dbError } = await supabase
          .from("messages")
          .insert({
            room_id: req.body.room_id,
            user_id: req.userId,
            content: req.body.content,
            image_url: result.secure_url,
          })

        if (dbError) return res.status(400).json({ error: dbError.message })

        res.json({ message: "Upload feito!", url: result.secure_url })
      }
    ).end(req.file.buffer) // envia o buffer do multer para o stream
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router


