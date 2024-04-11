import React, { Component } from "react";
import "../css/profile.css";
import JsBarcode from "jsbarcode";
import "../css/profile.css"; // 引入樣式文件
import "react-datepicker/dist/react-datepicker.css"; // 引入日期選擇器樣式
import { Modal } from "react-bootstrap"; // 添加這行
import { FaRegTrashAlt, FaPencilAlt } from "react-icons/fa";
import Axios from "axios";
class Barcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyBarcodeInput: "", // 驗證輸入的條碼
      validationResult: "", // 驗證結果
      generatedBarcodeContainerDisplay: "none", // 生成的條碼容器顯示狀態
      barcodeImgButtonDisplay: "none", // 條碼圖片按鈕顯示狀態
      isModalOpen: false, // 模態框打開狀態
      barcodeText: "", // 條碼文本
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);
    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (!userData) {
      this.setState({
        error: "User data not found in localStorage",
        loading: false,
      });
      return; // 離開方法以避免後續代碼執行
    }
  
    // 獲取使用者資料
    Axios.get(`http://localhost:8000/user/${userData.user_id}`)
      .then((response) => {
        const userImg = response.data.user_img
          ? response.data.user_img
          : "LeDian.png";
        this.setState({ userImg, userData });
      })
      .catch((error) => {
        console.error("Failed to fetch user data:", error);
        this.setState({ error: "Failed to fetch user data", loading: false });
      });
  
    // 獲取載具資料
    Axios.get(`http://localhost:8000/user/${userData.user_id}/barcode`)
      .then((response) => {
        const barcodeData = response.data; // 從後端獲取的載具數據
        if (barcodeData && barcodeData.barcode)  {
          // 如果數據存在，更新組件狀態以顯示編輯和刪除按鈕以及載具文字和 SVG 圖片
          this.setState({
            barcodeText: barcodeData.barcode,
            barcodeImgButtonDisplay: "flex", // 顯示編輯和刪除按鈕
            generatedBarcodeContainerDisplay: "flex", // 顯示 SVG 圖片容器
          });
  
          // 等待元素渲染到 DOM 中後再生成條碼
          if (barcodeData && barcodeData.barcode) {
            setTimeout(() => {
              JsBarcode("#generatedBarcode", barcodeData.barcode, {
                format: "CODE39",
              });
            }, 0);
          }
          
        } else {
          // 如果沒有載具數據或載具條碼為空，將條碼相關的狀態初始化為空值
          this.clearBarcode();
        }
      })
      .catch((error) => {
        console.error("Failed to fetch barcode data:", error);
      });
  }
  

  // 處理輸入框變化
  handleInputChange = (e) => {
    this.setState({ verifyBarcodeInput: e.target.value.toUpperCase() });
  };

// 處理編輯按鈕點擊
  handleEditButtonClick = () => {
    this.setState({ isModalOpen: true ,validationResult: ""})
  };
// 儲存條碼
handleSaveButtonClick = () => {
  const barcodeValue = this.state.verifyBarcodeInput.trim(); // 取得輸入的條碼並去除空白

  // 檢查載具條碼是否為空
  if (!barcodeValue) {
    console.error("Barcode value is empty");
    return; // 不執行後續動作
  }

  const userData = JSON.parse(localStorage.getItem("userdata"));
  
  // 發送更新條碼的請求
  Axios.put(`http://localhost:8000/user/${userData.user_id}/barcode`, { barcode: barcodeValue })
    .then((response) => {
      // 更新成功後重新獲取載具資料
      Axios.get(`http://localhost:8000/user/${userData.user_id}/barcode`)
        .then((response) => {
          const barcodeData = response.data;
          if (barcodeData && barcodeData.barcode) {
            // 更新狀態以顯示新的條碼資訊
            this.setState({
              barcodeText: barcodeData.barcode,
              barcodeImgButtonDisplay: "flex",
              generatedBarcodeContainerDisplay: "flex",
            });

            // 使用 JsBarcode 生成新的條碼
            if (barcodeData && barcodeData.barcode) {
              setTimeout(() => {
                JsBarcode("#generatedBarcode", barcodeData.barcode, {
                  format: "CODE39",
                });
              }, 0);
            }
          } else {
            // 如果沒有載具數據或載具條碼為空，清除相關狀態
            this.clearBarcode();
          }
        })
        .catch((error) => {
          console.error("Failed to fetch updated barcode data:", error);
        });

      // 關閉對話框
      this.setState({ isModalOpen: false });
    })
    .catch((error) => {
      console.error("Failed to update barcode data:", error);
    });
};



// 處理刪除按鈕點擊
handleDeleteButtonClick = () => {
  // 先清除當前的條碼信息
  this.clearBarcode();

  // 從本地存儲中獲取用戶數據
  const userData = JSON.parse(localStorage.getItem("userdata"));
  if (!userData) {
    console.error("User data not found in localStorage");
    return;
  }

  // 發送刪除條碼的請求到後端
  Axios.delete(`http://localhost:8000/user/${userData.user_id}/barcode`)
    .then((response) => {
      console.log("Barcode deleted successfully");
    })
    .catch((error) => {
      console.error("Failed to delete barcode:", error);
    });
};


  // 清除條碼信息
  clearBarcode = () => {
    this.setState({
      verifyBarcodeInput: "",
      validationResult: "",
      generatedBarcodeContainerDisplay: "none",
      barcodeImgButtonDisplay: "none",
      barcodeText: "",
    });
  };

  validateBarcode = () => {
    const barcodeValue = this.state.verifyBarcodeInput.trim();
    const regex = /^\/[\dA-Z0-9+\-.]{7}$/;
    
    if (regex.test(barcodeValue)) {
      // 驗證通過後直接呼叫儲存函式處理後續操作
      this.handleSaveButtonClick(barcodeValue);
      this.setState({validationResult: ""})
    } else {
      this.setState({ validationResult: "載具號碼格式不正確，請重新確認!" });
    }
  };
  
  // 生成條碼
  generateBarcode = (barcodeValue) => {
    alert("Barcode value: " + barcodeValue);
    alert("Generated barcode container: " + document.getElementById("generatedBarcodeContainer"));
    JsBarcode("#generatedBarcode", barcodeValue, { format: "CODE39" });
    this.setState({
      barcodeImgButtonDisplay: "flex",
      generatedBarcodeContainerDisplay: "flex",
      barcodeText: barcodeValue,
      isModalOpen: false,
    });
  };
  
  




  handleModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  render() {
    const {
      barcodeText
    } = this.state;
    return (
      <>
        <Modal show={this.state.isModalOpen} backdrop="static" centered>
          <Modal.Header closeButton onClick={this.handleModalClose}>
            <Modal.Title className="fs-3">我的載具</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label
              htmlFor="verifyBarcodeInput"
              className="form-label modalLabel fs-5"
            >
              請輸入載具條碼，輸入確認後會自動產生條碼
            </label>
            <input
              id="verifyBarcodeInput"
              className="form-control mb-2 fs-5"
              type="text"
              placeholder="首位為/，英文字母為大寫"
              maxLength="8"
              aria-label="default input example"
              value={this.state.verifyBarcodeInput}
              onChange={this.handleInputChange}
            />
            <div id="validationResult" className="fs-5">{this.state.validationResult}</div>
          </Modal.Body>
          <Modal.Footer
            onClick={this.validateBarcode}
            style={{ cursor: "pointer" }}
          >
            <div className="mx-auto fs-4">儲存</div>
          </Modal.Footer>
        </Modal>

        <div className="col-12 mb-2 mt-4">
    <div className="row">
      <div className="col-2"></div>
      <div className="col-12 text-center">載具條碼</div>
      <div className="col-6 text-end p-1">
        {this.state.barcodeText && (
          <div id="barcodeText">{this.state.barcodeText}</div>
        )}
      </div>
      <div className="col-6">
        <div
          className={`d-flex align-items-center ms-3 text-grey ${
            this.state.barcodeImgButtonDisplay === "none" ? "d-none" : ""
          }`}
          id="barcodeimgbutton"
        >
          <button
            type="button"
            className="btn btn-sm"
            id="editbutton"
            onClick={this.handleEditButtonClick}
          >
            <FaPencilAlt className="pencil" />
            
          </button>
          <button
            type="button"
            className="btn btn-sm"
            id="deletebutton"
            onClick={this.handleDeleteButtonClick}
          >
            <FaRegTrashAlt className="trash" />
          </button>
        </div>
      </div>
    </div>
  </div>




        <div className="col-12 d-flex justify-content-center align-items-center">
          <div
            id="Barcodecontent"
            className={`mx-auto my-auto ${
              this.state.barcodeText ? "d-none" : ""
            }`}
          >
            <label
              className="rounded-3"
              id="Barcodeborder"
              onClick={this.handleEditButtonClick}
            >
              <span className="Barcodemodallabel fs-5">&#43; 新增載具條碼</span>
              <button
                type="button"
                className="btn btn-primary Barcodemodal"
                id="Barcodebutton"
              ></button>
            </label>
          </div>







          {this.state.barcodeText && (
    <div
      id="generatedBarcodeContainer"
      className={`mx-auto my-auto d-flex justify-content-center align-items-center ${
        this.state.generatedBarcodeContainerDisplay === "none"
          ? "d-none"
          : ""
      }`}
    >
      <svg id="generatedBarcode">{barcodeText}</svg>
    </div>
  )}
        </div>
      </>
    );
  }
}

export default Barcode;
