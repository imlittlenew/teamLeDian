import React, { Component } from "react";
import "../css/order.css";
import "bootstrap/dist/js/bootstrap.js";
import axios from "axios";

import "../css/index.css";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { PiMedal } from "react-icons/pi";
import { PiCoins } from "react-icons/pi";
import { GiCancel } from "react-icons/gi";
import { QRCodeCanvas } from "qrcode.react";
import { Newspaper } from "react-bootstrap-icons";
import Toast from "react-bootstrap/Toast";

class order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storeInfo: {},
      brandInfo: {},
      productList: [],
      categoriesList: [],
      productInfo: {},
      sumPrice: 0,
      modelInfo: {}, // 對話盒菜單資料 // 存儲所有的飲料信息
      resultModal: null,
      selectedProduct: {}, // 選擇的飲料的訊息
      modelproductsize: {}, // 對話盒的商品尺寸
      modelproductsugars: {}, // 對話盒的甜度資料
      modelproductingredients: {}, // 該品牌配料表的資料
      modelresulttemperaturesugar: {}, // 對話盒的尺寸溫度甜度資料
      selectsize: 0, // 選中的size
      selectedPrice: 0,
      item_quantity: 1,
      totalPrice: 0,
      ingredientSumPrice: 0,
      ingredient: "",
      selectedProduct: { choose_sugar: 0 }, //選中的商品的甜度資料
      selectedProduct: { choose_size_0: 0 }, //選中的商品的S尺寸價格
      selectedProduct: { choose_size_1: 1 }, //選中的商品的S尺寸價格
      selectedProduct: { choose_size_2: 2 }, //選中的商品的S尺寸價格
      selectedIngredients: {},
      productCkeck: {
        size: "",
        temperatures: "",
        sugar: "",
      },
      showToast: false, // 初始状态为不显示Toast
      successMessage: "",
    };
  }

  // 元件掛載撈資料
  componentDidMount = async () => {
    //
    let newState = { ...this.state };
    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (userData) {
      axios
        .get(`http://localhost:8000/user/${userData.user_id}`)
        .then((response) => {
          const userImg = response.data.user_img
            ? response.data.user_img
            : "LeDian.png";
          this.setState({ userImg, userData });
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
        });
    }

    let user_id = userData.user_id;
    let cart_id = new Date().getTime() + user_id;
    newState.user_id = user_id; //使用者id
    newState.cart_id = cart_id; //購物車id
    this.setState(newState);
    //撈使用者資料表
    let usertable = await axios.get(`http://localhost:8000/user/${user_id}`);
    usertable = usertable.data;
    console.log("usertable", usertable);
    //取得使用者名稱
    newState.user_name = usertable.name || usertable.email;
    console.log("newState.user_name", newState.user_name);

    var resultStore = await axios.get(
      `http://localhost:8000/order/branch/${this.props.match.params.id}`
    );
    var resultBrand = await axios.get(
      `http://localhost:8000/order/brand/${resultStore.data[0].brand_id}`
    );
    var resultProduct = await axios.get(
      `http://localhost:8000/order/product/${resultStore.data[0].brand_id}`
    );
    var resultCategories = await axios.get(
      `http://localhost:8000/categories/${resultStore.data[0].brand_id}`
    );

    // 對話盒菜單資料  從資料庫獲取飲料和配料的信息
    var resultModal = await axios.get(
      `http://localhost:8000/order/modelproduct/${resultStore.data[0].brand_id}`
    );
    // alert(JSON.stringify(resultModal))

    // 對話盒商品尺寸
    var resultproductsize = await axios.get(
      `http://localhost:8000/order/modelproductsize/${resultStore.data[0].brand_id}`
    );

    // 對話盒甜度資料
    var resultproductsugars = await axios.get(
      `http://localhost:8000/order/modelproductsugars/${resultStore.data[0].brand_id}`
    );
    // alert(JSON.stringify(resultproductsugars))

    // 對話盒配料表資料
    var resultproductingredients = await axios.get(
      `http://localhost:8000/order/modelproductingredients/${resultStore.data[0].brand_id}`
    );
    // alert(JSON.stringify(resultproductingredients))

    // 對話盒尺寸溫度甜度資料
    var resulttemperaturesugar = await axios.get(
      `http://localhost:8000/order/create/${resultStore.data[0].brand_id}`
    );
    // alert(JSON.stringify(resulttemperaturesugar))

    //選中的商品的甜度資料
    var resulesugars = await axios.get(
      `http://localhost:8000/order/modelsugar/${resultStore.data[0].brand_id}`
    );

    // var newState = { ...this.state };
    newState.storeInfo = resultStore.data[0];
    newState.brandInfo = resultBrand.data[0];
    newState.productList = resultProduct.data;
    newState.categoriesList = resultCategories.data;
    newState.resultModal = resultModal.data;

    //選中的商品的尺寸的資料

    //選中的商品的甜度資料
    newState.sugars = resulesugars.data;
    console.log(resulesugars.data);

    // 對話盒菜單  獲取的飲料訊息
    newState.modelInfo = resultModal.data;
    //console.log(resultModal.data);

    // 對話盒商品尺寸
    newState.modelproductsize = resultproductsize.data;
    //console.log(resultproductsize.data);

    // 對話盒甜度資料
    newState.modelproductsugars = resultproductsugars.data;
    //console.log(resultproductsugars.data)

    // 對話盒配料表資料
    newState.modelproductingredients = resultproductingredients.data;
    //console.log(resultproductingredients.data)

    // 對話盒尺寸溫度甜度
    newState.modelresulttemperaturesugar = resulttemperaturesugar.data;
    //console.log(resulttemperaturesugar.data)

    this.setState(newState);
    //console.log(this.state);
  };

  // getProductInfo = () => {

  // }

  // 点击按钮时显示Toast消息
  handleShowToast = () => {
    this.setState({ showToast: true });

    // 3 秒后隐藏Toast消息
    setTimeout(() => {
      this.setState({ showToast: false });
    }, 3000);
  };

  // 顯示溫度 // 判斷所選的溫度會跳出來的尺寸
  showTemp = (temp) => {
    // 選擇 m 冷的
    if (temp == 1) {
      if (this.state.comparisonInfo.choose_size_0 == 1) {
        return this.state.coldTemp.map((item) => {
          return (
            <div className="col-4 form-check" key={item}>
              <input
                className="form-check-input order"
                type="radio"
                name="temperature"
                id={item}
                onChange={this.chooseTemp}
                value=""
              ></input>
              <label className="form-check-label" htmlFor={item}>
                &nbsp;{item}
              </label>
            </div>
          );
        });
      } else if (this.state.comparisonInfo.choose_size_0 == 2) {
        return this.state.hotTemp.map((item) => {
          return (
            <div className="col-4 form-check" key={item}>
              <input
                className="form-check-input order"
                type="radio"
                name="temperature"
                id={item}
                onChange={this.chooseTemp}
                value="1"
              ></input>
              <label className="form-check-label" htmlFor={item}>
                &nbsp;{item}
              </label>
            </div>
          );
        });
      } else if (this.state.comparisonInfo.choose_size_0 == 3) {
        return (
          <>
            {this.state.coldTemp.map((item) => {
              return (
                <div className="col-4 form-check" key={item}>
                  <input
                    className="form-check-input order"
                    type="radio"
                    name="temperature"
                    id={item}
                    onChange={this.chooseTemp}
                    value="1"
                  ></input>
                  <label className="form-check-label" htmlFor={item}>
                    &nbsp;{item}
                  </label>
                </div>
              );
            })}
            {this.state.hotTemp.map((item) => {
              return (
                <div className="col-4 form-check" key={item}>
                  <input
                    className="form-check-input order"
                    type="radio"
                    name="temperature"
                    id={item}
                    onChange={this.chooseTemp}
                    value="1"
                  ></input>
                  <label className="form-check-label" htmlFor={item}>
                    &nbsp;{item}
                  </label>
                </div>
              );
            })}
          </>
        );
      } else if (
        this.state.comparisonInfo.choose_size_0 == 4 &&
        this.state.chooseTempName !== "冷固定"
      ) {
        this.state.chooseTempName = "冷固定";
        return (
          <div className="col-4 form-check">
            <input
              className="form-check-input order"
              type="radio"
              name="temperature"
              value="1"
              id="冷固定"
              onChange={this.chooseTemp}
              checked
            ></input>
            <label className="form-check-label">&nbsp;冷固定</label>
          </div>
        );
      } else if (
        this.state.comparisonInfo.choose_size_0 == 5 &&
        this.state.chooseTempName !== "熱固定"
      ) {
        this.state.chooseTempName = "熱固定";
        return (
          <div className="col-4 form-check">
            <input
              className="form-check-input order"
              type="radio"
              name="temperature"
              value="1"
              id="熱固定"
              onChange={this.chooseTemp}
              checked
            ></input>
            <label className="form-check-label">&nbsp;熱固定</label>
          </div>
        );
      }

      // 選擇L
    } else if (temp == 2) {
      if (this.state.comparisonInfo.choose_size_1 == 1) {
        return this.state.coldTemp.map((item) => {
          return (
            <div className="col-4 form-check" key={item}>
              <input
                className="form-check-input order"
                type="radio"
                name="temperature"
                id={item}
                onChange={this.chooseTemp}
                value="1"
              ></input>
              <label className="form-check-label" htmlFor={item}>
                &nbsp;{item}
              </label>
            </div>
          );
        });
      } else if (this.state.comparisonInfo.choose_size_1 == 2) {
        return this.state.hotTemp.map((item) => {
          return (
            <div className="col-4 form-check" key={item}>
              <input
                className="form-check-input order"
                type="radio"
                name="temperature"
                id={item}
                onChange={this.chooseTemp}
                value="1"
              ></input>
              <label className="form-check-label" htmlFor={item}>
                &nbsp;{item}
              </label>
            </div>
          );
        });
      } else if (this.state.comparisonInfo.choose_size_1 == 3) {
        return (
          <>
            {this.state.coldTemp.map((item) => {
              return (
                <div className="col-4 form-check" key={item}>
                  <input
                    className="form-check-input order"
                    type="radio"
                    name="temperature"
                    id={item}
                    onChange={this.chooseTemp}
                    value="1"
                  ></input>
                  <label className="form-check-label" htmlFor={item}>
                    &nbsp;{item}
                  </label>
                </div>
              );
            })}
            {this.state.hotTemp.map((item) => {
              return (
                <div className="col-4 form-check " key={item}>
                  <input
                    className="form-check-input order"
                    type="radio"
                    name="temperature"
                    id={item}
                    onChange={this.chooseTemp}
                    value="1"
                  ></input>
                  <label className="form-check-label" htmlFor={item}>
                    &nbsp;{item}
                  </label>
                </div>
              );
            })}
          </>
        );
      } else if (
        this.state.comparisonInfo.choose_size_1 == 4 &&
        this.state.chooseTempName !== "冷固定"
      ) {
        this.state.chooseTempName = "冷固定";
        return (
          <div className="col-4 form-check">
            <input
              className="form-check-input order"
              type="radio"
              name="temperature"
              value="1"
              id="冷固定"
              onChange={this.chooseTemp}
              checked
            ></input>
            <label className="form-check-label">&nbsp;冷固定</label>
          </div>
        );
      } else if (
        this.state.comparisonInfo.choose_size_1 == 5 &&
        this.state.chooseTempName !== "熱固定"
      ) {
        this.state.chooseTempName = "熱固定";
        return (
          <div className="col-4 form-check">
            <input
              className="form-check-input order"
              type="radio"
              name="temperature"
              value="1"
              id="熱固定"
              onChange={this.chooseTemp}
              checked
            ></input>
            <label className="form-check-label">&nbsp;熱固定</label>
          </div>
        );
      }

      // 選擇XL
    } else if (temp == 3) {
      if (this.state.comparisonInfo.choose_size_2 == 1) {
        return this.state.coldTemp.map((item) => {
          return (
            <div className="col-4 form-check" key={item}>
              <input
                className="form-check-input order"
                type="radio"
                name="temperature"
                id={item}
                value="1"
                onChange={this.chooseTemp}
              ></input>
              <label className="form-check-label" htmlFor={item}>
                &nbsp;{item}
              </label>
            </div>
          );
        });
      } else if (this.state.comparisonInfo.choose_size_2 == 2) {
        return this.state.hotTemp.map((item) => {
          return (
            <div className="col-4 form-check" key={item}>
              <input
                className="form-check-input order"
                type="radio"
                name="temperature"
                id={item}
                value="1"
                onChange={this.chooseTemp}
              ></input>
              <label className="form-check-label" htmlFor={item}>
                &nbsp;{item}
              </label>
            </div>
          );
        });
      } else if (this.state.comparisonInfo.choose_size_2 == 3) {
        return (
          <>
            {this.state.coldTemp.map((item) => {
              return (
                <div className="col-4 form-check" key={item}>
                  <input
                    className="form-check-input order"
                    type="radio"
                    name="temperature"
                    id={item}
                    value="1"
                    onChange={this.chooseTemp}
                  ></input>
                  <label className="form-check-label" htmlFor={item}>
                    &nbsp;{item}
                  </label>
                </div>
              );
            })}
            {this.state.hotTemp.map((item) => {
              return (
                <div className="col-4 form-check" key={item}>
                  <input
                    className="form-check-input order"
                    type="radio"
                    name="temperature"
                    id={item}
                    onChange={this.chooseTemp}
                    value="1"
                  ></input>
                  <label className="form-check-label" htmlFor={item}>
                    &nbsp;{item}
                  </label>
                </div>
              );
            })}
          </>
        );
      } else if (
        this.state.comparisonInfo.choose_size_2 == 4 &&
        this.state.chooseTempName !== "冷固定"
      ) {
        this.state.chooseTempName = "冷固定";
        return (
          <div className="col-4 form-check">
            <input
              className="form-check-input order"
              type="radio"
              name="temperature"
              value="1"
              id="冷固定"
              onChange={this.chooseTemp}
              checked
            ></input>
            <label className="form-check-label">&nbsp;冷固定</label>
          </div>
        );
      } else if (
        this.state.comparisonInfo.choose_size_2 == 5 &&
        this.state.chooseTempName !== "熱固定"
      ) {
        this.state.chooseTempName = "熱固定";
        return (
          <div className="col-4 form-check">
            <input
              className="form-check-input order"
              type="radio"
              name="temperature"
              value="1"
              id="熱固定"
              onChange={this.chooseTemp}
              checked
            ></input>
            <label className="form-check-label">&nbsp;熱固定</label>
          </div>
        );
      }
    }
  };

  //選擇哪一個溫度
  chooseTemp = (e) => {
    let newState = { ...this.state };
    newState.chooseTempName = e.target.id;
    console.log(newState.chooseTempName);
    this.setState(newState);
  };

  // 選擇甜度
  sugars = () => {
    var sugarName = [
      this.state.sugars.sugar_0,
      this.state.sugars.sugar_1,
      this.state.sugars.sugar_3,
      this.state.sugars.sugar_4,
      this.state.sugars.sugar_5,
      this.state.sugars.sugar_6,
      this.state.sugars.sugar_7,
      this.state.sugars.sugar_8,
      this.state.sugars.sugar_9,
    ];
    console.log(sugarName);
    if (this.state.selectedProduct.choose_sugar == 1) {
      return [
        sugarName[0],
        sugarName[1],
        sugarName[2],
        sugarName[3],
        sugarName[4],
        sugarName[5],
      ].map((name, i) => {
        if (name) {
          return (
            <div className="col-4 form-check">
              <input
                className="form-check-input order"
                type="radio"
                name="sugariness"
                value="1"
                data-sugar={name}
                onChange={this.chooseSugar}
                id={`sugar${i}`}
              />
              <label className="form-check-label" htmlFor={`sugar${i}`}>
                &nbsp;{name}
              </label>
            </div>
          );
        }
      });
    } else if (this.state.selectedProduct.choose_sugar == 2) {
      return (
        <div className="col-4 form-check">
          <input
            className="form-check-input order"
            type="radio"
            name="sugariness"
            value="1"
            id={`sugar0`}
            data-sugar="甜度固定"
            onChange={this.chooseSugar}
          />
          <label className="form-check-label" htmlFor={`sugar0`}>
            &nbsp;甜度固定
          </label>
        </div>
      );
    } else if (this.state.selectedProduct.choose_sugar == 3) {
      return (
        <div className="col-4 form-check">
          <input
            className="form-check-input order"
            type="radio"
            name="sugariness"
            value="1"
            id={`sugar0`}
            data-sugar="無糖"
            onChange={this.chooseSugar}
          />
          <label className="form-check-label" htmlFor={`sugar0`}>
            &nbsp;僅限無糖
          </label>
        </div>
      );
    } else if (this.state.selectedProduct.choose_sugar == 4) {
      return [sugarName[0], sugarName[1]].map((name, i) => {
        return (
          <div className="col-4 form-check">
            <input
              className="form-check-input order"
              type="radio"
              name="sugariness"
              value="1"
              id={`sugar${i}`}
              data-sugar={name}
              onChange={this.chooseSugar}
            />
            <label className="form-check-label" htmlFor={`sugar${i}`}>
              &nbsp;{name}
            </label>
          </div>
        );
      });
    } else if (this.state.selectedProduct.choose_sugar == 5) {
      return [sugarName[0], sugarName[1], sugarName[2], sugarName[3]].map(
        (name, i) => {
          if (name) {
            return (
              <div className="col-4 form-check">
                <input
                  className="form-check-input order"
                  type="radio"
                  name="sugariness"
                  value="1"
                  id={`sugar${i}`}
                  data-sugar={name}
                  onChange={this.chooseSugar}
                />
                <label className="form-check-label" htmlFor={`sugar${i}`}>
                  &nbsp;{name}
                </label>
              </div>
            );
          }
        }
      );
    } else if (this.state.selectedProduct.choose_sugar == 6) {
      return [sugarName[3], sugarName[5]].map((name, i) => {
        return (
          <div className="col-4 form-check">
            <input
              className="form-check-input order"
              type="radio"
              name="sugariness"
              value="1"
              id={`sugar${i}`}
              data-sugar={name}
              onChange={this.chooseSugar}
            />
            <label className="form-check-label" htmlFor={`sugar${i}`}>
              &nbsp;{name}
            </label>
          </div>
        );
      });
    } else if (this.state.selectedProduct.choose_sugar == 7) {
      return [sugarName[6], sugarName[7], sugarName[8]].map((name, i) => {
        return (
          <div className="col-4 form-check">
            <input
              className="form-check-input order"
              type="radio"
              name="sugariness"
              value="1"
              id={`sugar${i}`}
              data-sugar={name}
              onChange={this.chooseSugar}
            />
            <label className="form-check-label" htmlFor={`sugar${i}`}>
              &nbsp;{name}
            </label>
          </div>
        );
      });
    }
  };

  //選擇哪一個甜度
  chooseSugar = (e) => {
    let newState = { ...this.state };
    newState.chooseSugarName = e.target.dataset.sugar;
    this.setState(newState);
  };

  // 點選按鈕所顯示的該商品 //點選商品會帶入的尺寸 溫度 甜度 訊息
  boxmenu = async (productId) => {
    // alert(1);
    // 根据商品ID從 modelInfo 中获取对应的商品信息
    var creatresulttemperaturesugar = await axios.get(
      `http://localhost:8000/order/create/${productId}`
    );
    // console.log(creatresulttemperaturesugar)
    var newState = { ...this.state };
    newState.selecttemperaturesugar = creatresulttemperaturesugar;
    // this.setState(newState);

    // 對話盒的產品名稱及圖片及品牌備註
    const Product = this.state.modelInfo.find(
      (product) => product.product_id === productId
    );
    var hotTemp = [];
    var coldTemp = [];
    const tempInfo =
      this.state.modelresulttemperaturesugar[1].temperature_choose;
    for (let i = 0; i < tempInfo.length; i++) {
      if (tempInfo[i] == 1) {
        coldTemp.push(tempInfo[i - 1]);
      } else if (tempInfo[i] == 2) {
        hotTemp.push(tempInfo[i - 1]);
      }
    }
    newState.hotTemp = hotTemp;
    newState.coldTemp = coldTemp;

    newState.selectedProduct = Product;
    // console.log(newState.selectedProduct);
    // 做比對的資料
    newState.comparisonInfo = {
      choose_size_0: Product.choose_size_0,
      choose_size_1: Product.choose_size_1,
      choose_size_2: Product.choose_size_2,
      choose_sugar: Product.choose_sugar,
      temperature_id: Product.temperature_id,
    };

    // var resultselectproduct = await axios.get(`http://localhost:8000/order/create/${this.state.selectedProduct.product_id}`);
    // // alert(JSON.stringify(resultselectproduct))

    this.setState(newState);
    console.log(this.state);
  };

  // //尺寸
  // size_change = (e) => {
  //     // console.log(e.target.dataset.temperatures);
  //     let newState = { ...this.state };
  //     newState.productEdit[8].cats_item.item_size = e.target.value;

  //     newState.productEdit[8].cats_item.item_price = Number(
  //         e.target.dataset.products_price
  //     );
  //     this.setState(newState);
  //     console.log(newState);
  //     // console.log(newState);
  // };

  //甜度
  // sugar_change = (e) => {
  //     //console.log(e.target.value);
  //     let newState = { ...this.state };
  //     newState.productEdit[8].cats_item.item_sugar = e.target.value;
  //     this.setState(newState);
  // };cartpay

  // //溫度
  // temperatures_change = (e) => {
  //     //console.log(e.target.value);
  //     let newState = { ...this.state };
  //     newState.productEdit[8].cats_item.item_temperatures = e.target.value;
  //     this.setState(newState);
  // };

  //複製揪團連結
  shareLink = (e) => {
    var copyText = document.getElementById("join-box-copy-text");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
  };

  // 消除所選的紀錄
  handleClick = (event) => {
    if (event.target.id === "exampleModal") {
      var formCheckInput = document.getElementsByClassName("form-check-input");
      for (var i = 0; i < formCheckInput.length; i++) {
        if (formCheckInput[i].checked) {
          formCheckInput[i].checked = false;
        }
      }
      event.preventDefault(); // 阻止默认事件
      this.setState({
        selectsize: 0,
        selectedPrice: 0, // 清除金額
        totalPrice: 0,
        item_quantity: 1,
      });
    }
  };
  //清除加入購物車內容
  handleCartOkClick = (event) => {
    var formCheckInput = document.getElementsByClassName("form-check-input");
    for (var i = 0; i < formCheckInput.length; i++) {
      if (formCheckInput[i].checked) {
        formCheckInput[i].checked = false;
      }
    }
    this.setState({
      selectsize: 0,
      selectedPrice: 0, // 清除金額
      totalPrice: 0,
      item_quantity: 1,
    });
  };

  // 加入購物車
  cartpay = async (e) => {
    let newState = { ...this.state };
    let serverData = {
      cart_id: this.state.cart_id,
      user_id: this.state.user_id, //req.params.userid
      user_name: this.state.user_name,
      brand_id: this.state.storeInfo.brand_id,
      branch_id: this.state.storeInfo.branch_id,
      product_id: this.state.selectedProduct.product_id,
      item_img: this.state.selectedProduct.product_img,
      item_name: this.state.selectedProduct.product_name,
      item_size: this.state.selectsize_name,
      item_sugar: this.state.chooseSugarName,
      item_temperatures: this.state.chooseTempName,
      item_price: this.state.selectsize_price, //un
      item_ingredient: this.state.ingredient.replace(/^、/, ""),
      ingredient_price: this.state.totalPrice - this.state.selectsize_price, //0
      item_quantity: this.state.item_quantity,
      total_price: this.state.totalPrice,
      updatetime: new Date(),
      createtime: new Date(),
    };
    console.log(serverData);
    if (
      serverData.item_size === undefined ||
      serverData.item_sugar === undefined ||
      serverData.item_temperatures === undefined
    ) {
      newState.successMessage = "加入購物車失敗 請選擇尺寸、甜度、溫度";
      this.setState(newState);
      this.handleShowToast();
      return;
    }
    newState.successMessage = "成功加入購物車";
    this.setState(newState);
    this.handleShowToast();
    let config = {
      headers: {
        "content-type": "application/json",
      },
    };

    if (this.props.match.params.userid) {
      let cartid = this.props.match.params.cartid;
      let userid = this.props.match.params.userid;
      serverData.cart_id = cartid;
      serverData.user_id = userid;
    }
    console.log("serverData", serverData);

    await axios.post("http://localhost:8000/cartorder", serverData, config);
  };
  handleSizeChange = (size, size_name, size_price) => {
    console.log("size_name", size_name);
    console.log("size_price", size_price);
    this.setState({
      selectsize_price: size_price,
      selectsize_name: size_name,
      selectsize: size,
      totalPrice: this.calculateTotalPrice(
        size,
        this.state.selectedIngredients
      ),
    });
  };

  // 處理配料的價格
  handleIngredientChange = (event) => {
    const ingredientKey = event.target.value;
    const isChecked = event.target.checked;
    const ingredientPrice = parseFloat(event.target.getAttribute("data-price"));
    const ingredientname = event.target.getAttribute("data-name");
    let newState = { ...this.state };

    if (event.target.checked) {
      newState.ingredient += `、` + ingredientname;
      this.setState(newState);
    } else {
      let remainingIngredients = newState.ingredient
        .split("、")
        .filter((item) => item !== ingredientname);

      newState.ingredient = remainingIngredients.toString().replace(/,/g, "、");
      console.log("ingredient", newState.ingredient);
      this.setState(newState);
      console.log("nochecked", remainingIngredients);
    }

    console.log("ingredient", newState.ingredient);

    console.log(ingredientname);

    this.setState((prevState) => {
      const updatedIngredients = {
        ...prevState.selectedIngredients,
        [ingredientKey]: { checked: isChecked, price: ingredientPrice },
      };

      // 更新總額
      const totalPrice = this.calculateTotalPrice(
        prevState.selectsize,
        updatedIngredients
      );

      return {
        selectedIngredients: updatedIngredients,
        totalPrice: totalPrice,
      };
    });
  };

  calculateTotalPrice = (selectedSize, selectedIngredients) => {
    let totalPrice = 0;
    let newState = { ...this.state };
    switch (selectedSize) {
      case 1:
        totalPrice += this.state.selectedProduct.products_price_0;

        break;
      case 2:
        totalPrice += this.state.selectedProduct.products_price_1;
        break;
      case 3:
        totalPrice += this.state.selectedProduct.products_price_2;
        break;
      default:
        break;
    }
    Object.keys(selectedIngredients).forEach((ingredient) => {
      if (selectedIngredients[ingredient].checked) {
        totalPrice += selectedIngredients[ingredient].price;
        // newState.ingredientSumPrice += selectedIngredients[ingredient].price;
        // this.setState(newState);
      }
    });

    // newState.sumPrice = totalPrice;
    // this.setState(newState);
    return totalPrice;
  };

  // 數量減少
  reduceCount = () => {
    let newState = { ...this.state };
    if (newState.item_quantity <= 1) {
      return;
    }
    newState.item_quantity -= 1;
    newState.sumPrice = newState.totalPrice * newState.item_quantity;
    newState.sumPrice = this.state.totalPrice * newState.item_quantity;
    this.setState(newState);
  };

  //數量增加
  addCount = () => {
    let newState = { ...this.state };
    newState.item_quantity += 1;
    newState.sumPrice = this.state.totalPrice * newState.item_quantity;
    this.setState(newState);
  };

  render() {
    //const { currentStep } = this.state;
    const brandInfo = this.state.brandInfo;
    const storeInfo = this.state.storeInfo;
    const day = new Date().getDay();
    const openTime = [
      storeInfo.Sun_start,
      storeInfo.Mon_start,
      storeInfo.Tue_start,
      storeInfo.Wed_start,
      storeInfo.Thu_start,
      storeInfo.Fri_start,
      storeInfo.Sat_start,
    ];
    const closeTime = [
      storeInfo.Sun_end,
      storeInfo.Mon_end,
      storeInfo.Tue_end,
      storeInfo.Wed_end,
      storeInfo.Thu_end,
      storeInfo.Fri_end,
      storeInfo.Sat_end,
    ];
    // if (this.state.resultModal !== null) {
    //     alert(JSON.stringify(this.state.resultModal));
    // }

    // alert(JSON.stringify(this.state.selectedProduct))

    return (
      <React.Fragment>
        {/* header */}
        <div
          id="header"
          style={{
            boxShadow: "1px 3px 10px #cccccc",
            marginBottom: "4px",
          }}
          className="d-flex justify-content-between"
        >
          <div className="col-7 col-sm-7 col-md-6 col-xl-5 d-flex ms-2 justify-content-between align-items-center">
            <div id="menu" className="col-8">
              <h2
                className="btn text-start  my-auto fs-4"
                onClick={this.toggleMenuNav}
              >
                ☰
              </h2>
            </div>
            <h4
              id="homeBtn"
              className="my-auto btn"
              onClick={() => {
                window.location = "/index";
              }}
            >
              <img
                id="logo"
                src="/img/index/LeDian_LOGO-05.png"
                alt="logo"
              ></img>
            </h4>
            <h4
              className="my-auto p-0 btn headerText menuBtn d-flex align-items-center justify-content-center"
              onClick={this.cartMenuClick}
            >
              <HiOutlineShoppingBag className="fs-4" />
              購物車
            </h4>
            <h4
              className="my-auto p-0 btn headerText menuBtn d-flex align-items-center justify-content-center"
              onClick={() => {
                window.location = "/brand";
              }}
            >
              <PiMedal className="fs-4" />
              品牌專區
            </h4>
            <h4
              className="my-auto p-0 btn headerText menuBtn d-flex align-items-center justify-content-center"
              onClick={this.pointinfoShow}
            >
              <PiCoins className="fs-4" />
              集點資訊
            </h4>
          </div>
          <div id="pointinfo">
            <button id="pointinfoclose" onClick={this.pointinfoHide}>
              <GiCancel className="fs-2 text-light" />
            </button>
            <h1>集點資訊</h1>
            <p>．每消費20元即可累積1點。</p>
            <p>．每點可折抵1元消費金額。</p>
            <p>．點數可在下次消費時折抵使用。</p>
            <p>．點數不可轉讓，不可兌換現金，不可合併使用。</p>
            <p>．本集點活動以公告為準，如有更改，恕不另行通知。</p>
          </div>

          <div className="d-flex me-2 align-items-center">
            {this.state.userData ? (
              <h4
                id="loginBtn"
                className="my-auto btn headerText text-nowrap"
                onClick={this.toggleMemberNav}
              >
                <img
                  id="memberHeadshot"
                  src={`/img/users/${this.state.userImg}`}
                  alt="memberHeadshot"
                  className="img-fluid my-auto mx-1 rounded-circle border"
                />
                會員專區▼
              </h4>
            ) : (
              <h4
                id="loginBtn"
                className="my-auto btn headerText align-self-center"
                onClick={this.toggleMemberNav}
              >
                登入/註冊
              </h4>
            )}

            <div id="memberNav" className="collapse">
              <div className="p-2">
                <h4
                  className="headerText text-center my-2"
                  onClick={() => {
                    window.location = "/profile";
                  }}
                >
                  會員中心
                </h4>
                <hr />
                <h4
                  className="headerText text-center my-2"
                  onClick={this.logoutClick}
                >
                  登出
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div
          id="menuNav"
          className="menuNav d-flex flex-column align-items-center"
        >
          <h4
            className="menuText my-3 mainColor border-bottom border-secondary"
            onClick={this.cartMenuClick}
          >
            <HiOutlineShoppingBag className="fs-4" />
            購物車
          </h4>
          <h4
            className="menuText my-3 mainColor border-bottom border-secondary"
            onClick={() => {
              window.location = "/brand";
            }}
          >
            <PiMedal className="fs-4" />
            品牌專區
          </h4>
          <h4
            className="menuText my-3 mainColor border-bottom border-secondary"
            onClick={this.pointinfoShow}
          >
            <PiCoins className="fs-4" />
            集點資訊
          </h4>
        </div>
        {/* 電腦版banner */}
        <div className="row computer">
          <div className="col-12">
            <img
              src={`/img/storebanner/${brandInfo.brand_id}.png`}
              alt="bannerImg"
              className="banner"
            ></img>
          </div>
        </div>

        {/* 手機版banner */}
        <div className="row phone">
          <div className="col-12">
            <img
              src={`/img/storebannermin/${brandInfo.brand_id}.png`}
              alt="bannerImg"
              className="bannermin"
            ></img>
          </div>
        </div>

        {/* 商店資訊 */}

        <div className="row storeBox">
          <div className="col-3 storeBox">
            <div className="row">
              <div className="col-1"></div>
              <div className="col-3">
                <img
                  src={`/img/logo/${brandInfo.brand_id}.png`}
                  className="storeBoxLogo"
                  alt="brandLogo"
                ></img>
              </div>

              <div
                className="col-7 buy btn"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#exampleModaljoin"
                id="joinjoin"
              >
                {/* <BsPeopleFill className="fs-4 my-auto text-center me-3 joinjoin" /> */}
                <h3 className="buytext my-auto text-center"> 揪團訂購 </h3>
              </div>
              <div className="col-1"></div>
            </div>
            <div className="row textstore">
              <div className="col-12 textstore">
                <h4 className="storeTitle">
                  {brandInfo.brand_name} {storeInfo.branch_name}
                </h4>
              </div>
              <div className="col-12 textstore">
                <p className="storeContent">
                  營業時間:{openTime[day] == "店休" ? "店休" : openTime[day]}~
                  {closeTime[day] == "店休" ? "店休" : closeTime[day]}
                </p>
              </div>
              <div className="col-12 textstore">
                <p className="storeContent">
                  聯絡電話: {storeInfo.branch_phone}
                </p>
              </div>
              <div className="col-12 textstore">
                <p className="storeContent">地址: {storeInfo.branch_address}</p>
              </div>
            </div>
          </div>
          <div className="col-10"></div>
        </div>

        {/* 揪團對話盒 */}
        <div
          className="modal fade join"
          id="exampleModaljoin"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content join join-box">
              <div className="modal-header d-flex justify-content-center pb-0 border-0">
                <h5 className="modal-title text-title-b" id="exampleModaljoin">
                  揪團分享！
                </h5>
              </div>
              <div className="modal-body">
                <div className="row d-flex flex-column justify-content-between">
                  <div className="col-12 text-center">
                    <input
                      id="join-box-copy-text"
                      className="text-des p-2 border-0 join-box-input"
                      type="text"
                      readOnly
                      value={`http://localhost:3000/order/${this.props.match.params.id}/${this.state.cart_id}/${this.state.user_id}`}
                      onChange={this.change_test}
                    />
                  </div>
                  <div className="col-12 text-center my-3">
                    <button
                      type="button"
                      className="btn-continue text-title p-3"
                      onClick={this.shareLink}
                    >
                      揪團分享！ 複製連結
                    </button>
                  </div>
                  <div className="col-12 mt-3">
                    <div className="row">
                      <div className="col-6 pe-0 d-flex justify-content-end">
                        <QRCodeCanvas value="https://order.nidin.shop/gb/men" />
                      </div>
                      <div className="col-6 px-0">
                        <img src="/img/users/LeDian.png" alt="brand-logo" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 菜單 */}
        <div className="menu">
          <div className="boxMenu">
            {/* 按鈕 */}
            <div className="container">
              {/* 第一段 */}
              {this.state.categoriesList.map((category) => {
                return (
                  <React.Fragment key={category.category_id}>
                    <div className="row">
                      <h3 className="title1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-suit-heart-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1" />
                        </svg>
                        &nbsp;{category.category_name}
                      </h3>
                      <div className="link-top"></div>
                    </div>
                    <div className="row drink">
                      {this.state.productList.map((product) => {
                        if (product.category_id == category.category_id) {
                          return (
                            <div
                              className="col-lg-3 drink col-md-6 drink button btn btn-outline-warning"
                              type="button"
                              data-bs-toggle="modal"
                              key={product.product_id}
                              id={product.product_id}
                              data-bs-target="#exampleModal"
                              onClick={() => {
                                this.boxmenu(product.product_id);
                              }}
                            >
                              <div className="row">
                                <div className="col-8 button ">
                                  <div className="row">
                                    <h3 className="buttonTitle">
                                      {product.product_name}
                                    </h3>
                                    <div className="row text">
                                      <div className="col-5">
                                        <p className="buttonPrics col">
                                          $
                                          {product.products_price_0
                                            ? product.products_price_0
                                            : product.products_price_1}
                                        </p>
                                      </div>
                                      <div className="col-2"></div>
                                      <div className="col-5">
                                        {(product.choose_size_0 == 1) |
                                        (product.choose_size_0 == 3) |
                                        (product.choose_size_0 == 4) |
                                        (product.choose_size_1 == 1) |
                                        (product.choose_size_1 == 3) |
                                        (product.choose_size_1 == 4) |
                                        (product.choose_size_2 == 1) |
                                        (product.choose_size_2 == 3) |
                                        (product.choose_size_0 == 4) ? (
                                          <img
                                            src={"/img/icon/snowflake.png"}
                                            className="cold"
                                            alt="cold"
                                          ></img>
                                        ) : null}
                                        {(product.choose_size_0 == 2) |
                                        (product.choose_size_0 == 3) |
                                        (product.choose_size_0 == 5) |
                                        (product.choose_size_1 == 2) |
                                        (product.choose_size_1 == 3) |
                                        (product.choose_size_1 == 5) |
                                        (product.choose_size_2 == 2) |
                                        (product.choose_size_2 == 3) |
                                        (product.choose_size_0 == 5) ? (
                                          <img
                                            src={"/img/icon/hotsale.png"}
                                            className="hot"
                                            alt="hot"
                                          ></img>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4 product">
                                  <div className="row">
                                    <div className="col-12">
                                      <img
                                        src={`/img/drinksimg/${product.product_img}.png`}
                                        className="productImg"
                                        alt="productImg"
                                      ></img>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}{" "}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* 對話盒Modal */}
        <div
          className="modal fade "
          id="exampleModal"
          onClick={this.handleClick}
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg ">
            <div className="modal-content join">
              <div className="modal-body">
                <div className="modal-body">
                  <div className="container-fluid">
                    {this.state.resultModal && (
                      <div className="row">
                        <div className="col-6 modaltop">
                          <h3 className="modalTitle">
                            {this.state.selectedProduct.product_name}
                          </h3>
                        </div>
                        <div className="col-6 modaltop"></div>
                      </div>
                    )}

                    {this.state.resultModal && (
                      <div className="row">
                        <div className="col-md-5">
                          {/* 左側上方圖片 */}
                          <div className="row">
                            <div className="col-12 menuproductImg">
                              <img
                                src={`/img/class/${this.state.selectedProduct.product_img}.png`}
                                className="menuproductImg"
                                alt="productImg"
                              ></img>
                            </div>
                            <div className="col-12 Text">
                              <div className="alert alert-warning" role="alert">
                                <p className="notetext">
                                  {this.state.selectedProduct.brand_note}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-7 modalRight">
                          {/* 右側尺寸 */}
                          <div className="row sizetitle">
                            <div className="col-4 text">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-star-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                              </svg>
                              尺寸
                            </div>
                            <div className="col-4"></div>
                            <div className="col-4"></div>
                          </div>

                          {/* 尺寸選項 */}
                          {this.state.modelproductsize && (
                            <div className="row sizecheck">
                              {this.state.selectedProduct.products_price_0 ? (
                                <div className="col-4 form-check">
                                  <input
                                    className="form-check-input order "
                                    type="radio"
                                    name="size"
                                    id="medium"
                                    value={
                                      this.state.modelproductsize.size_0_name
                                    }
                                    onChange={() =>
                                      this.handleSizeChange(
                                        1,
                                        this.state.modelproductsize.size_0_name,
                                        this.state.selectedProduct
                                          .products_price_0
                                      )
                                    }
                                  ></input>
                                  <label
                                    className="form-check-label"
                                    for="medium"
                                  >
                                    {this.state.modelproductsize.size_0_name}
                                    &nbsp;$
                                    {
                                      this.state.selectedProduct
                                        .products_price_0
                                    }
                                  </label>
                                </div>
                              ) : null}

                              {this.state.selectedProduct.products_price_1 ? (
                                <div className="col-4 form-check">
                                  <input
                                    className="form-check-input order"
                                    type="radio"
                                    name="size"
                                    id="large"
                                    value="large"
                                    data-price={
                                      this.state.selectedProduct
                                        .products_price_1
                                    }
                                    onChange={() =>
                                      this.handleSizeChange(
                                        2,
                                        this.state.modelproductsize.size_1_name,
                                        this.state.selectedProduct
                                          .products_price_1
                                      )
                                    }
                                  ></input>
                                  <label
                                    className="form-check-label"
                                    for="large"
                                  >
                                    {this.state.modelproductsize.size_1_name}
                                    &nbsp;$
                                    {
                                      this.state.selectedProduct
                                        .products_price_1
                                    }
                                  </label>
                                </div>
                              ) : null}
                              {this.state.selectedProduct.products_price_2 ? (
                                <div className="col-4 form-check">
                                  <input
                                    className="form-check-input order"
                                    type="radio"
                                    name="size"
                                    id="extraLarge"
                                    value="size"
                                    onChange={() =>
                                      this.handleSizeChange(
                                        3,
                                        this.state.modelproductsize.size_2_name,
                                        this.state.selectedProduct
                                          .products_price_2
                                      )
                                    }
                                  ></input>
                                  <label
                                    className="form-check-label"
                                    for="extraLarge"
                                  >
                                    {this.state.modelproductsize.size_2_name}
                                    &nbsp;$
                                    {
                                      this.state.selectedProduct
                                        .products_price_2
                                    }
                                  </label>
                                </div>
                              ) : null}
                            </div>
                          )}

                          <div className="row temperaturetitle">
                            {/* 溫度 */}
                            <div className="col-4 text">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-star-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                              </svg>
                              溫度
                            </div>
                            <div className="col-4"></div>
                            <div className="col-4"></div>
                          </div>

                          <div className="row temperaturecheck">
                            {/* 溫度選項 */}
                            {this.showTemp(this.state.selectsize)}
                            {/* <div className="col-4 form-check">
                                                        <input className="form-check-input order" type="radio" name="temperature" id="lessIce" value="1"></input>
                                                        <label className="form-check-label" for="flexRadioDefault1">&nbsp;少冰</label>
                                                    </div>
                                                    <div className="col-4 form-check">
                                                        <input className="form-check-input order" type="radio" name="temperature" id="low" value="2"></input>
                                                        <label className="form-check-label" for="flexRadioDefault1">&nbsp;微冰</label>
                                                    </div>
                                                    <div className="col-4 form-check">
                                                        <input className="form-check-input order" type="radio" name="temperature" id="noIce" value="3"></input>
                                                        <label className="form-check-label" for="flexRadioDefault1">&nbsp;去冰</label>
                                                    </div>
                                                    <div className="col-4 form-check">
                                                        <input className="form-check-input order" type="radio" name="temperature" id="normal" value="4"></input>
                                                        <label className="form-check-label" for="flexRadioDefault1">&nbsp;正常</label>
                                                    </div>
                                                    <div className="col-4 form-check">
                                                        <input className="form-check-input order" type="radio" name="temperature" id="roomTemperature" value="5"></input>
                                                        <label className="form-check-label" for="flexRadioDefault1">&nbsp;溫</label>
                                                    </div>
                                                    <div className="col-4 form-check">
                                                        <input className="form-check-input order" type="radio" name="temperature" id="hot" value="6"></input>
                                                        <label className="form-check-label" for="flexRadioDefault1">&nbsp;熱</label>
                                                    </div> */}
                          </div>

                          <div className="row sugarinesstitle">
                            {/* 甜度 */}
                            <div className="col-4 text">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-star-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                              </svg>
                              甜度
                            </div>
                            <div className="col-4"></div>
                            <div className="col-4"></div>
                          </div>

                          <div className="row sugarinesscheck">
                            {/* 甜度選項 */}
                            {/* {this.sugars()}; */}

                            {this.sugars()}
                            {/* <div className="col-4 form-check">
                                                                    <input className="form-check-input order" type="radio" name="sugariness" value="1" />
                                                                    <label className="form-check-label" htmlFor="lessSugar">&nbsp;無糖</label>
                                                                </div>
                                                                <div className="col-4 form-check">
                                                                    <input className="form-check-input order" type="radio" name="sugariness" value="2" />
                                                                    <label className="form-check-label" htmlFor="halfSugar">&nbsp;一分糖</label>
                                                                </div>
                                                                <div className="col-4 form-check">
                                                                    <input className="form-check-input order" type="radio" name="sugariness" value="3" />
                                                                    <label className="form-check-label" htmlFor="standard">&nbsp;二分糖</label>
                                                                </div>
                                                                <div className="col-4 form-check">
                                                                    <input className="form-check-input order" type="radio" name="sugariness" value="3" />
                                                                    <label className="form-check-label" htmlFor="standard">&nbsp;微糖</label>
                                                                </div>
                                                                <div className="col-4 form-check">
                                                                    <input className="form-check-input order" type="radio" name="sugariness" value="3" />
                                                                    <label className="form-check-label" htmlFor="standard">&nbsp;半糖</label>
                                                                </div>
                                                                <div className="col-4 form-check">
                                                                    <input className="form-check-input order" type="radio" name="sugariness" id="standard" value="3" />
                                                                    <label className="form-check-label" htmlFor="standard">&nbsp;少糖</label>
                                                                </div>
                                                                <div className="col-4 form-check">
                                                                    <input className="form-check-input order" type="radio" name="sugariness" id="standard" value="3" />
                                                                    <label className="form-check-label" htmlFor="standard">&nbsp;正常糖</label>
                                                                </div> */}
                          </div>

                          <div className="row sugarinesstitle">
                            {/* 配料 */}
                            <div className="col-4 text">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-star-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                              </svg>
                              配料
                            </div>
                            <div className="col-4"></div>
                            <div className="col-4"></div>
                          </div>
                          {
                            // 拿取商品資料
                            this.state.modelproductingredients &&
                              // 判斷是否可以加配料
                              (this.state.selectedProduct.choose_ingredient ===
                              1 ? (
                                <div className="row sugarinesscheck">
                                  {/* 配料選項 */}
                                  {/* 判斷是否有這個配料 */}
                                  {this.state.modelproductingredients
                                    .ingredient_0 && (
                                    <div className="col-6 form-check">
                                      <input
                                        className="form-check-input order"
                                        type="checkbox"
                                        name="ingredients"
                                        id="ing0"
                                        value="0"
                                        data-price={
                                          this.state.modelproductingredients
                                            .ingredient_price_0
                                        }
                                        data-name={
                                          this.state.modelproductingredients
                                            .ingredient_0
                                        }
                                        onChange={this.handleIngredientChange}
                                      ></input>
                                      <label
                                        className="form-check-label"
                                        htmlFor="ing0"
                                      >
                                        &nbsp;
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_0
                                        }{" "}
                                        $
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_price_0
                                        }
                                      </label>
                                    </div>
                                  )}

                                  {/* 判斷是否有這個配料 */}
                                  {this.state.modelproductingredients
                                    .ingredient_1 && (
                                    <div className="col-6 form-check">
                                      <input
                                        className="form-check-input order"
                                        type="checkbox"
                                        name="ingredients"
                                        id="ing1"
                                        value="1"
                                        data-price={
                                          this.state.modelproductingredients
                                            .ingredient_price_1
                                        }
                                        data-name={
                                          this.state.modelproductingredients
                                            .ingredient_1
                                        }
                                        onChange={this.handleIngredientChange}
                                      ></input>
                                      <label
                                        className="form-check-label"
                                        htmlFor="ing1"
                                      >
                                        &nbsp;
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_1
                                        }{" "}
                                        $
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_price_1
                                        }
                                      </label>
                                    </div>
                                  )}

                                  {/* 判斷是否有這個配料 */}
                                  {this.state.modelproductingredients
                                    .ingredient_2 && (
                                    <div className="col-6 form-check">
                                      <input
                                        className="form-check-input order"
                                        type="checkbox"
                                        name="ingredients"
                                        id="ing2"
                                        value="2"
                                        data-name={
                                          this.state.modelproductingredients
                                            .ingredient_2
                                        }
                                        data-price={
                                          this.state.modelproductingredients
                                            .ingredient_price_2
                                        }
                                        onChange={this.handleIngredientChange}
                                      ></input>
                                      <label
                                        className="form-check-label"
                                        htmlFor="ing2"
                                      >
                                        &nbsp;
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_2
                                        }{" "}
                                        $
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_price_2
                                        }
                                      </label>
                                    </div>
                                  )}

                                  {this.state.modelproductingredients
                                    .ingredient_3 && (
                                    <div className="col-6 form-check">
                                      <input
                                        className="form-check-input order"
                                        type="checkbox"
                                        name="ingredients"
                                        id="ing3"
                                        value="3"
                                        data-price={
                                          this.state.modelproductingredients
                                            .ingredient_price_3
                                        }
                                        data-name={
                                          this.state.modelproductingredients
                                            .ingredient_3
                                        }
                                        onChange={this.handleIngredientChange}
                                      ></input>
                                      <label
                                        className="form-check-label"
                                        htmlFor="ing3"
                                      >
                                        &nbsp;
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_3
                                        }{" "}
                                        $
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_price_3
                                        }
                                      </label>
                                    </div>
                                  )}

                                  {this.state.modelproductingredients
                                    .ingredient_4 && (
                                    <div className="col-6 form-check">
                                      <input
                                        className="form-check-input order"
                                        type="checkbox"
                                        name="ingredients"
                                        id="ing4"
                                        value="4"
                                        data-price={
                                          this.state.modelproductingredients
                                            .ingredient_price_4
                                        }
                                        data-name={
                                          this.state.modelproductingredients
                                            .ingredient_4
                                        }
                                        onChange={this.handleIngredientChange}
                                      ></input>
                                      <label
                                        className="form-check-label"
                                        htmlFor="ing4"
                                      >
                                        &nbsp;
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_4
                                        }{" "}
                                        $
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_price_4
                                        }
                                      </label>
                                    </div>
                                  )}

                                  {this.state.modelproductingredients
                                    .ingredient_5 && (
                                    <div className="col-6 form-check">
                                      <input
                                        className="form-check-input order"
                                        type="checkbox"
                                        name="ingredients"
                                        id="ing5"
                                        value="5"
                                        data-price={
                                          this.state.modelproductingredients
                                            .ingredient_price_5
                                        }
                                        data-name={
                                          this.state.modelproductingredients
                                            .ingredient_5
                                        }
                                        onChange={this.handleIngredientChange}
                                      ></input>
                                      <label
                                        className="form-check-label"
                                        htmlFor="ing5"
                                      >
                                        &nbsp;
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_5
                                        }{" "}
                                        $
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_price_5
                                        }
                                      </label>
                                    </div>
                                  )}

                                  {this.state.modelproductingredients
                                    .ingredient_6 && (
                                    <div className="col-6 form-check">
                                      <input
                                        className="form-check-input order"
                                        type="checkbox"
                                        name="ingredients"
                                        id="ing6"
                                        value="6"
                                        data-price={
                                          this.state.modelproductingredients
                                            .ingredient_price_6
                                        }
                                        data-name={
                                          this.state.modelproductingredients
                                            .ingredient_6
                                        }
                                        onChange={this.handleIngredientChange}
                                      ></input>
                                      <label
                                        className="form-check-label"
                                        htmlFor="ing6"
                                      >
                                        &nbsp;
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_6
                                        }{" "}
                                        $
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_price_6
                                        }
                                      </label>
                                    </div>
                                  )}

                                  {this.state.modelproductingredients
                                    .ingredient_7 && (
                                    <div className="col-6 form-check">
                                      <input
                                        className="form-check-input order"
                                        type="checkbox"
                                        name="ingredients"
                                        id="ing7"
                                        value="7"
                                        data-price={
                                          this.state.modelproductingredients
                                            .ingredient_price_7
                                        }
                                        data-name={
                                          this.state.modelproductingredients
                                            .ingredient_7
                                        }
                                        onChange={this.handleIngredientChange}
                                      ></input>
                                      <label
                                        className="form-check-label"
                                        htmlFor="ing7"
                                      >
                                        &nbsp;
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_7
                                        }{" "}
                                        $
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_price_7
                                        }
                                      </label>
                                    </div>
                                  )}

                                  {this.state.modelproductingredients
                                    .ingredient_8 && (
                                    <div className="col-6 form-check">
                                      <input
                                        className="form-check-input order"
                                        type="checkbox"
                                        name="ingredients"
                                        id="ing8"
                                        value="8"
                                        data-price={
                                          this.state.modelproductingredients
                                            .ingredient_price_8
                                        }
                                        data-name={
                                          this.state.modelproductingredients
                                            .ingredient_8
                                        }
                                        onChange={this.handleIngredientChange}
                                      ></input>
                                      <label
                                        className="form-check-label"
                                        htmlFor="ing8"
                                      >
                                        &nbsp;
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_8
                                        }{" "}
                                        $
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_price_8
                                        }
                                      </label>
                                    </div>
                                  )}

                                  {this.state.modelproductingredients
                                    .ingredient_9 && (
                                    <div className="col-6 form-check">
                                      <input
                                        className="form-check-input order"
                                        type="checkbox"
                                        name="ingredients"
                                        id="ing9"
                                        value="9"
                                        data-price={
                                          this.state.modelproductingredients
                                            .ingredient_price_9
                                        }
                                        data-name={
                                          this.state.modelproductingredients
                                            .ingredient_9
                                        }
                                        onChange={this.handleIngredientChange}
                                      ></input>
                                      <label
                                        className="form-check-label"
                                        htmlFor="ing9"
                                      >
                                        &nbsp;
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_9
                                        }{" "}
                                        $
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_price_9
                                        }
                                      </label>
                                    </div>
                                  )}

                                  {this.state.modelproductingredients
                                    .ingredient_10 && (
                                    <div className="col-6 form-check">
                                      <input
                                        className="form-check-input order"
                                        type="checkbox"
                                        name="ingredients"
                                        id="ing10"
                                        value="10"
                                        data-price={
                                          this.state.modelproductingredients
                                            .ingredient_price_10
                                        }
                                        data-name={
                                          this.state.modelproductingredients
                                            .ingredient_10
                                        }
                                        onChange={this.handleIngredientChange}
                                      ></input>
                                      <label
                                        className="form-check-label"
                                        htmlFor="ing10"
                                      >
                                        &nbsp;
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_10
                                        }{" "}
                                        $
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_price_10
                                        }
                                      </label>
                                    </div>
                                  )}

                                  {this.state.modelproductingredients
                                    .ingredient_11 && (
                                    <div className="col-4 form-check">
                                      <input
                                        className="form-check-input order"
                                        type="checkbox"
                                        name="ingredients"
                                        id="ing11"
                                        value="11"
                                        data-price={
                                          this.state.modelproductingredients
                                            .ingredient_price_11
                                        }
                                        data-name={
                                          this.state.modelproductingredients
                                            .ingredient_11
                                        }
                                        onChange={this.handleIngredientChange}
                                      ></input>
                                      <label
                                        className="form-check-label"
                                        htmlFor="ing11"
                                      >
                                        &nbsp;
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_11
                                        }{" "}
                                        $
                                        {
                                          this.state.modelproductingredients
                                            .ingredient_price_11
                                        }
                                      </label>
                                    </div>
                                  )}
                                </div>
                              ) : null)
                          }
                        </div>
                      </div>
                    )}

                    <div className="row footer">
                      <div className="col-6 modaltop">
                        金額 :{" "}
                        {this.state.totalPrice * this.state.item_quantity} 元
                      </div>

                      <div className="col-6 modaltop">
                        <div className="row price">
                          <div className="col-4">
                            <button
                              type="button"
                              onClick={this.reduceCount}
                              className="btn add btn-outline-warning"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-dash-lg"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="col-4 text-center">
                            <div className="price">
                              {this.state.item_quantity}
                            </div>
                          </div>
                          <div className="col-4 text-center">
                            <button
                              type="button"
                              className="btn add btn-outline-warning"
                              onClick={this.addCount}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-plus-lg"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-grid gap-2 col-8 mx-auto">
                    <button
                      className="btn btn-outline-warning btn-primary cartpay"
                      type="button"
                      data-bs-dismiss="modal"
                      onClick={() => {
                        this.cartpay();
                        this.handleCartOkClick();
                      }}
                    >
                      加入購物車
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Toast
            show={this.state.showToast}
            className="order-toast"
            onClose={() => this.setState({ showToast: false })}
            delay={7000} // 7 秒后自动隐藏
            aria-label="Close"
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
            }}
          >
            <Toast.Header>
              <strong className="me-auto">
                <h5 className="textcart fw-bolder">
                  {" "}
                  {brandInfo.brand_name}{" "}
                  {this.state.selectedProduct.product_name}{" "}
                </h5>{" "}
              </strong>
              {/* <small>11 mins ago</small> */}
            </Toast.Header>
            <Toast.Body>
              <h5>{this.state.successMessage}</h5>
            </Toast.Body>
          </Toast>
        </div>
        {/* footer */}
        <div id="footer" className="d-flex">
          <div id="footerLogo" className="col-3">
            <img
              id='"footerImg"'
              className="img-fluid"
              src={"/img/index/LeDian_LOGO-04.png"}
              alt="footerLogo"
            />
          </div>
          <div className="col-6 d-flex align-items-center">
            <div id="footerlink" className="col-2 d-flex flex-column">
              <div className="d-flex">
                <div>
                  <img
                    className="img-fluid"
                    src={"/img/index/facebook.png"}
                    alt="fackbook"
                  />
                </div>
                <div>
                  <img
                    className="img-fluid"
                    src={"/img/index/instagram.png"}
                    alt="instagram"
                  />
                </div>
                <div>
                  <img
                    className="img-fluid"
                    src={"/img/index/line.png"}
                    alt="line"
                  />
                </div>
              </div>
              <p className="text-white text-nowrap footerText">
                信箱: ledian.tw@gmail.com
              </p>
            </div>
          </div>
          <div
            id="footerInfo"
            className="col-3 d-flex row align-items-center justify-content-center"
          >
            <div className="col-3 col-sm-6 d-flex flex-column align-items-center">
              <p className="footerText m-0 py-1 text-nowrap text-white">
                意見回饋
              </p>
              <p className="footerText m-0 py-1 text-nowrap text-white">
                常見問題
              </p>
            </div>
            <div className="col-4 col-sm-6 d-flex flex-column align-items-start">
              <p className="footerText m-0 py-1 text-nowrap text-white">
                使用者條款
              </p>
              <p className="footerText m-0 py-1 text-nowrap text-white">
                隱私權條款
              </p>
              <p className="footerText m-0 py-1 text-nowrap text-white">
                信用卡條款
              </p>
            </div>
          </div>
        </div>

        {/* 購物車吐司訊息 */}
        {/* <button type="button" className="btn btn-primary" id="liveToastBtn">Show live toast</button>

            <div className="position-fixed bottom-0 end-0 p-3">
                <div id="liveToast" className="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <img src="..." className="rounded me-2" alt="...">
                            <strong className="me-auto">Bootstrap</strong>
                            <small>11 mins ago</small>
                            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </img>
                    </div>
                    <div className="toast-body">
                        Hello, world! This is a toast message.
                    </div>
                </div>
            </div> */}
      </React.Fragment>
    ); // end of redner()
  }

  // boxmenu = function (e) {
  //     console.log(e)
  // }

  // toastEl = function() {
  //     var toastElList = [].slice.call(document.querySelectorAll('.toast'))
  //     var toastList = toastElList.map(function (toastEl) {
  //       return new bootstrap.Toast(toastEl, option)
  //     })
  // }

  pointinfoShow = (event) => {
    document.getElementById("pointinfo").style.top = event.clientY + 50 + "px";
    document.getElementById("pointinfo").style.left =
      event.clientX - 150 + "px";
  };

  pointinfoHide = (event) => {
    document.getElementById("pointinfo").style.top = "-500px";
    event.cancelBubble = true;
  };

  toggleMemberNav = () => {
    const userdata = localStorage.getItem("userdata");
    if (userdata) {
      document.getElementById("memberNav").classList.toggle("collapse");
    } else {
      const path = this.props.location.pathname;
      sessionStorage.setItem("redirect", path);
      window.location = "/login";
    }
  };
  toggleMenuNav = () => {
    document.getElementById("menuNav").classList.toggle("menuNav");
  };
  logoutClick = async () => {
    // 清除localStorage
    localStorage.removeItem("userdata");
    const userdata = localStorage.getItem("userdata");
    //console.log("現在的:", userdata);
    try {
      // 告訴後台使用者要登出
      await axios.post("http://localhost:8000/logout");

      //   window.location = '/logout'; // 看看登出要重新定向到哪個頁面
    } catch (error) {
      console.error("登出時出錯:", error);
    }

    document.getElementById("memberNav").classList.add("collapse");
    this.setState({});
    window.location = "/index";
  };

  cartMenuClick = () => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (userData) {
      const userId = userData.user_id;
      window.location = `/cartlist/${userId}`;
    } else {
      window.location = "/login";
    }
  };
}

export default order;
