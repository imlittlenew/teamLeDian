import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/cart.css";
import { FaRegTrashAlt } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { PiMedal } from "react-icons/pi";
import { PiCoins } from "react-icons/pi";
import { GiCancel } from "react-icons/gi";
import axios from "axios";
class cartList extends Component {
  state = {
    dbData: [
      {
        cart_id: 1,
        user_id: 1,
        brand_id: 1,
        brand_name: "迷客夏",
        banch_id: 1,
        branch_name: "臺中世貿店",
        branch_address: "台中市大里區成功路462號",
        total_item: 4,
        total_item_price: 145,
      },
    ],
  };
  delete_btn = (e) => {
    e.preventDefault();
    alert("delete");
  };
  render() {
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

        <div className=" body-bg">
          <div className="container">
            <div className="row">
              <h1 className="col mb-5 mt-5 text-title-b">購物清單</h1>

              {this.state.dbData.map((cart, i) => {
                return (
                  <div
                    className="mb-5 mx-auto list-item row d-flex align-items-stretch"
                    key={i}
                  >
                    <a
                      className="d-md-block p-4 a-link"
                      href={`./cartPay/${cart.cart_id}`}
                    >
                      <div className="row text-end">
                        <p className="col text-des-small">02/23 20:30</p>
                      </div>
                      <div className="row d-flex d-flex align-items-stretch">
                        <div className="col-auto col-3-mb mb-3 mb-md-0 mx-auto">
                          <img
                            src={(`img/logo/${cart.brand_id}.png`)}
                            alt="log"
                            className="logo"
                          />
                        </div>

                        <div className="col-12 col-md-5 mb-md-0 text-center text-md-start d-flex flex-column justify-content-around">
                          <h2 className="text-title">{`${cart.brand_name} (${cart.branch_name})`}</h2>
                          <p className="text-des-small d-none d-md-block">
                            {cart.branch_address}
                          </p>
                        </div>
                        <div className="col-12 col-md mb-3 mb-md-0">
                          <div className="row d-flex flex-column mt-3">
                            <div className="col d-flex justify-content-around">
                              <p className="text-title">{`${cart.total_item}項`}</p>
                              <p className="text-title">
                                ${cart.total_item_price}
                              </p>
                              <div className="text-center">
                                <div className="btn btn-pay">結帳</div>
                                <div
                                  onClick={this.delete_btn}
                                  className="btn-garbage ps-2 mt-3"
                                >
                                  <FaRegTrashAlt className="trash" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                );
              })}

              {/* <div className="mb-5 mx-auto list-item row d-flex align-items-stretch">
                <a className="d-md-block p-4 a-link" href="./payStep.html">
                  <div className="row text-end">
                    <p className="col text-des-small">02/23 20:30</p>
                  </div>
                  <div className="row d-flex d-flex align-items-stretch">
                    <div className="col-auto col-3-mb mb-3 mb-md-0 mx-auto">
                      <img
                        src={("img/img/logo/4.png")}
                        alt="log"
                        className="logo"
                      />
                    </div>

                    <div className="col-12 col-md-5 mb-md-0 text-center text-md-start d-flex flex-column justify-content-around">
                      <h2 className="text-title">龜記茗品 (大里成功店)</h2>
                      <p className="text-des-small d-none d-md-block">
                        台中市大里區成功路462號
                      </p>
                    </div>
                    <div className="col-12 col-md mb-3 mb-md-0">
                      <div className="row d-flex flex-column mt-3">
                        <div className="col d-flex justify-content-around">
                          <p className="text-title">5項</p>
                          <p className="text-title">$302</p>
                          <div className="text-center">
                            <div className="btn btn-pay">結帳</div>
                            <div
                              onClick={this.delete_btn}
                              className="btn-garbage ps-2 mt-3"
                            >
                              <FaRegTrashAlt className="trash" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              <div className="mb-5 mx-auto list-item row d-flex align-items-stretch">
                <a className="d-md-block p-4 a-link" href="./payStep.html">
                  <div className="row text-end">
                    <p className="col text-des-small">02/23 20:30</p>
                  </div>
                  <div className="row d-flex d-flex align-items-stretch">
                    <div className="col-auto col-3-mb mb-3 mb-md-0 mx-auto">
                      <img
                        src={("img/img/logo/4.png")}
                        alt="log"
                        className="logo"
                      />
                    </div>

                    <div className="col-12 col-md-5 mb-md-0 text-center text-md-start d-flex flex-column justify-content-around">
                      <h2 className="text-title">龜記茗品 (大里成功店)</h2>
                      <p className="text-des-small d-none d-md-block">
                        台中市大里區成功路462號
                      </p>
                    </div>
                    <div className="col-12 col-md mb-3 mb-md-0">
                      <div className="row d-flex flex-column mt-3">
                        <div className="col d-flex justify-content-around">
                          <p className="text-title">5項</p>
                          <p className="text-title">$302</p>
                          <div className="text-center">
                            <div className="btn btn-pay">結帳</div>
                            <div
                              onClick={this.delete_btn}
                              className="btn-garbage ps-2 mt-3"
                            >
                              <FaRegTrashAlt className="trash" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div> */}
            </div>
          </div>
        </div>
        <div id="footer" className="d-flex">
          <div id="footerLogo" className="col-3">
            <img
              id='"footerImg"'
              className="img-fluid"
              src={("img/img/index/LeDian_LOGO-04.png")}
              alt="footerLogo"
            />
          </div>
          <div className="col-6 d-flex align-items-center">
            <div id="footerlink" className="col-2 d-flex flex-column">
              <div className="d-flex">
                <div>
                  <img
                    className="img-fluid"
                    src={("img/img/index/facebook.png")}
                    alt="fackbook"
                  />
                </div>
                <div>
                  <img
                    className="img-fluid"
                    src={("img/img/index/instagram.png")}
                    alt="instagram"
                  />
                </div>
                <div>
                  <img
                    className="img-fluid"
                    src={("img/img/index/line.png")}
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

  componentDidMount = async () => {
    let newState = { ...this.state };
    let result;
    result = await axios.get("http://localhost:8000/cartlist");

    newState.dbData = result.data;
    this.setState(newState);
    console.log(newState);
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
        window.location = "/login";
    }
  }
  toggleMenuNav = () => {
      document.getElementById('menuNav').classList.toggle('menuNav');
  }
  logoutClick = () => {
      localStorage.removeItem('userdata')
      document.getElementById('memberNav').classList.add('collapse');
      this.setState({})
  }
  loginCheck = () => {
    const userdata = JSON.parse(localStorage.getItem('userdata'));
    const userImg = userdata.user_img;
    if(userdata){
        return (
            <h4 id='loginBtn' className='my-auto btn headerText text-nowrap' onClick={this.toggleMemberNav}>                
                <img id='memberHeadshot' src={(`/img/Member_Area/${userImg}`)} alt='memberHeadshot' className='img-fluid my-auto mx-1 rounded-circle'></img>
                會員專區▼</h4>
            )
    }else {
        return (<h4 id='loginBtn' className='my-auto btn headerText align-self-center' onClick={this.toggleMemberNav}>登入/註冊▼</h4>)
    }              
}


}

export default cartList;
