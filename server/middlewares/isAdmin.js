// server/middlewares/isAdmin.js
export function isAdmin(req, res, next) {
  
   if (!req.session.user) {
    
    return res.status(401).json({ error: 'No autenticado' })
  }
  if (req.session.user.id != process.env.ADMIN_ID) {
    
    return res.status(403).json({ error: 'No autorizado' })
  } 
  next() 
}
