import React, { Component } from 'react';
import "../css/branch.css";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { PiMedal } from "react-icons/pi";
import { PiCoins } from "react-icons/pi";
import { GiCancel } from "react-icons/gi";
import GradeIcon from '@mui/icons-material/Grade';  
import Axios from 'axios';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox, Autocomplete,DistanceMatrixService } from '@react-google-maps/api';

<head>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCxryD8kH56hfiJ0bJt6r_KQ6G4MEZY6dI&loading=async&libraries=places,drawing,geometry&callback=initMap&v=weekly"></script>
</head>

class index extends Component {
    state = { 
        currentLocation: { lat: null, lng: null },
        branchList:[
            {},
        ],
        distances: {},
        brand:{},
     } 
     componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords: { latitude: lat, longitude: lng } }) => {
                    const pos = { lat, lng };
                    this.setState({ currentLocation: pos}, 
                    () => {
                        this.getData(); 
                    });
                },
                error => {
                    console.error('Error getting geolocation:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }

     getData = async () => {
        try {
            const resultBranch = await Axios.get(`http://localhost:8000/branch/${this.props.match.params.id}`);
            const resultBrand = await Axios.get(`http://localhost:8000/brand/${this.props.match.params.id}`);
            const newState = {...this.state};
            newState.branchList = resultBranch.data;
            newState.brand = resultBrand.data;
            newState.branchPosition = resultBranch.data.map(branch => ({
                branchId: branch.branch_id,
                branchAddress: branch.branch_address,
                lat: branch.branch_latitude,
                lng: branch.branch_longitude
            }));

            this.setState(newState, () => {
                this.calculateDistances();
                console.log(this.state)
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }


    calculateDistances = () => {
        const currentLat =  this.state.currentLocation.lat
        const currentLng =  this.state.currentLocation.lng
        const branchPosition  = this.state.branchPosition;
        if (currentLat !== null && currentLng !== null) {
          const R = 6371; // 地球平均半径（km）
          const distances = {};
          branchPosition.forEach(branch => {
            const { branchId,lat, lng,} = branch;
            const dLat = this.deg2rad(lat - currentLat);
            const dLng = this.deg2rad(lng - currentLng);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(this.deg2rad(currentLat)) * Math.cos(this.deg2rad(lat)) *
                      Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            distances[branchId] = (R * c).toFixed(1); // 保留一位小数
          });        
          this.setState({distances});
        }
      }
    
      deg2rad = (deg) => {
        return deg * (Math.PI / 180);
      }


     
    render() { 
        const distances  = this.state.distances;

        return (<React.Fragment>
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




            <div id='banner' className='d-flex justify-content-center'><img id='bannerImg' src={("/img/index/Home_Banner_01.jpg")} alt='homeBanner' className='img-fluid'></img></div>
            <div className="container">
                <div className='navbar row'>
                    <div className='navImg col-4 btn' onClick={()=>{window.location="/le"}}><img src={("/img/index/LeDian_BANNER-01.jpg")} alt='navImg' className='img-fluid'></img></div>
                    <div className='navImg col-4 btn' onClick={()=>{window.location="/dian"}}><img src={("/img/index/LeDian_BANNER-02.jpg")} alt='navImg' className='img-fluid'></img></div>
                    <div className='navImg col-4 btn' onClick={()=>{window.location="/news"}}><img src={("/img/index/LeDian_BANNER-05.jpg")} alt='navImg' className='img-fluid'></img></div>
                </div>
                <h2 className='text-center mainColor m-2'>所有分店</h2>
            </div>
            <div className="container my-2">
                <div className="row d-flex justify-content-center">
                    <div className="choose_right row">
                        
                        {Object.entries(distances).sort((a, b) => a[1] - b[1]).map((distance)=>{
                            return this.state.branchList.map((branch,i)=>{
                                if(distance[0] == branch.branch_id){
                                    const day = new Date().getDay();
                                    const openTime = [branch.Sun_start,branch.Mon_start,branch.Tue_start,branch.Wed_start,branch.Thu_start,branch.Fri_start,branch.Sat_start]
                                    const closeTime = [branch.Sun_end,branch.Mon_end,branch.Tue_end,branch.Wed_end,branch.Thu_end,branch.Fri_end,branch.Sat_end]

                                    return(<React.Fragment key={i}> 
                                        <div className="col-lg-6 col-xxl-4 my-3" id={branch.branch_id} 
                                        onClick={()=>{
                                            const userData = JSON.parse(localStorage.getItem('userdata'));
                                            if(userData){
                                                window.location=`/order/${branch.branch_id}`
                                            }else {                         
                                                sessionStorage.setItem('redirect',`/order/${branch.branch_id}`) ;
                                                window.location = "/login";
                                            }}}>
                                            <div className="card branchCard">
                                                <div className="image">
                                                <img
                                                    src={`/img/mainproduct/${branch.brand_id}.png`}
                                                    className="card-img-top"
                                                    alt="..."
                                                />     
                                                <img src={`/img/logo/${branch.brand_id}.png`} className="logo" alt="..." />
                                                </div>
                                                <div className="card-body">
                                                <div className="row information ">
                                                    <p className="col-3 score align-items-center d-flex align-items-center justify-content-center">
                                                    <GradeIcon className='me-1 iconGrade' /> {branch.branch_score.toFixed(1)}
                                                    </p>
                                                    <p className="col-4 time">

                                                
                                                    {openTime[day]}~{closeTime[day]}

                                                    </p>
                                                    <p className="col-4 kilometre">約 {distances[branch.branch_id]} 公里</p>
                                                </div>
                                                <p className="card-title lh-sm">
                                                    {this.state.brand[0].brand_name} {" "}
                                                    {branch.branch_name}<br /><a
                                                    href={`https://www.google.com/maps/place/${branch.branch_address}`}
                                                    >{branch.branch_address}</a>
                                                </p>
                                                </div>
                                            </div>
                                        </div>
            
                                        </React.Fragment>)
                                }
                            })
                        })}

                    </div>
                </div>
            </div>
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
            </React.Fragment>);
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
 
export default index;