import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";
import { TodoInstance } from "./Todo";

interface UserAttributes {
  id: number;
  email: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
  Todos?: TodoInstance[];
}

const User = sequelize.define<UserInstance>("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const associateUser = (models: any) => {
  User.hasMany(models.Todo, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
};

export default User;
