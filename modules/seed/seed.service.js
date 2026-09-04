const bcrypt = require('bcrypt');
const crypto = require('crypto');
const QRCode = require('qrcode');
const sequelize = require('../../database/config/connect');
const responses = require('../../messages/responses');
const User = require('../../database/model/tables/user.model');
const MenuItem = require('../../database/model/tables/menu.model');
const AddOn = require('../../database/model/tables/addOn.model');
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
    imageUrl:
      'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Samoussas au poulet',
    description: 'Feuilletés croustillants au poulet et aux épices',
    price: 2000,
    category: 'starter',
    estimatedPrepTime: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Salade de saison',
    description: 'Salade verte, tomates, œufs et poulet grillé',
    price: 3000,
    category: 'starter',
    estimatedPrepTime: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Soupe de poisson',
    description: 'Soupe traditionnelle délicatement parfumée',
    price: 2000,
    category: 'starter',
    estimatedPrepTime: 20,
    imageUrl:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Beignets de légumes',
    description: 'Beignets de légumes frais, sauce moutarde',
    price: 1500,
    category: 'starter',
    estimatedPrepTime: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  },
  // Plats principaux (5)
  {
    name: 'Thiéboudienne',
    description: 'Riz au poisson, légumes frais et sauce tomate',
    price: 5000,
    category: 'main',
    estimatedPrepTime: 40,
    imageUrl:
      'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Yassa au poulet',
    description: 'Poulet mariné aux oignons et au citron, riz blanc',
    price: 4500,
    category: 'main',
    estimatedPrepTime: 35,
    imageUrl:
      'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Mafé',
    description: 'Viande en sauce cacahuète, servi avec du riz',
    price: 4500,
    category: 'main',
    estimatedPrepTime: 35,
    imageUrl:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dibi',
    description: 'Brochettes de viande grillée, moutarde et oignons',
    price: 4000,
    category: 'main',
    estimatedPrepTime: 30,
    imageUrl:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Domoda',
    description: 'Viande mijotée en sauce tomate et arachide',
    price: 4500,
    category: 'main',
    estimatedPrepTime: 35,
    imageUrl:
      'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
  },
  // Desserts (5)
  {
    name: 'Thiakry',
    description: 'Semoule de mil au yaourt et lait concentré sucré',
    price: 1500,
    category: 'dessert',
    estimatedPrepTime: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Fondant au chocolat',
    description: 'Cœur coulant au chocolat noir',
    price: 2500,
    category: 'dessert',
    estimatedPrepTime: 20,
    imageUrl:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Tiramisu',
    description: 'Mascarpone, café et cacao',
    price: 2500,
    category: 'dessert',
    estimatedPrepTime: 20,
    imageUrl:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Crème brûlée',
    description: 'Crème vanillée au caramel croustillant',
    price: 2000,
    category: 'dessert',
    estimatedPrepTime: 20,
    imageUrl:
      'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Salade de fruits frais',
    description: 'Fruits de saison, sirop léger',
    price: 1500,
    category: 'dessert',
    estimatedPrepTime: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=800&q=80',
  },
  // Boissons (5)
  {
    name: 'Bissap',
    description: 'Jus d’hibiscus glacé à la menthe',
    price: 1000,
    category: 'drink',
    estimatedPrepTime: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Jus de gingembre',
    description: 'Jus de gingembre frais et citron',
    price: 1000,
    category: 'drink',
    estimatedPrepTime: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Bouye',
    description: 'Crémeux de baobab à la vanille',
    price: 1500,
    category: 'drink',
    estimatedPrepTime: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Jus d’ananas',
    description: 'Jus d’ananas frais pressé',
    price: 1000,
    category: 'drink',
    estimatedPrepTime: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Eau minérale',
    description: 'Bouteille 50cl',
    price: 500,
    category: 'drink',
    estimatedPrepTime: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80',
  },
];
// Pool commun de suppléments : chacun est rattaché à TOUS les menus seedés
// (chaque menu aura ainsi au moins 24 add-ons), avec de vraies images du net.
const seedAddOns = [
  {
    name: 'Sauce piment doux',
    description: 'Sauce pimentée maison',
    price: 500,
    image:
      'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sauce fromage',
    description: 'Sauce fromagère fondante',
    price: 700,
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sauce barbecue',
    description: 'Sauce barbecue fumée',
    price: 600,
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sauce aïoli',
    description: 'Aïoli crémeux à l’ail',
    price: 500,
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sauce tomate fraîche',
    description: 'Sauce tomate maison',
    price: 400,
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Beurre doux',
    description: 'Beurre frais pasteurisé',
    price: 300,
    image:
      'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Fromage râpé',
    description: 'Fromage râpé affiné',
    price: 800,
    image:
      'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Cheddar fondu',
    description: 'Cheddar fondant',
    price: 1000,
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Œuf au plat',
    description: 'Œuf frais au plat',
    price: 700,
    image:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Œuf dur',
    description: 'Œuf cuit dur',
    price: 500,
    image:
      'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Portion de frites',
    description: 'Frites croustillantes',
    price: 1000,
    image:
      'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Riz blanc',
    description: 'Riz blanc vapeur',
    price: 700,
    image:
      'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Légumes sautés',
    description: 'Légumes frais sautés',
    price: 900,
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Salade verte',
    description: 'Salade croquante assaisonnée',
    price: 600,
    image:
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Ail confit',
    description: 'Gousses d’ail confites',
    price: 400,
    image:
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Oignons caramélisés',
    description: 'Oignons doux caramélisés',
    price: 500,
    image:
      'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Champignons sautés',
    description: 'Champignons de Paris sautés',
    price: 800,
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Avocat frais',
    description: 'Quartiers d’avocat frais',
    price: 1200,
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Citron vert',
    description: 'Quartiers de citron vert',
    price: 200,
    image:
      'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Pain supplémentaire',
    description: 'Pain frais supplémentaire',
    price: 300,
    image:
      'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Beurre à l’ail',
    description: 'Beurre aromatisé à l’ail',
    price: 500,
    image:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Herbes fraîches',
    description: 'Persil, coriandre et ciboulette',
    price: 300,
    image:
      'https://images.unsplash.com/photo-1579168765467-3b235f938439?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Épices supplémentaires',
    description: 'Épices relevées en plus',
    price: 200,
    image:
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sauce moutarde',
    description: 'Moutarde à l’ancienne',
    price: 500,
    image:
      'https://images.unsplash.com/photo-1594387625717-04ea3e58a1d1?auto=format&fit=crop&w=800&q=80',
  },
];
const generateAndUploadQrImage = async (token, tableId) => {
  const url = `${process.env.CLIENT_URL}/${token}`;
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
    created: { users: 0, menus: 0, addOns: 0, tables: 0 },
    existing: { users: 0, menus: 0, addOns: 0, tables: 0 },
    users: [],
    menus: [],
    addOns: [],
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
        defaults: { ...menuData, isAvailable: true },
        transaction,
      });
      result.menus.push(menu);
      if (created) {
        result.created.menus += 1;
      } else {
        result.existing.menus += 1;
      }
    }

    // Suppléments (add_ons) : le pool commun est rattaché à CHAQUE menu,
    // chaque menu aura donc au moins 24 add-ons, avec des images réelles du net.
    for (const menuData of seedMenus) {
      const menu = await MenuItem.findOne({
        where: { name: menuData.name, category: menuData.category },
        transaction,
      });

      // On ne crée les suppléments que si le menu existe
      if (!menu) continue;

      for (const addOnData of seedAddOns) {
        const [addOn, created] = await AddOn.findOrCreate({
          where: { name: addOnData.name, menuId: menu.id },
          defaults: { ...addOnData, menuId: menu.id },
          transaction,
        });
        result.addOns.push(addOn);
        if (created) {
          result.created.addOns += 1;
        } else {
          result.existing.addOns += 1;
        }
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
      addOns: result.addOns,
      tables: result.tables,
    },
  });
};

module.exports = { runSeedService };
