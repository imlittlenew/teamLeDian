import React, { Component } from 'react';
import "../css/order.css";
import "bootstrap/dist/js/bootstrap.js";
import axios from 'axios';


class order extends Component {

    state = {
        storeList: []
    }

    render() {

        const {storeList} = this.state;


        return (<React.Fragment>




            {/* 電腦版banner */}
            <div className="row computer">
                <div className="col-12">
                    <img 
                    src={("img/storebanner/1.png")}
                    alt="bannerImg"
                    className="banner">
                    </img>
                </div>
            </div>

            {/* 手機版banner */}
            <div class="row phone">
                <div class="col-12">
                    <img 
                    src={("img/storebannermin/1.png")} 
                    alt="bannerImg" 
                    class="bannermin">
                    </img>
                </div>
            </div>

            {/* 商店資訊 */}

            <div className="row storeBox">

                <div className="col-3 storeBox">
                    <div className="row">
                        <div className="col-6">
                            <img 
                            src={("img/logo/1.png")} 
                            className="storeBoxLogo">
                            </img>
                        </div>
                        <div className="col-6">
                            <img 
                            src={("img/icon/buy2.png")} 
                            alt="buy" 
                            className="buyjoin d-flex flex-column align-items-center btn-join" 
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModaljoin"
                            type="button"
                            onclick="linkShare">
                            </img>
                        </div>
                    </div>
                    <div className="row textstore">
                        <div className="col-12 textstore">
                            <h4 className="storeTitle">米克夏 台中市府店</h4>
                        </div>
                        <div className="col-12 textstore">
                            <p className="storeContent">
                                營業時間:09:30 ~ 20:00
                            </p>
                        </div>
                        <div className="col-12 textstore">
                            <p className="storeContent">
                                聯絡電話:
                            </p>
                        </div>
                        <div className="col-12 textstore">
                            <p className="storeContent">
                                地址:
                                {/* {store.branch_address} */}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-10"></div>
            </div>




            {/* 揪團對話盒 */}
            <div class="modal fade join" id="exampleModaljoin" tabindex="-1" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content join-box">
                        <div class="modal-header d-flex justify-content-center pb-0 border-0">
                            <h5 class="modal-title text-title-b" id="exampleModaljoin">
                                揪團分享！
                            </h5>
                        </div>
                        <div class="modal-body">
                            <div class="row d-flex flex-column justify-content-between">
                                <div class="col-12 text-center">
                                    <input class="text-des p-2 border-0 join-box-input" type="text"
                                        value="https://order.nidin.shop/gb/men" />
                                </div>
                                <div class="col-12 text-center my-3">
                                    <button id="copy-link" class="btn-continue text-title p-3">
                                        揪團分享！ 複製連結
                                    </button>
                                </div>
                                <div class="col-12 mt-3">
                                    <div class="row">
                                        <div class="col-6 pe-0 d-flex justify-content-end">
                                            <div id="qrcode-size"></div>
                                        </div>
                                        <div class="col-6 px-0">
                                            <img src={("img/logo/1.png")} alt="logo" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 菜單 */}
            <div class="menu">
                <div class="boxMenu">
                    {/* 按鈕 */}
                    <div class="container">
                        {/* 第一段 */}
                        <div class="row">
                            <h3 class="title1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-suit-heart-fill" viewBox="0 0 16 16">
                                    <path
                                        d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1" />
                                </svg>
                                人氣精選
                            </h3>
                        </div>
                        <div class="row drink">
                            <div class="col-lg-3 col-md-6 button btn btn-outline-warning" type="button" data-bs-toggle="modal"
                                data-bs-target="#exampleModal" onClick={this.boxmenu}>
                                <div class="row">
                                    <div class="col-8 button ">
                                        <div class="row">
                                            <h3 class="buttonTitle">許慶良窯燒桂圓鮮奶茶</h3>
                                            <div class="row text">
                                                <div class="col-5">
                                                    <p class="buttonPrics col">$50</p>
                                                </div>
                                                <div class="col-2"></div>
                                                <div class="col-5">
                                                    <img src={("img/icon/snowflake.png")} class="cold" alt="cold"></img>
                                                    <img src={("img/icon/hotsale.png")} class="hot" alt="hot"></img>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-4 product">
                                        <div class="row">
                                            <div class="col-12">
                                                <img src={("img/drinksimg/1_1.png")} class="productImg"
                                                    alt="productImg"></img>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-3 col-md-6 button btn btn-outline-warning" type="button" data-bs-toggle="modal"
                                data-bs-target="#exampleModal">
                                <div class="row">
                                    <div class="col-8 button">
                                        <div class="row">
                                            <h3 class="buttonTitle">許慶良窯燒桂圓鮮奶茶</h3>
                                            <div class="row text">
                                                <div class="col-5">
                                                    <p class="buttonPrics col">$50</p>
                                                </div>
                                                <div class="col-2"></div>
                                                <div class="col-5">
                                                    <img src={("img/icon/snowflake.png")} class="cold" alt="cold"></img>
                                                    <img src={("img/icon/hotsale.png")} class="hot" alt="hot"></img>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-4 product">
                                        <div class="row">
                                            <div class="col-12">
                                                <img src={("img/drinksimg/1_1.png")} class="productImg"
                                                    alt="productImg"></img>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-3 col-md-6 button btn btn-outline-warning" type="button" data-bs-toggle="modal"
                                data-bs-target="#exampleModal">
                                <div class="row">
                                    <div class="col-8 button">
                                        <div class="row">
                                            <h3 class="buttonTitle">許慶良窯燒桂圓鮮奶茶</h3>
                                            <div class="row text">
                                                <div class="col-5">
                                                    <p class="buttonPrics col">$50</p>
                                                </div>
                                                <div class="col-2"></div>
                                                <div class="col-5">
                                                    <img src={("img/icon/snowflake.png")} class="cold" alt="cold"></img>
                                                    <img src={("img/icon/hotsale.png")} class="hot" alt="hot"></img>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-4 product">
                                        <div class="row">
                                            <div class="col-12">
                                                <img src={("img/drinksimg/1_1.png")} class="productImg"
                                                    alt="productImg"></img>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-3 col-md-6 button btn btn-outline-warning" type="button" data-bs-toggle="modal"
                                data-bs-target="#exampleModal">
                                <div class="row">
                                    <div class="col-8 button">
                                        <div class="row">
                                            <h3 class="buttonTitle">許慶良窯燒桂圓鮮奶茶</h3>
                                            <div class="row text">
                                                <div class="col-5">
                                                    <p class="buttonPrics col">$50</p>
                                                </div>
                                                <div class="col-2"></div>
                                                <div class="col-5">
                                                    <img src={("img/icon/snowflake.png")} class="cold" alt="cold"></img>
                                                    <img src={("img/icon/hotsale.png")} class="hot" alt="hot"></img>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-4 product">
                                        <div class="row">
                                            <div class="col-12">
                                                <img src={("img/drinksimg/1_1.png")} class="productImg"
                                                    alt="productImg"></img>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="link-top"></div>
                    </div>
                </div>
            </div>

            {/* 對話盒Modal */}
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg ">
                    <div class="modal-content">
                        <div class="modal-body">
                            <div class="modal-body">
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col-6 modaltop">
                                            <h3 class="modalTitle">許慶良窯燒桂圓鮮奶茶</h3>
                                        </div>
                                        <div class="col-6 modaltop"></div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-5">
                                            {/* 左側上方圖片 */}
                                            <div class="row">
                                                <div class="col-12">
                                                    <img src="img/class/14_782.png" class="clasImg"></img>
                                                </div>
                                                <div class="col-12 Text">
                                                    <div class="alert alert-warning" role="alert">
                                                        *脆啵啵球配料冷飲限定口感佳（常溫/溫/熱恕不開放加料<br></br>
                                                        *小圓仔配料建議冷/溫飲
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-7 modalRight">
                                            {/* 右側尺寸 */}
                                            <div class="row sizetitle">
                                                <div class="col-4 text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                        fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                        <path
                                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                    </svg>
                                                    尺寸
                                                </div>
                                                <div class="col-4"></div>
                                                <div class="col-4"></div>
                                            </div>
                                            <div class="row sizecheck">
                                                {/* 尺寸選項 */}

                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="radio" name="size" id="medium" value="1"></input>
                                                    <label class="form-check-label" for="medium">&nbsp;M</label>
                                                </div>
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="radio" name="size" id="large" value="2"></input>
                                                    <label class="form-check-label" for="large">&nbsp;L</label>
                                                </div>
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="radio" name="size" id="bottle" value="3"></input>
                                                    <label class="form-check-label" for="bottle">&nbsp;瓶</label>
                                                </div>

                                            </div>



                                            <div class="row temperaturetitle">
                                                {/* 溫度 */}
                                                <div class="col-4 text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                        fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                        <path
                                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                    </svg>
                                                    溫度
                                                </div>
                                                <div class="col-4"></div>
                                                <div class="col-4"></div>
                                            </div>
                                            <div class="row temperaturecheck">
                                                {/* 溫度選項 */}
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="radio" name="temperature" id="lessIce" value="1"></input>
                                                    <label class="form-check-label" for="flexRadioDefault1">&nbsp;少冰</label>
                                                </div>
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="radio" name="temperature" id="low" value="2"></input>
                                                    <label class="form-check-label" for="flexRadioDefault1">&nbsp;微冰</label>
                                                </div>
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="radio" name="temperature" id="noIce" value="3"></input>
                                                    <label class="form-check-label" for="flexRadioDefault1">&nbsp;去冰</label>
                                                </div>
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="radio" name="temperature" id="normal" value="4"></input>
                                                    <label class="form-check-label" for="flexRadioDefault1">&nbsp;正常</label>
                                                </div>
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="radio" name="temperature" id="roomTemperature" value="5"></input>
                                                    <label class="form-check-label" for="flexRadioDefault1">&nbsp;溫</label>
                                                </div>
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="radio" name="temperature" id="hot" value="6"></input>
                                                    <label class="form-check-label" for="flexRadioDefault1">&nbsp;熱</label>
                                                </div>
                                            </div>


                                            <div class="row sugarinesstitle">
                                                {/* 甜度 */}
                                                <div class="col-4 text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                        fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                        <path
                                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                    </svg>
                                                    甜度
                                                </div>
                                                <div class="col-4"></div>
                                                <div class="col-4"></div>
                                            </div>
                                            <div class="row sugarinesscheck">
                                                {/* 甜度選項 */}
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="radio" name="sugariness" id="lessSugar" value="1"></input>
                                                    <label class="form-check-label" for="flexRadioDefault1">&nbsp;少糖</label>
                                                </div>
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="radio" name="sugariness" id="halfSugar" value="2"></input>
                                                    <label class="form-check-label" for="flexRadioDefault1">&nbsp;半糖</label>
                                                </div>
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="radio" name="sugariness" id="standard" value="3"></input>
                                                    <label class="form-check-label" for="flexRadioDefault1">&nbsp;標準</label>
                                                </div>
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="radio" name="sugariness" id="lightSugar" value="4"></input>
                                                    <label class="form-check-label" for="flexRadioDefault1">&nbsp;微糖</label>
                                                </div>
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="radio" name="sugariness" id="noSugar" value="5"></input>
                                                    <label class="form-check-label" for="flexRadioDefault1">&nbsp;無糖</label>
                                                </div>
                                            </div>


                                            <div class="row sugarinesstitle">
                                                {/* 配料 */}
                                                <div class="col-4 text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                        fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                        <path
                                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                    </svg>
                                                    配料
                                                </div>
                                                <div class="col-4"></div>
                                                <div class="col-4"></div>
                                            </div>
                                            <div class="row sugarinesscheck">
                                                {/* 配料選項 */}
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="checkbox" name="ingredients" id="grass" value="1"></input>
                                                    <label class="form-check-label" for="flexRadioDefault1">&nbsp;仙草</label>
                                                </div>
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="checkbox" name="ingredients" id="balls" value="2"></input>
                                                    <label class="form-check-label" for="flexRadioDefault1">&nbsp;珍珠</label>
                                                </div>
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="checkbox" name="ingredients" id="taroBalls" value="3"></input>
                                                    <label class="form-check-label" for="flexRadioDefault1">&nbsp;芋圓</label>
                                                </div>
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="checkbox" name="ingredients" id="redBeans" value="4"></input>
                                                    <label class="form-check-label" for="flexRadioDefault1">&nbsp;紅豆</label>
                                                </div>
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="checkbox" name="ingredients" id="pidding" value="5"></input>
                                                    <label class="form-check-label" for="flexRadioDefault1">&nbsp;布丁</label>
                                                </div>
                                                <div class="col-4 form-check">
                                                    <input class="form-check-input" type="checkbox" name="ingredients" id="konjacjelly" value="6"></input>
                                                    <label class="form-check-label" for="flexRadioDefault1">&nbsp;愛玉</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row footer">
                                        <div class="col-6 modaltop">總金額 : 100 元</div>
                                        <div class="col-6 modaltop">
                                            <div class="row price">
                                                <div class="col-4">
                                                    <button type="button" class="btn add btn-outline-warning">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                            fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd"
                                                                d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div class="col-4 text-center" >
                                                    <div class="price">10</div>
                                                </div>
                                                <div class="col-4 text-center" >
                                                    <button type="button" class="btn add btn-outline-warning">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                            fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd"
                                                                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-grid gap-2 col-8 mx-auto">
                                    <button class="btn btn-outline-warning" type="button">加入購物車</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment >
        ); // end of redner()
    }

    // 元件掛載撈資料
    componentDidMount = async () => {
        var result = await axios.get("http://localhost:8000/index/order/9");
        var newState = { ...this.state };
        newState.storeList = result.data;
        this.setState(newState);
        console.log(result);
    }



    boxmenu = function (e) {
        alert('ok');
    }


}

export default order;