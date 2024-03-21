import React, { Component } from "react";
import "../css/ledian.css";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { PiMedal } from "react-icons/pi";
import { PiCoins } from "react-icons/pi";
import { GiCancel } from "react-icons/gi";
// import axios from "axios";

class le extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        classification_1: false,
        classification_2: false,
        classification_3: false,
        classification_4: false,
        classification_5: false,
      },
      data: [],
      filteredData: [], // 新增 filteredData 狀態來保存篩選後的數據
      resultlebrand: [], // 初始化 resultlebrand 狀態
      search: "搜尋店家",
    };
  }

  componentDidMount() {
    fetch("http://localhost:8000/all/products")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data); // 在此處檢查數據
        this.setState({ data }, () => {
          // 在數據加載完畢後執行一次篩選以顯示所有飲料
          this.filterData();
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  handleFilterChange = (filter) => {
    this.setState(
      (prevState) => ({
        filters: {
          ...prevState.filters,
          [filter]: !prevState.filters[filter],
        },
      }),
      () => {
        // 在狀態更新後重新篩選資料並更新 UI
        console.log("New Filters:", this.state.filters); // 檢查更新後的篩選器狀態
        this.filterData();
      }
    );
  };

  filterData() {
    const { data, filters } = this.state;
    console.log("Filters:", filters); // 檢查篩選器的狀態
    console.log("Data:", data); // 檢查原始數據的狀態

    const filterCondition = (item) => {
      return Object.keys(filters).every((filter) => {
        // 將篩選器的鍵映射到對應的數據屬性名稱
        const dataKey = `product_class_${filter.split("_")[1]}`; // 提取下劃線後的數字部分

        // 檢查篩選器值是否為 true
        if (filters[filter]) {
          // 檢查數據屬性是否等於 1
          if (item[dataKey] === 1) {
            // 滿足篩選條件
            return true;
          } else {
            // 不滿足篩選條件
            return false;
          }
        } else {
          // 如果篩選器為 false，則不進行篩選，直接返回 true
          return true;
        }
      });
    };

    // 使用 filterCondition 函數進行篩選
    const filteredData = data.filter(filterCondition);

    console.log("Filtered Data:", filteredData); // 檢查篩選後的數據
    this.setState({ filteredData });

    return filteredData; // 直接返回篩選後的數據
  }

  render() {
    const { filters, filteredData } = this.state;

    // 如果 filteredData 未定義，顯示載入中的訊息或採取其他適當的措施
    if (!filteredData) {
      return <div>Loading...</div>;
    }

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
              <div className="col-sm-5 col-md-4 col-lg-3 col-xxl-2">
                <div className="choose_left">
                  <div className="choose_left_1">透過以下分類篩選</div>
                  <div className="choose_classification">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="classification_1"
                        checked={filters.classification_1}
                        onChange={() =>
                          this.handleFilterChange("classification_1")
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="classification_1"
                      >
                        精選推味
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="classification_2"
                        checked={filters.classification_2}
                        onChange={() =>
                          this.handleFilterChange("classification_2")
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="classification_2"
                      >
                        茶品精選
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="classification_3"
                        checked={filters.classification_3}
                        onChange={() =>
                          this.handleFilterChange("classification_3")
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="classification_3"
                      >
                        拿鐵探查
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="classification_4"
                        checked={filters.classification_4}
                        onChange={() =>
                          this.handleFilterChange("classification_4")
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="classification_4"
                      >
                        口感尋覓
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="classification_5"
                        checked={filters.classification_5}
                        onChange={() =>
                          this.handleFilterChange("classification_5")
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="classification_5"
                      >
                        新鮮探勘
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-7 col-md-8 col-lg-9 col-xxl-10 row choose_right mx-auto">
                {filteredData.map((item) => (
                  <div key={item.product_id} className="col-lg-6 col-xxl-4 my-3">
                    <div className="card">
                      <div className="image">
                        {/* 動態設定圖片路徑 */}
                        <img
                          src={`/img/class/${item.product_img}.png`}
                          className="card-img-top"
                          alt="..."
                        />
                        {/* 動態設定 logo 路徑 */}
                        <img
                          src={`/img/logo/${item.brand_id}.png`}
                          className="logo"
                          alt="..."
                        />
                      </div>
                      {/* 動態設定標題 */}
                      <div className="card-title">
                        {this.state.resultlebrand.length > 0 &&
                          this.state.resultlebrand.map((brand) => (
                            <span key={brand.brand_id}>{brand.brand_name}</span>
                          ))}
                      </div>

                      {/* 動態設定內容 */}
                      <div className="card-body_la">
                        <p className="card-text">{item.product_name}</p>
                        <div className="d-flex justify-content-center">
                          <p className="price_1 text-center ms-1">
                            {item.products_price_0
                              ? `M${item.products_price_0}`
                              : ""}
                          </p>
                          <p className="price_2 text-center mx-1">
                            {item.products_price_1
                              ? `L${item.products_price_1}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
}

export default le;
