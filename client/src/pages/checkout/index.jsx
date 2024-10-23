import { Button, Radio, RadioGroup, FormControlLabel, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { fetchDataFromApi, postData, deleteData } from "../../utils/api";

const Checkout = () => {
  const [formFields, setFormFields] = useState({
    fullName: "",
    country: "",
    streetAddressLine1: "",
    streetAddressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
  });
  const [cartData, setCartData] = useState([]);
  const [totalAmount, setTotalAmount] = useState();
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Default to Cash on Delivery

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const user = JSON.parse(localStorage.getItem("user"));
    fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
      setCartData(res);

      setTotalAmount(
        res.length !== 0 &&
          res
            .map((item) => parseInt(item.price) * item.quantity)
            .reduce((total, value) => total + value, 0)
      );
    });
  }, []);

  const onChangeInput = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };

  const payNow = (e) => {
    e.preventDefault();

    if (formFields.fullName === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill full name ",
      });
      return false;
    }

    if (formFields.country === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill country ",
      });
      return false;
    }

    if (formFields.streetAddressLine1 === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill Street address",
      });
      return false;
    }

    if (formFields.city === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill city ",
      });
      return false;
    }

    if (formFields.state === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill state ",
      });
      return false;
    }

    if (formFields.zipCode === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill zipCode ",
      });
      return false;
    }

    if (formFields.phoneNumber === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill phone Number ",
      });
      return false;
    }

    if (formFields.email === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill email",
      });
      return false;
    }

    // Check payment method
    if (paymentMethod === "ONLINE") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Online payment is currently not available. Please select Cash on Delivery.",
      });
      return;
    }

    // Handle Cash on Delivery order
    const user = JSON.parse(localStorage.getItem("user"));
    const payLoad = {
      name: formFields.fullName,
      phoneNumber: formFields.phoneNumber,
      address: formFields.streetAddressLine1 + formFields.streetAddressLine2,
      pincode: formFields.zipCode,
      amount: parseInt(totalAmount),
      paymentId: "COD",
      email: user.email,
      userid: user.userId,
      products: cartData,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    postData(`/api/orders/create`, payLoad).then((res) => {
      fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
        res?.length !== 0 &&
          res?.map((item) => {
            deleteData(`/api/cart/${item?.id}`).then(() => {});
          });
        setTimeout(() => {
          context.getCartData();
        }, 1000);
        history("/orders");
      });
    });
  };

  return (
    <section className="section pt-5 pb-4">
      <div className="container">
        <form className="checkoutForm" onSubmit={payNow}>
          <div className="row">
            <div className="col-md-8">
              <h2 className="hd">BILLING DETAILS</h2>

              <div className="row mt-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Full Name *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="fullName"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Country *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="country"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>Street address *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="House number and street name"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="streetAddressLine1"
                      onChange={onChangeInput}
                    />
                  </div>

                  <div className="form-group">
                    <TextField
                      label="Apartment, suite, unit, etc. (optional)"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="streetAddressLine2"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>Town / City *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="City"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="city"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>State / County *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="State"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="state"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>Postcode / ZIP *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="ZIP Code"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="zipCode"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Phone Number"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      type="number"
                      name="phoneNumber"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Email Address"
                      type="email"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="email"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              {/* Payment method selection */}
              <h4 className="hd mt-4">Payment Method</h4>
              <RadioGroup
                aria-label="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel value="COD" control={<Radio />} label="Cash on Delivery (COD)" />
                <FormControlLabel value="ONLINE" control={<Radio />} label="Online Payment" />
              </RadioGroup>
            </div>

            <div className="col-md-4">
              <div className="table-responsive border-bottom">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartData &&
                      cartData.length !== 0 &&
                      cartData?.map((item) => {
                        return (
                          <tr key={item.id}>
                            <td>
                              {item.title} x {item.quantity}
                            </td>
                            <td>
                              <i className="fa fa-inr"></i>
                              {parseInt(item.price) * item.quantity}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              <div className="table-responsive border-bottom">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Subtotal</th>
                      <th>
                        <i className="fa fa-inr"></i>
                        {totalAmount}
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>

            <div className="orderBtn text-center mt-4">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                className="placeOrderBtn"
              >
                PLACE ORDER
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Checkout;
