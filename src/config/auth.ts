export default {
  jwt: {
    secret: process.env.JWT_SECRET as string || 'testesenha',
    expiresIn: '1d'
  }
}
