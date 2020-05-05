"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("user_teams", {
      is_leader: {
        type: Sequelize.ENUM("F", "T"),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      users_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      teams_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "teams", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("user_teams");
  },
};
