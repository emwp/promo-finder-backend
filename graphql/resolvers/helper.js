const DataLoader = require('dataloader');
const Promo = require('../../models/promo');
const User = require('../../models/user');

const promoLoader = new DataLoader(promoIds => {
  return promos(promoIds);
});

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } });
});

// Relates the user to the promo created
const promos = async promoIds => {
  try {
    const promos = await Promo.find({ _id: { $in: promoIds } });
    return promos.map(promo => {
      return transformPromo(promo);
    });
  } catch (err) {
    throw err;
  }
};

// Relates the promo to the user who created
const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      password: null,
      createdPromos: () => promoLoader.loadMany(user._doc.createdPromos),
    };
  } catch (err) {
    throw err;
  }
};

const transformPromo = promo => {
  return {
    ...promo._doc,
    _id: promo.id,
    date: new Date(promo._doc.date).toISOString(),
    creator: user.bind(this, promo.creator),
  };
};

// exports.user = user;
// exports.promos = promos;
exports.transformPromo = transformPromo;
