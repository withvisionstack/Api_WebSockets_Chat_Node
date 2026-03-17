export const successResponse = (res, data, message = "Sucesso") => {
  return res.status(200).json({
    success: true,
    message,
    data,
  })
}

export const errorResponse = (res, message = "Erro", status = 400) => {
  return res.status(status).json({
    success: false,
    message,
  })
}