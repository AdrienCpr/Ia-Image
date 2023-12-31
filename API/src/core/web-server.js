const express = require('express');
const { initializeConfigMiddlewares, initializeErrorMiddlwares } = require('./middlewares');
const { sequelize } = require('../models/config.db')
const http = require('http');
const socketIo = require('socket.io');
const {set} = require("express/lib/application");

const {Image} = require("../models/models/image.model");
const {User} = require("../models/models/user.model");
const {User_image} = require("../models/models/user_image.model");

const authRoutes = require('../controllers/auth.routes');
const usersRoutes = require('../controllers/users.routes');
const imagesRoutes = require('../controllers/images.routes');

class WebServer {
  app = undefined;
  port = process.env.PORT;
  server = undefined;
  // io = undefined;

  constructor() {
    this.app = express();
    require('dotenv').config();

    User.belongsToMany(Image, { through: User_image, foreignKey: 'id_user' });
    Image.belongsToMany(User, { through: User_image, foreignKey: 'id_image' });

    sequelize.sync();
    // sequelize.sync({ force: true });

    initializeConfigMiddlewares(this.app);
    this._initializeRoutes();
    initializeErrorMiddlwares(this.app);
  }

  start() {
    this.server = http.createServer(this.app);
    // this.io = socketIo(this.server,{ cors: { origin: '*', } });
    // this._initializeWebSocket();
    this.server.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
    console.log(process.env.NODE_ENV);
  }

  stop() {
    this.server.close();
  }

  _initializeRoutes() {
    this.app.use('/auth', authRoutes.initializeRoutes());
    this.app.use('/users', usersRoutes.initializeRoutes());
    this.app.use('/images', imagesRoutes.initializeRoutes())
  }
}

module.exports = WebServer;