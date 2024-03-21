var express = require("express");
const session = require('express-session');
var cors = require("cors");
var app = express();
app.listen(8000);
app.use( express.static("public")  );
app.use( express.json() );
app.use( express.urlencoded( {extended: true}) );
app.use(cors());

app.use(session({
    secret: 'ledian', // 用于对 session 数据进行加密的密钥，可以是任意字符串
    resave: false, // 是否每次请求都重新保存 session 数据，默认为 true
    saveUninitialized: false // 是否保存未初始化的 session 数据，默认为 false
}));


var mysql = require("mysql");
var conn = mysql.createConnection({
    user: "root",
    password: "",
    host: "localhost",
    port: 3306,
    database: "lediandata"
});

conn.connect(function (err) {
    console.log(err);
})

app.get("/index/branch", function (req, res) {
    conn.query("select * from branch",
        function (err, rows) {
            res.send( JSON.stringify(rows) );
        }
    )
})
app.get("/index/brand", function (req, res) {
    conn.query("select * from brand",
        function (err, rows) {
            res.send( JSON.stringify(rows) );
        }
    )
})
app.get("/index/products", function (req, res) {
    conn.query("select product_name, product_img, brand_id, product_id from products where product_img != '無' and product_class_1 = 1",
        function (err, rows) {
            res.send( JSON.stringify(rows) );
        }
    )
})

app.get("/brand", function (req, res) {
    conn.query("select * from brand",
        function (err, rows) {
            res.send( JSON.stringify(rows) );
        }
    )
})

app.get("/branch/:id", function (req, res) {
    conn.query("select * from branch where brand_id = ?",[req.params.id],
        function (err, rows) {
            res.send( JSON.stringify(rows) );
        }
    )
})

app.get("/brand/:id", function (req, res) {
    conn.query("select * from brand where brand_id = ?",[req.params.id],
        function (err, rows) {
            res.send( JSON.stringify(rows) );
        }
    )
})

// 全部飲料
app.get("/all/products", function (req, res) {
    conn.query("select * from products", function (err, rows) {
      res.send(JSON.stringify(rows));
    });
  });
  
  
  // 飲料部分
  app.get("/le1/product", function (req, res) {
    conn.query(
      "select product_img, product_id, product_name, products_price_0, products_price_1, brand_id from products where product_class_1 = 1",
      function (err, rows) {
        res.send(JSON.stringify(rows));
      }
    );
  });
  
  
  app.get("/le/brand", function (req, res) {
    conn.query("select * from brand", function (err, rows) {
      res.send(JSON.stringify(rows));
    });
  });
  
  
  app.get("/le2/product", function (req, res) {
    conn.query(
      "select product_img, product_id, product_name, products_price_0, products_price_1, brand_id from products where product_class_2 = 1",
      function (err, rows) {
        res.send(JSON.stringify(rows));
      }
    );
  });
  
  
  app.get("/le3/product", function (req, res) {
    conn.query(
      "select product_img, product_id, product_name, products_price_0, products_price_1, brand_id from products where product_class_3 = 1",
      function (err, rows) {
        res.send(JSON.stringify(rows));
      }
    );
  });
  
  
  app.get("/le4/product", function (req, res) {
    conn.query(
      "select product_img, product_id, product_name, products_price_0, products_price_1, brand_id from products where product_class_4 = 1",
      function (err, rows) {
        res.send(JSON.stringify(rows));
      }
    );
  });
  
  
  app.get("/le5/product", function (req, res) {
    conn.query(
      "select product_img, product_id, product_name, products_price_0, products_price_1, brand_id from products where product_class_5 = 1",
      function (err, rows) {
        res.send(JSON.stringify(rows));
      }
    );
  });


  // 店家部分-附近店家(x)


// 店家部分-評級4以上(星評優選)
// app.get("/dian/star4", function (req, res) {
//   conn.query("select * from branch", function (err, rows) {
//     res.send(JSON.stringify(rows));
//   });
// });


// 店家部分-地區
app.get("/dian0321/:id", function (req, res) {
    conn.query(
      "select * from branch where branch_postcode = ?",
      function (err, rows) {
        res.send(JSON.stringify(rows));
      }
    );
  });
  // 店家部分-評分x`



// 訂購頁面連資料庫
app.get("/index/order/9",function(req,res){
    // res.send('ok');
    conn.query("SELECT * FROM branch LEFT join brand on branch.brand_id = brand.brand_id WHERE branch.branch_id=1" , [ ],
        function(err,rows) {
            res.send(JSON.stringify(rows));
        }
    )
})










// 訂購頁面拿取尺寸資料
// app.get("/index/order/9",function(req,res){
//     // res.send('ok');
//     conn.query("select*from brand,sizes where brand.brand_id = sizes.brand_id", [ ],
//         function(err,rows) {
//             res.send(JSON.stringify(rows));
//         }
//     )
// })




  const bodyParser = require("body-parser");
  const bcrypt = require('bcrypt'); 
  app.use(bodyParser.json()); 
  
  
  //註冊
  app.post("/signup", async function (req, res) {
      const { phone, email, password, password2 } = req.body;
  
  
      // 驗證電子郵件格式
      const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isEmailValid = emailRegex.test(email.toLowerCase());
  
  
      // 驗證手機號碼格式
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
  
  
      // 檢查密碼是否匹配
      if (password !== password2) {
          console.log("密碼與確認密碼不匹配");
          return res.status(400).json({ error: "密碼與確認密碼不匹配" });
      }
  
  
      // 檢查電話號碼和電子郵件是否已被使用
      conn.query("SELECT * FROM users WHERE phone = ? OR email = ?", [phone, email], function (err, rows) {
          if (err) {
              console.error("查詢用戶時發生錯誤:", err);
              return res.status(500).json({ error: "查詢用戶時出錯" });
          }
  
  
          if (rows.length > 0) {
              // 電話號碼或電子郵件已被使用
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
  
  
          // 如果以上檢查都通過，則註冊新用戶
          bcrypt.hash(password, 10, function (err, hashedPassword) {
              if (err) {
                  console.error("加密密碼時發生錯誤:", err);
                  return res.status(500).json({ error: "加密密碼時出錯" });
              }
  
  
              conn.query("INSERT INTO users (phone, email, password, createtime) VALUES (?, ?, ?, ?)",
                  [phone, email, hashedPassword, onTime()],
                  function (err, result) {
                      if (err) {
                          console.error("註冊新用戶時發生錯誤:", err);
                          return res.status(500).json({ error: "註冊新用戶失敗" });
                      }
  
  
                      // 返回成功響應
                      res.status(200).json({ message: "User registered successfully" });
                  }
              );
          });
      });
  });

  // 登入路由
app.post("/login", async function (req, res) {
    const { email, password } = req.body;


    // 驗證電子郵件格式
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmailValid = emailRegex.test(email.toLowerCase());


    if (!isEmailValid) {
        console.log("無效的電子郵件格式");
        return res.status(400).json({ error: "無效的電子郵件格式" });
    }


    // 從資料庫中查詢與提供的電子郵件匹配的使用者
    conn.query('SELECT * FROM users WHERE email = ?', [email], async function (error, results, fields) {
        if (error) {
            console.error('查詢資料庫時出錯:', error);
            return res.status(500).json({ error: "資料庫查詢錯誤" });
        }


        if (results.length === 0) {
            console.log("會員不存在");
            return res.status(404).json({ error: "會員不存在" });
        }


        const user = results[0]; // 獲取查詢到的使用者資訊


        try {
            // 使用 bcrypt.compare 方法驗證密碼是否匹配
            const passwordMatch = await bcrypt.compare(password, user.password);


            if (passwordMatch) {
                // 如果使用者存在且密碼正確，則登入成功
                console.log("使用者登入成功:", user);
                
                // 將使用者的 ID 存儲到會話中
                req.session.userId = user.user_id;
                req.session.userImg = user.user_img;
                console.log("會員的 ID 是:", req.session.userId);
            
                return res.status(200).json({ message: "使用者登入成功", user_id: user.user_id,user_img: user.user_img });
            
            
        
            } else {
                console.log("密碼不正確");
                return res.status(401).json({ error: "密碼不正確" });
            }
        } catch (error) {
            console.error("登入時出錯:", error);
            return res.status(500).json({ error: "內部伺服器錯誤" });
        }
    });
});

// 登出路由
app.post("/logout", function(req, res) {
    // 清除會員 session 
    req.session.destroy(function(err) {
        if (err) {
            console.error("登出时出错:", err);
            return res.status(500).json({ error: "登出时出错" });
        }
        console.log("會員的 session 已成功清除");
        return res.status(200).json({ message: "用户已成功登出" });
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


    return [date.getFullYear(), "-" +
        (mm > 9 ? '' : '0') + mm, "-" +
        (dd > 9 ? '' : '0') + dd, " " +
        (hh > 9 ? '' : '0') + hh, ":" +
        (mi > 9 ? '' : '0') + mi, ":" +
        (ss > 9 ? '' : '0') + ss
    ].join('');
};




// 忘記密碼
app.post("/forgotPassword", async function (req, res) {
    const { email } = req.body;


    // 在資料庫中查找是否存在該電子郵件
    conn.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
        if (error) {
            console.error('查詢資料庫時出錯:', error);
            return res.status(500).json({ error: "資料庫查詢錯誤" });
        }


        // 如果找到匹配的使用者，表示電子郵件存在
        if (results.length > 0) {
            console.log(`${email} 存在，郵件已發送`);
            res.status(200).json({ message: `${email} 存在，郵件已發送` });
        } else {
            console.log(`${email} 不存在`);
            res.status(404).json({ error: `${email} 不存在` });
        }
    });
});

// user 是大家共用的路由
app.get("/user/:id", function (req, res) {
    const userId = req.params.id; //從路由拿到id
    const isLoggedIn = req.session.userId != null; // 檢查用戶是否登入


    if (!isLoggedIn) {
        // 沒有登入是來賓，一樣可以瀏覽網站
        const guestData = {
            isLoggedIn: false,
        };
        return res.json(guestData);
    }


    conn.query("SELECT * FROM users WHERE user_id = ?;", [userId], function (err, rows) {
        if (err) {
            console.error("會員資訊出錯:", err);
            return res.status(500).json({ error: "會員資訊出錯" });
        }
        if (rows.length === 0) {
            console.log("找不到會員");
            return res.status(404).json({ error: "找不到會員" });
        }
        const userData = rows[0]; // 獲取第一個匹配的會員
        res.json(userData); // 
    });
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


//區域表
app.get("/region/:cityId", function (req, res) {
    const cityId = req.params.cityId;
    conn.query("SELECT * FROM region WHERE city_id = ?", [cityId], function (err, rows) {
        if (err) {
            console.error("Failed to fetch region:", err);
            return res.status(500).json({ error: "Failed to fetch region" });
        }
        res.json(rows);
    });
});

