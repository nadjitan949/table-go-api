const bcrypt = require('bcrypt');
const crypto = require('crypto');
const QRCode = require('qrcode');
const sequelize = require('../../database/config/connect');
const responses = require('../../messages/responses');
const User = require('../../database/model/tables/user.model');
const MenuItem = require('../../database/model/tables/menu.model');
const Table = require('../../database/model/tables/table.model');
const { uploadToCloudinary } = require('../../utils/uploadToCloudinary');

const DEFAULT_PASSWORD = 'Table@Go2026';

const seedUsers = [
  { fullname: 'Admin Principal', phone: '+221771000001', status: 'admin' },
  { fullname: 'Cheikh Fall', phone: '+221771000002', status: 'server' },
  { fullname: 'Awa Diop', phone: '+221771000003', status: 'cook' },
  { fullname: 'Moussa Ndiaye', phone: '+221771000004', status: 'server' },
  { fullname: 'Fatou Sy', phone: '+221771000005', status: 'server' },
];

const seedMenus = [
  // Entrées (5)
  {
    name: 'Accras de morue',
    description: 'Beignets de morue épicés, sauce piment doux',
    price: 2500,
    category: 'starter',
    estimatedPrepTime: 15,
  },
  {
    name: 'Samoussas au poulet',
    description: 'Feuilletés croustillants au poulet et aux épices',
    price: 2000,
    category: 'starter',
    estimatedPrepTime: 10,
  },
  {
    name: 'Salade de saison',
    description: 'Salade verte, tomates, œufs et poulet grillé',
    price: 3000,
    category: 'starter',
    estimatedPrepTime: 10,
  },
  {
    name: 'Soupe de poisson',
    description: 'Soupe traditionnelle délicatement parfumée',
    price: 2000,
    category: 'starter',
    estimatedPrepTime: 20,
  },
  {
    name: 'Beignets de légumes',
    description: 'Beignets de légumes frais, sauce moutarde',
    price: 1500,
    category: 'starter',
    estimatedPrepTime: 10,
  },
  // Plats principaux (5)
  {
    name: 'Thiéboudienne',
    description: 'Riz au poisson, légumes frais et sauce tomate',
    price: 5000,
    category: 'main',
    estimatedPrepTime: 40,
  },
  {
    name: 'Yassa au poulet',
    description: 'Poulet mariné aux oignons et au citron, riz blanc',
    price: 4500,
    category: 'main',
    estimatedPrepTime: 35,
  },
  {
    name: 'Mafé',
    description: 'Viande en sauce cacahuète, servi avec du riz',
    price: 4500,
    category: 'main',
    estimatedPrepTime: 35,
  },
  {
    name: 'Dibi',
    description: 'Brochettes de viande grillée, moutarde et oignons',
    price: 4000,
    category: 'main',
    estimatedPrepTime: 30,
  },
  {
    name: 'Domoda',
    description: 'Viande mijotée en sauce tomate et arachide',
    price: 4500,
    category: 'main',
    estimatedPrepTime: 35,
  },
  // Desserts (5)
  {
    name: 'Thiakry',
    description: 'Semoule de mil au yaourt et lait concentré sucré',
    price: 1500,
    category: 'dessert',
    estimatedPrepTime: 10,
  },
  {
    name: 'Fondant au chocolat',
    description: 'Cœur coulant au chocolat noir',
    price: 2500,
    category: 'dessert',
    estimatedPrepTime: 20,
  },
  {
    name: 'Tiramisu',
    description: 'Mascarpone, café et cacao',
    price: 2500,
    category: 'dessert',
    estimatedPrepTime: 20,
  },
  {
    name: 'Crème brûlée',
    description: 'Crème vanillée au caramel croustillant',
    price: 2000,
    category: 'dessert',
    estimatedPrepTime: 20,
  },
  {
    name: 'Salade de fruits frais',
    description: 'Fruits de saison, sirop léger',
    price: 1500,
    category: 'dessert',
    estimatedPrepTime: 10,
  },
  // Boissons (5)
  {
    name: 'Bissap',
    description: 'Jus d’hibiscus glacé à la menthe',
    price: 1000,
    category: 'drink',
    estimatedPrepTime: 5,
  },
  {
    name: 'Jus de gingembre',
    description: 'Jus de gingembre frais et citron',
    price: 1000,
    category: 'drink',
    estimatedPrepTime: 5,
  },
  {
    name: 'Bouye',
    description: 'Crémeux de baobab à la vanille',
    price: 1500,
    category: 'drink',
    estimatedPrepTime: 5,
  },
  {
    name: 'Jus d’ananas',
    description: 'Jus d’ananas frais pressé',
    price: 1000,
    category: 'drink',
    estimatedPrepTime: 5,
  },
  {
    name: 'Eau minérale',
    description: 'Bouteille 50cl',
    price: 500,
    category: 'drink',
    estimatedPrepTime: 1,
  },
];
const generateAndUploadQrImage = async (token, tableId) => {
  const url = `${process.env.CLIENT_URL}/menu/${token}`;
  const qrBuffer = await QRCode.toBuffer(url, { width: 1000, margin: 2 });

  const result = await uploadToCloudinary(
    qrBuffer,
    'tablego/qr-codes',
    `table-${tableId}`
  );

  return result.secure_url;
};

const runSeedService = async (req, res) => {
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const result = {
    created: { users: 0, menus: 0, tables: 0 },
    existing: { users: 0, menus: 0, tables: 0 },
    users: [],
    menus: [],
    tables: [],
  };

  const transaction = await sequelize.transaction();

  try {
    // 5 utilisateurs
    for (const userData of seedUsers) {
      const [user, created] = await User.findOrCreate({
        where: { phone: userData.phone },
        defaults: { ...userData, password: hashedPassword },
        transaction,
      });
      result.users.push(user);
      if (created) {
        result.created.users += 1;
      } else {
        result.existing.users += 1;
      }
    }

    // 5 plats par catégorie (starter, main, dessert, drink)
    for (const menuData of seedMenus) {
      const [menu, created] = await MenuItem.findOrCreate({
        where: { name: menuData.name, category: menuData.category },
        defaults: { ...menuData, isAvailable: true, imageUrl: null },
        transaction,
      });
      result.menus.push(menu);
      if (created) {
        result.created.menus += 1;
      } else {
        result.existing.menus += 1;
      }
    }

    // 10 tables (numéro + token QR + image QR générée comme dans table.service)
    for (let i = 1; i <= 10; i += 1) {
      const qrCodeToken = crypto.randomBytes(16).toString('hex');

      const [table, created] = await Table.findOrCreate({
        where: { number: `TABLE-${i}` },
        defaults: {
          number: `TABLE-${i}`,
          qrCodeToken,
          qrCodeImageUrl: null,
          status: 'free',
        },
        transaction,
      });

      // Génère et uploade l'image QR si elle manque (nouvelle table ou ancienne sans image)
      if (created || !table.qrCodeImageUrl) {
        const qrCodeImageUrl = await generateAndUploadQrImage(
          table.qrCodeToken,
          table.id
        );
        await table.update({ qrCodeImageUrl }, { transaction });
      }

      result.tables.push(table);
      if (created) {
        result.created.tables += 1;
      } else {
        result.existing.tables += 1;
      }
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  return res.status(responses.CREATED).json({
    success: true,
    message: 'Seed exécuté avec succès !',
    data: {
      defaultPassword: DEFAULT_PASSWORD,
      summary: {
        created: result.created,
        existing: result.existing,
      },
      users: result.users,
      menus: result.menus,
      tables: result.tables,
    },
  });
};

module.exports = { runSeedService };
