import jwt from "jsonwebtoken"

export const generateToken = (userId, res) => {
  // Cria o token com o mesmo segredo do .env
  const token = jwt.sign(
    { userId }, // precisa bater com o middleware (req.userId)
    process.env.JWT_SECRET, // "syscloudinary" no seu .env
    { expiresIn: "7d" }
  )

  // Opcional: setar cookie para uso em navegador
  res.cookie("jwt", token, {
    httpOnly: true,
    samesite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
  })

  return token
}

