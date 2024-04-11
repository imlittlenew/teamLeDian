import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../css/profile.css";
import Barcode from "./Barcode.jsx";
import "@fortawesome/fontawesome-free/css/all.css";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { PiMedal } from "react-icons/pi";
import { PiCoins } from "react-icons/pi";
import { GiCancel } from "react-icons/gi";
import { Helmet } from "react-helmet";
import { Modal } from "bootstrap";
import Axios from "axios";
import { Toast } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      displayMinicol10: window.innerWidth <= 930 ? "block" : "none",
      displayCol6: window.innerWidth <= 930 ? "block" : "none",
      userName: "",
      userEmail: "",
      userPhone: "",
      selectedDistrict: "",
      form1Validated: false,
      form2Validated: false,
      rating: 5,
      userData: { name: "", email: "" },
      selectedGender: 2,
      city: [],
      region: [],
      selectedCity: "",
      selectedRegion: "",
      error: null,
      loading: true,
      selectedDate: new Date(),
      dbdata: {},
      isDataUpdated: false,
      h5Name: "",
      ordersData: [],
      orderDetailsData: [],
      selectedOrder: null,
      selectedOrderDetails: null,
      userImg: null,
      showToast: false,
      toastMessage: "",
    };
  }

  componentDidMount() {
    this.setState({ showToast: false });
    window.addEventListener("resize", this.handleWindowResize);
    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (userData) {
      Axios.get(`http://localhost:8000/user/${userData.user_id}`)
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
    if (userData.user_id != null) {
      Axios.get(`http://localhost:8000/user/${userData.user_id}`)
        .then((response) => {
          if (!response.data.name) {
            response.data.name = "LeDian";
          }
          if (!response.data.points) {
            response.data.points = 0;
          }
          this.setState({
            userData: response.data,
            h5Name: response.data.name,
            loading: false,
            selectedGender: response.data.sex,
            selectedDate: response.data.birthday,
          });

          Axios.get(`http://localhost:8000/profile/orders/${userData.user_id}`)
            .then((ordersResponse) => {
              this.setState({ ordersData: ordersResponse.data });

              ordersResponse.data.forEach((order) => {
                Axios.get(
                  `http://localhost:8000/profile/order_details/${order.orders_id}`
                )
                  .then((orderDetailsResponse) => {
                    this.setState((prevState) => ({
                      orderDetailsData: [
                        ...prevState.orderDetailsData,
                        orderDetailsResponse.data,
                      ],
                    }));
                  })
                  .catch((orderDetailsError) => {
                    console.log(
                      "Failed to fetch order details data: " + orderDetailsError
                    );
                  });
              });
            })
            .catch((ordersError) => {
              console.log("Failed to fetch orders data: " + ordersError);
            });

          Axios.get("http://localhost:8000/city").then((cityResponse) => {
            const cityList = cityResponse.data;
            this.setState({ city: cityList });
            if (response.data.city_id) {
              Axios.get(`http://localhost:8000/region/${response.data.city_id}`)
                .then((regionResponse) => {
                  const regionList = regionResponse.data;
                  this.setState({ region: regionList });
                })
                .catch((regionError) => {
                  console.error("Failed to fetch region:", regionError);
                });
            }
          });
        })
        .catch((error) => {
          this.setState({ error: "Failed to fetch user data", loading: false });
          console.error("Failed to fetch user data:", error);
        });
    } else {
      this.setState({
        error: "User ID not found in localStorage",
        loading: false,
      });
    }
  }
  toggleToast = (message) => {
    this.setState({ toastMessage: message });
    this.setState((prevState) => ({ showToast: !prevState.showToast }));
    if (!this.state.showToast) {
      this.toastTimer = setTimeout(() => {
        this.setState({ showToast: false });
      }, 3000);
    } else {
      clearTimeout(this.toastTimer);
    }
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize = () => {
    const windowWidth = window.innerWidth;
    this.setState({
      windowWidth,
      displayMinicol10: windowWidth <= 1050 ? "block" : "none",
      displayCol6: windowWidth <= 1050 ? "block" : "none",
    });
  };

  handleForm1Submit = (event) => {
    event.preventDefault();
    const { selectedFile, userData } = this.state;
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.stopPropagation();
      this.setState({ form1Validated: true });
      return;
    }
    Axios.post(
      `http://localhost:8000/updateUserData/${userData.user_id}`,
      userData
    )
      .then(() => {
        Axios.get(`http://localhost:8000/user/${userData.user_id}`)
          .then((response) => {
            this.setState({ userData: response.data }, () => {
              this.uploadFile(selectedFile, userData.user_id);
              this.setState({ h5Name: response.data.name });
            });
          })
          .catch((error) => {
            console.error("Failed to fetch updated user data:", error);
          });
      })
      .catch((error) => {
        console.error("Failed to update user data:", error);
      });
  };

  uploadFile = (file, userId) => {
    if (file) {
      const formData = new FormData();
      formData.append("user_img", file);

      Axios.post(`http://localhost:8000/uploadUserImage/${userId}`, formData)
        .then((response) => {
          console.log("File uploaded successfully:", response.data.user_img);
        })
        .catch((error) => {
          console.error("Failed to upload file:", error);
        });
    }
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      userData: {
        ...prevState.userData,
        [name]: value,
      },
    }));
  };

  handleForm2Submit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.stopPropagation();
      this.setState({ form2Validated: true });
      return;
    }

    const { userData } = this.state;
    const userId = userData.user_id;
    const oldPassword = form.elements.inputOldPassword.value;
    const newPassword = form.elements.inputNewPassword.value;
    const newPassword2 = form.elements.inputNewPassword2.value;

    if (newPassword !== newPassword2) {
      this.toggleToast("新密碼和再次輸入新密碼不匹配，請重新輸入。");
      return;
    }

    Axios.post("http://localhost:8000/verifyPassword", { userId, oldPassword })
      .then((response) => {
        Axios.post("http://localhost:8000/changePassword", {
          userId,
          newPassword,
        })
          .then((response) => {
            this.toggleToast("密碼修改成功");
          })
          .catch((error) => {
            console.error("Failed to change password:", error);
            this.toggleToast("密碼修改失敗 請稍後再試。");
          });
      })
      .catch((error) => {
        console.error("Failed to verify old password:", error);
        this.toggleToast("舊密碼驗證失敗。");
      });
  };

  handleStarClick = (value) => {
    this.setState({ rating: value });
  };
  handleGenderChange = (event) => {
    const selectedGender = parseInt(event.target.value);
    this.setState((prevState) => ({
      userData: {
        ...prevState.userData,
        sex: selectedGender,
      },
      selectedGender: selectedGender,
    }));
  };

  handleCityChange = (event) => {
    const selectedCityId = event.target.value;
    console.log(selectedCityId);
    this.setState({ region: [] });
    Axios.get(`http://localhost:8000/region/${selectedCityId}`)
      .then((response) => {
        this.setState((prevState) => ({
          region: response.data,
          selectedCity: selectedCityId,
          userData: {
            ...prevState.userData,
            city_id: selectedCityId,
          },
        }));
      })
      .catch((error) => {
        console.error("Failed to fetch regions:", error);
      });
  };

  handleRegionChange = (event) => {
    const selectedRegionId = event.target.value;
    console.log(selectedRegionId);
    this.setState((prevState) => ({
      selectedRegion: selectedRegionId,
      userData: {
        ...prevState.userData,
        area_id: selectedRegionId,
      },
    }));
  };

  handleDateChange = (date) => {
    const formattedDate = new Date(date.getTime() + 8 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    console.log(formattedDate);
    this.setState((prevState) => ({
      selectedDate: date,
      userData: {
        ...prevState.userData,
        birthday: formattedDate,
      },
    }));
  };

  handleFileChange = (event) => {
    const file = event.target.files[0];
    const userData = { ...this.state.userData };
    const userId = userData.user_id;
    const fileExtension = file.name.split(".").pop();
    const newFileName = `${userId}.${fileExtension}`;
    userData.user_img = newFileName;

    console.log("New filename:", newFileName);

    this.setState((prevState) => ({
      selectedFile: file,
      userData: {
        ...prevState.userData,
        user_img: newFileName,
      },
    }));
  };

  handleFileUpload = () => {
    const { selectedFile } = this.state;
    const formData = new FormData();
    formData.append("user_img", selectedFile);

    Axios.post(`http://localhost:8000/uploadUserImage`, formData)
      .then((response) => {
        console.log("File uploaded successfully:", response.data.user_img);
      })
      .catch((error) => {
        console.error("Failed to upload file:", error);
      });
  };

  handleModalClose = () => {
    const myModalElement = document.getElementById("Orders_staticBackdrop");
    const myModal = Modal.getInstance(myModalElement);

    if (myModal) {
      myModal.hide();
      myModalElement.setAttribute("data-bs-backdrop", "true");
    } else {
    }
  };
  handleOrderButtonClick = (order) => {
    this.setState({ selectedOrder: order });
    Axios.get(`http://localhost:8000/profile/order_details/${order.orders_id}`)
      .then((orderDetailsResponse) => {
        this.setState({ selectedOrderDetails: orderDetailsResponse.data });
      })
      .catch((orderDetailsError) => {
        console.log("Failed to fetch order details data: " + orderDetailsError);
      });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedOrder) {
      const { user_id } = this.state.selectedOrder;
      Axios.get(`http://localhost:8000/profile/orders/${user_id}`)
        .then((response) => {
          const orders = response.data;
          orders.forEach((order) => {
            const { payment_status, updatedpoints } = order;
            if (payment_status === 1 && updatedpoints === 0) {
              this.updateUserPoints();
            }
          });
        })
        .catch((error) => {
          console.error("Error fetching orders data:", error);
        });
    }
  }
  updateUserPoints = () => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    const userId = userData.user_id;
    const pointsToAdd = Math.floor(this.state.selectedOrder.orders_total / 20);

    Axios.post(`http://localhost:8000/updateUserPoints/${userId}`, {
      pointsToAdd: pointsToAdd,
    })
      .then((response) => {
        const updatedPointsToAdd = response.data;
        console.log("Updated pointsToAdd:", updatedPointsToAdd);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  render() {
    const {
      userData,
      displayMinicol10,
      displayCol6,
      city,
      region,
      h5Name,
      ordersData,
    } = this.state;
    let totalQuantity = 0;

    return (
      <div id="profile">
        <Helmet>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        </Helmet>
        <div id="profileheader">
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
        </div>
        <Toast
          show={this.state.showToast}
          onClose={this.toggleToast}
          className="custom-toast position-fixed  p-3"
        >
          <div class="d-flex">
            <Toast.Body>{this.state.toastMessage}</Toast.Body>
            <button
              type="button"
              class="btn-close me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </Toast>
        <div
          className="modal fade"
          id="Orders_staticBackdrop"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="Orders_staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <div className="row">
                  <div className="col-9 text-start pe-0 ps-4">
                    <div className="col-12 mt-4 mb-4">
                      <h1
                        className="modal-title fs-1 fw-bold"
                        id="Orders_staticBackdropLabel"
                      >
                        LeDian
                      </h1>
                    </div>
                    <div className="fs-5">
                      {this.state.selectedOrder && (
                        <div className="col-12 mb-3">
                          <span>以下是您在</span>
                          <div className="col-12 mb-3">
                            <span className="ma-1">
                              {this.state.selectedOrder.brand_name}
                            </span>
                            <span>{this.state.selectedOrder.branch_name}</span>
                            <span>訂購的電子明細。</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-3 text-end ps-0">
                    <div className="col-12">
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="col-12 text-start">
                      <img
                        id="LeDianLogoModal"
                        src="./img/Member_Area/LeDianLogoModal.png"
                        alt="LeDianLogo"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- head end --> */}

              <div className="modal-body">
                <div className="row container mx-0">
                  <div className="col-12 mb-2">
                    <h3 className="fw-bold">訂單</h3>
                  </div>
                  <hr />
                  {this.state.selectedOrder && (
                    <>
                      <div className="col-5 mt-1 fs-5">訂單狀態</div>
                      <div className="col-4 px-1">
                        <div
                          className={`sendOrder rounded-1 text-center p-1 fs-5 ${
                            this.state.selectedOrder.orders_status === 0
                              ? ""
                              : "completedOrder"
                          }`}
                        >
                          {this.state.selectedOrder.orders_status === 0
                            ? "訂單準備中"
                            : "訂單完成"}
                        </div>
                      </div>
                      <div className="col-3"></div>
                      <hr className="mt-3" />

                      <div className="col-5 fs-5">預計取貨時間</div>
                      <div className="col-7 fs-5">
                        {this.state.selectedOrder.orders_pick_up}
                      </div>
                      <hr className="mt-3" />

                      <div className="col-5 fs-5">付款方式</div>
                      <div className="col-7 fs-5">
                        {this.state.selectedOrder.terms_of_payment}
                      </div>
                      <hr className="mt-3" />

                      <div className="col-5 fs-5">開立發票方式</div>
                      <div className="col-7 fs-5">
                        <span>{this.state.selectedOrder.invoicing_method}</span>
                      </div>
                      <hr className="mt-3" />

                      <div className="col-5 fs-5">訂單建立時間</div>
                      <div className="col-7 mb-3 fs-5">
                        {this.state.selectedOrder.createtime}
                      </div>

                      {this.state.selectedOrder.payment_status === 1 && (
                        <div
                          className="my-2 text-center rounded-2"
                          id="pointbuttom"
                        >
                          <div className="col-12 mt-3 mb-1 fs-4">
                            恭喜獲得點數
                          </div>
                          <div className="col-12 mb-4 fs-5">
                            <span className="mx-1">消費贈點</span>
                            <span>
                              {Math.floor(
                                this.state.selectedOrder.orders_total / 20
                              )}
                              點
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {/* <!-- 訂單end --> */}

                  <div className="col-12 mt-4 mb-2">
                    <h3 className="fw-bold">明細</h3>
                  </div>
                  <hr />
                  {this.state.selectedOrderDetails && (
                    <>
                      {this.state.selectedOrderDetails.map((detail, index) => (
                        <div
                          key={`detail_${index}`}
                          className="rounded-1 detailsbuttom my-2"
                        >
                          <div className="col-12 mb-1 fs-5 fw-bold mt-3">
                            {detail.details_name}
                          </div>
                          <div className="col-12 fs-5">
                            <p>
                              <span>{detail.details_size}/</span>
                              <span>{detail.details_mperatures}/</span>
                              <span>{detail.details_sugar}/</span>
                              <span>{detail.details_amount}/</span>
                              <span>{detail.details_quantity}份</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {this.state.selectedOrder &&
                    this.state.selectedOrder.orders_bag === 1 && (
                      <div key="bag" className="rounded-1 detailsbuttom fs-5">
                        <div className="col-12 mb-1 fw-bold mt-3">塑膠袋</div>
                        <div className="col-12 mb-3">
                          <span>$2/</span>
                          <span>
                            {this.state.selectedOrder.orders_bag_num}份
                          </span>
                        </div>
                      </div>
                    )}

                  {this.state.selectedOrderDetails && (
                    <>
                      {this.state.selectedOrderDetails.map((detail, index) => {
                        totalQuantity += detail.details_quantity;
                      })}
                      <div className="mt-4"></div>
                      <div className="col-3 fs-5">
                        <span>商品</span>
                      </div>
                      <div className="col-4 text-start fs-5">
                        X{totalQuantity}
                      </div>
                      <div className="col-5 text-end fs-5">
                        $
                        {this.state.selectedOrderDetails.reduce(
                          (totalPrice, detail) =>
                            totalPrice + detail.details_total,
                          0
                        )}
                      </div>
                    </>
                  )}

                  {this.state.selectedOrder && (
                    <>
                      {this.state.selectedOrder &&
                        this.state.selectedOrder.orders_bag === 1 && (
                          <>
                            <div className="col-3 fs-5">
                              <span>塑膠袋</span>
                            </div>
                            <div className="col-4 text-start fs-5">
                              X{this.state.selectedOrder.orders_bag_num}
                            </div>
                            <div className="col-5 text-end fs-5">
                              ${this.state.selectedOrder.orders_bag_num * 2}
                            </div>
                          </>
                        )}
                      {this.state.selectedOrder.usePoninter !== 0 && (
                        <>
                          <div className="col-3 text-danger fs-5">
                            <span>點數折扣</span>
                          </div>
                          <div className="col-9 text-end text-danger fs-5">
                            -${this.state.selectedOrder.usePoninter}
                          </div>
                        </>
                      )}

                      <hr className="mt-3" />

                      <div className="col-3 fs-5">
                        <span>總計</span>
                      </div>
                      <div className="col-9 text-end mb-4 fs-5">
                        ${this.state.selectedOrder.orders_total}
                      </div>
                    </>
                  )}

                  <div className="col-12 mt-4 fs-5 mb-2">
                    <h3 className="fw-bold">評價此次訂單</h3>
                  </div>
                  <hr />
                  <div className="col-12 text-center mb-3">
                    <div id="full-stars-example-two">
                      <div className="rating-group">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <React.Fragment key={value}>
                            <label
                              className="rating_label"
                              htmlFor={`start${value}`}
                            >
                              <i className="star fas fa-star profilestar"></i>
                            </label>
                            <input
                              className="rating_input"
                              name="start"
                              id={`start${value}`}
                              value={value}
                              type="radio"
                              checked={value === this.state.rating}
                              onChange={() => this.handleStarClick(value)}
                            />
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- body end --> */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btnmodal fs-4"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={this.handleModalClose}
                >
                  送出評價
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-5">
          <div className="container-fluid">
            <div className="row">
              <div className="col-2 mt-4 profilecol2">
                <div className="row mb-3">
                  <div className="col-5 mt-4 pt-0 userimg-container">
                    <img
                      id="userimg"
                      src={`/img/users/${this.state.userImg}`}
                      alt="memberHeadshot"
                      className="w-100 img-fluid mt-1 mx-1 rounded-circle border"
                    ></img>
                  </div>
                  <div className="col-7 mt-3">
                    <div className="row">
                      <div className="col-12 mb-5 mt-3 mx-1">
                        <h5 className="username fs-5">{h5Name}</h5>

                        <span className="d-flex align-items-center">
                          <img
                            src="./img/Member_Area/points.png"
                            id="pointimg"
                            alt=" "
                          />
                          <h6 className="mb-0 mx-2 userpoint fs-5">
                            {this.state.userData.points}
                          </h6>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <ul id="leftnav" className="nav flex-column fs-4">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      id="Profile-v-tab"
                      data-bs-toggle="tab"
                      href="#Profile-v"
                    >
                      個人檔案
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      id="Management-v-tab"
                      data-bs-toggle="tab"
                      href="#Management-v"
                    >
                      帳號管理
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      id="Historical_Orders-v-tab"
                      data-bs-toggle="tab"
                      href="#Historical_Orders-v"
                    >
                      歷史訂單
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      id="Barcode-v-tab"
                      data-bs-toggle="tab"
                      href="#Barcode-v"
                    >
                      載具存取
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-10 profilecol10">
                <div
                  id="minicol10"
                  style={{ display: displayMinicol10 }}
                  className="row d-flex align-items-center py-3 mb-3 minisize"
                >
                  <div
                    className="col-6 text-end"
                    style={{ display: displayCol6 }}
                  >
                    <img
                      src={`/img/users/${this.state.userImg}`}
                      id="userimgcol10"
                      className="border rounded-circle img-fluid"
                      alt=" "
                    />
                  </div>
                  <div className="col-6 mt-1" style={{ display: displayCol6 }}>
                    <h5 className="fs-3 mb-1">{userData.name}</h5>
                    <span className="d-flex align-items-center ">
                      <img
                        src="./img/Member_Area/points.png"
                        id="pointimgcol10"
                        alt=" "
                      />
                      <h6 className="mb-0 mx-2 fs-4 mt-0">{userData.points}</h6>
                    </span>
                  </div>
                </div>
                <div style={{ display: displayMinicol10 }}>
                  <div
                    id="minicol10nav"
                    className="row d-flex align-items-center py-3 mb-3 minisize"
                  >
                    <ul id="col10nav" className="nav fs-5">
                      <div className="col">
                        <li className="nav-item col d-flex justify-content-center">
                          <a
                            className="nav-link active px-0"
                            id="col10Profile-v-tab"
                            data-bs-toggle="tab"
                            href="#Profile-v"
                            aria-selected="true"
                          >
                            個人檔案
                          </a>
                        </li>
                      </div>

                      <div className="col">
                        <li className="nav-item col d-flex justify-content-center">
                          <a
                            className="nav-link px-0"
                            id="col10Management-v-tab"
                            data-bs-toggle="tab"
                            href="#Management-v"
                            aria-selected="false"
                          >
                            帳號管理
                          </a>
                        </li>
                      </div>

                      <div className="col">
                        <li className="nav-item col d-flex justify-content-center">
                          <a
                            className="nav-link px-0"
                            id="col10Historical_Orders-v-tab"
                            data-bs-toggle="tab"
                            href="#Historical_Orders-v"
                            aria-selected="false"
                          >
                            歷史訂單
                          </a>
                        </li>
                      </div>

                      <div className="col">
                        <li className="nav-item col d-flex justify-content-center">
                          <a
                            className="nav-link px-0"
                            id="col10Barcode-v-tab"
                            data-bs-toggle="tab"
                            href="#Barcode-v"
                            aria-selected="false"
                          >
                            載具存取
                          </a>
                        </li>
                      </div>
                    </ul>
                  </div>
                </div>
                <div className="row">
                  <div className="tab-content mb-5">
                    {/* <!-- 個人檔案Profile --> */}
                    <div className="tab-pane fade show active" id="Profile-v">
                      <div className="input-group">
                        <form
                          id="form1"
                          className={`row g-3 ${
                            this.state.form1Validated ? "was-validated" : ""
                          }`}
                          onSubmit={this.handleForm1Submit}
                          noValidate
                        >
                          <div className="col-12 mb-4">
                            <label className="rounded-3" id="uploadborder">
                              <div className="d-flex flex-column align-items-center">
                                <input
                                  type="file"
                                  className="custom-file-input form-control"
                                  id="formFileLg"
                                  name="usefile"
                                  onChange={this.handleFileChange}
                                />
                                <img
                                  src="./img/Member_Area/upload.png"
                                  className="img-fluid mb-1"
                                  alt="Upload Icon"
                                />
                                <p className="fs-5" id="uploadtext">
                                  上傳頭像
                                </p>
                              </div>
                            </label>
                          </div>
                          <div className="col-12 mb-3">
                            <label
                              htmlFor="userName"
                              className="form-label fs-5"
                            >
                              姓名
                            </label>
                            <input
                              type="text"
                              id="userNameId"
                              defaultValue={userData.name}
                              name="name"
                              className="form-control fs-5"
                              onChange={this.handleInputChange}
                              maxLength={5}
                            />
                          </div>

                          <div className="col-12 mb-3">
                            <label for="email" className="form-label fs-5">
                              <span className="text-danger">*</span>信箱
                            </label>
                            <input
                              type="text"
                              id="userEmailId"
                              defaultValue={this.state.userData.email}
                              name="email"
                              className="form-control fs-5"
                              required
                              onChange={this.handleInputChange}
                            />
                            <div className="invalid-feedback">不能為空</div>
                          </div>
                          <div className="col-12 mb-3">
                            <label
                              for="userPhoneId"
                              className="form-label fs-5"
                            >
                              <span className="text-danger">*</span>手機號碼
                            </label>
                            <input
                              type="text"
                              id="userPhoneId"
                              className="form-control fs-5"
                              defaultValue={this.state.userData.phone}
                              name="phone"
                              required
                              onChange={this.handleInputChange}
                            />
                            <div className="invalid-feedback">不能為空</div>
                          </div>

                          <div className="col-12">
                            <label
                              for="inlineRadio1"
                              className="form-label mb-0 fs-5"
                            >
                              性別
                            </label>
                          </div>
                          <div className="col-12 mb-2 mt-2 mx-1">
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input fs-5"
                                type="radio"
                                name="inlineRadioOptions"
                                id="inlineRadio1"
                                value={0}
                                onChange={this.handleGenderChange}
                                checked={this.state.selectedGender === 0}
                              />
                              <label
                                className="form-check-label fs-5"
                                for="inlineRadio1"
                              >
                                女
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="inlineRadioOptions"
                                id="inlineRadio2"
                                value={1}
                                onChange={this.handleGenderChange}
                                checked={this.state.selectedGender === 1}
                              />
                              <label
                                className="form-check-label fs-5"
                                for="inlineRadio2"
                              >
                                男
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="inlineRadioOptions"
                                id="inlineRadio3"
                                value={2}
                                onChange={this.handleGenderChange}
                                checked={this.state.selectedGender === 2}
                              />
                              <label
                                className="form-check-label fs-5"
                                for="inlineRadio3"
                              >
                                不提供
                              </label>
                            </div>
                          </div>

                          <div className="col-12">
                            <label
                              for="inlineRadio1"
                              className="form-label mb-0 mt-3 fs-5"
                            >
                              生日
                            </label>
                          </div>

                          <div className="datepicker-container profiledate">
                            <DatePicker
                              className="text-des form-control fs-5"
                              selected={this.state.selectedDate}
                              maxDate={new Date()}
                              dateFormat="yyyy-MM-dd"
                              onChange={this.handleDateChange}
                            />
                          </div>
                          <div className="col-12">
                            <label
                              htmlFor="useraddress"
                              className="form-label mb-0 mt-3 fs-5"
                            >
                              居住地
                            </label>
                          </div>
                          <div className="col-6 mt-2">
                            <select
                              className="form-select fs-5"
                              aria-label="Default select example"
                              value={this.state.userData.city_id || ""}
                              onChange={this.handleCityChange}
                            >
                              <option value="">選擇城市</option>
                              {city &&
                                city.map((cityItem) => (
                                  <option
                                    key={cityItem.city_id}
                                    value={cityItem.city_id}
                                  >
                                    {cityItem.city}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="col-6 mt-2">
                            <select
                              className="form-select fs-5"
                              aria-label="Default select example"
                              value={this.state.userData.area_id || ""}
                              onChange={this.handleRegionChange}
                            >
                              <option value="">選擇地區</option>
                              {region &&
                                region.map((regionItem) => (
                                  <option
                                    key={regionItem.region_id}
                                    value={regionItem.region_id}
                                  >
                                    {regionItem.region}
                                  </option>
                                ))}
                            </select>
                          </div>

                          <div className="col-12 mt-5">
                            <button
                              id="profileButton"
                              className="btn btn-profileButton px-5 fs-4"
                              type="submit"
                            >
                              確認
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                    {/* <!-- 帳號管理Management --> */}
                    <div className="tab-pane fade" id="Management-v">
                      <div className="input-group">
                        <form
                          id="form2"
                          className={`row g-3 ${
                            this.state.form2Validated ? "was-validated" : ""
                          }`}
                          onSubmit={this.handleForm2Submit}
                          noValidate
                        >
                          <div className="col-12 mb-4">
                            <label
                              for="inputPassword"
                              className="form-label fs-5"
                            >
                              <span className="text-danger">*</span>舊密碼
                            </label>
                            <input
                              type="password"
                              id="inputOldPassword"
                              name="oldPassword"
                              className="form-control fs-5"
                              required
                              autoComplete="current-password"
                            />
                            <div className="invalid-feedback">不能為空</div>
                          </div>

                          <div className="col-12 mb-4">
                            <label
                              for="inputNewPassword"
                              className="form-label fs-5"
                            >
                              <span className="text-danger">*</span>新密碼
                            </label>
                            <input
                              type="password"
                              id="inputNewPassword"
                              name="newPassword"
                              className="form-control fs-5"
                              required
                              autoComplete="new-password"
                            />
                            <div className="invalid-feedback">不能為空</div>
                          </div>

                          <div className="col-12 mb-4">
                            <label
                              for="inputNewPassword2"
                              className="form-label fs-5"
                            >
                              <span className="text-danger">*</span>
                              再次輸入新密碼
                            </label>
                            <input
                              type="password"
                              id="inputNewPassword2"
                              name="newPassword"
                              className="form-control fs-5"
                              required
                              autoComplete="new-password"
                            />
                            <div className="invalid-feedback">不能為空</div>
                          </div>
                          <div className="col-12">
                            <button
                              id="managementButton"
                              type="submit"
                              className="btn btn-managementButton px-5"
                            >
                              修改密碼
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                    {/* <!-- 歷史訂單Historical_Orders --> */}
                    <div className="tab-pane fade" id="Historical_Orders-v">
                      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {ordersData.map((order, index) => (
                          <div key={order.orderId} className="col">
                            <div className="card h-100 text-center">
                              <div className="card-header fw-bold fs-5">
                                完成
                              </div>
                              <div className="text-center mt-3">
                                <img
                                  src={`/img/logo/${order.brand_id}.png`}
                                  className="card-img-top w-25 rounded-circle border"
                                  alt="品牌LOGO"
                                />
                              </div>
                              <div className="card-body fs-5">
                                <p className="card-title">
                                  {order.orders_pick_up}
                                </p>
                                <p className="card-text">
                                  <span className="me-2">
                                    {order.brand_name}
                                  </span>
                                  <span>{order.branch_name}</span>
                                </p>
                              </div>
                              <div className="card-footer">
                                <h4 className="mt-2 fw-bold fs-3">
                                  共 {order.orders_total} 元
                                </h4>
                              </div>
                              <button
                                className="btn btn-footer mx-3 mb-3 fs-5"
                                data-bs-toggle="modal"
                                data-bs-target="#Orders_staticBackdrop"
                                onClick={() =>
                                  this.handleOrderButtonClick(order)
                                }
                              >
                                請為您的訂單評分
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 載具條碼 */}
                    <div className="tab-pane fade fs-4" id="Barcode-v">
                      <div className="row mt-3">
                        <div className="col-12 text-center">歡迎使用樂點！</div>
                        <div className="col-12 text-center mb-4">
                          您可以設定<span id="Barcodecolor">載具條碼</span>囉！
                        </div>
                        <hr />
                        <div id="barcodeText">
                          <Barcode />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="profilefooter">
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
        </div>
      </div>
    );
  }
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
    localStorage.removeItem("userdata");
    const userdata = localStorage.getItem("userdata");
    console.log("現在的:", userdata);
    try {
      await Axios.post("http://localhost:8000/logout");
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

export default Profile;
