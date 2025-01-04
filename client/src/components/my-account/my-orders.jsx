import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

const MyOrders = ({ orderData }) => {
  const order_items = orderData.data;
  return (
    <div className="profile__ticket table-responsive">
      {!order_items ||
        (order_items?.length === 0 && (
          <div
            style={{ height: "210px" }}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="text-center">
              <i
                style={{ fontSize: "30px" }}
                className="fa-solid fa-cart-circle-xmark"
              ></i>
              <p>Bạn chưa có đơn hàng nào</p>
            </div>
          </div>
        ))}
      {order_items && order_items?.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Mã đơn hàng</th>
              <th scope="col">Thời gian đặt hàng</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Xem</th>
            </tr>
          </thead>
          <tbody>
            {order_items.map((item, i) => (
              <tr key={i}>
                <th scope="row">#{item._id.substring(20, 25)}</th>
                <td data-info="title">
                  {dayjs(item.createdAt).format("MMMM D, YYYY")}
                </td>
                <td
                  data-info={`status ${
                    item.status === "Pending" ? "pending" : ""
                  }  ${item.status === "Processing" ? "hold" : ""}  ${
                    item.status === "Delivered" ? "done" : ""
                  }`}
                  className={`status ${
                    item.status === "Pending" ? "pending" : ""
                  } ${item.status === "Processing" ? "hold" : ""}  ${
                    item.status === "Delivered" ? "done" : ""
                  }`}
                >
                  {item.status}
                </td>
                <td>
                  <Link href={`/order/${item._id}`} className="tp-logout-btn">
                    Hoá đơn
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
