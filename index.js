const Koa = require("koa");
const cors = require("koa2-cors");
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
    gameID: {
      type: Sequelize.INTEGER,
      references: {
        model: "Game",
        key: "id"
      }
    }
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
    lp_link: Sequelize.STRING(100),
    post_count: Sequelize.INTEGER(3),
    img: Sequelize.STRING(100)
  },
  {
    timestamps: false
  }
);

Game.hasMany(Post, { foreignKey: "gameID", sourceKey: "id" });
Post.belongsTo(Game, { foreignKey: "gameID", sourceKey: "id" });
// sequelize.sync().then(console.log(123));

const app = new Koa();
app.use(cors());
const router = Router();

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

// Router -> /
router.get("games", "/games", async ctx => {
  const games = await Game.findAll({
    order: ['post_count', 'DESC']
  }).map(data => data.dataValues);
  ctx.body = games;
});

// Router -> /about
router.get("game", "/game/:id", async ctx => {
  const game = await Game.findByPk(ctx.params.id);
  // const game = await Game.findOne({
  //   where: {
  //     id: ctx.params.id
  //   }
  // });
  const posts = await game.getPosts();
  ctx.body = posts;
});

app.use(logger());

app.use(router.routes());
app.listen(PORT);
