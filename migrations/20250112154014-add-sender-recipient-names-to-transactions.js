"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Transactions", "senderName", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("Transactions", "recipientName", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Transactions", "senderName");
    await queryInterface.removeColumn("Transactions", "recipientName");
  },
};
