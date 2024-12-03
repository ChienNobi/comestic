import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import Link from "next/link";
// internal
import { Close, Minus, Plus } from "@/svg";
import {
  add_cart_product,
  quantityDecrement,
  remove_product,
} from "@/redux/features/cartSlice";
import {formatMoney} from "@/utils/formatter";

const CartItem = ({ product }) => {
  const { id, img, name, price, orderQuantity = 0 } = product || {};

  const dispatch = useDispatch();

  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };
  const handleDecrement = (prd) => {
    dispatch(quantityDecrement(prd));
  };

  const handleRemovePrd = (prd) => {
    dispatch(remove_product(prd));
  };

  return (
    <tr>
      <td className="tp-cart-img">
        <Link href={`/product-details/${id}`}>
          <Image src={img} alt="product img" width={70} height={100} />
        </Link>
      </td>
      <td className="tp-cart-title">
        <Link href={`/product-details/${id}`}>{name}</Link>
      </td>
      <td className="tp-cart-price">
        <span>{formatMoney(price * orderQuantity)}</span>
      </td>
      <td className="tp-cart-quantity">
        <div className="tp-product-quantity mt-10 mb-10">
          <span onClick={() => handleDecrement(product)} className="tp-cart-minus"><Minus /></span>
          <input
            className="tp-cart-input"
            type="text"
            value={orderQuantity}
            readOnly
          />
          <span
            onClick={() => handleAddProduct(product)}
            className="tp-cart-plus"
          >
            <Plus />
          </span>
        </div>
      </td>
      <td className="tp-cart-action">
        <button
          onClick={() => handleRemovePrd({ name, id: id })}
          className="tp-cart-action-btn"
        >
          <Close />
          <span> Xóa</span>
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
