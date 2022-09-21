const mongoose = require('mongoose');

const Ceza = mongoose.Schema({
  sunucuID: String,
  uyeID: String,
  yetkiliID: String,
  cezaTuru: String,
  cezaSebebi: String,
  atilmaTarihi: Number,
  bitisTarihi: Number,
  yetkiler: Array,
  adı: String
});

module.exports = mongoose.model("Penalties", Ceza);