import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "../css/cart.css";
import { FaRegTrashAlt, FaPencilAlt } from "react-icons/fa";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Axios from "axios";
class productItem extends Component {
  state = { cartData: [] };
  render() {
    return (
      <React.Fragment>
        {this.state.cartData.map((item, i) => (
          <div className="col mt-3" key={i}>
            <div className="row d-flex align-items-center">
              <div className="col-md-3 col-6 text-end">
                <img
                  className="product-img"
                  src={(`img/class/${item.brand_id}_${item.item_id}.png`)}
                  alt="drink-img"
                />
              </div>
              <div className="col-5">
                <h2 className="text-des">{item.item}</h2> {/* 修改此處 */}
                <p className="mb-0 text-des-small">
                  {item.temperatures} / {item.sugar}{" "}
                </p>
                {/* 加料才顯示 */}
                {item.ingredient && (
                  <p className="mt-0 text-des-small">
                    {item.ingredient}/{item.ingredient}/{item.ingredient}
                  </p>
                )}
              </div>
              <div className="col">
                <div className="row d-flex align-items-end justify-content-center">
                  <div className="col d-flex justify-content-around align-items-center">
                    <p className="text-des mb-0">${item.total_price}</p>
                    <p className="text-des mb-0">x{item.quantity}</p>
                    <button
                      type="button"
                      //   onClick={this.delete_btn}
                      className="btn-delete"
                    >
                      <FaRegTrashAlt className="trash" />
                    </button>
                    <button
                      className="btn-edit"
                      type="button"
                      //   onClick={this.edit_btn}
                    >
                      <span>
                        <FaPencilAlt className="pencil" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <hr className="mt-2" />
          </div>
        ))}
      </React.Fragment>
    );
  }

  componentDidMount = async () => {
    var url = "http://localhost:8000/cartPay";
    var result = await Axios.get(url);
    var newData = result.data;
    // newState = result.data;
    this.setState({ cartData: newData });
    // console.log(this.state.cartData);
  };
}
export default productItem;
