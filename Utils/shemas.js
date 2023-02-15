const { model, Schema } = require("mongoose");

exports.histogramsModel = model(
  "histograms",
  new Schema({
    TjData: String,
    Histogram: String
  })
);

exports.serverModel = model(
  "servers",
  new Schema({
    ID: String,
    Prefix: String
  })
);

exports.settingsModel = model(
  "settings",
  new Schema({
    SessionId: String,
    Tickets: Array,
    Tokens: Array
  })
);

exports.clotheModel = model(
  "clothes",
  new Schema({
    ID: Number,
    ClotheId: Number,
    Link: String
  })
);