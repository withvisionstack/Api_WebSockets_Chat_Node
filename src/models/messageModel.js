import { supabase } from "../lib/lib.js"

// Criar mensagem
export async function createMessage({ room_id, user_id, content, image_url }) {
  const { data, error } = await supabase
    .from("messages")
    .insert([{ room_id, user_id, content, image_url }])
    .select() // garante retorno

  if (error) throw error
  return data && data.length > 0 ? data[0] : null
}

// Buscar mensagens de uma sala
export async function getMessagesByRoom(room_id) {
  const { data, error } = await supabase
    .from("messages")
    .select(`
      id,
      room_id,
      user_id,
      content,
      image_url,
      created_at,
      users!messages_user_id_fkey(username)
    `)
    .eq("room_id", room_id)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data
}




