import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "../css/headerAndFooter.css";
import "../css/cart.css";
import { FaRegTrashAlt, FaPencilAlt } from "react-icons/fa";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import swal from "sweetalert";
// import ReactDOM from "react-dom";
import { QRCodeCanvas } from "qrcode.react";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { PiMedal } from "react-icons/pi";
import { PiCoins } from "react-icons/pi";
import { GiCancel } from "react-icons/gi";
import DateTimePicker from "./dateTimePicker";
import axios from "axios";

class cartPay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size_choose: "",
      selectedDate: "",
      currentStep: 1,
      showPointerItem: false,
      bag_isChecked: false,
      discount_isChecked: false,
      remainingPoints: 20, //剩餘點數
      usePoninter: 0,
      bagQuantity: 0,
      quantity: 0,
      sumPrice: 0,
      lastPrice: 0,
      payMethod: 1,
      receipt: 1,
      dbcarts: [
        {
          brand_id: "2",
          branch_name: "",
          branch_address: "",
          branch_phone: "",
          brand_name: "",
          item_img: "1_5",
          item_ingredient: "",
          item_id: 1,
          item_sugar: "",
          item_price: "",
          total_price: "",
        },
      ],

      pickupInfo: { personName: "JHEN", personPhone: "0912345432" },
      memo: "",
      uniform: "",
      vehicle: "",
      productEdit: [
        { size_choose: [] },
        { temperature_choose: [] },
        { sugar_choose: [] },
        { ingredient: [] },
        { brand_note: "" },
        { catrs_index: 0 },
        {},
        //商品資訊
        {
          product: {
            product_name: "水之森玄米抹茶",
            product_img: "1_1",
            choose_sugar: 1,
            choose_ingredient: 1,
            products_price_0: 0,
            products_price_1: 45,
            products_price_2: 0,
          },
        },
        //商品明細
        {
          cats_item: {
            item_size: "M",
            item_sugar: "正常",
            item_temperatures_range: "",
            item_temperatures: "",
            item_ingredient: [],
            item_price: 0,
            ingredient_price: 0,
            item_quantity: 1,
            total_price: 0,
          },
        },
      ],

      productCkeck: {
        size: "",
        temperatures: "",
        sugar: "",
      },
    };
  }

  nextStep = () => {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep + 1 });
    console.log(currentStep);

    if (currentStep !== 2) {
      const progressBar = document.getElementById("progressbar");
      const steps = progressBar.querySelectorAll("li");
      if (currentStep !== 3) {
        steps[currentStep].classList.add("active");
      } else {
        steps[currentStep - 1].classList.add("active");
      }
    }
    console.log(this.state);
  };

  previousStep = () => {
    const { currentStep } = this.state;
    if (currentStep > 1) {
      this.setState({ currentStep: currentStep - 1 });
    }
    // this.sendMessageToParent();
  };

  togglePointerItem = () => {
    this.setState((prevState) => ({
      showPointerItem: !prevState.showPointerItem,
    }));
  };
  pointerDiscount = () => {
    let newState;
    newState = this.state;
    newState.discount_isChecked = !newState.discount_isChecked;
    console.log(newState);
    // if(newState.discount_isChecked){

    // }
    this.setState(newState);
  };

  //複製揪團連結
  shareLink = (e) => {
    var copyText = document.getElementById("join-box-copy-text");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
  };

  pointerChange = (e) => {
    if (e.target.value > this.state.remainingPoints) {
      swal({
        title: "已超過可用點數",
        icon: "warning",
        // buttons: true,
        dangerMode: true,
      });
      return;
    }
    //是否超過單筆金額
    // if(e.target.value > this.state.dbcarts){

    // }
    let newState = { ...this.state };
    newState.usePoninter = e.target.value === "" ? 0 : e.target.value;
    newState.lastPrice = newState.sumPrice - newState.usePoninter;
    this.setState(newState);
  };

  //購物袋計算
  shoppingBag = () => {
    let newState;
    newState = this.state;
    newState.bag_isChecked = !newState.bag_isChecked;

    //計算袋子數量
    let num = 0;
    if (newState.bag_isChecked) {
      newState.dbcarts.forEach((item) => {
        num += item.item_quantity;
      });
    } else {
      newState.lastPrice = newState.lastPrice - newState.bagQuantity * 2;
      this.setState(newState);
      return;
    }
    newState.bagQuantity = Math.ceil(num / 4);
    newState.lastPrice = newState.lastPrice + newState.bagQuantity * 2;
    this.setState(newState);
  };

  //取貨人姓名、電話
  name_change = (e) => {
    let newState = { ...this.state };
    newState.pickupInfo.personName = e.target.value;
    this.setState(newState);
  };
  name_check = () => {
    let newState = { ...this.state };
    let rules = new RegExp(/^[^\d_\W]+$/);

    newState.pickupInfo.personName = rules.test(newState.pickupInfo.personName)
      ? newState.pickupInfo.personName
      : "";
    if (!newState.pickupInfo.personName) {
      swal({
        title: "請填入正確的姓名",
        icon: "warning",
        // buttons: true,
        dangerMode: true,
      });
    }
    this.setState(newState);
  };

  phone_change = (e) => {
    let newState = { ...this.state };
    newState.pickupInfo.personPhone = e.target.value;
    this.setState(newState);
  };
  phone_check = () => {
    let newState = { ...this.state };
    let rules = new RegExp(/^09\d{8}/);

    newState.pickupInfo.personPhone = rules.test(
      newState.pickupInfo.personPhone
    )
      ? newState.pickupInfo.personPhone
      : "";
    if (!newState.pickupInfo.personPhone) {
      swal({
        title: "請填入正確的電話號碼",
        icon: "warning",
        // buttons: true,
        dangerMode: true,
      });
    }
    this.setState(newState);
  };

  name_phone_check = () => {
    if (
      this.state.pickupInfo.personName === "" ||
      this.state.pickupInfo.personPhone === ""
    ) {
      swal({
        title: "請將取貨人資訊填寫完整",
        icon: "warning",
        // buttons: true,
        dangerMode: true,
      });
      return;
    }
    this.nextStep();
  };

  //備註
  memo_change = (e) => {
    let newState = { ...this.state };
    newState.memo = e.target.value;
    this.setState(newState);
  };

  //發票
  uniform_change = (e) => {
    let newState = { ...this.state };
    newState.uniform = e.target.value;
    this.setState(newState);
  };

  //統一標號
  vehicle_change = (e) => {
    let newState = { ...this.state };
    newState.vehicle = e.target.value;
    this.setState(newState);
  };

  //檢查是否選取時間
  checkedTime = () => {
    if (!this.state.selectedDate) {
      // swal("請選取取貨時間");
      swal({
        title: "請選取取貨時間",
        icon: "warning",
        // buttons: true,
        dangerMode: true,
      });
      return;
    }
    this.nextStep();
  };

  //選取時間
  getTimeValue = (time) => {
    let newState = { ...this.state.selectedDate };
    newState.selectedDate = time;
    // let Month=newState.selectedDate.getMo
    let year = newState.selectedDate.getFullYear();
    let month = (newState.selectedDate.getMonth() + 1)
      .toString()
      .padStart(2, 0);
    let date = newState.selectedDate.getDate().toString().padStart(2, 0);
    let hours = newState.selectedDate.getHours().toString().padStart(2, 0);
    let minutes = newState.selectedDate.getMinutes().toString().padStart(2, 0);
    let seconds = newState.selectedDate.getSeconds().toString().padStart(2, 0);
    newState.pickupTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    this.setState(newState);
  };

  //提交訂單
  handleButtonClick = async () => {
    let newSate = { ...this.state };
    let detailsdata;
    detailsdata = newSate.dbcarts.map((item) => {
      return {
        // orders_id:item.,
        details_name: item.item_name,
        details_size: item.item_size,
        details_sugar: item.item_sugar,
        details_mperatures: item.item_temperatures,
        details_ingredient: item.item_ingredient,
        details_amount: item.total_price,
        details_quantity: item.item_quantity,
        details_total: item.total_price * item.item_quantity,
        updatetime: new Date(),
        createtime: new Date(),
      };
    });

    //datails迴圈整理
    let serverData = {
      user_id: 1,
      branch_id: 1,
      orders_total: this.state.lastPrice,
      orders_bag: this.state.bag_isChecked ? 1 : 0,
      orders_bag_num: this.state.bagQuantity,
      usePoninter: Number(this.state.usePoninter),
      terms_of_payment: Number(this.state.payMethod),
      invoicing_method: Number(this.state.vehicle),
      orders_pick_up: this.state.pickupTime,
      orders_status: 1,
      payment_status: Number(this.state.payMethod) === 1 ? 1 : 2,
      updatetime: new Date(),
      createtime: new Date(),
      details: detailsdata,
    };
    this.nextStep();
    // console.log("serverData:", serverData);
    let config = {
      headers: {
        "content-type": "application/json",
      },
    };
    console.log(serverData);
    await axios.post(
      "http://localhost:8000/cartPay",
      JSON.stringify(serverData),
      config
    );

    //   // //串接linepay
    // await axios.post(
    //   "http://localhost:8000/test0231/783743",
    //   JSON.stringify(serverData),
    //   config
    // );
    // };
  };

  ///訂單確認
  //付款方式
  payMethod_change = (e) => {
    let newSate = { ...this.state };
    // console.log(newSate);
    newSate.payMethod = Number(e.target.value);
    // console.log(newSate.payMethod);
    this.setState(newSate);
    // console.log(this.state);
  };

  //發票
  receipt_change = (e) => {
    let newSate = { ...this.state };
    newSate.receipt = e.target.value;
    this.setState(newSate);
    // console.log(this.state.receipt);
  };

  //商品編輯
  product_edit = async (id, index) => {
    console.log(id);
    // alert(index);
    let newSate = { ...this.state };
    let result = await axios.get(`http://localhost:8000/itemedit/${id}`);
    newSate.dbcarts.item_id = id;
    newSate.productEdit = result.data;
    newSate.productEdit[5].catrs_index = index;
    console.log("productEdit:", newSate.productEdit);
    this.setState(newSate);
  };

  //尺寸
  size_change = (e) => {
    // console.log(e.target.dataset.temperatures);
    let newState = { ...this.state };
    newState.productEdit[8].cats_item.item_size = e.target.value;

    newState.productEdit[8].cats_item.item_price = Number(
      e.target.dataset.products_price
    );
    this.setState(newState);
    console.log(newState);
    // console.log(newState);
  };
  //甜度
  sugar_change = (e) => {
    // console.log(e.target.value);
    let newState = { ...this.state };
    newState.productEdit[8].cats_item.item_sugar = e.target.value;
    this.setState(newState);
  };
  //溫度
  temperatures_change = (e) => {
    // console.log(e.target.value);
    let newState = { ...this.state };
    newState.productEdit[8].cats_item.item_temperatures = e.target.value;
    this.setState(newState);
  };
  //配料
  ingredient_change = (e) => {
    // console.log(e.target.checked);
    let newState = { ...this.state };
    let ingredient_price = Number(e.target.dataset.price);
    if (e.target.checked) {
      let newIngredient =
        newState.productEdit[8].cats_item.item_ingredient +
        `、${e.target.value}`;
      newState.productEdit[8].cats_item.item_ingredient = newIngredient;

      newState.productEdit[8].cats_item.ingredient_price += ingredient_price;
      newState.productEdit[8].cats_item.total_price =
        newState.productEdit[8].cats_item.item_price +
        newState.productEdit[8].cats_item.ingredient_price;

      this.setState(newState);
    } else {
      let removedIngredient = e.target.value;
      let remainingIngredients =
        newState.productEdit[8].cats_item.item_ingredient
          .split("、")
          .filter((item) => item !== removedIngredient);

      console.log(remainingIngredients);
      newState.productEdit[8].cats_item.item_ingredient =
        remainingIngredients.join("、");
      newState.productEdit[8].cats_item.ingredient_price -= ingredient_price;
      newState.productEdit[8].cats_item.total_price =
        newState.productEdit[8].cats_item.item_price +
        newState.productEdit[8].cats_item.ingredient_price;
      this.setState(newState);
    }
  };

  //數量增加
  add_quantity = () => {
    let newState = { ...this.state };
    newState.productEdit[8].cats_item.item_quantity += 1;
    this.setState(newState);
  };

  // 數量減少
  reduce_quantity = () => {
    let newState = { ...this.state };
    if (newState.productEdit[8].cats_item.item_quantity <= 1) {
      return;
    }
    newState.productEdit[8].cats_item.item_quantity -= 1;
    this.setState(newState);
  };

  update_cart = async (index) => {
    alert("更新" + index);
    let newState = { ...this.state };

    //更新畫面
    newState.dbcarts[index].item_quantity =
      this.state.productEdit[8].cats_item.item_quantity;
    newState.dbcarts[index].item_size =
      this.state.productEdit[8].cats_item.item_size;
    newState.dbcarts[index].item_sugar =
      this.state.productEdit[8].cats_item.item_sugar;
    newState.dbcarts[index].item_ingredient =
      this.state.productEdit[8].cats_item.item_ingredient;
    newState.dbcarts[index].total_price =
      this.state.productEdit[8].cats_item.item_price +
      this.state.productEdit[8].cats_item.ingredient_price;

    let quantity = 0;
    let sumPrice = 0;
    newState.dbcarts.forEach((item) => {
      console.log("item", item);
      quantity += Number(item.item_quantity);
      sumPrice += item.total_price * item.item_quantity;
    });
    console.log(quantity);

    newState.quantity = quantity;
    newState.sumPrice = sumPrice;
    newState.lastPrice = sumPrice;

    console.log("new", newState);
    this.setState(newState);

    let item_sum = 0;
    let price_sum = 0;
    newState.dbcarts.forEach((item) => {
      item_sum += item.item_quantity;
      price_sum += item.total_price * item.item_quantity;
    });
    console.log(item_sum);
    newState.quantity = item_sum;
    newState.sumPrice = price_sum;
    newState.lastPrice =
      price_sum - this.state.usePoninter + this.state.bagQuantity * 2;

    //寫入資料庫
    let serverData = {
      item_quantity: this.state.productEdit[8].cats_item.item_quantity,
      item_size: this.state.productEdit[8].cats_item.item_size,
      item_sugar: this.state.productEdit[8].cats_item.item_sugar,
      item_ingredient: this.state.productEdit[8].cats_item.item_ingredient,
      ingredient_price: this.state.productEdit[8].cats_item.ingredient_price,
      item_price: this.state.productEdit[8].cats_item.item_price,
      total_price: this.state.productEdit[8].cats_item.total_price,
    };
    let config = {
      headers: {
        "content-type": "application/json",
      },
    };
    console.log(this.state.dbcarts[index].item_id);
    await axios.patch(
      `http://localhost:8000/itemedit/${this.state.dbcarts[index].item_id}`,
      serverData,
      config
    );
  };

  //刪除商品
  product_delete = async (itemid, index) => {
    console.log(itemid);
    console.log(index);
    let newState = { ...this.state };
    if (newState.dbcarts.length === 1) {
      alert("已無法再減少商品了");
      return;
    }
    newState.dbcarts.splice(index, 1);
    let quantity = 0;
    let sumPrice = 0;
    newState.dbcarts.forEach((item) => {
      console.log("item", item);
      quantity += Number(item.item_quantity);
      sumPrice += item.total_price * item.item_quantity;
    });
    newState.quantity = quantity;
    newState.sumPrice = sumPrice;
    newState.lastPrice = sumPrice;
    let item_sum = 0;
    let price_sum = 0;
    newState.dbcarts.forEach((item) => {
      item_sum += item.item_quantity;
      price_sum += item.total_price * item.item_quantity;
    });
    newState.quantity = item_sum;
    newState.sumPrice = price_sum;
    newState.lastPrice =
      price_sum - this.state.usePoninter + this.state.bagQuantity * 2;
    this.setState(newState);
    await axios.delete("http://localhost:8000/itemdelete/" + itemid);
  };
  render() {
    const { currentStep } = this.state;
    return (
      <React.Fragment>
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
            <h4 className="my-auto p-0 btn headerText menuBtn d-flex align-items-center justify-content-center">
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
            {this.loginCheck()}
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

        <div className="body-bg">
          {/* <React.Fragment> */}
          <div className="container  ">
            <div className="row ps-3 pe-3">
              <div className="col">
                <ul
                  className="d-flex justify-content-md-center justify-content-between p-0 test"
                  id="progressbar"
                >
                  <li className="active d-flex flex-column" id="step1">
                    <strong className="pt-2">確認明細</strong>
                  </li>
                  <li
                    className="d-flex flex-column align-items-center"
                    id="step2"
                  >
                    <strong className="pt-2">付款方式</strong>
                  </li>
                  <li
                    className="d-flex flex-column align-items-end justify-content"
                    id="step3"
                  >
                    <strong className="pt-2">完成訂購</strong>
                  </li>
                </ul>
              </div>
              <div>
                <form>
                  {currentStep === 1 && (
                    <React.Fragment>
                      <fieldset className="row mx-auto detail p-3 py-5">
                        <div className="col mx-auto check-details pt-5">
                          <div className="row d-flex justify-content-between justify-content-center-md align-items-center">
                            <div className="col-auto d-none d-md-block">
                              <img
                                className="mainproduct-img"
                                src={`/img/mainproduct/${this.state.dbcarts[0].brand_id}.png`}
                                alt="mainproduct-img"
                              />
                            </div>
                            <div className="col-8 col-md-5">
                              <h1 className="text-title">
                                {`${this.state.dbcarts[0].brand_name} (${this.state.dbcarts[0].branch_name})`}
                              </h1>
                              <p className="text-des mb-0 pt-2">
                                {this.state.dbcarts[0].branch_address}
                              </p>
                              <p className="text-des mb-0 pt-2">
                                {this.state.dbcarts[0].branch_phone}
                              </p>
                            </div>
                            <div className="col-auto col-md-2 d-flex justify-content-center align-items-center">
                              <button
                                type="button"
                                className="d-flex flex-column align-items-center btn-join"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModaljoinbox"
                                onClick={this.shareLink}
                              >
                                <img
                                  className="icon-join"
                                  src="/img/icon/add-friend 1.png"
                                  alt="add-friend"
                                />
                                <span>揪團</span>
                              </button>
                            </div>
                            <div
                              className="modal fade"
                              id="exampleModaljoinbox"
                              tabIndex="-1"
                              aria-labelledby="exampleModaljoinbox"
                              aria-hidden="true"
                            >
                              <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content join-box">
                                  <div className="modal-header d-flex justify-content-center pb-0 border-0">
                                    <h5
                                      className="modal-title text-title-b"
                                      id="exampleModaljoinbox"
                                    >
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
                                          value={`http://localhost:3000/cartPay/${this.props.match.params.id}`}
                                          onChange={this.change_test}
                                        />
                                      </div>
                                      <div className="col-12 text-center my-3">
                                        <button
                                          type="button"
                                          className="btn-continue text-title p-3"
                                          // onClick="linkShare()"
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
                                            <img
                                              src="/img/icon/logo.png"
                                              alt="brand-logo"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row d-flex justify-content-center mt-5">
                            <div className="col-12">
                              <label className="text-title" htmlFor="time">
                                取貨時間<span className="star-must">*</span>
                              </label>
                            </div>
                            <div className="col mt-3">
                              <DateTimePicker
                                key={this.state.keyForDateTimePicker}
                                onTime={this.getTimeValue}
                                message={this.state.selectedDate}
                                branch={
                                  this.state.dbcarts.length > 0
                                    ? this.state.dbcarts[0].branch_id
                                    : null
                                }
                              />
                            </div>
                          </div>
                          <div className="row d-flex flex-column mt-5">
                            <div className="col-12">
                              <h2 className="text-title">訂單內容</h2>
                            </div>

                            {this.state.dbcarts.map((item, i) => {
                              return (
                                <div className="col mt-3" key={i}>
                                  <div className="row d-flex align-items-center">
                                    <div className="col-md-3 col-6 text-end">
                                      <img
                                        className="product-img"
                                        src={`/img/class/${item.item_img}.png`}
                                        alt="drink-img"
                                      />
                                    </div>
                                    <div className="col-5">
                                      <h2 className="text-des">
                                        {item.item_name}
                                      </h2>
                                      <p className="mb-0 text-des-small">
                                        {item.item_temperatures}/
                                        {item.item_sugar}
                                      </p>
                                      <p>
                                        {item.item_ingredient !== ""
                                          ? item.item_ingredient.replace(
                                              "、",
                                              "/"
                                            )
                                          : ""}
                                      </p>
                                    </div>
                                    <div className="col">
                                      <div className="row d-flex align-items-end justify-content-center">
                                        <div className="col d-flex justify-content-around align-items-center">
                                          <p className="text-des mb-0">
                                            ${item.total_price}
                                          </p>
                                          <p className="text-des mb-0">
                                            x{item.item_quantity}
                                          </p>
                                          <button
                                            type="button"
                                            className="btn-delete"
                                            onClick={() => {
                                              this.product_delete(
                                                item.item_id,
                                                i
                                              );
                                            }}
                                          >
                                            <FaRegTrashAlt className="trash" />
                                          </button>
                                          <button
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModaledit"
                                            type="button"
                                            className="btn-edit"
                                            onClick={() => {
                                              this.product_edit(
                                                item.item_id,
                                                i
                                              );
                                            }}
                                          >
                                            <span>
                                              <FaPencilAlt className="pencil" />
                                            </span>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <hr className="mt-2 hr-line" />
                                </div>
                              );
                            })}
                          </div>

                          {/* 對話盒Modal */}
                          <div
                            className="modal fade"
                            id="exampleModaledit"
                            tabIndex="-1"
                            aria-labelledby="exampleModaledit"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog modal-lg ">
                              <div className="modal-content">
                                <div className="modal-body">
                                  <div className="modal-body">
                                    <div className="container-fluid">
                                      <div className="row">
                                        <div className="col-6 modaltop">
                                          <h3 className="modalTitle">
                                            {
                                              this.state.productEdit[7].product
                                                .product_name
                                            }
                                          </h3>
                                        </div>
                                        <div className="col-6 modaltop"></div>
                                      </div>
                                      <div className="row">
                                        <div className="col-md-5">
                                          {/* 左側上方圖片 */}
                                          <div className="row">
                                            <div className="col-12">
                                              <img
                                                src={`/img/class/${this.state.productEdit[7].product.product_img}.png`}
                                                className="clasImg"
                                                alt="productimg"
                                              ></img>
                                            </div>
                                            <div className="col-12 Text">
                                              <div
                                                className="alert alert-warning"
                                                role="alert"
                                              >
                                                {
                                                  this.state.productEdit[5]
                                                    .brand_note
                                                }
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-7 modalRight">
                                          {/* 右側尺寸 */}
                                          <div className="row sizetitle">
                                            <div className="col text">
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
                                          <div className="row sizecheck">
                                            {/* 尺寸選項 */}
                                            {this.state.productEdit[0].size_choose.map(
                                              (item, i) => {
                                                if (item.size) {
                                                  if (
                                                    item.size ===
                                                    this.state.productEdit[8]
                                                      .cats_item.item_size
                                                  ) {
                                                    this.state.productEdit[8].cats_item.item_temperatures_range =
                                                      item.temperatures;
                                                  }
                                                  return (
                                                    <div
                                                      className="col-4 form-check"
                                                      key={i}
                                                    >
                                                      <input
                                                        className="form-check-input square"
                                                        type="radio"
                                                        name="size"
                                                        id="medium"
                                                        value={item.size}
                                                        data-temperatures={
                                                          item.temperatures
                                                        }
                                                        data-products_price={
                                                          item.products_price
                                                        }
                                                        onChange={
                                                          this.size_change
                                                        }
                                                        checked={
                                                          item.size ===
                                                          this.state
                                                            .productEdit[8]
                                                            .cats_item.item_size
                                                            ? "checked"
                                                            : ""
                                                        }
                                                      ></input>
                                                      <label
                                                        className="form-check-label"
                                                        htmlFor="medium"
                                                      >
                                                        &nbsp;{item.size}
                                                      </label>
                                                    </div>
                                                  );
                                                } else {
                                                  return null;
                                                }
                                              }
                                            )}
                                          </div>

                                          <div className="row temperaturetitle">
                                            {/* 溫度 */}
                                            <div className="col text">
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
                                            {this.state.productEdit[8].cats_item
                                              .item_temperatures_range ===
                                              1 && (
                                              <React.Fragment>
                                                {/* a.filter((item)=>  !item.includes('冰') ) */}
                                                {this.state.productEdit[1].temperature_choose
                                                  .filter(
                                                    (item) =>
                                                      !item.includes("溫") &&
                                                      !item.includes("熱") &&
                                                      item !== ""
                                                  )
                                                  .map((t, i) => {
                                                    return (
                                                      <div
                                                        className="col-4 form-check"
                                                        key={i}
                                                      >
                                                        <input
                                                          className="form-check-input square"
                                                          type="radio"
                                                          name="temperature"
                                                          id="lessIce"
                                                          value={t}
                                                          checked={
                                                            t ===
                                                            this.state
                                                              .productEdit[8]
                                                              .cats_item
                                                              .item_temperatures
                                                              ? "checked"
                                                              : ""
                                                          }
                                                          onChange={
                                                            this
                                                              .temperatures_change
                                                          }
                                                        ></input>
                                                        <label
                                                          className="form-check-label"
                                                          htmlFor="flexRadioDefault1"
                                                        >
                                                          &nbsp;{t}
                                                        </label>
                                                      </div>
                                                    );
                                                  })}
                                              </React.Fragment>
                                            )}
                                            {this.state.productEdit[8].cats_item
                                              .item_temperatures_range ===
                                              2 && (
                                              <React.Fragment>
                                                {/* a.filter((item)=>  !item.includes('冰') ) */}
                                                {this.state.productEdit[1].temperature_choose
                                                  .filter(
                                                    (item) =>
                                                      !item.includes("冰") &&
                                                      item !== ""
                                                  )
                                                  .map((t, i) => {
                                                    return (
                                                      <div
                                                        className="col-4 form-check"
                                                        key={i}
                                                      >
                                                        <input
                                                          className="form-check-input square"
                                                          type="radio"
                                                          name="temperature"
                                                          id="lessIce"
                                                          value={t}
                                                          checked={
                                                            t ===
                                                            this.state
                                                              .productEdit[8]
                                                              .cats_item
                                                              .item_temperatures
                                                              ? "checked"
                                                              : ""
                                                          }
                                                          onChange={
                                                            this
                                                              .temperatures_change
                                                          }
                                                        ></input>
                                                        <label
                                                          className="form-check-label"
                                                          htmlFor="flexRadioDefault1"
                                                        >
                                                          &nbsp;{t}
                                                        </label>
                                                      </div>
                                                    );
                                                  })}
                                              </React.Fragment>
                                            )}

                                            {this.state.productEdit[8].cats_item
                                              .item_temperatures_range ===
                                              3 && (
                                              <React.Fragment>
                                                {this.state.productEdit[1].temperature_choose.map(
                                                  (item, i) => {
                                                    if (item) {
                                                      return (
                                                        <div
                                                          className="col-4 form-check"
                                                          key={i}
                                                        >
                                                          <input
                                                            className="form-check-input square"
                                                            type="radio"
                                                            name="temperature"
                                                            id="lessIce"
                                                            value={item}
                                                            checked={
                                                              item ===
                                                              this.state
                                                                .productEdit[8]
                                                                .cats_item
                                                                .item_temperatures
                                                                ? "checked"
                                                                : ""
                                                            }
                                                            onChange={
                                                              this
                                                                .temperatures_change
                                                            }
                                                          ></input>
                                                          <label
                                                            className="form-check-label"
                                                            htmlFor="flexRadioDefault1"
                                                          >
                                                            &nbsp;{item}
                                                          </label>
                                                        </div>
                                                      );
                                                    } else {
                                                      return null;
                                                    }
                                                  }
                                                )}
                                              </React.Fragment>
                                            )}

                                            {this.state.productEdit[8].cats_item
                                              .item_temperatures_range ===
                                              4 && (
                                              <div className="col-4 form-check">
                                                <input
                                                  className="form-check-input square"
                                                  type="radio"
                                                  name="temperature"
                                                  id="lessIce"
                                                  value="固定冷"
                                                  checked
                                                  readOnly
                                                ></input>
                                                <label
                                                  className="form-check-label"
                                                  htmlFor="flexRadioDefault1"
                                                >
                                                  &nbsp;{"固定冷"}
                                                </label>
                                              </div>
                                            )}

                                            {this.state.productEdit[8].cats_item
                                              .item_temperatures_range ===
                                              5 && (
                                              <div className="col-4 form-check">
                                                <input
                                                  className="form-check-input square"
                                                  type="radio"
                                                  name="temperature"
                                                  id="lessIce"
                                                  value="固定熱"
                                                  checked
                                                  readOnly
                                                ></input>
                                                <label
                                                  className="form-check-label"
                                                  htmlFor="flexRadioDefault1"
                                                >
                                                  &nbsp;{"固定熱"}
                                                </label>
                                              </div>
                                            )}
                                          </div>

                                          <div className="row sugarinesstitle">
                                            {/* 甜度 */}
                                            <div className="col text">
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
                                            {this.state.productEdit[7].product
                                              .choose_sugar === 1 &&
                                              this.state.productEdit[2].sugar_choose.map(
                                                (item, i) => {
                                                  if (item) {
                                                    return (
                                                      <div
                                                        className="col-4 form-check"
                                                        key={i}
                                                      >
                                                        <input
                                                          className="form-check-input square"
                                                          type="radio"
                                                          name="sugariness"
                                                          id="lessSugar"
                                                          value={item}
                                                          onChange={
                                                            this.sugar_change
                                                          }
                                                          checked={
                                                            item ===
                                                            this.state
                                                              .productEdit[8]
                                                              .cats_item
                                                              .item_sugar
                                                              ? "checked"
                                                              : ""
                                                          }
                                                        ></input>
                                                        <label
                                                          className="form-check-label"
                                                          htmlFor="flexRadioDefault1"
                                                        >
                                                          &nbsp;{item}
                                                        </label>
                                                      </div>
                                                    );
                                                  } else {
                                                    return null;
                                                  }
                                                }
                                              )}

                                            {this.state.productEdit[7].product
                                              .choose_sugar === 2 && (
                                              <div className="col-4 form-check">
                                                <input
                                                  className="form-check-input square"
                                                  type="radio"
                                                  name="sugariness"
                                                  id="lessSugar"
                                                  value="甜度固定"
                                                ></input>
                                                <label
                                                  className="form-check-label"
                                                  htmlFor="flexRadioDefault1"
                                                >
                                                  &nbsp;甜度固定
                                                </label>
                                              </div>
                                            )}
                                            {this.state.productEdit[7].product
                                              .choose_sugar === 3 && (
                                              <div className="col-4 form-check">
                                                <input
                                                  className="form-check-input square"
                                                  type="radio"
                                                  name="sugariness"
                                                  id="lessSugar"
                                                  value="無糖"
                                                ></input>
                                                <label
                                                  className="form-check-label"
                                                  htmlFor="flexRadioDefault1"
                                                >
                                                  &nbsp;無糖
                                                </label>
                                              </div>
                                            )}

                                            {this.state.productEdit[7].product
                                              .choose_sugar === 4 &&
                                              this.state.productEdit[2].sugar_choose
                                                .slice(1)
                                                .map((item, i) => {
                                                  if (item) {
                                                    return (
                                                      <div
                                                        className="col-4 form-check"
                                                        key={i}
                                                      >
                                                        <input
                                                          className="form-check-input square"
                                                          type="radio"
                                                          name="sugariness"
                                                          id="lessSugar"
                                                          value={item}
                                                          onChange={
                                                            this.sugar_change
                                                          }
                                                          checked={
                                                            item ===
                                                            this.state
                                                              .productEdit[8]
                                                              .cats_item
                                                              .item_sugar
                                                              ? "checked"
                                                              : ""
                                                          }
                                                        ></input>
                                                        <label
                                                          className="form-check-label"
                                                          htmlFor="flexRadioDefault1"
                                                        >
                                                          &nbsp;{item}
                                                        </label>
                                                      </div>
                                                    );
                                                  } else {
                                                    return null;
                                                  }
                                                })}

                                            {this.state.productEdit[7].product
                                              .choose_sugar === 5 &&
                                              this.state.productEdit[2].sugar_choose
                                                .slice(0, 5)
                                                .map((item, i) => {
                                                  if (item) {
                                                    return (
                                                      <div
                                                        className="col-4 form-check"
                                                        key={i}
                                                      >
                                                        <input
                                                          className="form-check-input square"
                                                          type="radio"
                                                          name="sugariness"
                                                          id="lessSugar"
                                                          value={item}
                                                          onChange={
                                                            this.sugar_change
                                                          }
                                                          checked={
                                                            item ===
                                                            this.state
                                                              .productEdit[8]
                                                              .cats_item
                                                              .item_sugar
                                                              ? "checked"
                                                              : ""
                                                          }
                                                        ></input>
                                                        <label
                                                          className="form-check-label"
                                                          htmlFor="flexRadioDefault1"
                                                        >
                                                          &nbsp;{item}
                                                        </label>
                                                      </div>
                                                    );
                                                  } else {
                                                    return null;
                                                  }
                                                })}

                                            {this.state.productEdit[7].product
                                              .choose_sugar === 6 &&
                                              this.state.productEdit[2].sugar_choose
                                                .filter(
                                                  (item, i) =>
                                                    i === 4 || i === 6
                                                )
                                                .map((item, i) => {
                                                  if (item) {
                                                    return (
                                                      <div
                                                        className="col-4 form-check"
                                                        key={i}
                                                      >
                                                        <input
                                                          className="form-check-input square"
                                                          type="radio"
                                                          name="sugariness"
                                                          id="lessSugar"
                                                          value={item}
                                                          onChange={
                                                            this.sugar_change
                                                          }
                                                          checked={
                                                            item ===
                                                            this.state
                                                              .productEdit[8]
                                                              .cats_item
                                                              .item_sugar
                                                              ? "checked"
                                                              : ""
                                                          }
                                                        ></input>
                                                        <label
                                                          className="form-check-label"
                                                          htmlFor="flexRadioDefault1"
                                                        >
                                                          &nbsp;{item}
                                                        </label>
                                                      </div>
                                                    );
                                                  } else {
                                                    return null;
                                                  }
                                                })}
                                          </div>
                                          <div className="row sugarinesstitle">
                                            {/* 配料 */}
                                            <div className="col text">
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
                                          <div className="row sugarinesscheck">
                                            {/* 配料選項 */}

                                            {this.state.productEdit[3].ingredient.map(
                                              (item, i) => {
                                                if (item.ingredient_choose) {
                                                  let item_ingredient_ary =
                                                    this.state.productEdit[8].cats_item.item_ingredient.split(
                                                      "、"
                                                    );
                                                  // console.log(
                                                  //   item_ingredient_ary
                                                  // );
                                                  return (
                                                    <div
                                                      className="col-6 form-check"
                                                      key={i}
                                                    >
                                                      <input
                                                        className="form-check-input square"
                                                        type="checkbox"
                                                        name="ingredients"
                                                        id="grass"
                                                        value={
                                                          item.ingredient_choose
                                                        }
                                                        data-price={
                                                          item.ingredient_price
                                                        }
                                                        checked={
                                                          item_ingredient_ary.includes(
                                                            item.ingredient_choose
                                                          )
                                                            ? "checked"
                                                            : ""
                                                        }
                                                        onChange={
                                                          this.ingredient_change
                                                        }
                                                      ></input>
                                                      <label
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault1"
                                                      >
                                                        &nbsp;
                                                        {item.ingredient_choose}
                                                        <span>+</span>
                                                        {item.ingredient_price}
                                                      </label>
                                                    </div>
                                                  );
                                                } else {
                                                  return null;
                                                }
                                              }
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row footer">
                                        <div className="col-6 modaltop  ">
                                          總金額 :
                                          {this.state.productEdit[8].cats_item
                                            .item_price +
                                            this.state.productEdit[8].cats_item
                                              .ingredient_price}
                                          元
                                        </div>
                                        <div className="col-6 text-">
                                          <div className="row price">
                                            <div className="col-4">
                                              <button
                                                type="button"
                                                className="btn add btn-outline-warning"
                                                onClick={this.reduce_quantity}
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
                                                {
                                                  this.state.productEdit[8]
                                                    .cats_item.item_quantity
                                                }
                                              </div>
                                            </div>
                                            <div className="col-4 text-center">
                                              <button
                                                type="button"
                                                className="btn add btn-outline-warning"
                                                onClick={this.add_quantity}
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
                                        className="btn btn-outline-warning"
                                        type="button"
                                        onClick={() => {
                                          this.update_cart(
                                            this.state.productEdit[5]
                                              .catrs_index
                                          );
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

                          <div className="row d-flex mt-5">
                            <div className="col-10">
                              <h4 className="text-title">點數折扣</h4>
                            </div>
                            <div className="col-10 mt-3 ms-3">
                              <input
                                className="input_box"
                                name="pointer"
                                type="checkbox"
                                id="pointer"
                                checked={this.state.discount_isChecked}
                                onChange={this.pointerDiscount}
                              />

                              <label className="text-des" htmlFor="pointer">
                                使用點數折抵
                              </label>
                            </div>
                            {this.state.discount_isChecked && (
                              <div className="col-10 d-flex flex-column align-items-start pointer-item ">
                                <input
                                  className="mt-3 ms-3 form-control"
                                  type="text"
                                  value={this.state.usePoninter}
                                  onChange={this.pointerChange}
                                />
                                <p className="mt-3 ps-3 text-des star-must mb-0">
                                  可用點數:{this.state.remainingPoints}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="row d-flex mt-5">
                            <div className="col-10">
                              <h4 className="text-title">提袋選購</h4>
                            </div>
                            <div className="col-10 mt-3 ms-3">
                              <input
                                className="input_box"
                                name="bag "
                                type="checkbox"
                                id="bag"
                                checked={this.state.bag_isChecked}
                                onChange={this.shoppingBag}
                              />
                              <label className="text-des" htmlFor="bag">
                                加購塑膠袋
                              </label>
                            </div>
                          </div>
                          <div className="row d-flex mt-5">
                            <div className="col-10">
                              <h4 className="text-title">訂單匯總</h4>
                            </div>
                            <div className="col-10 d-flex mt-3 ms-3">
                              <div className="col d-flex">
                                <p className="text-des">商品</p>
                                <p className="text-des">
                                  <span>x</span>
                                  {this.state.quantity}
                                </p>
                              </div>
                              <div className="col text-end">
                                <p className="text-des">
                                  <span>$</span>
                                  {this.state.sumPrice}
                                </p>
                              </div>
                            </div>
                            {this.state.bag_isChecked && (
                              <div className="col-10 d-flex mt-2 ms-3">
                                <div className="col d-flex">
                                  <p className="text-des">塑膠袋</p>
                                  <p className="text-des">
                                    <span>x</span>
                                    {this.state.bagQuantity}
                                  </p>
                                </div>
                                <div className="col text-end">
                                  <p className="text-des">
                                    <span>$</span>
                                    {this.state.bagQuantity * 2}
                                  </p>
                                </div>
                              </div>
                            )}
                            <div className="col-10 d-flex mt-2 ms-3">
                              <div className="col d-flex">
                                <p className="text-des star-must">點數折扣</p>
                              </div>
                              <div className="col text-des text-end star-must">
                                <p>
                                  <span>-</span>
                                  {this.state.usePoninter}
                                </p>
                              </div>
                            </div>
                            <hr className="mt-2 hr-line" />
                            <div className="col-10 d-flex mt-2 ms-3">
                              <div className="col d-flex">
                                <p className="text-des">應付金額</p>
                              </div>
                              <div className="col text-end text-des">
                                <p>
                                  <span>$</span>
                                  {this.state.lastPrice}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="row d-flex mt-3">
                            <div className="col-12">
                              <label className="text-des me-3">備註</label>
                              <input
                                className="text-des mt-2 form-control"
                                type="text"
                                maxLength="20"
                                onChange={this.memo_change}
                              />
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col d-flex justify-content-between align-items-center">
                              <a className="btn-return" href="./cart-list.html">
                                繼續加購
                              </a>
                              <button
                                type="button"
                                className="next-step btn-continue"
                                onClick={this.checkedTime}
                              >
                                下一步
                              </button>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </React.Fragment>
                  )}
                  {currentStep === 2 && (
                    <React.Fragment>
                      <fieldset className="row mx-auto detail py-5">
                        <div className="col mx-auto check-details">
                          <div className="row d-flex justify-content-center mt-5">
                            <div className="col-10">
                              <h2 className="text-title">取貨人資訊</h2>
                            </div>
                            <div className="col-10 mt-4 mb-2 ms-2">
                              <label htmlFor="" className="text-des">
                                取貨人姓名<span className="star-must">*</span>
                              </label>
                              <input
                                className="ms-2 mt-3 form-control input-box"
                                type="text"
                                value={this.state.pickupInfo.personName}
                                onChange={this.name_change}
                                onBlur={this.name_check}
                                maxLength={20}
                              />
                            </div>
                            <div className="col-10 mt-3 mb-2 ms-2">
                              <label htmlFor="" className="text-des">
                                取貨人電話<span className="star-must">*</span>
                              </label>
                              <input
                                className="ms-2 mt-3 form-control input-box"
                                type="text"
                                value={this.state.pickupInfo.personPhone}
                                onChange={this.phone_change}
                                maxLength={10}
                                onBlur={this.phone_check}
                              />
                            </div>
                          </div>

                          <div className="row d-flex justify-content-center mt-5">
                            <div className="col-10">
                              <h4 className="text-title">
                                付款方式<span className="star-must">*</span>
                              </h4>
                            </div>
                            <div className="col-10 mt-3 mb-2">
                              <input
                                className="ms-2 input_box"
                                type="radio"
                                id="cash"
                                name="pay-method"
                                defaultChecked
                                value="1"
                                onChange={this.payMethod_change}
                              />
                              <label htmlFor="cash" className="text-des">
                                <img
                                  src="/img/icon/cash.png"
                                  alt="cash-icon"
                                  className="icon-img-s"
                                />
                                現金
                              </label>
                            </div>
                            <div className="col-10 mt-3 mb-2">
                              <input
                                className="ms-2 input_box"
                                type="radio"
                                name="pay-method"
                                id="line-pay"
                                value="2"
                                onChange={this.payMethod_change}
                              />
                              <label htmlFor="line-pay" className="text-des">
                                <span>
                                  <img
                                    src="/img/icon/linepay.png"
                                    alt="inepay-icon"
                                    className="icon-img"
                                  />
                                </span>
                              </label>
                            </div>
                          </div>

                          <div className="row d-flex justify-content-center mt-5">
                            <div className="col-10">
                              <h4 className="text-title">
                                開立發票<span className="star-must">*</span>
                              </h4>
                            </div>
                            <div className="col-10 mt-3 mb-2">
                              <input
                                className="ms-2 input_box"
                                type="radio"
                                name="receipt"
                                id="bill"
                                defaultChecked
                                value={1}
                                onChange={this.receipt_change}
                              />
                              <label htmlFor="bill" className="text-des">
                                紙本發票
                              </label>
                            </div>
                            <div className="col-10 mt-3 mb-2">
                              <input
                                className="ms-2 input_box"
                                type="radio"
                                id="vehicle"
                                name="receipt"
                                value={2}
                                onChange={this.receipt_change}
                              />
                              <label htmlFor="vehicle" className="text-des">
                                載具
                              </label>
                            </div>
                            <div className="col-10">
                              <input
                                className="ms-2 mt-3 form-control input-box"
                                type="text"
                                onChange={this.vehicle_change}
                              />
                            </div>
                          </div>

                          <div className="row d-flex justify-content-center mt-5">
                            <div className="col-10">
                              <h4 className="text-title">統一編號</h4>
                            </div>
                            <div className="col-10">
                              <input
                                className="ms-2 mt-3 form-control input-box"
                                type="text"
                                onChange={this.uniform_change}
                              />
                            </div>
                          </div>

                          <div className="row mt-3">
                            <div className="col d-flex justify-content-between">
                              <button
                                type="button"
                                className="previous-step"
                                onClick={this.previousStep}
                              >
                                上一步
                              </button>
                              <button
                                type="button"
                                className="next-step customer-fill-in"
                                onClick={this.name_phone_check}
                              >
                                下一步
                              </button>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </React.Fragment>
                  )}

                  {currentStep === 3 && (
                    <React.Fragment>
                      <fieldset className="row mx-auto detail p-3">
                        <div className="col mx-auto check-details pt-5">
                          <div className="row">
                            <div className="col">
                              <div className="col">
                                <h4 className="text-center text-title-b">
                                  訂單確認
                                </h4>
                                <div className="text-center d-flex align-items-baseline justify-content-center mt-3">
                                  <span className="small-text p-2">
                                    <img
                                      className="me-2"
                                      src="/img/icon/exclamation 1.png"
                                      alt="icnimg"
                                    />
                                    預計取貨時間會依門市狀況調整
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row order-check mx-auto mb-5">
                            <div className="row d-flex align-items-center mt-5">
                              <div className="col-5 col-md-3 text-center text-md-start">
                                <h4 className="text-des">訂購門市</h4>
                              </div>
                              <div className="col">
                                <h4 className="text-des">
                                  {`${this.state.dbcarts[0].brand_name} (${this.state.dbcarts[0].branch_name})`}
                                </h4>
                              </div>
                              <hr className="mt-2 hr-line" />
                            </div>

                            <div className="row d-flex align-items-center mt-4">
                              <div className="col-5 col-md-3 text-center text-md-start">
                                <h4 className="text-des">取貨人</h4>
                              </div>
                              <div className="col">
                                <h4 className="text-des">
                                  {this.state.pickupInfo.personName}
                                </h4>
                              </div>
                              <hr className="mt-2 hr-line" />
                            </div>

                            <div className="row d-flex align-items-center mt-4">
                              <div className="col-5 col-md-3 text-center text-md-start">
                                <h4 className="text-des">連絡電話</h4>
                              </div>
                              <div className="col">
                                <h4 className="text-des">
                                  {this.state.pickupInfo.personPhone}
                                </h4>
                              </div>
                              <hr className="mt-2 hr-line" />
                            </div>

                            <div className="row d-flex align-items-center align-items-center mt-4">
                              <div className="col-5 col-md-3 text-center text-md-start">
                                <h4 className="text-des">取貨地點</h4>
                              </div>
                              <div className="col">
                                <h4 className="text-des">
                                  {this.state.dbcarts[0].branch_address}
                                </h4>
                              </div>
                              <hr className="mt-2 hr-line" />
                            </div>

                            <div className="row d-flex align-items-center mt-4">
                              <div className="col-5 col-md-3 text-center text-md-start">
                                <h4 className="text-des">預計取貨時間</h4>
                              </div>
                              <div className="col">
                                <h4 className="text-des">
                                  {this.state.pickupTime}
                                </h4>
                              </div>
                              <hr className="mt-2 hr-line" />
                            </div>

                            <div className="row d-flex align-items-center mt-4">
                              <div className="col-5 col-md-3 text-center text-md-start">
                                <h4 className="text-des">付款方式</h4>
                              </div>
                              <div className="col">
                                <h4 className="text-des">
                                  {this.state.payMethod === 1
                                    ? "現金"
                                    : "LINE Pay"}
                                </h4>
                              </div>
                              <hr className="mt-2 hr-line" />
                            </div>

                            <div className="row d-flex align-items-center mt-4">
                              <div className="col-5 col-md-3 text-center text-md-start">
                                <h4 className="text-des">發票開立</h4>
                              </div>
                              <div className="col">
                                <h4 className="text-des">
                                  {this.state.vehicle
                                    ? `手機載具-${this.state.vehicle}`
                                    : "紙本發票"}
                                </h4>
                              </div>
                              <hr className="mt-2 hr-line" />
                            </div>

                            <div className="row d-flex align-items-center mt-4">
                              <div className="col-5 col-md-3 text-center text-md-start">
                                <h4 className="text-des">統一編號</h4>
                              </div>
                              <div className="col">
                                <h4 className="text-des">
                                  {this.state.uniform ? this.state.uniform : ""}
                                </h4>
                              </div>
                              <hr className="mt-2 hr-line" />
                            </div>

                            <div className="row d-flex align-items-center mt-4">
                              <div className="col-5 col-md-3 text-center text-md-start">
                                <h4 className="text-des">應付金額</h4>
                              </div>
                              <div className="col">
                                <h4 className="text-des">
                                  ${this.state.lastPrice}
                                </h4>
                              </div>
                              <hr className="mt-2 hr-line" />
                            </div>

                            <div className="row mt-3">
                              <div className="col d-flex justify-content-between">
                                <button
                                  className="previous-step"
                                  onClick={this.previousStep}
                                >
                                  上一步
                                </button>
                                <button
                                  type="button"
                                  className="next-step"
                                  onClick={this.handleButtonClick}
                                >
                                  送出
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </React.Fragment>
                  )}
                </form>
                {currentStep === 4 && (
                  <React.Fragment>
                    <fieldset className="row mx-auto detail p-3">
                      <div className="col mx-auto check-details pt-5">
                        <div className="row">
                          <div className="col">
                            <h1 className="text-title-b text-center">
                              恭喜您已完成訂購流程
                            </h1>
                          </div>
                        </div>
                        <div className="row mt-3 complete-order mx-auto">
                          <div className="col d-flex flex-column align-items-center">
                            <img
                              className="icon-img"
                              src="/img/icon/clock.png"
                              alt="clock-icon"
                            />
                            <h4 className="text-title mt-3">取貨時間</h4>
                            <p className="text-des">{this.state.pickupTime}</p>
                            <h4 className="text-title">取貨地點</h4>
                            <p className="mb-0 text-des">
                              {`${this.state.dbcarts[0].brand_name} (${this.state.dbcarts[0].branch_name})`}
                            </p>
                            <p className="text-des-small">
                              {this.state.dbcarts[0].branch_address}
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col text-center mt-3 mb-5">
                            <a className="btn-continue" href="./cartLiist.html">
                              關閉
                            </a>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
          {/* </React.Fragment> */}
        </div>

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
      </React.Fragment>
    );
  }
  //更新狀態key
  updateState = () => {
    this.setState({
      // 更新状态
      keyForDateTimePicker: Math.random(), // 设置一个随机值作为 key
    });
  };
  pointinfoShow = (event) => {
    document.getElementById("pointinfo").style.top = event.clientY + 50 + "px";
    document.getElementById("pointinfo").style.left = event.clientX - 150 + "px";
} 

pointinfoHide = (event) => {
    document.getElementById("pointinfo").style.top = "-500px";
    event.cancelBubble = true;
}

toggleMemberNav = () => {
    const userdata = localStorage.getItem('userdata');
    if(userdata){
        document.getElementById('memberNav').classList.toggle('collapse');
    }else{
        const path = this.props.location.pathname;
        sessionStorage.setItem('redirect',path) ;
        window.location = "/login";
    }
  }
toggleMenuNav = () => {
    document.getElementById('menuNav').classList.toggle('menuNav');
}
logoutClick = async () => {
    // 清除localStorage
    localStorage.removeItem("userdata");
    const userdata = localStorage.getItem("userdata");
    console.log("現在的:", userdata);
    try {
        // 告訴後台使用者要登出
        await axios.post('http://localhost:8000/logout');
    
        
        //   window.location = '/logout'; // 看看登出要重新定向到哪個頁面
    } catch (error) {
        console.error("登出時出錯:", error);
    }
    
    document.getElementById('memberNav').classList.add('collapse');
    this.setState({})
    window.location = "/index"
}
loginCheck = () => {
    const userData = JSON.parse(localStorage.getItem('userdata'));
    if(userData){
        const userImg = userData.user_img?userData.user_img:'LeDian.png';
        return (
            <h4 id='loginBtn' className='my-auto btn headerText text-nowrap' onClick={this.toggleMemberNav}>                
                <img id='memberHeadshot' src={(`/img/users/${userImg}`)} alt='memberHeadshot' className='img-fluid my-auto mx-1 rounded-circle border'></img>
                會員專區▼</h4>
            )
    }else {
        return (<h4 id='loginBtn' className='my-auto btn headerText align-self-center' onClick={this.toggleMemberNav}>登入/註冊▼</h4>)
    }              
}
cartMenuClick = () => {
    const userData = JSON.parse(localStorage.getItem('userdata'));
    if(userData){
        const userId = userData.user_id;
        window.location = `/cartlist/${userId}`;
    }else {
        window.location = "/login";
    }              

}

componentDidMount = async () => {
    console.log(this.props.match.params.id);
    let newState = { ...this.state };
    let result = await axios.get(
      `http://localhost:8000/cartPay/${this.props.match.params.id}`
    );
    console.log(result);
    let quantity = 0;
    let sumPrice = 0;
    newState.dbcarts = result.data;
    console.log("dbcarts:", newState.dbcarts);

    newState.dbcarts.forEach((item) => {
      quantity += item.item_quantity;
      sumPrice +=
        (item.item_price + item.ingredient_price) * item.item_quantity;
    });
    console.log("sumPrice", sumPrice);
    newState.quantity = quantity;
    newState.sumPrice = sumPrice;
    newState.lastPrice = sumPrice;

    this.setState(newState);
    console.log("dbcart", this.state.dbcarts);
  };
}
export default cartPay;

// ingredient_price
//item_ingredient
