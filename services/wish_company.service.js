const db = require("../models");
const Wish_Company = db.wish_company;

exports.update = async (wishId, rank) => {
  try {
    await Wish_Company.update({ rank: rank }, { where: { id: wishId } });
    return rank;
  } catch (err) {
    throw err;
  }
};

exports.findAllByCompanyId = async (companyId) => {
  try {
    const list = await Wish_Company.findAll({
      where: { companyId: companyId },
      order: [[`rank`, `ASC`]],
    });
    return list;
  } catch (err) {
    throw err;
  }
};
