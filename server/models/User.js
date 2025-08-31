// server/models/User.js (ESM + clase Model)
import { DataTypes, Model } from 'sequelize'
import sequelize from '../database.js'  // tu instancia de Sequelize (dotenv, etc.)

class User extends Model {
  /*static associate(models) {
    // Ejemplos de asociaciones:
    // this.hasMany(models.Todo, { foreignKey: 'userId' })
    // this.belongsTo(models.Role, { foreignKey: 'roleId' })
  }*/
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(200),
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'User',     // si tu tabla real se llama 'User' (singular)
    // freezeTableName: true, // alternativa a tableName si querés evitar pluralización
    timestamps: false,
    underscored: false     // poné true si tus columnas son snake_case (created_at)
  }
)

export default User
