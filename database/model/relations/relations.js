const AddOn = require('../tables/addOn.model');
const MenuItem = require('../tables/menu.model');

MenuItem.hasMany(AddOn, { foreignKey: 'menuId', onDelete: 'CASCADE' });
AddOn.belongsTo(MenuItem, { foreignKey: 'menuId', onDelete: 'CASCADE' });

module.exports = { MenuItem, AddOn };
