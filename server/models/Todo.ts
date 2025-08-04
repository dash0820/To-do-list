import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";
import { UserInstance } from "./User";

interface TodoAttributes {
  id: number;
  text: string;
  completed: boolean;
  userId: number;
}

interface TodoCreationAttributes
  extends Optional<TodoAttributes, "id" | "completed"> {}

export interface TodoInstance
  extends Model<TodoAttributes, TodoCreationAttributes>,
    TodoAttributes {
  User?: UserInstance;
}

const Todo = sequelize.define<TodoInstance>("Todo", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export const associateTodo = (models: any) => {
  Todo.belongsTo(models.User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
};

export default Todo;
