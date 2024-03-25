import React, { Component } from "react";
import "../css/ledian.css";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { PiMedal } from "react-icons/pi";
import { PiCoins } from "react-icons/pi";
import { GiCancel } from "react-icons/gi";
import GradeIcon from "@mui/icons-material/Grade";
import Axios from "axios";

class dian extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: "",
      content: [],
      score: [],
      userLocation: null,
      selectedNearby: "",
      resultlebrand: [],
      brand: [],
    };
  }

  componentDidMount() {
    this.handleScoreChange("4.0");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log("User location:", userLocation);
        this.setState({ userLocation });
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );

    this.fetchBrandData();
  }

  fetchBrandData = async () => {
    try {
      var brand = await Axios.get("http://localhost:8000/all/brand");

      this.setState({
        brand: brand.data,
      });
      console.log(this.state);
    } catch (error) {
      console.error(error);
    }
  };
  calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(1);
  };

  handleNearbyChange = async (selectedNearby) => {
    try {
      this.setState({ score: "", selectedOption: "" });

      let url = "";
      if (selectedNearby === "nearby") {
        url = "http://localhost:8000/dian/address";
      }

      const response = await Axios.get(url);
      const contentWithDistance = response.data
        .map((item) => {
          const distance = this.calculateDistance(
            this.state.userLocation.latitude,
            this.state.userLocation.longitude,
            item.branch_latitude,
            item.branch_longitude
          );

          // 只有當距離小於1.5公里時才將該地點添加到狀態中
          if (parseFloat(distance) < 1.5) {
            return {
              ...item,
              distance: distance,
            };
          }
          return null; // 如果距離大於等於1.5公里，則返回 null
        })
        .filter((item) => item !== null); // 去除距離大於等於1.5公里的地點

      this.setState({ selectedNearby, content: contentWithDistance });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  handleOptionChange = async (selectedOption) => {
    try {
      this.setState({ score: "", selectedNearby: "" });

      let url = "";

      if (selectedOption === "400") {
        url = "http://localhost:8000/dian/address_400";
      } else if (selectedOption === "401") {
        url = "http://localhost:8000/dian/address_401";
      } else if (selectedOption === "402") {
        url = "http://localhost:8000/dian/address_402";
      } else if (selectedOption === "403") {
        url = "http://localhost:8000/dian/address_403";
      } else if (selectedOption === "404") {
        url = "http://localhost:8000/dian/address_404";
      } else if (selectedOption === "406") {
        url = "http://localhost:8000/dian/address_406";
      } else if (selectedOption === "407") {
        url = "http://localhost:8000/dian/address_407";
      } else if (selectedOption === "408") {
        url = "http://localhost:8000/dian/address_408";
      } else if (selectedOption === "411") {
        url = "http://localhost:8000/dian/address_411";
      } else if (selectedOption === "412") {
        url = "http://localhost:8000/dian/address_412";
      } else if (selectedOption === "413") {
        url = "http://localhost:8000/dian/address_413";
      } else if (selectedOption === "414") {
        url = "http://localhost:8000/dian/address_414";
      } else if (selectedOption === "420") {
        url = "http://localhost:8000/dian/address_420";
      } else if (selectedOption === "421") {
        url = "http://localhost:8000/dian/address_421";
      } else if (selectedOption === "422") {
        url = "http://localhost:8000/dian/address_422";
      } else if (selectedOption === "423") {
        url = "http://localhost:8000/dian/address_423";
      } else if (selectedOption === "426") {
        url = "http://localhost:8000/dian/address_426";
      } else if (selectedOption === "427") {
        url = "http://localhost:8000/dian/address_427";
      } else if (selectedOption === "428") {
        url = "http://localhost:8000/dian/address_428";
      } else if (selectedOption === "429") {
        url = "http://localhost:8000/dian/address_429";
      } else if (selectedOption === "432") {
        url = "http://localhost:8000/dian/address_432";
      } else if (selectedOption === "433") {
        url = "http://localhost:8000/dian/address_433";
      } else if (selectedOption === "434") {
        url = "http://localhost:8000/dian/address_434";
      } else if (selectedOption === "435") {
        url = "http://localhost:8000/dian/address_435";
      } else if (selectedOption === "436") {
        url = "http://localhost:8000/dian/address_436";
      } else if (selectedOption === "437") {
        url = "http://localhost:8000/dian/address_437";
      } else if (selectedOption === "438") {
        url = "http://localhost:8000/dian/address_438";
      }

      const response = await Axios.get(url);
      const contentWithDistance = response.data.map((item) => {
        const distance = this.calculateDistance(
          this.state.userLocation.latitude,
          this.state.userLocation.longitude,
          item.branch_latitude,
          item.branch_longitude
        );
        return {
          ...item,
          distance: distance,
        };
      });
      this.setState({ selectedOption, content: contentWithDistance });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  handleScoreChange = async (selectedScore) => {
    try {
      this.setState({ selectedOption: "", selectedNearby: "" });

      let url = "";
      if (selectedScore === "4.5") {
        url = "http://localhost:8000/dian/score_4.5";
      } else if (selectedScore === "4.0") {
        url = "http://localhost:8000/dian/score_4.0";
      } else if (selectedScore === "3.5") {
        url = "http://localhost:8000/dian/score_3.5";
      } else if (selectedScore === "3.0") {
        url = "http://localhost:8000/dian/score_3.0";
      }

      const response = await Axios.get(url);
      const contentWithDistance = response.data.map((item) => {
        if (this.state.userLocation) {
          const distance = this.calculateDistance(
            this.state.userLocation.latitude,
            this.state.userLocation.longitude,
            item.branch_latitude,
            item.branch_longitude
          );
          return {
            ...item,
            distance: parseFloat(distance).toFixed(1),
          };
        } else {
          return {
            ...item,
            distance: "N/A", // 如果 userLocation 為 null，則設置距離為 N/A
          };
        }
      });
      this.setState({ score: selectedScore, content: contentWithDistance });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  render() {
    const { selectedOption, content, selectedNearby } = this.state;
    const shuffledContent = content.sort(() => Math.random() - 0.5);

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
                    <h4 id='homeBtn' className='my-auto btn' onClick={()=>{window.location="/index"}}><img id='logo' src='/img/index/LeDian_LOGO-05.png' alt='logo'></img></h4>
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
                        checked={selectedNearby === "nearby"}
                        onChange={() => this.handleNearbyChange("nearby")}
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
                        checked={this.state.score === "4.0"}
                        onChange={() => this.handleScoreChange("4.0")}
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
                          data-postcode
                          checked={selectedOption === "400"}
                          onChange={() => this.handleOptionChange("400")}
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
                          checked={selectedOption === "401"}
                          onChange={() => this.handleOptionChange("401")}
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
                          checked={selectedOption === "402"}
                          onChange={() => this.handleOptionChange("402")}
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
                          checked={selectedOption === "403"}
                          onChange={() => this.handleOptionChange("403")}
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
                          checked={selectedOption === "404"}
                          onChange={() => this.handleOptionChange("404")}
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
                          checked={selectedOption === "406"}
                          onChange={() => this.handleOptionChange("406")}
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
                          checked={selectedOption === "407"}
                          onChange={() => this.handleOptionChange("407")}
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
                          checked={selectedOption === "408"}
                          onChange={() => this.handleOptionChange("408")}
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
                          checked={selectedOption === "411"}
                          onChange={() => this.handleOptionChange("411")}
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
                          checked={selectedOption === "412"}
                          onChange={() => this.handleOptionChange("412")}
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
                          checked={selectedOption === "413"}
                          onChange={() => this.handleOptionChange("413")}
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
                          checked={selectedOption === "414"}
                          onChange={() => this.handleOptionChange("414")}
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
                          checked={selectedOption === "420"}
                          onChange={() => this.handleOptionChange("420")}
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
                          checked={selectedOption === "421"}
                          onChange={() => this.handleOptionChange("421")}
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
                          checked={selectedOption === "422"}
                          onChange={() => this.handleOptionChange("422")}
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
                          checked={selectedOption === "423"}
                          onChange={() => this.handleOptionChange("423")}
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
                          checked={selectedOption === "426"}
                          onChange={() => this.handleOptionChange("426")}
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
                          checked={selectedOption === "427"}
                          onChange={() => this.handleOptionChange("427")}
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
                          checked={selectedOption === "428"}
                          onChange={() => this.handleOptionChange("428")}
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
                          checked={selectedOption === "429"}
                          onChange={() => this.handleOptionChange("429")}
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
                          checked={selectedOption === "432"}
                          onChange={() => this.handleOptionChange("432")}
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
                          checked={selectedOption === "433"}
                          onChange={() => this.handleOptionChange("433")}
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
                          checked={selectedOption === "434"}
                          onChange={() => this.handleOptionChange("434")}
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
                          checked={selectedOption === "435"}
                          onChange={() => this.handleOptionChange("435")}
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
                          checked={selectedOption === "436"}
                          onChange={() => this.handleOptionChange("436")}
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
                          checked={selectedOption === "437"}
                          onChange={() => this.handleOptionChange("437")}
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
                          checked={selectedOption === "438"}
                          onChange={() => this.handleOptionChange("438")}
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
                        checked={this.state.score === "4.5"}
                        onChange={() => this.handleScoreChange("4.5")}
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
                        checked={this.state.score === "4.0"}
                        onChange={() => this.handleScoreChange("4.0")}
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
                        checked={this.state.score === "3.5"}
                        onChange={() => this.handleScoreChange("3.5")}
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
                        checked={this.state.score === "3.0"}
                        onChange={() => this.handleScoreChange("3.0")}
                      />
                      <label className="form-check-label" htmlFor="score_2">
                        <GradeIcon className="me-1 iconColor" /> 3.0以上
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-7 col-md-8 col-lg-9 col-xxl-10 row choose_right justify-content-center mx-auto">
                {/* 台中探索、尋星饗宴、星評優選 */}
                {shuffledContent.map((item, index) => {
                  let distance = "";

                  if (this.state.userLocation) {
                    distance = this.calculateDistance(
                      this.state.userLocation.latitude,
                      this.state.userLocation.longitude,
                      item.branch_latitude,
                      item.branch_longitude
                    );
                  } else {
                    console.log("User location is not available yet.");
                  }

                  return (
                    <div key={index} className="col-lg-6 col-xxl-4 my-3">
                      <div className="card">
                        <div className="image">
                          <img
                            src={`/img/mainproduct/${item.brand_id}.png`}
                            className="card-img-top"
                            alt="..."
                          />
                          <img
                            src={`/img/logo/${item.brand_id}.png`}
                            className="logo"
                            alt="..."
                          />
                        </div>
                        <div className="card-body">
                          <div className="row information">
                            <p className="col-3 score align-items-center d-flex align-items-center justify-content-center">
                              <GradeIcon className="me-1 iconColor" />
                              {item.branch_score.toFixed(1)}
                            </p>
                            <p className="col-5 time">10:00~23:00</p>
                            <p className="col-4 kilometre">
                              約 {item.distance} 公里
                            </p>
                          </div>
                          <p className="card-title lh-sm">
                            {this.state.brand
                              .filter(
                                (brand) => brand.brand_id === item.brand_id
                              ) // 過濾出符合 brand_id 的品牌
                              .map((brand) => (
                                <span key={brand.brand_id}>
                                  {brand.brand_name}
                                </span>
                              ))}{" "}
                            {item.branch_name}
                            <br />
                            <a
                              href={`https://www.google.com/maps/place/${item.branch_address}`}
                            >
                              {item.branch_address}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
    const userdata = localStorage.getItem('userdata');
    if(userdata){
        document.getElementById('memberNav').classList.toggle('collapse');
    }else{
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

}

export default dian;
