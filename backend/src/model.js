import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
});

const Swaps = sequelize.define("Swaps", {
  swapId: DataTypes.STRING,
});

export { sequelize, Swaps };
