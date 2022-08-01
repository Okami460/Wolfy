const mongoose = require('mongoose');

const guildConfigSchema = mongoose.Schema({
  guildID: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  channelID: {
    type: mongoose.SchemaTypes.String,
    required: false,
  },
  categoryID: {
    type: mongoose.SchemaTypes.String,
    required: false,
  },

});

module.exports = mongoose.model('Temp Vc', guildConfigSchema);