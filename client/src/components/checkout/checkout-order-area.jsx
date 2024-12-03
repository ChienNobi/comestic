import { useState } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
// internal
import useCartInfo from "@/hooks/use-cart-info";
import ErrorMsg from "../common/error-msg";
import {SHIPPING_FEE_FAST, SHIPPING_FEE_NORMAL} from "@/commons/constants";
import {formatMoney} from "@/utils/formatter";

const CheckoutOrderArea = ({ checkoutData }) => {
  const {
    handleShippingCost,
    cartTotal = 0,
    stripe,
    isCheckoutSubmit,
    clientSecret,
    register,
    errors,
    showCard,
    setShowCard,
    shippingCost,
    discountAmount,
  } = checkoutData;
  const { cart_products } = useSelector((state) => state.cart);
  const { total } = useCartInfo();
  return (
    <div className="tp-checkout-place white-bg">
      <h3 className="tp-checkout-place-title">Thông tin mua hàng</h3>

      <div className="tp-order-info-list">
        <ul>
          {/*  header */}
          <li className="tp-order-info-list-header">
            <h4>Sản phẩm</h4>
            <h4>Tổng tiền</h4>
          </li>

          {cart_products.map((item) => (
            <li key={item.id} className="tp-order-info-list-desc">
              <p>
                {item.name} <span> x {item.orderQuantity}</span>
              </p>
              <span>{formatMoney(item.price)}</span>
            </li>
          ))}

          <li className="tp-order-info-list-shipping">
            <span>Phương thức giao hàng</span>
            <div className="tp-order-info-list-shipping-item d-flex flex-column align-items-end">
              <span>
                <input
                  {...register(`shippingOption`, {
                    required: `Vui lòng chọn phương thức giao hàng`,
                  })}
                  id="flat_shipping"
                  type="radio"
                  name="shippingOption"
                />
                <label
                  onClick={() => handleShippingCost(SHIPPING_FEE_FAST)}
                  htmlFor="flat_shipping"
                >
                  Ship nhanh <span>{formatMoney(SHIPPING_FEE_FAST)}</span>
                </label>
              </span>
              <span>
                <input
                  {...register(`shippingOption`, {
                    required: `Vui lòng chọn phương thức giao hàng`,
                  })}
                  id="flat_rate"
                  type="radio"
                  name="shippingOption"
                />
                <label
                  onClick={() => handleShippingCost(SHIPPING_FEE_NORMAL)}
                  htmlFor="flat_rate"
                >
                  Ship thường <span>{formatMoney(SHIPPING_FEE_NORMAL)}</span>
                </label>
              </span>
              <ErrorMsg msg={errors?.shippingOption?.message} />
            </div>
          </li>

          {/*  subtotal */}
          <li className="tp-order-info-list-subtotal">
            <span>Tổng phụ</span>
            <span>{formatMoney(total)}</span>
          </li>

          {/*  shipping cost */}
          <li className="tp-order-info-list-subtotal">
            <span>Phí ship</span>
            <span>{formatMoney(shippingCost)}</span>
          </li>

          {/* discount */}
          <li className="tp-order-info-list-subtotal">
            <span>Giảm giá</span>
            <span>{formatMoney(discountAmount)}</span>
          </li>

          {/* total */}
          <li className="tp-order-info-list-total">
            <span>Tổng tiền</span>
            <span>{formatMoney(cartTotal)}</span>
          </li>
        </ul>
      </div>
      <div className="tp-checkout-payment">
        <div className="tp-checkout-payment-item">
          <input
            {...register(`payment`, {
              required: `Vui lòng chọn phương thức thanh toán!`,
            })}
            type="radio"
            id="back_transfer"
            name="payment"
            value="Card"
          />
          <label
            onClick={() => setShowCard(true)}
            htmlFor="back_transfer"
            data-bs-toggle="direct-bank-transfer"
          >
            Thẻ ngân hàng
          </label>
          {showCard && (
            <div className="direct-bank-transfer">
              <div className="payment_card">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="tp-checkout-payment-item">
          <input
            {...register(`payment`, {
              required: `Vui lòng chọn phương thức thanh toán`,
            })}
            onClick={() => setShowCard(false)}
            type="radio"
            id="cod"
            name="payment"
            value="COD"
          />
          <label htmlFor="cod">Thanh toán khi nhận hàng</label>
        </div>
        <ErrorMsg msg={errors?.payment?.message} />
      </div>

      <div className="tp-checkout-btn-wrapper">
        <button
          type="submit"
          disabled={!stripe || isCheckoutSubmit}
          className="tp-checkout-btn w-100"
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
};

export default CheckoutOrderArea;
