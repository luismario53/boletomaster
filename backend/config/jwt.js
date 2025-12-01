export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'aqui_va la cl@ve secreta',
  expiresIn: '24h',
  refreshExpiresIn: '7d'
}