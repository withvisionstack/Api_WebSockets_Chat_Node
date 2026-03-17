import { supabase } from "../lib/lib.js"

// Criar usuário
export async function createUser({ email, username, password }) {
  const { data, error } = await supabase
    .from("users")
    .insert([{ email, username, password }])
    .select()

  if (error) throw error
  return data[0]
}

// Buscar todos usuários
export async function getUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("*")

  if (error) throw error
  return data
}

// Buscar usuário por email
export async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle()

  if (error) throw error
  return data
}

// Buscar usuário por ID
export async function getUserById(id) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) throw error
  return data
}

// Atualizar usuário por ID (necessário para updateProfile)
export async function updateUserById(id, updates) {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id)
    .select()
    .maybeSingle()

  if (error) throw error
  return data
}

