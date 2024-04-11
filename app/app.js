var express = require("express");
const session = require("express-session");
const { HmacSHA256 } = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");
const multer = require("multer");
const axios = require("axios");
var cors = require("cors");
var app = express();
app.listen(8000);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  session({
    secret: "ledian", // 用于对 session 数据进行加密的密钥，可以是任意字符串
    resave: false, // 是否每次请求都重新保存 session 数据，默认为 true
    saveUninitialized: false, // 是否保存未初始化的 session 数据，默认为 false
  })
);

var mysql = require("mysql");
var conn = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  port: 3306,
  database: "lediandata",
});

conn.connect(function (err) {
  console.log(err);
});

app.get("/index/branch", function (req, res) {
  conn.query("select * from branch", function (err, rows) {
    res.send(JSON.stringify(rows));
  });
});
app.get("/index/brand", function (req, res) {
  conn.query("select * from brand", function (err, rows) {
    res.send(JSON.stringify(rows));
  });
});
app.get("/index/products", function (req, res) {
  conn.query(
    "select product_name, product_img, brand_id, product_id, product_class_1 from products where product_img != 'LeDian' and product_class_1 = 1 and (brand_id = 14 or brand_id = 10 or brand_id = 1 or brand_id = 9)",
    function (err, rows) {
      if (err) {
        console.log(err);
      }
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/brand", function (req, res) {
  conn.query("select * from brand", function (err, rows) {
    res.send(JSON.stringify(rows));
  });
});

app.get("/branch/:id", function (req, res) {
  conn.query(
    "select * from branch where brand_id = ?",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/brand/:id", function (req, res) {
  conn.query(
    "select * from brand where brand_id = ?",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

// 全部飲料
app.get("/all/products", function (req, res) {
  conn.query("select * from products", function (err, rows) {
    res.send(JSON.stringify(rows));
  });
});

app.get("/all/brand", function (req, res) {
  conn.query("select * from brand", function (err, rows) {
    res.send(JSON.stringify(rows));
  });
});

// 店家部分-全部
app.get("/dian/address", function (req, res) {
  conn.query("select * from branch", function (err, rows) {
    res.send(JSON.stringify(rows));
  });
});

// 店家部分-地區
app.get("/dian/address_400", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 400",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_401", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 401",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_402", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 402",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_403", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 403",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_404", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 404",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_406", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 406",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_407", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 407",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_408", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 408",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_411", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 411",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_412", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 412",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_413", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 413",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_414", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 414",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_420", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 420",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_421", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 421",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_422", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 422",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_423", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 423",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_426", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 426",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_427", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 427",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_428", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 428",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_429", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 429",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_432", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 432",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_433", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 433",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_434", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 434",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_435", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 435",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_436", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 436",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_437", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 437",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/address_438", function (req, res) {
  conn.query(
    "select * from branch where branch_postcode = 438",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

// 店家部分-評分(全)
app.get("/dian/scoreall", function (req, res) {
  conn.query("select * from branch", function (err, rows) {
    res.send(JSON.stringify(rows));
  });
});

// 店家部分-評分
app.get("/dian/score_4.5", function (req, res) {
  conn.query(
    "select * from branch where branch_score between 4.5 and 5.0 ",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/score_4.0", function (req, res) {
  conn.query(
    "select * from branch where branch_score between 4.0 and 5 ",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/score_3.5", function (req, res) {
  conn.query(
    "select * from branch where branch_score between 3.5 and 5 ",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/dian/score_3.0", function (req, res) {
  conn.query(
    "select * from branch where branch_score between 3.0 and 5 ",
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

// 訂購頁面
app.get("/order/branch/:id", function (req, res) {
  // res.send('ok');
  conn.query(
    "SELECT * FROM branch WHERE branch_id=?",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/order/brand/:id", function (req, res) {
  // res.send('ok');
  conn.query(
    "SELECT * FROM brand WHERE brand_id=?",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/order/product/:id", function (req, res) {
  // res.send('ok');
  conn.query(
    "SELECT * FROM products WHERE brand_id=?",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});
app.get("/product/:id", function (req, res) {
  // res.send('ok');
  conn.query(
    "SELECT * FROM products WHERE product_id=?",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

app.get("/categories/:id", function (req, res) {
  // res.send('ok');
  conn.query(
    "SELECT * FROM categories WHERE brand_id=?",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

// 訂購頁面 對話盒
app.get("/order/modelproduct/:id", function (req, res) {
  // res.send('ok');
  conn.query(
    "SELECT products.*, brand.brand_note FROM products INNER JOIN brand ON products.brand_id = brand.brand_id WHERE brand.brand_id = ?;",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

// 訂購頁面 對話盒 尺寸資料
app.get("/order/modelproductsize/:id", function (req, res) {
  conn.query(
    "SELECT brand.brand_id, brand.brand_name, sizes.size_id, sizes.size_name, sizes.size_0_name,sizes.size_1_name, sizes.size_2_name FROM brand LEFT JOIN sizes ON brand.brand_id = sizes.brand_id WHERE brand.brand_id = ?",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows[0]));
    }
  );
});

// 訂購頁面 對話盒 甜度資料
app.get("/order/modelproductsugars/:id", function (req, res) {
  conn.query(
    "SELECT brand.brand_id, brand.brand_name,sugars.* FROM sugars INNER JOIN brand ON brand.brand_id = sugars.brand_id WHERE brand.brand_id = ?",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows[0]));
    }
  );
});

// 訂購頁面 對話盒 配料表資料
app.get("/order/modelproductingredients/:id", function (req, res) {
  conn.query(
    "SELECT brand.brand_id, brand.brand_name,ingredients.* FROM ingredients INNER JOIN brand ON brand.brand_id = ingredients.brand_id WHERE brand.brand_id = ? ",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows[0]));
    }
  );
});

// 訂購頁面 拿取甜度資料
app.get("/order/modelsugar/:id", function (req, res) {
  conn.query(
    "SELECT sugars.sugar_0,sugars.sugar_1,sugars.sugar_2,sugars.sugar_2,sugars.sugar_3,sugars.sugar_4,sugars.sugar_5,sugars.sugar_6,sugars.sugar_7,sugars.sugar_8,sugars.sugar_9 FROM sugars WHERE sugar_id = ?",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows[0]));
    }
  );
});

// 訂購頁面拿取商品尺寸資料 // 依照產品id拿取產品的尺寸的價格
app.get("/order/moderprice/:id", function (req, res) {
  conn.query(
    "SELECT products.products_price_0,products.products_price_1,products.products_price_2 FROM products WHERE product_id = ?",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows[0]));
    }
  );
});

//訂購頁面 尺寸甜度溫度資料
app.get("/order/create/:id", function (req, res) {
  console.log(req.params.id);
  conn.query(
    `SELECT * FROM products LEFT JOIN sizes ON sizes.brand_id = products.brand_id LEFT JOIN sugars ON sugars.brand_id = products.brand_id LEFT JOIN temperatures ON temperatures.brand_id = products.brand_id LEFT JOIN brand ON brand.brand_id = products.brand_id WHERE products.product_id = ?;`,
    [req.params.id],
    function (err, rows) {
      let newdata = [
        {
          size_choose: [
            {
              size: rows[0].choose_size_0 ? rows[0].size_0_name : "",
              temperatures: rows[0].choose_size_0,
              products_price: rows[0].products_price_0,
            },
            {
              size: rows[0].choose_size_1 ? rows[0].size_1_name : "",
              temperatures: rows[0].choose_size_1,
              products_price: rows[0].products_price_1,
            },
            {
              size: rows[0].choose_size_2 ? rows[0].size_1_name : "",
              temperatures: rows[0].choose_size_2,
              products_price: rows[0].products_price_2,
            },
          ],
        },

        {
          temperature_choose: [
            rows[0].temperature_0,
            rows[0].temperature_categorise_0,
            rows[0].temperature_1,
            rows[0].temperature_categorise_1,
            rows[0].temperature_2,
            rows[0].temperature_categorise_2,
            rows[0].temperature_3,
            rows[0].temperature_categorise_3,
            rows[0].temperature_4,
            rows[0].temperature_categorise_4,
            rows[0].temperature_5,
            rows[0].temperature_categorise_5,
            rows[0].temperature_6,
            rows[0].temperature_categorise_6,
            rows[0].temperature_7,
            rows[0].temperature_categorise_7,
          ],
        },

        {
          sugar_choose: [
            rows[0].sugar_0,
            rows[0].sugar_1,
            rows[0].sugar_2,
            rows[0].sugar_3,
            rows[0].sugar_4,
            rows[0].sugar_5,
            rows[0].sugar_6,
            rows[0].sugar_7,
            rows[0].sugar_8,
            rows[0].sugar_9,
          ],
        },

        {
          product: {
            // product_name: rows[0].product_name,
            // product_img: rows[0].product_img,
            // choose_size_0: 0,
            // choose_size_1: 3,
            // choose_size_2: 0,
            choose_sugar: rows[0].choose_sugar,
            choose_ingredient: rows[0].choose_ingredient,
            products_price_0: rows[0].products_price_0,
            products_price_1: rows[0].products_price_1,
            products_price_2: rows[0].products_price_2,
          },
        },
      ];
      console.log(newdata);
      res.send(JSON.stringify(newdata));
    }
  );
});

const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
app.use(bodyParser.json());

//註冊
app.post("/signup", async function (req, res) {
  const { phone, email, password, password2 } = req.body;

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isEmailValid = emailRegex.test(email.toLowerCase());

  const phoneRegex = /^09[0-9]{8}$/;
  const isPhoneValid = phoneRegex.test(phone);

  if (!isEmailValid) {
    console.log("無效的電子郵件格式");
    return res.status(400).json({ error: "無效的電子郵件格式" });
  }

  if (!isPhoneValid) {
    console.log("無效的手機號碼格式");
    return res.status(400).json({ error: "無效的手機號碼格式" });
  }

  if (password !== password2) {
    console.log("密碼與確認密碼不匹配");
    return res.status(400).json({ error: "密碼與確認密碼不匹配" });
  }

  conn.query(
    "SELECT * FROM users WHERE phone = ? OR email = ?",
    [phone, email],
    function (err, rows) {
      if (err) {
        console.error("查詢用戶時發生錯誤:", err);
        return res.status(500).json({ error: "查詢用戶時出錯" });
      }

      if (rows.length > 0) {
        const existingUser = rows[0];
        if (existingUser.phone === phone) {
          console.log(`${phone} 已被使用`);
          return res.status(400).json({ error: `${phone} 已被使用` });
        }
        if (existingUser.email === email) {
          console.log(`${email} 已被使用`);
          return res.status(400).json({ error: `${email} 已被使用` });
        }
      }

      bcrypt.hash(password, 10, function (err, hashedPassword) {
        if (err) {
          console.error("加密密碼時發生錯誤:", err);
          return res.status(500).json({ error: "加密密碼時出錯" });
        }

        conn.query(
          "INSERT INTO users (phone, email, password, createtime) VALUES (?, ?, ?, ?)",
          [phone, email, hashedPassword, onTime()],
          function (err, result) {
            if (err) {
              console.error("註冊新用戶時發生錯誤:", err);
              return res.status(500).json({ error: "註冊新用戶失敗" });
            }
            res.status(200).json({ message: "User registered successfully" });
          }
        );
      });
    }
  );
});

// 登入路由
app.post("/login", async function (req, res) {
  const { email, password } = req.body;
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isEmailValid = emailRegex.test(email.toLowerCase());

  if (!isEmailValid) {
    console.log("無效的電子郵件格式");
    return res.status(400).json({ error: "無效的電子郵件格式" });
  }

  conn.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async function (error, results, fields) {
      if (error) {
        console.error("查詢資料庫時出錯:", error);
        return res.status(500).json({ error: "資料庫查詢錯誤" });
      }

      if (results.length === 0) {
        console.log("會員不存在");
        return res.status(404).json({ error: "會員不存在" });
      }

      const user = results[0];

      try {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          console.log("使用者登入成功:", user);

          req.session.userId = user.user_id;
          req.session.userImg = user.user_img;
          console.log("會員的 ID 是:", req.session.userId);

          return res.status(200).json({
            message: "使用者登入成功",
            user_id: user.user_id,
            user_img: user.user_img,
          });
        } else {
          console.log("密碼不正確");
          return res.status(401).json({ error: "密碼不正確" });
        }
      } catch (error) {
        console.error("登入時出錯:", error);
        return res.status(500).json({ error: "內部伺服器錯誤" });
      }
    }
  );
});

// 登出路由
app.post("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.error("登出時出錯:", err);
      return res.status(500).json({ error: "登出時出錯" });
    }
    console.log("會員的 session 已成功清除");
    return res.status(200).json({ message: "成功登出" });
  });
});

//獲取添加時間
const onTime = () => {
  const date = new Date();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const hh = date.getHours();
  const mi = date.getMinutes();
  const ss = date.getSeconds();

  return [
    date.getFullYear(),
    "-" + (mm > 9 ? "" : "0") + mm,
    "-" + (dd > 9 ? "" : "0") + dd,
    " " + (hh > 9 ? "" : "0") + hh,
    ":" + (mi > 9 ? "" : "0") + mi,
    ":" + (ss > 9 ? "" : "0") + ss,
  ].join("");
};

// 忘記密碼
app.post("/forgotPassword", async function (req, res) {
  const { email } = req.body;

  conn.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    function (error, results, fields) {
      if (error) {
        console.error("查詢資料庫時出錯:", error);
        return res.status(500).json({ error: "資料庫查詢錯誤" });
      }
      if (results.length > 0) {
        console.log(`${email} 存在，郵件已發送`);
        res.status(200).json({ message: `${email} 存在，郵件已發送` });
      } else {
        console.log(`用戶不存在`);
        res.status(404).json({ error: `用戶不存在` });
      }
    }
  );
});

// user 是大家共用的路由
app.get("/user/:id", function (req, res) {
  const userId = parseInt(req.params.id);
  const isLoggedIn = userId != null;

  if (!isLoggedIn) {
    const guestData = {
      isLoggedIn: false,
    };
    console.log("User is not logged in");
    return res.json(guestData);
  }

  conn.query(
    "SELECT * FROM users WHERE user_id = ?;",
    [userId],
    function (err, rows) {
      if (err) {
        console.error("查詢錯誤:", err);
        return res.status(500).json({ error: "查詢錯誤" });
      }
      if (rows.length === 0) {
        console.log("找不到用户");
        return res.status(404).json({ error: "找不到用户" });
      }
      const userData = rows[0];
      res.json(userData);
    }
  );
});

// 縣市表
app.get("/city", function (req, res) {
  conn.query("SELECT * FROM city", function (err, rows) {
    if (err) {
      console.error("Failed to fetch city:", err);
      return res.status(500).json({ error: "Failed to fetch city" });
    }
    res.json(rows);
  });
});
//區域表全
app.get("/regions", function (req, res) {
  conn.query("SELECT * FROM region", function (err, rows) {
    if (err) {
      console.error("Failed to fetch city:", err);
      return res.status(500).json({ error: "Failed to fetch city" });
    }
    res.json(rows);
  });
});
//區域表
app.get("/region/:cityId", function (req, res) {
  const cityId = req.params.cityId;
  conn.query(
    "SELECT * FROM region WHERE city_id = ?",
    [cityId],
    function (err, rows) {
      if (err) {
        console.error("Failed to fetch region:", err);
        return res.status(500).json({ error: "Failed to fetch region" });
      }
      res.json(rows);
    }
  );
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public/img/users");
  },
  filename: function (req, file, cb) {
    const user_id = parseInt(req.params.id);
    const fileExtension = file.originalname.split(".").pop();
    const newFileName = `${user_id}.${fileExtension}`;
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });

app.post("/uploadUserImage/:id", upload.single("user_img"), (req, res) => {
  if (!req.file) {
    console.log("No file received");
    return res.status(400).json({ error: "No file received" });
  }

  console.log("Received file:", req.file.originalname);
  console.log("File saved as:", req.file.filename);

  const fileInfo = {
    message: "File uploaded successfully",
    originalName: req.file.originalname,
    savedName: req.file.filename,
  };

  return res.status(200).json(fileInfo);
});

app.post("/updateUserData/:id", (req, res) => {
  const user_id = parseInt(req.params.id);
  const { email, name, phone, sex, birthday, city_id, area_id, user_img } =
    req.body;
  const updatetime = onTime();
  const sql = `UPDATE users SET email=?, name=?, phone=?, sex=?, birthday=?, city_id=?, area_id=?, user_img=?, updatetime=? WHERE user_id=?`;

  conn.query(
    sql,
    [
      email,
      name,
      phone,
      sex,
      birthday,
      city_id,
      area_id,
      user_img,
      updatetime,
      user_id,
    ],
    (err, result) => {
      if (err) {
        console.error("Failed to update user data:", err);
        return res.status(500).json({ error: "Failed to update user data" });
      }
      console.log("User data updated successfully");

      const fetchUpdatedUserDataQuery = "SELECT * FROM users WHERE user_id = ?";
      conn.query(
        fetchUpdatedUserDataQuery,
        [user_id],
        (fetchErr, fetchResult) => {
          if (fetchErr) {
            console.error("Failed to fetch updated user data:", fetchErr);
            return res
              .status(500)
              .json({ error: "Failed to fetch updated user data" });
          }
          const updatedUserData = fetchResult[0];
          return res.json(updatedUserData);
        }
      );
    }
  );
});

app.post("/updateUserPoints/:userId", (req, res) => {
  const userId = req.params.userId;
  const pointsToAdd = req.body.pointsToAdd;

  conn.query(
    "SELECT points FROM users WHERE user_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (results.length === 0) {
        res
          .status(404)
          .json({ error: "User not found or points data not found" });
        return;
      }

      const currentPoints = results[0].points;
      const updatedPoints = currentPoints + pointsToAdd;

      conn.query(
        "UPDATE users SET points = ? WHERE user_id = ?",
        [updatedPoints, userId],
        (error, results) => {
          if (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }
          conn.query(
            "UPDATE orders SET updatedpoints = 1 WHERE user_id = ?",
            [userId],
            (error, results) => {
              if (error) {
                console.error("Error:", error);
                res.status(500).json({ error: "Internal Server Error" });
                return;
              }

              res.json({ updatedPoints: updatedPoints });
            }
          );
        }
      );
    }
  );
});

//驗證修改密碼前是否正確
app.post("/verifyPassword", async function (req, res) {
  const userId = req.body.userId;
  const oldPassword = req.body.oldPassword;
  conn.query(
    "SELECT * FROM users WHERE user_id = ?",
    [userId],
    async function (error, results, fields) {
      const user = results[0];

      try {
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);

        if (passwordMatch) {
          console.log("舊密碼驗證通過");
          res.status(200).json({ message: "舊密碼驗證通過" });
        } else {
          console.log("舊密碼不正確");
          return res.status(401).json({ error: "舊密碼不正確" });
        }
      } catch (error) {
        console.error("驗證密碼時出錯:", error);
        return res.status(500).json({ error: "內部錯誤" });
      }
    }
  );
});

// 修改密碼
app.post("/changePassword", async function (req, res) {
  const userId = req.body.userId;
  const newPassword = req.body.newPassword;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    conn.query(
      "UPDATE users SET password = ? WHERE user_id = ?",
      [hashedPassword, userId],
      function (error, results, fields) {
        if (error) {
          console.error("更新密碼錯誤:", error);
          return res.status(500).json({ error: "更新密碼錯誤" });
        }

        console.log("密碼成功更新");
        res.status(200).json({ message: "密碼成功更新" });
      }
    );
  } catch (error) {
    console.error("新密碼錯誤:", error);
    return res.status(500).json({ error: "新密碼錯誤" });
  }
});

app.get("/profile/orders/:userId", (req, res) => {
  const userId = req.params.userId;
  conn.query(
    "SELECT * FROM orders WHERE user_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: "Failed to fetch orders data" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.get("/profile/order_details/:orderId", (req, res) => {
  const orderId = req.params.orderId;
  conn.query(
    "SELECT * FROM order_details WHERE orders_id = ?",
    [orderId],
    (error, results) => {
      if (error) {
        res.status(500).send("Internal server error");
        return;
      }
      if (results.length === 0) {
        res.status(404).send("Order details not found");
      } else {
        res.json(results);
      }
    }
  );
});

//新增條碼
app.post("/user/:userId/barcode", (req, res) => {
  const userId = req.params.userId;
  const { barcodeValue } = req.body;
  conn.query(
    "UPDATE users SET barcode = ? WHERE user_id = ?",
    [barcodeValue, userId],
    (error, results) => {
      if (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.json({ message: "Barcode saved successfully" });
    }
  );
});
//更新條碼
app.put("/user/:userId/barcode", (req, res) => {
  const userId = req.params.userId;
  const { barcode } = req.body;
  conn.query(
    "UPDATE users SET barcode = ? WHERE user_id = ?",
    [barcode, userId],
    (error, results) => {
      if (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.json({ message: "Barcode updated successfully" });
    }
  );
});
//刪除條碼
app.delete("/user/:userId/barcode", (req, res) => {
  const userId = req.params.userId;
  conn.query(
    "UPDATE users SET barcode = NULL WHERE user_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.json({ message: "Barcode deleted successfully" });
    }
  );
});

// GET 載具資料
app.get("/user/:userId/barcode", (req, res) => {
  const userId = req.params.userId;
  conn.query(
    "SELECT barcode FROM users WHERE user_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      const barcodeData = results[0];
      res.json(barcodeData);
    }
  );
});

//購物車清單
app.get("/cartlist/:id", function (req, res) {
  console.log(req.params.id);
  conn.query(
    "SELECT  *,  SUM(cartdetails.item_quantity) as total_item ,  SUM(cartdetails.total_price*cartdetails.item_quantity) as total_item_price ,cartdetails.createtime as cart_createtime FROM branch LEFT join  cartdetails ON branch.branch_id=cartdetails.branch_id LEFT join brand on cartdetails.brand_id=brand.brand_id  WHERE user_id=?   GROUP BY cart_id",
    [req.params.id],
    (err, rows) => {
      if (err) {
        console.log(err);
      }
      res.send(JSON.stringify(rows));
    }
  );
});
//購物車明細
app.get("/cartPay/:id", function (req, res) {
  console.log(req.params.id);
  conn.query(
    " SELECT * FROM cartdetails LEFT join branch on cartdetails.branch_id=branch.branch_id left join brand on brand.brand_id=cartdetails.brand_id  WHERE cart_id=?",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

//商品編輯
app.get("/itemedit/:id", function (req, res) {
  console.log(req.params.id);
  conn.query(
    `SELECT * FROM products LEFT join cartdetails on products.product_id=cartdetails.product_id LEFT join branch on branch.branch_id =cartdetails.branch_id LEFT join brand on brand.brand_id=cartdetails.brand_id LEFT JOIN sizes on sizes.brand_id = brand.brand_id LEFT join temperatures on temperatures.brand_id = brand.brand_id LEFT JOIN ingredients on ingredients.brand_id=brand.brand_id LEFT join sugars on sugars.brand_id=brand.brand_id WHERE cartdetails.item_id=?;`,
    [req.params.id],
    function (err, rows) {
      let newdata = [
        {
          size_choose: [
            {
              size: rows[0].choose_size_0 ? rows[0].size_0_name : "",
              temperatures: rows[0].choose_size_0,
              products_price: rows[0].products_price_0,
            },
            {
              size: rows[0].choose_size_1 ? rows[0].size_1_name : "",
              temperatures: rows[0].choose_size_1,
              products_price: rows[0].products_price_1,
            },
            {
              size: rows[0].choose_size_2 ? rows[0].size_2_name : "",
              temperatures: rows[0].choose_size_2,
              products_price: rows[0].products_price_2,
            },
          ],
        },
        {
          temperature_choose: [
            rows[0].temperature_0,
            rows[0].temperature_1,
            rows[0].temperature_2,
            rows[0].temperature_3,
            rows[0].temperature_4,
            rows[0].temperature_5,
            rows[0].temperature_6,
            rows[0].temperature_7,
          ],
        },
        {
          sugar_choose: [
            rows[0].sugar_0,
            rows[0].sugar_1,
            rows[0].sugar_2,
            rows[0].sugar_3,
            rows[0].sugar_4,
            rows[0].sugar_5,
            rows[0].sugar_6,
            rows[0].sugar_7,
            rows[0].sugar_8,
            rows[0].sugar_9,
          ],
        },

        {
          ingredient: [
            {
              ingredient_choose: rows[0].ingredient_0,
              ingredient_price: rows[0].ingredient_price_0,
            },
            {
              ingredient_choose: rows[0].ingredient_1,
              ingredient_price: rows[0].ingredient_price_1,
            },
            {
              ingredient_choose: rows[0].ingredient_2,
              ingredient_price: rows[0].ingredient_price_2,
            },
            {
              ingredient_choose: rows[0].ingredient_3,
              ingredient_price: rows[0].ingredient_price_3,
            },
            {
              ingredient_choose: rows[0].ingredient_4,
              ingredient_price: rows[0].ingredient_price_4,
            },
            {
              ingredient_choose: rows[0].ingredient_5,
              ingredient_price: rows[0].ingredient_price_5,
            },
            {
              ingredient_choose: rows[0].ingredient_6,
              ingredient_price: rows[0].ingredient_price_6,
            },
            {
              ingredient_choose: rows[0].ingredient_7,
              ingredient_price: rows[0].ingredient_price_7,
            },
            {
              ingredient_choose: rows[0].ingredient_8,
              ingredient_price: rows[0].ingredient_price_8,
            },
            {
              ingredient_choose: rows[0].ingredient_9,
              ingredient_price: rows[0].ingredient_price_9,
            },
            {
              ingredient_choose: rows[0].ingredient_10,
              ingredient_price: rows[0].ingredient_price_10,
            },
            {
              ingredient_choose: rows[0].ingredient_11,
              ingredient_price: rows[0].ingredient_price_11,
            },
          ],
        },

        {
          ingredient_price: [
            rows[0].ingredient_price_0,
            rows[0].ingredient_price_2,
            rows[0].ingredient_price_3,
            rows[0].ingredient_price_4,
            rows[0].ingredient_price_5,
            rows[0].ingredient_price_6,
            rows[0].ingredient_price_7,
            rows[0].ingredient_price_8,
            rows[0].ingredient_price_9,
            rows[0].ingredient_price_1,
            rows[0].ingredient_price_1,
          ],
        },
        { brand_note: rows[0].brand_note },
        {
          branch_name: rows[0].branch_name,
          branch_address: rows[0].branch_address,
          branch_phone: rows[0].branch_phone,
        },
        {
          product: {
            product_name: rows[0].product_name,
            product_img: rows[0].product_img,
            // choose_size_0: 0,
            // choose_size_1: 3,
            // choose_size_2: 0,
            choose_sugar: rows[0].choose_sugar,
            choose_ingredient: rows[0].choose_ingredient,
            products_price_0: rows[0].products_price_0,
            products_price_1: rows[0].products_price_1,
            products_price_2: rows[0].products_price_2,
          },
        },
        {
          cats_item: {
            item_size: rows[0].item_size,
            item_sugar: rows[0].item_sugar,
            item_temperatures: rows[0].item_temperatures,
            item_price: rows[0].item_price,
            item_ingredient: rows[0].item_ingredient,
            ingredient_price: rows[0].ingredient_price,
            item_quantity: rows[0].item_quantity,
            total_price: rows[0].total_price,
          },
        },
      ];
      console.log(newdata);
      res.send(JSON.stringify(newdata));
    }
  );
});

//營業時間
app.get("/branchinfo/:branchid", function (req, res) {
  conn.query(
    "SELECT * FROM `branch` WHERE branch_id = ?;",
    [req.params.branchid],
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});

//訂單寫入
//現金交易
app.post("/cartcashpay", function (req, res) {
  console.log("ok");
  console.log(req.body);

  const orderInfo = {
    user_id: req.body.user_id,
    brand_id: req.body.brand_id,
    branch_name: req.body.branch_name,
    brand_name: req.body.brand_name,
    orders_total: req.body.orders_total,
    orders_bag: req.body.orders_bag,
    terms_of_payment: req.body.terms_of_payment,
    invoicing_method: req.body.invoicing_method,
    orders_bag_num: req.body.orders_bag_num,
    usePoninter: req.body.usePoninter,
    orders_status: req.body.orders_status,
    payment_status: req.body.payment_status,
    orders_pick_up: req.body.orders_pick_up,
    updatedpoints: req.body.updatedpoints,
    updatetime: onTime(),
    createtime: onTime(),
  };
  const orderDetails = req.body.details;
  let neworderDetails;
  let orders_id;
  console.log(orderInfo);
  conn.query(
    "INSERT INTO orders (user_id, brand_id,branch_name,brand_name ,orders_total, orders_bag, terms_of_payment, invoicing_method, orders_bag_num,usePoninter, payment_status,orders_status,updatedpoints,orders_pick_up,updatetime, createtime) VALUES (?, ?,?,?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)",
    [
      orderInfo.user_id,
      orderInfo.brand_id,
      orderInfo.branch_name,
      orderInfo.brand_name,
      orderInfo.orders_total,
      orderInfo.orders_bag,
      orderInfo.terms_of_payment,
      orderInfo.invoicing_method,
      orderInfo.orders_bag_num,
      orderInfo.usePoninter,
      orderInfo.payment_status,
      orderInfo.orders_status,
      orderInfo.updatedpoints,
      orderInfo.orders_pick_up,
      orderInfo.updatetime,
      orderInfo.createtime,
    ],
    (err, results) => {
      if (err) {
        res.send(JSON.stringify(err));
      } else {
        console.log("Inserted successfully.");
        console.log("Results:", results);

        orders_id = results.insertId;
        neworderDetails = orderDetails.map((item) => {
          item.orders_id = orders_id;
          return [
            item.orders_id,
            item.details_name,
            item.details_size,
            item.details_sugar,
            item.details_mperatures,
            item.details_ingredient,
            item.details_amount,
            item.details_quantity,
            item.details_total,
            onTime(),
            onTime(),
          ];
        });

        console.log(neworderDetails);
        conn.query(
          "INSERT INTO order_details (orders_id, details_name, details_size, details_sugar, details_mperatures, details_ingredient, details_amount, details_quantity, details_total,updatetime, createtime) VALUES  ?",
          [neworderDetails],
          (err, result) => {
            if (err) {
              console.log(JSON.stringify(err));
            } else {
              console.log("成功寫入訂單資訊、明細");
              res.end();
            }
          }
        );
      }
    }
  );
});

//串接
const SecretKey = "085beec8f76f130cf12838cfeb1835f2";
const LINEPAY_CHANNEL_ID = 2004276099;
const LINEPAY_VERSION = "v3";
const LINEPAY_SITE = "https://sandbox-api-pay.line.me";
let orders = {};
let orderId = parseInt(new Date().getTime() / 1000);
function createSignature(uri, linePayBody) {
  let nonce = parseInt(new Date().getTime() / 1000);
  const string = `${SecretKey}/${LINEPAY_VERSION}${uri}${JSON.stringify(
    linePayBody
  )}${nonce}`;
  const signature = Base64.stringify(HmacSHA256(string, SecretKey));
  console.log(linePayBody, signature);
  const headers = {
    "Content-Type": "application/json",
    "X-LINE-ChannelId": LINEPAY_CHANNEL_ID,
    "X-LINE-Authorization-Nonce": nonce,
    "X-LINE-Authorization": signature,
  };
  console.log("headersssssss" + headers);
  return headers;
}

app.post("/cartlinepay", function (req, res) {
  orders = {};
  orderId = parseInt(new Date().getTime() / 1000);
  console.log("ok");
  console.log(req.body);

  const orderInfo = {
    user_id: req.body.user_id,
    brand_id: req.body.brand_id,
    branch_name: req.body.branch_name,
    brand_name: req.body.brand_name,
    orders_total: req.body.orders_total,
    orders_bag: req.body.orders_bag,
    terms_of_payment: req.body.terms_of_payment,
    invoicing_method: req.body.invoicing_method,
    orders_bag_num: req.body.orders_bag_num,
    usePoninter: req.body.usePoninter,
    orders_status: req.body.orders_status,
    payment_status: req.body.payment_status,
    orders_pick_up: req.body.orders_pick_up,
    updatedpoints: req.body.updatedpoints,
    updatetime: onTime(),
    createtime: onTime(),
  };
  const orderDetails = req.body.details;
  let neworderDetails;
  let orders_id;
  console.log(orderInfo);
  conn.query(
    "INSERT INTO orders (user_id, brand_id,branch_name,brand_name ,orders_total, orders_bag, terms_of_payment, invoicing_method, orders_bag_num,usePoninter, payment_status,orders_status,updatedpoints,orders_pick_up,updatetime, createtime) VALUES (?, ?,?,?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)",
    [
      orderInfo.user_id,
      orderInfo.brand_id,
      orderInfo.branch_name,
      orderInfo.brand_name,
      orderInfo.orders_total,
      orderInfo.orders_bag,
      orderInfo.terms_of_payment,
      orderInfo.invoicing_method,
      orderInfo.orders_bag_num,
      orderInfo.usePoninter,
      orderInfo.payment_status,
      orderInfo.orders_status,
      orderInfo.updatedpoints,
      orderInfo.orders_pick_up,
      orderInfo.updatetime,
      orderInfo.createtime,
    ],
    (err, results) => {
      if (err) {
        res.send(JSON.stringify(err));
      } else {
        console.log("Inserted successfully.");
        console.log("Results:", results);

        orders_id = results.insertId;
        neworderDetails = orderDetails.map((item) => {
          item.orders_id = orders_id;
          return [
            item.orders_id,
            item.details_name,
            item.details_size,
            item.details_sugar,
            item.details_mperatures,
            item.details_ingredient,
            item.details_amount,
            item.details_quantity,
            item.details_total,
            onTime(),
            onTime(),
          ];
        });

        console.log(neworderDetails);
        conn.query(
          "INSERT INTO order_details (orders_id, details_name, details_size, details_sugar, details_mperatures, details_ingredient, details_amount, details_quantity, details_total,updatetime, createtime) VALUES  ?",
          [neworderDetails],
          (err, result) => {
            if (err) {
              console.log(JSON.stringify(err));
            } else {
              console.log("成功寫入訂單資訊、明細");
              console.log(orders_id);
              conn.query(
                `SELECT * FROM  orders where orders_id=${orders_id}`,
                [],
                async (err, rows) => {
                  orderDate = {
                    amount: rows[0].orders_total,
                    currency: "TWD",
                    orderId: orderId,
                    packages: [
                      {
                        id: rows[0].orders_id,
                        amount: Number(rows[0].orders_total),
                        products: [
                          {
                            name: "飲料",
                            quantity: 1,
                            price: Number(rows[0].orders_total),
                          },
                        ],
                      },
                    ],
                  };
                  if (err) {
                    console.log(JSON.stringify(err));
                  } else {
                    const order = orderDate;
                    orders[order.orderId] = order;
                    const linePayBody = {
                      ...order,
                      redirectUrls: {
                        confirmUrl: "http://localhost:8000/linepay/confirm",
                        cancelUrl: "http://localhost:8000/linepay/cancel",
                      },
                    };
                    console.log("linePayBody", linePayBody);
                    const uri = "/payments/request";
                    const headers = createSignature(uri, linePayBody);
                    //       //準備送給linepay
                    const url = `${LINEPAY_SITE}/${LINEPAY_VERSION}${uri}`;
                    const linePayRes = await axios.post(url, linePayBody, {
                      headers,
                    });
                    console.log("linePayRes", linePayRes.data);
                    console.log(linePayRes.data.info);
                    transactionId = linePayRes.data.info.transactionId;
                    paymentAccessToken =
                      linePayRes.data.info.paymentAccessToken;
                    if (linePayRes?.data?.returnCode === "0000") {
                      res.send(linePayRes?.data?.info.paymentUrl.web);
                    }
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});
app.get("/linepay/confirm", async (req, res) => {
  const { transactionId, orderId } = req.query;
  console.log(transactionId, orderId);
  try {
    const order = orders[orderId];
    const linePayBody = {
      amount: order.amount,
      currency: "TWD",
    };
    const uri = `/payments/${transactionId}/confirm`;
    const headers = createSignature(uri, linePayBody);
    const url = `${LINEPAY_SITE}/${LINEPAY_VERSION}${uri}`;
    const linePayRes = await axios.post(url, linePayBody, { headers });
    console.log("付款成功");
    //這裡寫交易成功轉址
    res.redirect("http://localhost:3000/Profile");
  } catch (err) {
    res.end();
  }
});

//修改購物車內容

app.patch("/itemedit/:itemid", function (req, res) {
  console.log("修改");
  console.log(req.params.itemid);
  console.log(req.body);
  conn.query(
    "UPDATE cartdetails SET item_quantity= ?,  item_size= ?,item_sugar= ?,item_price=?,item_ingredient=?,ingredient_price=?,total_price=? WHERE item_id=?",
    [
      req.body.item_quantity,
      req.body.item_size,
      req.body.item_sugar,
      req.body.item_price,
      req.body.item_ingredient,
      req.body.ingredient_price,
      req.body.total_price,
      req.params.itemid,
    ],
    function (err, row) {
      if (err) {
        console.log(err);
      }
      console.log(row);
      console.log("修改成功");
      res.end();
    }
  );
});

//刪除購物車
app.delete("/cartdelete/:cartid", function (req, res) {
  console.log("刪除");
  console.log(req.params.cartid);
  // console.log(req.body);
  conn.query(
    "DELETE FROM cartdetails WHERE cart_id=?",
    [req.params.cartid],
    function (err, row) {
      if (err) {
        console.log(err);
      }
      console.log(row);
      console.log("已成功刪除");
    }
  );
});

//刪除購物車內容
app.delete("/itemdelete/:itemid", function (req, res) {
  console.log(req.params.itemid);
  conn.query(
    "DELETE FROM cartdetails WHERE cartdetails.item_id=?",
    [req.params.itemid],
    function (err, row) {
      if (err) {
        console.log(err);
      } else {
        console.log("已成功刪除");
        res.end();
      }
    }
  );
});

//更新user點數
app.patch("/user/:id", function (req, res) {
  conn.query(
    "UPDATE users SET points= ?  WHERE user_id=?",
    [req.body.updatepoints, req.params.id],
    function (err, row) {
      if (err) {
        console.log(err);
      }
      console.log(row);
      console.log("修改成功");
      res.end();
    }
  );
});

//訂購系統介面加入購物車
app.post("/cartorder", function (req, res) {
  let data = {
    cart_id: req.body.cart_id,
    user_id: req.body.user_id,
    user_name: req.body.user_name,
    brand_id: req.body.brand_id,
    branch_id: req.body.branch_id,
    product_id: req.body.product_id,
    item_img: req.body.item_img,
    item_name: req.body.item_name,
    item_size: req.body.item_size,
    item_sugar: req.body.item_sugar,
    item_temperatures: req.body.item_temperatures,
    item_price: req.body.item_price,
    item_ingredient: req.body.item_ingredient,
    ingredient_price: req.body.ingredient_price,
    item_quantity: req.body.item_quantity,
    total_price: req.body.total_price,
    updatetime: onTime(),
    createtime: onTime(),
  };
  console.log(data);
  conn.query(
    "INSERT INTO cartdetails(cart_id, user_id, user_name, brand_id, branch_id, product_id, item_img, item_name, item_size, item_sugar, item_temperatures, item_price, item_ingredient, ingredient_price, item_quantity, total_price, updatetime, createtime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      data.cart_id, //req.params.cartid
      data.user_id, //req.params.userid
      data.user_name,
      data.brand_id,
      data.branch_id,
      data.product_id,
      data.item_img,
      data.item_name,
      data.item_size,
      data.item_sugar,
      data.item_temperatures,
      data.item_price,
      data.item_ingredient,
      data.ingredient_price,
      data.item_quantity,
      data.total_price,
      data.updatetime,
      data.createtime,
    ],
    function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        console.log("成功寫入");
      }
    }
  );
});

//訂購系統揪團介面
app.get("/order/:id/:cartid/:userid", function (req, res) {
  // res.send('ok');
  conn.query(
    "SELECT * FROM branch WHERE branch_id=?",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});
