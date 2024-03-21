import React, { Component } from "react";
import "../css/ledian.css";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { PiMedal } from "react-icons/pi";
import { PiCoins } from "react-icons/pi";
import { GiCancel } from "react-icons/gi";
import GradeIcon from "@mui/icons-material/Grade";
import Axios from "axios";
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
  Autocomplete,
  DistanceMatrixService,
} from "@react-google-maps/api";
// import axios from "axios";

<head>
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCxryD8kH56hfiJ0bJt6r_KQ6G4MEZY6dI&loading=async&libraries=places,drawing,geometry&callback=initMap&v=weekly"></script>
</head>;

class dian extends Component {
  state = {
    currentLocation: { lat: null, lng: null },
    search: "搜尋店家",
    branchList: [{}],
    brandList: [{}],
    branchPosition: [
      {
        branchId: 1,
        branchAddress: "台中市西屯區中工三路181號1樓",
        lat: 24.1767266,
        lng: 120.6183528,
      },
    ],
    distances: {},
    productList: [{}],
    // nearbyChecked: false, // 新增一个状态来跟踪复选框的状态
    // starChecked: false, // 添加星评优选选项的状态
    star4: [],
  };

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude: lat, longitude: lng } }) => {
          const pos = { lat, lng };
          this.setState({ currentLocation: pos }, () => {
            this.getData();
          });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  getData = async () => {
    try {
      const resultBranch = await Axios.get(
        "http://localhost:8000/index/branch"
      );
      const resultBrand = await Axios.get("http://localhost:8000/index/brand");
      const resultProduct = await Axios.get(
        "http://localhost:8000/index/products"
      );
      const newState = { ...this.state };
      newState.branchList = resultBranch.data;
      newState.brandList = resultBrand.data;
      newState.productList = resultProduct.data;
      newState.productList.map((item, i) => {
        newState.path[
          i
        ] = `/img/class/${newState.productList[i].product_img}.png`;
      });

      newState.branchPosition = resultBranch.data.map((branch) => ({
        branchId: branch.branch_id,
        branchAddress: branch.branch_address,
        lat: branch.branch_latitude,
        lng: branch.branch_longitude,
      }));
      this.setState(newState, () => {
        this.calculateDistances();
      });
      console.log(this.state);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  calculateDistances = () => {
    const currentLat = this.state.currentLocation.lat;
    const currentLng = this.state.currentLocation.lng;
    const branchPosition = this.state.branchPosition;
    if (currentLat !== null && currentLng !== null) {
      const R = 6371; // 地球平均半径（km）
      const distances = {};
      branchPosition.forEach((branch) => {
        const { branchId, lat, lng } = branch;
        const dLat = this.deg2rad(lat - currentLat);
        const dLng = this.deg2rad(lng - currentLng);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.deg2rad(currentLat)) *
            Math.cos(this.deg2rad(lat)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distances[branchId] = (R * c).toFixed(1); // 保留一位小数
      });
      this.setState({ distances });
    }
  };

  deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  render() {
    const currentLat = this.state.currentLocation.lat;
    const currentLng = this.state.currentLocation.lng;
    const distances = this.state.distances;
    // const nearbyChecked = this.state.nearbyChecked; // 获取复选框状态
    // const starChecked = this.state.starChecked; // 获取星评优选选项的状态

    return (
      <React.Fragment>
        <div id='header'
            style={{
                boxShadow: '1px 3px 10px #cccccc',
                marginBottom: '4px',
            }} 
            className='d-flex justify-content-between'>
            <div className='col-7 col-sm-7 col-md-6 col-xl-5 d-flex ms-2 justify-content-between align-items-center'>
            <div id='menu' className='col-8'><h2 className='btn text-start  my-auto fs-4' onClick={this.toggleMenuNav}>☰</h2></div>
                <h4 id='homeBtn' className='my-auto btn' onClick={()=>{window.location="/index"}}><img id='logo' src='/img/index/LeDian_LOGO-05.png'></img></h4>
                <h4 className='my-auto p-0 btn headerText menuBtn d-flex align-items-center justify-content-center'><HiOutlineShoppingBag className='fs-4'/>購物車</h4>
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


            <div className='d-flex me-2  align-items-center'>
                <h4 id='loginBtn' className='my-auto btn headerText' onClick={this.toggleMemberNav}>登入/註冊▼</h4>
                <div id='memberNav' className='collapse'>
                    <img id='memberNavImg' src={("/img/index/LeDian_LOGO-05.png")} alt='logo'></img>
                    <div className='p-2'>
                        <h4 className='headerText text-center my-2' onClick={()=>{window.location="/profile"}}>個人檔案</h4><hr />
                        <h4 className='headerText text-center my-2' onClick={()=>{window.location="/profile"}}>帳號管理</h4><hr />
                        <h4 className='headerText text-center my-2' onClick={()=>{window.location="/profile"}}>歷史訂單</h4><hr />
                        <h4 className='headerText text-center my-2' onClick={()=>{window.location="/profile"}}>載具存取</h4><hr />
                        <h4 className='headerText text-center my-2'>登出</h4>
                    </div>
                </div>
            </div>
        </div>
        <div id='menuNav' className='menuNav d-flex flex-column align-items-center'>
            <h4 className='menuText my-3 mainColor border-bottom border-secondary'><HiOutlineShoppingBag className='fs-4'/>購物車</h4>
            <h4 className='menuText my-3 mainColor border-bottom border-secondary' onClick={()=>{window.location="/brand"}}><PiMedal className='fs-4'/>品牌專區</h4>
            <h4 className='menuText my-3 mainColor border-bottom border-secondary' onClick={this.pointinfoShow}><PiCoins className='fs-4'/>集點資訊</h4>
        </div>


        <div id="banner" className="d-flex justify-content-center">
          <img
            id="bannerImg"
            src={"/img/index/Home_Banner_01.jpg"}
            alt="homeBanner"
            className="img-fluid"
          ></img>
        </div>
        <div className="container">
          <div className="navbar row">
            <div
              className="navImg col-4 btn"
              onClick={() => {
                window.location = "/le";
              }}
            >
              <img
                src={"/img/index/LeDian_BANNER-01.jpg"}
                alt="navImg"
                className="img-fluid"
              ></img>
            </div>
            <div
              className="navImg col-4 btn"
              onClick={() => {
                window.location = "/dian";
              }}
            >
              <img
                src={"/img/index/LeDian_BANNER-02.jpg"}
                alt="navImg"
                className="img-fluid"
              ></img>
            </div>
            <div
              className="navImg col-4 btn"
              onClick={() => {
                window.location = "/news";
              }}
            >
              <img
                src={"/img/index/LeDian_BANNER-05.jpg"}
                alt="navImg"
                className="img-fluid"
              ></img>
            </div>
          </div>
          <input
            type="text"
            id="search"
            name="search"
            onChange={this.searchChange}
            value={this.state.search}
            className="form-control rounded-pill ps-4 bg-secondary-subtle"
          ></input>
        </div>

        <main>
          <div className="container">
            <div className="row">
              <div className="col-sm-5 col-md-4 col-lg-3 col-xxl-2 justify-content-center">
                <div className="choose_left_de">
                  <div className="choose_left_1">透過以下分類篩選</div>
                  <div className="choose_classification_1">
                    <div className="classification_title">快速篩選</div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        value=""
                        id="classification_1"
                        name="nearbyChecked"
                        onChange={this.handleCheckboxChange} // 在复选框的onChange事件中调用handleCheckboxChange函数
                      />
                      <label
                        className="form-check-label"
                        htmlFor="classification_1"
                      >
                        附近店家
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        value=""
                        id="classification_2"
                        name="starChecked" // 设置复选框的name属性，用于标识不同的选项
                        // onChange={this.handleCheckboxChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="classification_2"
                      >
                        星評優選
                      </label>
                    </div>
                  </div>
                  <div className="choose_classification_2">
                    <div className="classification_title">台中探索</div>
                    <div className="addressall">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_1"
                          value="中區"
                        />
                        <label className="form-check-label" htmlFor="address_1">
                          {" "}
                          中區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_2"
                          value="東區"
                        />
                        <label className="form-check-label" htmlFor="address_2">
                          {" "}
                          東區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_3"
                          value="南區"
                        />
                        <label className="form-check-label" htmlFor="address_3">
                          {" "}
                          南區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_4"
                          value="西區"
                        />
                        <label className="form-check-label" htmlFor="address_4">
                          {" "}
                          西區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_5"
                          value="北區"
                        />
                        <label className="form-check-label" htmlFor="address_5">
                          {" "}
                          北區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_6"
                          value="北屯區"
                        />
                        <label className="form-check-label" htmlFor="address_6">
                          {" "}
                          北屯區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_7"
                          value="西屯區"
                        />
                        <label className="form-check-label" htmlFor="address_7">
                          {" "}
                          西屯區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_8"
                          value="南屯區"
                        />
                        <label className="form-check-label" htmlFor="address_8">
                          {" "}
                          南屯區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_9"
                          value="太平區"
                        />
                        <label className="form-check-label" htmlFor="address_9">
                          {" "}
                          太平區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_10"
                          value="大里區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_10"
                        >
                          {" "}
                          大里區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_11"
                          value="霧峰區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_11"
                        >
                          {" "}
                          霧峰區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_12"
                          value="烏日區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_12"
                        >
                          {" "}
                          烏日區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_13"
                          value="豐原區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_13"
                        >
                          {" "}
                          豐原區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_14"
                          value="后里區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_14"
                        >
                          {" "}
                          后里區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_15"
                          value="石岡區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_15"
                        >
                          {" "}
                          石岡區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_16"
                          value="東勢區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_16"
                        >
                          {" "}
                          東勢區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_17"
                          value="新社區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_17"
                        >
                          {" "}
                          新社區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_18"
                          value="潭子區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_18"
                        >
                          {" "}
                          潭子區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_19"
                          value="大雅區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_19"
                        >
                          {" "}
                          大雅區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_20"
                          value="神岡區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_20"
                        >
                          {" "}
                          神岡區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_21"
                          value="大肚區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_21"
                        >
                          {" "}
                          大肚區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_22"
                          value="沙鹿區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_22"
                        >
                          {" "}
                          沙鹿區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_23"
                          value="龍井區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_23"
                        >
                          {" "}
                          龍井區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_24"
                          value="梧棲區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_24"
                        >
                          {" "}
                          梧棲區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_25"
                          value="清水區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_25"
                        >
                          {" "}
                          清水區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_26"
                          value="大甲區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_26"
                        >
                          {" "}
                          大甲區{" "}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="address"
                          id="address_27"
                          value="外埔區"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="address_27"
                        >
                          {" "}
                          外埔區{" "}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="choose_classification_3">
                    <div className="classification_title">尋星饗宴</div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="score"
                        id="score_1"
                      />
                      <label className="form-check-label" htmlFor="score_1">
                        <GradeIcon className="me-1 iconColor" /> 4.5以上
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="score"
                        id="score_2"
                      />
                      <label className="form-check-label" htmlFor="score_2">
                        <GradeIcon className="me-1 iconColor" /> 4.0以上
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="score"
                        id="score_2"
                      />
                      <label className="form-check-label" htmlFor="score_2">
                        <GradeIcon className="me-1 iconColor" /> 3.5以上
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="score"
                        id="score_2"
                      />
                      <label className="form-check-label" htmlFor="score_2">
                        <GradeIcon className="me-1 iconColor" /> 3.0以上
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-7 col-md-8 col-lg-9 col-xxl-10 row choose_right justify-content-center">
                {/* 附近店鋪 */}
                {currentLat !== null && currentLng !== null ? (
                  <>
                    {Object.entries(distances)
                      .filter(([branchId, distance]) => distance < 1.5)
                      .sort((a, b) => a[1] - b[1])
                      .map(([branchid, distance]) => (
                        <div key={branchid} className="col-lg-6 col-xxl-4 my-3">
                          <div className="card">
                            <div className="image">
                              {this.state.branchList.map((branch) => {
                                if (branch.branch_id == branchid) {
                                  var id = branch.brand_id;
                                  return this.state.brandList.map(function (
                                    brand
                                  ) {
                                    if (brand.brand_id == id) {
                                      return (
                                        <img
                                          src={`/img/mainproduct/${brand.brand_id}.png`}
                                          className="card-img-top"
                                          alt="..."
                                          key={branch.branch_id}
                                        />
                                      );
                                    } else {
                                      return null;
                                    }
                                  });
                                } else {
                                  return null;
                                }
                              })}
                            </div>
                            <div className="card-body">
                              <div className="row information">
                                <p className="col-3 score align-items-center d-flex align-items-center justify-content-center">
                                  <GradeIcon className="me-1 iconColor" />
                                  {/* 評分 */}
                                  {this.state.branchList.map(function (e) {
                                    if (e.branch_id == branchid) {
                                      return e.branch_score.toFixed(1); //小數點後補0
                                    } else {
                                      return null;
                                    }
                                  })}
                                </p>

                                <p className="col-5 time">
                                  {/* 營業時間 */}

                                  {this.state.branchList.map((branch) => {
                                    if (branch.branch_id == branchid) {
                                      const day = new Date().getDay();
                                      const openTime = [
                                        branch.Sun_start,
                                        branch.Mon_start,
                                        branch.Tue_start,
                                        branch.Wed_start,
                                        branch.Thu_start,
                                        branch.Fri_start,
                                        branch.Sat_start,
                                      ];
                                      const closeTime = [
                                        branch.Sun_end,
                                        branch.Mon_end,
                                        branch.Tue_end,
                                        branch.Wed_end,
                                        branch.Thu_end,
                                        branch.Fri_end,
                                        branch.Sat_end,
                                      ];
                                      if (
                                        (openTime[day] == "店休") |
                                        (closeTime[day] == "店休")
                                      ) {
                                        return "店休";
                                      } else {
                                        return `${openTime[day]}~${closeTime[day]}`;
                                      }
                                    } else {
                                      return null;
                                    }
                                  })}
                                </p>
                                <p className="col-4 kilometre">
                                  約 {distance} 公里
                                </p>
                              </div>
                              <p className="card-title lh-sm">
                                {/* 品牌名 */}
                                {this.state.branchList.map((branch) => {
                                  if (branch.branch_id == branchid) {
                                    var id = branch.brand_id;
                                    return this.state.brandList.map(function (
                                      brand
                                    ) {
                                      if (brand.brand_id == id) {
                                        return brand.brand_name;
                                      } else {
                                        return null;
                                      }
                                    });
                                  } else {
                                    return null;
                                  }
                                })}{" "}
                                {/* 店名 */}
                                {this.state.branchList.map(function (e) {
                                  if (e.branch_id == branchid) {
                                    return e.branch_name;
                                  } else {
                                    return null;
                                  }
                                })}
                                <br />
                                {this.state.branchList.map(function (e) {
                                  if (e.branch_id == branchid) {
                                    return (
                                      <a
                                        key={branchid}
                                        href={
                                          "https://www.google.com/maps/place/" +
                                          e.branch_address
                                        }
                                      >
                                        {e.branch_address}
                                      </a>
                                    );
                                  } else {
                                    return null;
                                  }
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </>
                ) : (
                  <h3>無法讀取位置...</h3>
                )}

                {/* 星評優選 */}
              </div>
            </div>
          </div>
        </main>

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
            className="col-3 d-flex row align-items-center justify-content-center pe-1"
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
  searchChange = (e) => {
    var newState = { ...this.state };
    newState.search = e.target.value;
    this.setState(newState);
  };
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
    document.getElementById("memberNav").classList.toggle("collapse");
  };

  toggleMenuNav = () => {
    document.getElementById("menuNav").classList.toggle("menuNav");
  };

  // componentDidMount = async () => {
  //   try {
  //     var resultstar4 = await axios.get("http://localhost:8000/dian/star4");
  //     var branchList = await axios.get("http://localhost:8000/index/branch");
  //     var brandList = await axios.get("http://localhost:8000/index/brand");

  //     this.setState({
  //       resultstar4: resultstar4.data,
  //       branchList: branchList.data,
  //       brandList: brandList.data,
  //     });
  //     console.log(this.state);
  //   } catch (ereor) {
  //     console.error("Error", error);
  //   }
  // };

  handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked }); // 更新对应选项的状态
  };
}

export default dian;
