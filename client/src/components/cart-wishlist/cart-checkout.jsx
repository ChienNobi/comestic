import React from "react";
import Link from "next/link";
import useCartInfo from "@/hooks/use-cart-info";
import { useState } from "react";
import {formatMoney} from "@/utils/formatter";
import {SHIPPING_FEE_FAST} from "@/commons/constants";

const CartCheckout = () => {
  const { total } = useCartInfo();
  const [shipCost, setShipCost] = useState(0);
  const handleShippingCost = (value) => {
    if (!value) {
      setShipCost(0);
    } else {
      setShipCost(value);
    }
  };
  return (
    <div className="tp-cart-checkout-wrapper">
      <div className="tp-cart-checkout-top d-flex align-items-center justify-content-between">
        <span className="tp-cart-checkout-top-title">Tổng phụ</span>
        <span className="tp-cart-checkout-top-price">{formatMoney(total)}</span>
      </div>
      <div className="tp-cart-checkout-shipping">
        <h4 className="tp-cart-checkout-shipping-title">Phí ship</h4>
        <div className="tp-cart-checkout-shipping-option-wrapper">
          <div className="tp-cart-checkout-shipping-option">
            <input id="flat_rate" type="radio" name="shipping" />
            <label htmlFor="flat_rate" onClick={() => handleShippingCost(SHIPPING_FEE_FAST)}>
              Ship hỏa tốc: <span>{formatMoney(SHIPPING_FEE_FAST)}</span>
            </label>
          </div>
          <div className="tp-cart-checkout-shipping-option">
            <input id="free_shipping" type="radio" name="shipping" />
            <label
              onClick={() => handleShippingCost()}
              htmlFor="free_shipping"
            >
              Free shipping
            </label>
          </div>
        </div>
      </div>
      <div className="tp-cart-checkout-total d-flex align-items-center justify-content-between">
        <span>Total</span>
        <span>{formatMoney(total + shipCost)}</span>
      </div>
      <div className="tp-cart-checkout-proceed">
        <Link href="/checkout" className="tp-cart-checkout-btn w-100">
          Đặt hàng
        </Link>
      </div>
    </div>
  );
};

export default CartCheckout;
