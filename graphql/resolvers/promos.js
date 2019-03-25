const Promo = require('../../models/promo');
const User = require('../../models/user');
const { transformPromo } = require('./helper');

module.exports = {
  // Graphql resolver to 'Query' promos in mongoDB
  promos: async () => {
    try {
      const promos = await Promo.find();
      return promos.map(promo => {
        return transformPromo(promo);
      });
    } catch (err) {
      throw err;
    }
  },
  // Graphql mutation to create new promos in mongoDB
  createPromo: async (arg, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const promo = new Promo({
      title: arg.promoInput.title,
      link: arg.promoInput.link,
      store: arg.promoInput.store,
      description: arg.promoInput.description,
      price: +arg.promoInput.price,
      date: new Date(arg.promoInput.date),
      creator: req.userId,
    });

    let createdPromo;
    try {
      const res = await promo.save();
      createdPromo = transformPromo(res);
      const creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error('User not found');
      }

      creator.createdPromos.push(promo);
      await creator.save();

      return createdPromo;
    } catch (err) {
      throw err;
    }
  },

  deletePromo: async (arg, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    return await Promo.findByIdAndRemove(arg.id);
  },

  editPromo: async (arg, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    return await Promo.findByIdAndUpdate(arg.editInput.id, {
      title: arg.editInput.title,
      link: arg.editInput.link,
      store: arg.editInput.store,
      description: arg.editInput.description,
      price: arg.editInput.price,
    });
  },
};
