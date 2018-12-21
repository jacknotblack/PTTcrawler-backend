const Koa = require("koa");
const logger = require("koa-logger");
const Router = require("koa-router");
const Sequelize = require("sequelize");

const PORT = process.env.PORT || 80;

const sequelize = new Sequelize(
  "heroku_6b3036d88f374e5",
  "b533748927bff2",
  "aad075c1",
  {
    host: "us-cdbr-iron-east-01.cleardb.net",
    dialect: "mysql",

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },

    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
  }
);

const Post = sequelize.define(
  "post",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: Sequelize.STRING(100),
    gameName: Sequelize.STRING(50),
    price: Sequelize.BIGINT,
    postAt: Sequelize.BIGINT,
    link: Sequelize.STRING(100),
    createdAt: Sequelize.BIGINT,
    updatedAt: Sequelize.BIGINT,
    version: Sequelize.BIGINT,
    gameID: Sequelize.INTEGER
  },
  {
    timestamps: false
  }
);

const Game = sequelize.define(
  "game",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: Sequelize.STRING(30),
    lowest_price: Sequelize.INTEGER(5),
    lp_link: Sequelize.STRING(100)
  },
  {
    timestamps: false
  }
);

const app = new Koa();
const router = Router();

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

// Router -> /
router.get("/games", async ctx => {
  const games = await Game.findAll().map(data => data.dataValues);
  ctx.body = games;
});

// Router -> /about
router.get("/about", async ctx => {
  ctx.body = "About Me";
});

app.use(logger());

app.use(router.routes());
app.listen(PORT);
