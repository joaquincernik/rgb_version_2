import { DataTypes, Model } from 'sequelize'
import sequelize from '../database.js'  // tu instancia de Sequelize (dotenv, etc.)

class Album extends Model {
 static associate(models) {
     this.hasMany(models.Photo, { foreignKey: 'album_id' })
  }
}

Album.init(
  {
    album_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },

    cover: {
      type: DataTypes.STRING,
      allowNull: false
    },
   
    link: {
      type: DataTypes.STRING,
    }
  },
  {
    sequelize,
    modelName: 'Album',
    tableName: 'Album',     // si tu tabla real se llama 'User' (singular)
    // freezeTableName: true, // alternativa a tableName si querés evitar pluralización
    timestamps: false,
    underscored: false     // poné true si tus columnas son snake_case (created_at)
  }
)

export default Album
