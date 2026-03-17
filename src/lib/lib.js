import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

// Inicializa o cliente Supabase
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// Função de conexão (apenas valida se está ok)
export const connectData = async () => {
  try {
    const { data, error } = await supabase.from("users").select("*").limit(1)

    if (error) {
      console.error("❌ Erro ao conectar ao Supabase:", error.message)
    } else {
      console.log("✅ Conectado ao Supabase, exemplo de dados:", data)
    }
  } catch (err) {
    console.error("❌ Falha inesperada:", err.message)
  }
}



