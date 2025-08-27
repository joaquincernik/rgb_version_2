import { DataTypes, Model } from 'sequelize'
import sequelize from '../database.js'  // tu instancia de Sequelize (dotenv, etc.)

class Photo extends Model {
  static associate(models) {
     this.belongsTo(models.Album, { foreignKey: 'album_id' })
  }
}

Photo.init(
  {
    photo_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    album_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'Photo',
    tableName: 'Photo',     // si tu tabla real se llama 'User' (singular)
    // freezeTableName: true, // alternativa a tableName si querés evitar pluralización
    timestamps: false,
    underscored: false     // poné true si tus columnas son snake_case (created_at)
  }
)

export default Photo
