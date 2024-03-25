import React, { Component } from 'react';
import "../css/login.css";
import { Helmet } from 'react-helmet';
import { HiOutlineShoppingBag } from "react-icons/hi";
import { PiMedal } from "react-icons/pi";
import { PiCoins } from "react-icons/pi";
import { GiCancel } from "react-icons/gi";
import Axios from 'axios';
import { Toast } from 'react-bootstrap';
class Login extends Component {
  state = { 
    phone: "",
    email: "",
    password: "",
    password2: "",
    showToast: false,
    toastMessage: '',
  };
    constructor(props) {
        super(props);
        this.state = {
            showLoginForm: true
        };
    }
    // 根據使用者ID從後端獲取使用者資訊的函數
    fetchUserData = async (userId) => {
      try {
        const response = await Axios.get(`http://localhost:8000/user/${userId}`);
        const userData = response.data;
        this.setState({ userData });
      } catch (error) {
        console.error("獲取用戶資料失敗:", error);
      }
    }
    toggleLoginForm = (isLoginForm) => {
        this.setState({
            showLoginForm: isLoginForm
        });
    };
    componentDidMount() {
      this.setState({ showToast: false });
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
  render() {
    return (
        <>
        testtest
        <Helmet>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
        </Helmet>
        <div id='loginheader'>
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

        </div>


        <Toast show={this.state.showToast} onClose={this.toggleToast} className="custom-toast position-fixed  p-3">
        <div class="d-flex">
          <Toast.Body>{this.state.toastMessage}</Toast.Body>
          <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </Toast>


      <div className="d-flex align-items-center"  style={{ paddingTop: '300px' }}>
        <div
          className="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header mb-3">
                <h1 className="modal-title fs-4 text-center" id="staticBackdropLabel">
                  忘記密碼
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <div
                    className="input-group-img d-flex align-items-center justify-content-center rounded-start-2"
                  >
                    <img className="imgicon w-50" src="./img/Member_Area/email.png" alt=" " />
                  </div>
                  <input type="email" className="login form-control" placeholder="電子郵件"  onChange={this.email_change}/>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-forgotPassword fs-5" onClick={this.forgotPassword_click}>
                  重設密碼
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="position-relative">
          <img src="./img/Member_Area/LeDian_LOGO-05.png" className="leftlogoimg" alt=" " />
        </div>
        <div className="position-relative">
          <img src="./img/Member_Area/LeDian_LOGO-06.png" className="rightlogoimg" alt=" " />
        </div>
        <div id="header-image" >
          <img
            src="./img/Member_Area/wave.png"
            alt=" "
            style={{ width: '100%', height: 'auto' }}
          />
        </div>

        <main className="rounded-5 loginmain">
          <div className="login-box">


            <div className="headerlogin text-center rounded-top-4 pt-3">
                    <h2>
                        <button
                            
                            className={this.state.showLoginForm ? 'login-link active loginbold' : 'login-link'}
                            onClick={() => this.toggleLoginForm(true)}
                        >
                            登入
                        </button>
                        {' | '}
                        <button
                        
                            className={!this.state.showLoginForm ? 'signup-link active loginbold' : 'signup-link'}
                            onClick={() => this.toggleLoginForm(false)}
                        >
                            註冊
                        </button>
                    </h2>
                </div>

        {this.state.showLoginForm && (
            <div className="email-login">
              <form className="container" action="/login" method="post">
                <h5 className="text-center welcomeledian m-3">
                  歡迎使用樂點！線上訂餐系統
                </h5>
                <div className="input-group mb-3">
                  <div
                    className="input-group-img d-flex align-items-center justify-content-center rounded-start-2"
                  >
                    <img className="imgicon w-50" src="./img/Member_Area/email.png" alt=" " />
                  </div>
                  <input type="email" className="login form-control" placeholder="電子郵件" value={this.state.email} onChange={this.email_change}/>
                </div>
                <div className="input-group mb-3">
                  <div
                    className="input-group-img d-flex align-items-center justify-content-center rounded-start-2"
                  >
                    <img className="imgicon w-50" src="./img/Member_Area/password.png" alt=" " />
                  </div>
                  <input type="password" className="login form-control" placeholder="密碼" value={this.state.password} onChange={this.password_change}/>
                </div>
                <div className="u-form-group mb-1">
                  <button className="btn btn-login w-100" onClick={this.login_click} type='button'>
                    <h5 className="fw-bold m-1">登入</h5>
                  </button>
                </div>
                <div className="u-form-group mb-3 text-center">
                <button
                        id='forgotbutton'
                        className="forgot-password mb-3" 
                        type='button'
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop"
                    >忘記密碼</button>
                </div>
                <div className="login-box mb-3">
                  <div className="other-login">
                    <span className="hr-line"></span>
                    其它登入方式
                    <span className="hr-line"></span>
                  </div>
                </div>
                <div className="social-login mb-3">
                  <button className="btn btn-google w-100 py-2">
                    <img className="imggoogleicon me-2" src="./img/Member_Area/google.png" alt=" " />
                    Google
                  </button>
                </div>
              </form>
              <div className="bottom text-center rounded-bottom-4">
                登入及代表您同意 <button className="fw-semibold">使用者條款</button> 和
                <button className="fw-semibold">隱私權條款</button>
              </div>
            </div>
        )}



        {!this.state.showLoginForm && (
            <div className="email-signup">
              <form className="container" action="/signup" method="post">
                <h5 className="text-center welcomeledian m-3">
                  歡迎使用樂點！線上訂餐系統
                </h5>
                <div className="input-group mb-3">
                  <div
                    className="input-group-img d-flex align-items-center justify-content-center rounded-start-2"
                  >
                    <img className="imgicon w-50" src="./img/Member_Area/phone.png" alt=" " />
                  </div>
                  <input type="phone" className="login form-control" placeholder="電話" value={this.state.phone} onChange={this.phone_change}/>
                </div>
                <div className="input-group mb-3">
                  <div
                    className="input-group-img d-flex align-items-center justify-content-center rounded-start-2"
                  >
                    <img className="imgicon w-50" src="./img/Member_Area/email.png" alt=" " />
                  </div>
                  <input type="email" className="login form-control" placeholder="電子郵件" value={this.state.email} onChange={this.email_change}/>
                </div>
                <div className="input-group mb-3">
                  <div
                    className="input-group-img d-flex align-items-center justify-content-center rounded-start-2"
                  >
                    <img className="imgicon w-50" src="./img/Member_Area/password.png" alt=" " />
                  </div>
                  <input type="password" className="login form-control" placeholder="密碼" value={this.state.password} onChange={this.password_change}/>
                </div>
                <div className="input-group mb-3">
                  <div
                    className="input-group-img d-flex align-items-center justify-content-center rounded-start-2"
                  >
                    <img className="imgicon w-50" src="./img/Member_Area/password.png" alt=" " />
                  </div>
                  <input
                    type="password"
                    className="login form-control"
                    placeholder="再次輸入密碼"
                    value={this.state.password2}
                    onChange={this.password2_change}
                  />
                </div>
                <div className="u-form-group mb-3">
                  <button type='button' className="btn btn-login w-100" onClick={this.signup_click}>
                    <h5 className="fw-bold m-1">註冊</h5>
                  </button>
                </div>
                <div className="login-box mb-3">
                  <div className="other-login">
                    <span className="hr-line"></span>
                    其它登入方式
                    <span className="hr-line"></span>
                  </div>
                </div>
                <div className="social-login mb-3">
                  <button className="btn btn-google w-100 py-2">
                    <img className="imggoogleicon me-2" src="./img/Member_Area/google.png" alt=" " />
                    Google
                  </button>
                </div>
              </form>
              <div className="bottom text-center rounded-bottom-4">
                登入及代表您同意 <button className="fw-bold ">使用者條款</button> 和
                <button className="fw-bold loginbutton">隱私權條款</button>
              </div>
            </div>
            )}
          </div>
        </main>
        
      </div>
      <div id='loginfooter'>
      <div id="footer" className='d-flex'>
                <div id="footerLogo" className='col-3'>
                    <img id='"footerImg"' className='img-fluid' src={("/img/index/LeDian_LOGO-04.png")} alt="footerLogo" />
                </div>
                <div className='col-6 d-flex align-items-center'>
                    <div  id='footerlink' className='col-2 d-flex flex-column'>
                        <div className='d-flex'>
                            <div><img className='img-fluid' src={("/img/index/facebook.png")} alt="fackbook" /></div>
                            <div><img className='img-fluid' src={("/img/index/instagram.png")} alt="instagram" /></div>
                            <div><img className='img-fluid' src={("/img/index/line.png")} alt="line" /></div>
                        </div>
                        <p className='text-white text-nowrap footerText'>信箱: ledian.tw@gmail.com</p>
                    </div>
                </div>
                <div id='footerInfo' className='col-3 d-flex row align-items-center justify-content-center'>   
                    <div className='col-3 col-sm-6 d-flex flex-column align-items-center'>
                        <p className='footerText m-0 py-1 text-nowrap text-white'>意見回饋</p>
                        <p className='footerText m-0 py-1 text-nowrap text-white'>常見問題</p>
                    </div>
                    <div className='col-4 col-sm-6 d-flex flex-column align-items-start'>
                        <p className='footerText m-0 py-1 text-nowrap text-white'>使用者條款</p>
                        <p className='footerText m-0 py-1 text-nowrap text-white'>隱私權條款</p>
                        <p className='footerText m-0 py-1 text-nowrap text-white'>信用卡條款</p>
                    </div>
                </div>
            </div>
            </div>
      </>
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


  phone_change = (e) => {
    this.setState({ phone: e.target.value });
  } 
  
  email_change = (e) => {
    this.setState({ email: e.target.value });
  } 
  
  password_change = (e) => {
    this.setState({ password: e.target.value });
  } 
  
  password2_change = (e) => {
    this.setState({ password2: e.target.value });
  } 
  
  signup_click = async (e) => {
    var dataToServer = {
        email: this.state.email,
        phone: this.state.phone,
        password: this.state.password,
        password2: this.state.password2
    };
  
    try {
        const response = await Axios.post('http://localhost:8000/signup', dataToServer);
        console.log("Response from backend:", response.data);
        window.location = '/'
        this.setState({ showToast: true, toastMessage: "登入成功" });
    } catch (error) {
      console.error("Error:", error);
      if (error.response.status === 400) {
          this.toggleToast(error.response.data.error);

      } else {
          this.setState({ showToast: true, toastMessage: "註冊失敗" });
      }
    }
  }
  
  login_click = async (e) => {
    e.preventDefault();
    var dataToServer = {
      email: this.state.email,
      password: this.state.password
    };
    try {
      const response = await Axios.post('http://localhost:8000/login', dataToServer);
      const { user_id, user_img } = response.data; 
      const userdata = { user_id, user_img }; 
      const userdataString = JSON.stringify(userdata);
      localStorage.setItem('userdata', userdataString);
      window.location = '/'; 
      this.setState({ showToast: true, toastMessage: "登入成功" });
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 404 || error.response.status === 401)) {
        this.toggleToast(error.response.data.error);
      } else {
        this.setState({ showToast: true, toastMessage: "內部伺服器錯誤" });
      }
    }
  }
  


  forgotPassword_click = async (e) => {
    e.preventDefault(); // 防止表單提交的默認行為
    var dataToServer = {
      email: this.state.email
    };

    try {
      const response = await Axios.post('http://localhost:8000/forgotPassword', dataToServer);   
      this.setState({ showToast: true, toastMessage: "發送成功", closeModal: true });
      
    } catch (error) {
      if (error.response.status === 404) {
        this.toggleToast(error.response.data.error);

    } else {
        this.setState({ showToast: true, toastMessage: "發送失敗" });
    }
    }
}

}


export default Login;
