// server/models/index.js
import User from './User.js'
// import Todo from './Todo.js'
// import Role from './Role.js'
// ... importá aquí todos los modelos

const models = { User /*, Todo, Role, ... */ }

// Ejecutar asociaciones si existen
Object.values(models).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(models)
  }
})

export default models
