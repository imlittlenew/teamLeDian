import React, { Component } from 'react';
import "../css/index.css";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { PiMedal } from "react-icons/pi";
import { PiCoins } from "react-icons/pi";

class index extends Component {
    state = { 
        search:'搜尋店家',
     } 
    render() { 
        return (<React.Fragment>
            <div id='header' className='d-flex justify-content-between'>
                <div className='col-6  d-flex ms-2 justify-content-between align-items-center'>
                    <h4 id='homeBtn' className='my-auto btn headerText'>首頁</h4>
                    <h4 className='my-auto btn headerText menuBtn'><HiOutlineShoppingBag />購物車</h4>
                    <h4 className='my-auto btn headerText menuBtn'><PiMedal />品牌專區</h4>
                    <h4 className='my-auto btn headerText menuBtn'><PiCoins />集點資訊</h4>
                </div>
                <div className='d-flex me-2  align-items-center'>
                    <h4 id='loginBtn' className='my-auto btn headerText'>登入/註冊▼</h4>
                </div>
            </div>
            <div id='banner' className='d-flex justify-content-center'><img src={require("../images/Home_Banner_01.jpg")} alt='homeBanner' className='img-fluid'></img></div>
            <div className="container">
                <div className='navbar row'>
                    <div className='navImg col-4 btn'><img src={require("../images/LeDian_BANNER-01.jpg")} alt='navImg' className='img-fluid'></img></div>
                    <div className='navImg col-4 btn'><img src={require("../images/LeDian_BANNER-02.jpg")} alt='navImg' className='img-fluid'></img></div>
                    <div className='navImg col-4 btn'><img src={require("../images/LeDian_BANNER-05.jpg")} alt='navImg' className='img-fluid'></img></div>
                </div>
                <input type="text" id='search' name='search' onChange={this.searchChange} value={this.state.search}  className="form-control rounded-pill ps-4 bg-secondary-subtle"></input>
            </div>
            <div id="footer" className='d-flex'>
                <div id="footerLogo" className='col-3'>
                    <img id='"footerImg"' className='img-fluid' src={require("../images/LeDian_LOGO-04.png")} alt="footerLogo" />
                </div>
                <div className='col-6 d-flex align-items-center'>
                    <div  id='footerlink' className='col-2 d-flex flex-column'>
                        <div className='d-flex'>
                            <div><img className='img-fluid' src={require("../images/facebook.png")} alt="fackbook" /></div>
                            <div><img className='img-fluid' src={require("../images/instagram.png")} alt="instagram" /></div>
                            <div><img className='img-fluid' src={require("../images/line.png")} alt="line" /></div>
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
            </React.Fragment>);
    }
    searchChange = () => {
        var newState = {...this.state};
        newState.search = this.value;   
        this.setState(newState);
        console.log(this.state.search)
    }
    test = () => {
        alert('ok')
    }
}
 
export default index;