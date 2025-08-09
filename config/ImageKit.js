const imageKit = require("imagekit");

const imagekit = new imageKit({
  publicKey: process.env.ImageKit_public_key,
  privateKey: process.env.ImageKit_private_key,
  urlEndpoint: process.env.ImageKit_URL_EndPoint,
});

module.exports = imagekit;
