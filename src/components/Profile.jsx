import React, { Component, useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../css/profile.css";
import Barcode from "./Barcode.jsx";
import "@fortawesome/fontawesome-free/css/all.css";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { PiMedal } from "react-icons/pi";
import { PiCoins } from "react-icons/pi";
import { GiCancel } from "react-icons/gi";
import { Helmet } from "react-helmet";
import Axios from "axios";
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
      orderDetailsData: [],
    };
  }
  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);
    const userData = JSON.parse(localStorage.getItem("userdata"));
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
          });




          Axios.get(`http://localhost:8000/orders/${userData.user_id}`) 
            .then((ordersResponse) => {
              this.setState({ ordersData: ordersResponse.data });
              ordersResponse.data.forEach((order) => {
                Axios.get(
                  `http://localhost:8000/order_details/${order.orders_id}`
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
                    alert.error(
                      "Failed to fetch order details data:",
                      orderDetailsError
                    );
                  });
              });
            })
            .catch((ordersError) => {
              alert.error("Failed to fetch orders data:", ordersError);
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

    // 更新用户数据
    Axios.post(
      `http://localhost:8000/updateUserData/${userData.user_id}`,
      userData
    )
      .then(() => {
        // 更新用户数据成功后重新获取最新用户数据
        Axios.get(`http://localhost:8000/user/${userData.user_id}`)
          .then((response) => {
            this.setState({ userData: response.data }, () => {
              // 在状态更新后执行文件上传
              this.uploadFile(selectedFile, userData.user_id);
              this.setState({ h5Name: response.data.name });
            });
          })
          .catch((error) => {
            console.error("Failed to fetch updated user data:", error);
          });
      })
      .catch((error) => {
        // 更新用户数据失败
        console.error("Failed to update user data:", error);
      });
  };

  uploadFile = (file, userId) => {
    if (file) {
      const formData = new FormData();
      formData.append("user_img", file);

      Axios.post(`http://localhost:8000/uploadUserImage/${userId}`, formData)
        .then((response) => {
          // 文件上传成功
          console.log("File uploaded successfully:", response.data.user_img);
          // 可以根据需要在这里处理上传成功后的逻辑
        })
        .catch((error) => {
          // 文件上传失败
          console.error("Failed to upload file:", error);
          // 可以根据需要在这里处理上传失败后的逻辑
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
      alert("新密碼和再次輸入新密碼不匹配，請重新輸入。");
      return;
    }
    console.log("Old Password:", oldPassword);
    console.log("New Password:", newPassword);
    console.log("Confirm New Password:", newPassword2);
    Axios.post("http://localhost:8000/verifyPassword", { userId, oldPassword })
      .then((response) => {
        Axios.post("http://localhost:8000/changePassword", {
          userId,
          newPassword,
        })
          .then((response) => {
            alert("密碼修改成功");
          })
          .catch((error) => {
            console.error("Failed to change password:", error);
            alert("密碼修改失敗 請稍後再試。");
          });
      })
      .catch((error) => {
        console.error("Failed to verify old password:", error);
        alert("舊密碼驗證失敗。");
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
      selectedGender: selectedGender, // 更新选定的性别
    }));
  };

  handleCityChange = (event) => {
    const selectedCityId = event.target.value; // 获取选中的城市 ID
    console.log(selectedCityId);

    // 清空现有的区域列表
    this.setState({ region: [] });

    // 发送请求获取选中城市对应的所有区域
    Axios.get(`http://localhost:8000/region/${selectedCityId}`)
      .then((response) => {
        // 更新状态以显示选中城市对应的区域列表
        this.setState((prevState) => ({
          region: response.data,
          selectedCity: selectedCityId, // 设置选中的城市 ID
          userData: {
            ...prevState.userData,
            city_id: selectedCityId, // 更新用户数据中的城市 ID
          },
        }));
      })
      .catch((error) => {
        console.error("Failed to fetch regions:", error);
      });
  };

  handleRegionChange = (event) => {
    const selectedRegionId = event.target.value; // 获取选中的地区 ID
    console.log(selectedRegionId);
    this.setState((prevState) => ({
      selectedRegion: selectedRegionId,
      userData: {
        ...prevState.userData,
        area_id: selectedRegionId, // 更新用户数据中的地区 ID
      },
    }));
  };

  handleDateChange = (date) => {
    // 將日期轉換為所需格式，例如 yyyy-MM-dd
    const formattedDate = new Date(date.getTime() + 8 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]; // 加上 8 小時後轉換為台北時間
    console.log(formattedDate);
    // 更新狀態並執行後續操作
    this.setState((prevState) => ({
      selectedDate: date, // 更新選擇的日期
      userData: {
        ...prevState.userData,
        birthday: formattedDate, // 更新用戶數據中的生日日期
      },
    }));
  };

  handleFileChange = (event) => {
    const file = event.target.files[0];
    const userData = { ...this.state.userData }; // 克隆当前用户数据
    const userId = userData.user_id;

    // 提取文件扩展名
    const fileExtension = file.name.split(".").pop();

    // 构建新的文件名
    const newFileName = `${userId}.${fileExtension}`;

    // 更新 userData 中的文件名
    userData.user_img = newFileName;

    console.log("New filename:", newFileName);

    // 将文件保存到 state 中，并更新 userData 的 user_img 字段
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

    // 发送文件到后端
    Axios.post(`http://localhost:8000/uploadUserImage`, formData)
      .then((response) => {
        console.log("File uploaded successfully:", response.data.user_img);
        // 可以根据需要在这里处理上传成功后的逻辑
      })
      .catch((error) => {
        console.error("Failed to upload file:", error);
        // 可以根据需要在这里处理上传失败后的逻辑
      });
  };

  render() {
    const { userData, displayMinicol10, displayCol6, city, region, h5Name } =
      this.state;

    return (
      <div id="profile">
        <Helmet>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        </Helmet>
        <div id="profileheader">
        <div id='header'
                style={{
                    boxShadow: '1px 3px 10px #cccccc',
                    marginBottom: '4px',
                }} 
                className='d-flex justify-content-between'>
                <div className='col-7 col-sm-7 col-md-6 col-xl-5 d-flex ms-2 justify-content-between align-items-center'>
                <div id='menu' className='col-8'><h2 className='btn text-start  my-auto fs-4' onClick={this.toggleMenuNav}>☰</h2></div>
                    <h4 id='homeBtn' className='my-auto btn' onClick={()=>{window.location="/index"}}><img id='logo' src='/img/index/LeDian_LOGO-05.png' alt='logo'></img></h4>
                    <h4 className='my-auto p-0 btn headerText menuBtn d-flex align-items-center justify-content-center' onClick={this.cartMenuClick}><HiOutlineShoppingBag className='fs-4'/>購物車</h4>
                    <h4 className='my-auto p-0 btn headerText menuBtn d-flex align-items-center justify-content-center' onClick={()=>{window.location="/brand"}}><PiMedal className='fs-4'/>品牌專區</h4>
                    <h4 className='my-auto p-0 btn headerText menuBtn d-flex align-items-center justify-content-center' onClick={this.pointinfoShow}><PiCoins className='fs-4'/>集點資訊</h4>
                </div>
                <div id="pointinfo">
                    <button  id="pointinfoclose" onClick={this.pointinfoHide}><GiCancel   className='fs-2 text-light' /></button>
                    <h1>集點資訊</h1>
                    <p>．每消費20元即可累積1點。</p>
                    <p>．每點可折抵1元消費金額。</p>
                    <p>．點數可在下次消費時折抵使用。</p>
                    <p>．點數不可轉讓，不可兌換現金，不可合併使用。</p>
                    <p>．本集點活動以公告為準，如有更改，恕不另行通知。</p>
                </div>


                <div className='d-flex me-2 align-items-center'>
                    {this.loginCheck()}
                    <div id='memberNav' className='collapse'>
                        <div className='p-2'>
                            <h4 className='headerText text-center my-2' onClick={()=>{window.location="/profile"}}>會員中心</h4><hr />
                            <h4 className='headerText text-center my-2' onClick={this.logoutClick}>登出</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div id='menuNav' className='menuNav d-flex flex-column align-items-center'>
                <h4 className='menuText my-3 mainColor border-bottom border-secondary' onClick={this.cartMenuClick}><HiOutlineShoppingBag className='fs-4'/>購物車</h4>
                <h4 className='menuText my-3 mainColor border-bottom border-secondary' onClick={()=>{window.location="/brand"}}><PiMedal className='fs-4'/>品牌專區</h4>
                <h4 className='menuText my-3 mainColor border-bottom border-secondary' onClick={this.pointinfoShow}><PiCoins className='fs-4'/>集點資訊</h4>
            </div>

        </div>

        <div
          className="modal fade"
          id="Orders_staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
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
                    <div className="col-12">
                      <span>{h5Name}</span>
                      <span>，感謝您的訂單</span>
                    </div>
                    <div className="col-12 mb-3">
                      <span>以下是您在</span>
                      <span className="ma-1">迷客夏</span>
                      <span>台中勤美店</span>
                      <span>訂購的電子明細。</span>
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
                  <div className="col-12">
                    <h4 className="fw-bold">訂單</h4>
                  </div>
                  <hr />
                  <div className="col-5 mt-1">訂單狀態</div>
                  <div className="col-3 px-1">
                    <div className="sendOrder rounded-1 text-center p-1">
                      已送出訂單
                    </div>
                  </div>
                  <div className="col-4"></div>
                  <hr className="mt-3" />

                  <div className="col-5">預計取貨時間</div>
                  <div className="col-7">2024-03-03 18:00</div>
                  <hr className="mt-3" />

                  <div className="col-5">付款方式</div>
                  <div className="col-7">LINE PAY</div>
                  <hr className="mt-3" />

                  <div className="col-5">開立發票方式</div>
                  <div className="col-7">
                    <span>手機載具</span>
                    <span>-</span>
                    <span>/AAAAAA</span>
                  </div>
                  <hr className="mt-3" />

                  <div className="col-5">訂單建立時間</div>
                  <div className="col-7 mb-3">2024-03-03 17:45</div>

                  <div className="my-2 text-center rounded-2" id="pointbuttom">
                    <div className="col-12 mt-3 mb-1 fs-5">恭喜獲得點數</div>
                    <div className="col-12 mb-4 fs-6">
                      <span className="mx-2">消費贈點</span>
                      <span>3點</span>
                    </div>
                  </div>

                  {/* <!-- 訂單end --> */}

                  <div className="col-12 mt-4">
                    <h4 className="fw-bold">明細</h4>
                  </div>
                  <hr />
                  <div className="rounded-1 detailsbuttom my-2">
                    <div className="col-12 mb-1 fs-6 fw-bold mt-3">
                      焙茶乳香拿鐵
                    </div>
                    <div className="col-12">
                      <p>
                        <span>L/</span>
                        <span>熱/</span>
                        <span>無糖/</span>
                        <span>$85/</span>
                        <span>1份</span>
                      </p>
                    </div>
                  </div>
                  <div className="rounded-1 detailsbuttom mb-4">
                    <div className="col-12 mb-1 fs-6 fw-bold mt-3">塑膠袋</div>
                    <div className="col-12 mb-3">
                      <span>$2/</span>
                      <span>1份</span>
                    </div>
                  </div>
                  <div className="col-3">
                    <span>商品</span>
                  </div>
                  <div className="col-4 text-start">X1</div>
                  <div className="col-5 text-end">$85</div>

                  <div className="col-3">
                    <span>塑膠袋</span>
                  </div>
                  <div className="col-4 text-start">X1</div>
                  <div className="col-5 text-end">$2</div>

                  <div className="col-3 text-danger">
                    <span>點數折扣</span>
                  </div>
                  <div className="col-9 text-end text-danger">-$9</div>
                  <hr className="mt-3" />

                  <div className="col-3">
                    <span>總計</span>
                  </div>
                  <div className="col-9 text-end mb-4">$76</div>
                  {/* <!-- 明細end --> */}

                  <div className="col-12 mt-4">
                    <h4 className="fw-bold">評價此次訂單</h4>
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

                  <div className="col-12 mb-3">
                    <textarea
                      className="form-control"
                      id="exampleFormControlTextarea1"
                      rows="3"
                      placeholder="分享幾句評價吧！"
                    ></textarea>
                  </div>
                </div>
              </div>
              {/* <!-- body end --> */}
              <div className="modal-footer">
                <button type="button" className="btn btnmodal w-100 fs-5">
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
                      src={
                        userData.user_img
                          ? `/img/users/${userData.user_img}`
                          : "/img/users/Ledian.png"
                      }
                      alt="memberHeadshot"
                      className="w-100 img-fluid mt-1 mx-1 rounded-circle border"
                    ></img>
                  </div>
                  <div className="col-7 mt-3">
                    <div className="row">
                      <div className="col-12 mb-5 mt-3 mx-1">
                        <h5 className="username">{h5Name}</h5>

                        <span className="d-flex align-items-center">
                          <img
                            src="./img/Member_Area/points.png"
                            id="pointimg"
                            alt=" "
                          />
                          <h6 className="mb-0 mx-2 userpoint">
                            {userData.points}
                          </h6>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <ul id="leftnav" className="nav flex-column fs-5">
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
                      src="./img/Member_Area/LeDian_LOGO-05.jpg"
                      id="userimgcol10"
                      className="border rounded-circle img-fluid"
                      alt=" "
                    />
                  </div>
                  <div className="col-6 mt-1" style={{ display: displayCol6 }}>
                    <h5 className="fs-5 mb-1">{userData.name}</h5>
                    <span className="d-flex align-items-center ">
                      <img
                        src="./img/Member_Area/points.png"
                        id="pointimgcol10"
                        alt=" "
                      />
                      <h6 className="mb-0 mx-2 fs-6 mt-0">{userData.points}</h6>
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
                                <p id="uploadtext">上傳頭像</p>
                              </div>
                            </label>
                          </div>
                          <div className="col-12 mb-3">
                            <label htmlFor="userName" className="form-label">
                              姓名
                            </label>
                            <input
                              type="text"
                              id="userNameId"
                              defaultValue={userData.name}
                              name="name"
                              className="form-control"
                              onChange={this.handleInputChange}
                              maxLength={5}
                            />
                          </div>

                          <div className="col-12 mb-3">
                            <label for="email" className="form-label">
                              <span className="text-danger">*</span>信箱
                            </label>
                            <input
                              type="text"
                              id="userEmailId"
                              defaultValue={this.state.userData.email}
                              name="email"
                              className="form-control"
                              required
                              onChange={this.handleInputChange}
                            />
                            <div className="invalid-feedback">不能為空</div>
                          </div>
                          <div className="col-12 mb-3">
                            <label for="userPhoneId" className="form-label">
                              <span className="text-danger">*</span>手機號碼
                            </label>
                            <input
                              type="text"
                              id="userPhoneId"
                              className="form-control"
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
                              className="form-label mb-0"
                            >
                              性別
                            </label>
                          </div>
                          <div className="col-12 mb-2 mt-2 mx-1">
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="inlineRadioOptions"
                                id="inlineRadio1"
                                value={0}
                                onChange={this.handleGenderChange}
                                checked={this.state.selectedGender === 0}
                              />
                              <label
                                className="form-check-label"
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
                                className="form-check-label"
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
                                className="form-check-label"
                                for="inlineRadio3"
                              >
                                不提供
                              </label>
                            </div>
                          </div>

                          <div className="col-12">
                            <label
                              for="inlineRadio1"
                              className="form-label mb-0 mt-3"
                            >
                              生日
                            </label>
                          </div>

                          <div className="datepicker-container profiledate">
                            <DatePicker
                              className="text-des form-control"
                              selected={this.state.selectedDate}
                              maxDate={new Date()}
                              dateFormat="yyyy-MM-dd"
                              onChange={this.handleDateChange}
                            />
                          </div>
                          <div className="col-12">
                            <label
                              htmlFor="useraddress"
                              className="form-label mb-0 mt-3"
                            >
                              居住地
                            </label>
                          </div>
                          <div className="col-6 mt-2">
                            <select
                              className="form-select"
                              aria-label="Default select example"
                              value={this.state.userData.city_id || ""}
                              onChange={this.handleCityChange} // 修改为handleCityChange
                            >
                              <option value="">選擇城市</option>
                              {city &&
                                city.map((city) => (
                                  <option
                                    key={city.city_id}
                                    value={city.city_id}
                                  >
                                    {city.city}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="col-6 mt-2">
                            <select
                              className="form-select"
                              aria-label="Default select example"
                              value={this.state.userData.area_id || ""}
                              onChange={this.handleRegionChange} // 修改为handleRegionChange
                            >
                              <option value="">選擇地區</option>
                              {region &&
                                region.map((region) => (
                                  <option
                                    key={region.region_id}
                                    value={region.region_id}
                                  >
                                    {region.region}
                                  </option>
                                ))}
                            </select>
                          </div>

                          <div className="col-12 mt-5">
                            <button
                              id="profileButton"
                              className="btn btn-profileButton px-5"
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
                            <label for="inputPassword" className="form-label">
                              <span className="text-danger">*</span>舊密碼
                            </label>
                            <input
                              type="password"
                              id="inputOldPassword"
                              name="oldPassword"
                              className="form-control"
                              required
                              autocomplete="current-password"
                            />
                            <div className="invalid-feedback">不能為空</div>
                          </div>

                          <div className="col-12 mb-4">
                            <label
                              for="inputNewPassword"
                              className="form-label"
                            >
                              <span className="text-danger">*</span>新密碼
                            </label>
                            <input
                              type="password"
                              id="inputNewPassword"
                              name="newPassword"
                              className="form-control"
                              required
                              autocomplete="new-password"
                            />
                            <div className="invalid-feedback">不能為空</div>
                          </div>

                          <div className="col-12 mb-4">
                            <label
                              for="inputNewPassword2"
                              className="form-label"
                            >
                              <span className="text-danger">*</span>
                              再次輸入新密碼
                            </label>
                            <input
                              type="password"
                              id="inputNewPassword2"
                              name="newPassword"
                              className="form-control"
                              required
                              autocomplete="new-password"
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
                        <div className="col">
                          <div className="card h-100 text-center">
                            <div className="card-header fw-bold">完成</div>
                            <div className="text-center mt-3">
                              <img
                                src="./img/Member_Area/LeDian_LOGO-05.png"
                                className="card-img-top w-25 rounded-circle border"
                                alt="品牌LOGO"
                              />
                            </div>
                            <div className="card-body">
                              <p className="card-title">03-13 09:30</p>
                              <p className="card-text">
                                <span className="me-2">迷客夏</span>
                                <span>台中勤美店</span>
                              </p>
                            </div>
                            <div className="card-footer">
                              <h4 className="mt-2 fw-bold">共 336 元</h4>
                            </div>
                            <button
                              className="btn btn-footer mx-3 mb-3"
                              data-bs-toggle="modal"
                              data-bs-target="#Orders_staticBackdrop"
                            >
                              請為您的訂單評分
                            </button>
                          </div>
                        </div>
                        <div className="col">
                          <div className="card h-100 text-center">
                            <div className="card-header fw-bold">完成</div>
                            <div className="text-center mt-3">
                              <img
                                src="./img/Member_Area/LeDian_LOGO-05.png"
                                className="card-img-top w-25 rounded-circle border"
                                alt="品牌LOGO"
                              />
                            </div>
                            <div className="card-body">
                              <p className="card-title">03-13 09:30</p>
                              <p className="card-text">
                                <span className="me-2">迷客夏</span>
                                <span>台中勤美店</span>
                              </p>
                            </div>
                            <div className="card-footer">
                              <h4 className="mt-2 fw-bold">共 336 元</h4>
                            </div>
                            <button
                              className="btn btn-footer mx-3 mb-3"
                              data-bs-toggle="modal"
                              data-bs-target="#Orders_staticBackdrop"
                            >
                              請為您的訂單評分
                            </button>
                          </div>
                        </div>
                        <div className="col">
                          <div className="card h-100 text-center">
                            <div className="card-header fw-bold">完成</div>
                            <div className="text-center mt-3">
                              <img
                                src="./img/Member_Area/LeDian_LOGO-05.png"
                                className="card-img-top w-25 rounded-circle border"
                                alt="品牌LOGO"
                              />
                            </div>
                            <div className="card-body">
                              <p className="card-title">03-13 09:30</p>
                              <p className="card-text">
                                <span className="me-2">迷客夏</span>
                                <span>台中勤美店</span>
                              </p>
                            </div>
                            <div className="card-footer">
                              <h4 className="mt-2 fw-bold">共 336 元</h4>
                            </div>
                            <button
                              className="btn btn-footer mx-3 mb-3"
                              data-bs-toggle="modal"
                              data-bs-target="#Orders_staticBackdrop"
                            >
                              請為您的訂單評分
                            </button>
                          </div>
                        </div>
                        <div className="col">
                          <div className="card h-100 text-center">
                            <div className="card-header fw-bold">完成</div>
                            <div className="text-center mt-3">
                              <img
                                src="./img/Member_Area/LeDian_LOGO-05.png"
                                className="card-img-top w-25 rounded-circle border"
                                alt="品牌LOGO"
                              />
                            </div>
                            <div className="card-body">
                              <p className="card-title">03-13 09:30</p>
                              <p className="card-text">
                                <span className="me-2">迷客夏</span>
                                <span>台中勤美店</span>
                              </p>
                            </div>
                            <div className="card-footer">
                              <h4 className="mt-2 fw-bold">共 336 元</h4>
                            </div>
                            <button
                              className="btn btn-footer mx-3 mb-3"
                              data-bs-toggle="modal"
                              data-bs-target="#Orders_staticBackdrop"
                            >
                              請為您的訂單評分
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="tab-pane fade" id="Barcode-v">
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
        await Axios.post('http://localhost:8000/logout');
    
        
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

}

export default Profile;
