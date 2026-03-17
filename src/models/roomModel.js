import { supabase } from "../lib/lib.js"

// Criar sala
export async function createRoom({ name }) {
  const { data, error } = await supabase
    .from("rooms")
    .insert([{ name }])

  if (error) throw error
  return data[0]
}

// Buscar todas salas
export async function getRooms() {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")

  if (error) throw error
  return data
}

