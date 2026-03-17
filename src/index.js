import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import cors from "cors"
import { connectData } from "./lib/lib.js"
import messageRoutes from "./routes/messageRoutes.js"
import uploadRoutes from "./routes/uploadRoute.js"
import authRoutes from "./routes/authRoutes.js"
import path from "path"
import { fileURLToPath } from "url"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()   // <-- declare o app primeiro



// Configuração CORS
app.use(cors({
  origin: "http://localhost:5173", // frontend
  credentials: true,               // permite cookies/autorização
}))


// Middlewares
app.use(express.json())
app.use(cookieParser())




// servir arquivos estáticos da pasta uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

/* =======================
   SWAGGER CONFIG
======================= */
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Minha API",
      version: "1.0.0",
      description: "Documentação da API estilo FastAPI",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"], // Onde estão suas rotas
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/* =======================
   ROTAS
======================= */
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api", uploadRoutes) // agora /api/upload funciona

/* =======================
   SERVER
======================= */
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT)
  connectData()
})

