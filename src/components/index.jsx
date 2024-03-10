import React, { Component } from 'react';
import "../css/index.css";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { PiMedal } from "react-icons/pi";
import { PiCoins } from "react-icons/pi";


class index extends Component {
    state = {  } 
    render() { 
        return (<React.Fragment>
            <div id='header' className='d-flex justify-content-between'>
                <div className='flex-fill d-flex ms-2 justify-content-between align-items-center'>
                    <h4 id='homeBtn' className='my-auto btn headerText'>首頁</h4>
                    <h4 className='my-auto btn headerText menuBtn'><HiOutlineShoppingBag />購物車</h4>
                    <h4 className='my-auto btn headerText menuBtn'><PiMedal />品牌專區</h4>
                    <h4 className='my-auto btn headerText menuBtn'><PiCoins />集點資訊</h4>
                </div>
                <div className='flex-fill'></div>
                <div className='d-flex me-2  align-items-center '>
                    <h4 id='loginBtn' className='my-auto btn headerText'>登入/註冊▼</h4>
                </div>
            </div>
            <div id='banner'><img src={require("../images/Home_Banner_01.jpg")} alt='homeBanner' className='img-fluid'></img></div>
            <div className="container">
                <div className='navbar row'>
                    <div className='navImg col-4'><img src={require("../images/LeDian_BANNER-01.jpg")} alt='navImg' className='img-fluid'></img></div>
                    <div className='navImg col-4'><img src={require("../images/LeDian_BANNER-02.jpg")} alt='navImg' className='img-fluid'></img></div>
                    <div className='navImg col-4'><img src={require("../images/LeDian_BANNER-05.jpg")} alt='navImg' className='img-fluid'></img></div>
                </div>
            </div>
            </React.Fragment>);
    }
    test = () => {
        alert('ok')
    }
}
 
export default index;