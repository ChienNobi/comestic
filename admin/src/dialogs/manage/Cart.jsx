import {useEffect, useState} from 'react';
import {Modal, Button, Form, Input, Select} from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import styled from 'styled-components';
import { DeleteOutlined } from '@ant-design/icons';

import api from '@/services/api';
import {clearSessionProducts, getSessionProducts, saveSessionProducts} from "@/commons/sessionStorage.js";
import {formatPrice} from "@/commons/utils.js";

const CustomForm = styled(Form)({
  marginTop: 24,
  marginBottom: 24,
});

const ItemList = styled.div`
  padding: .5em;
  border-bottom: 1px solid #ccc;
`;

const Cart = NiceModal.create(({ data, onSuccess, messageApi }) => {
  const freeShipValue = 300000;
  const modal = useModal();
  const [shippingCost, setShippingCost] = useState(0);
  const [products, setProducts] = useState(getSessionProducts());

  const calculateTotalPrice = products => {
    return products.reduce((total, product) => total + product.price * product.orderQuantity, 0);
  };

  const [totalPrice, setTotalPrice] = useState(calculateTotalPrice(products));
  const [discount, setDiscount] = useState(0);
  const [isValid, setIsValid] = useState('')

  useEffect(() => {
    setTotalPrice(calculateTotalPrice(products));
    setShippingCost(products.length > 0 && totalPrice >= freeShipValue ? 0 : 30000);
  }, [products]);

  function validatePromoCode(promoCode) {
    return undefined;
  }
  const updateQuantity = (productId, newQuantity) => {
    const updatedProducts = products.map(product =>
        product._id === productId ? { ...product, orderQuantity: newQuantity } : product
    ).filter(product => product.orderQuantity > 0);
    setProducts(updatedProducts);
    saveSessionProducts(updatedProducts);
    setTotalPrice(calculateTotalPrice(updatedProducts));
    setShippingCost(updatedProducts.length > 0 && totalPrice >= freeShipValue ? 0 : 30000);
  };

  const removeProduct = productId => {
    const updatedProducts = products.filter(product => product._id !== productId);
    setProducts(updatedProducts);
    saveSessionProducts(updatedProducts);
    setTotalPrice(calculateTotalPrice(updatedProducts));
    setShippingCost(updatedProducts.length > 0 && totalPrice >= freeShipValue ? 0 : 30000);
  };

  const applyPromoCode = (promoCode) => {
    const discountValue = validatePromoCode(promoCode);
    setDiscount(discountValue);
    setTotalPrice(calculateTotalPrice(products) - discountValue);
  };

  const handlePromotionCode = (e) => {
    const val = e.target.value
    if(val > 30) {
      setDiscount(0)
      setIsValid('error')
      return
    }
    setIsValid('')
    setDiscount(val/100)
  }

  const onFinish = values => {
    const orderDetails = {
      ...values,
      cart: products,
      country: 'Vietnam',
      shippingOption: 'on',
      status: 'pending',
      paymentMethod: 'COD',
      subTotal: totalPrice,
      shippingCost,
      discount: totalPrice * discount,
      totalAmount: totalPrice + shippingCost - discount,
    };

    api.createOrder(orderDetails)
        .then(() => {
          clearSessionProducts();
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          messageApi.error('Lỗi khi thêm đơn hàng');
        });
  };

  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.getUsers().then(response => {
      response.data = response.data.map(item => ({
        label: item.name,
        value: item._id,
      }));
      setUsers(response.data);
    }).catch(error => {
      console.log('Get users error', error);
      messageApi.error('Lỗi khi tải danh sách người dùng');
    });
  }, []);

  return (
      <Modal
          title={data?.id ? 'Chỉnh sửa đơn hàng' : 'Đặt hàng'}
          open={modal.visible}
          onCancel={modal.hide}
          afterClose={modal.remove}
          width={800}
          footer={[
            <Button key="cancel" onClick={modal.hide}>
              Hủy
            </Button>,
            <Button form="add-form" key="submit" htmlType="submit" type="primary">
              {data?.id ? 'Cập nhật' : 'Thêm'}
            </Button>,
          ]}
      >
        <div>
          <h3>Thông tin giỏ hàng</h3>
          {products.map((product, index) => (
              <ItemList key={product._id} style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                <span style={{flex: 1}}>{product.name} x {formatPrice(product.price)}</span>
                <Button onClick={() => updateQuantity(product._id, product.orderQuantity - 1)}>-</Button>
                <span style={{margin: '0 1rem'}}>{product.orderQuantity}</span>
                <Button style={{marginRight: '1rem'}}
                        onClick={() => updateQuantity(product._id, product.orderQuantity + 1)}>+</Button>
                <Button onClick={() => removeProduct(product._id)} icon={<DeleteOutlined/>}/>
              </ItemList>
          ))}
          <div style={{textAlign: "right", display: 'flex'}}>
            <div style={{ flexShrink: 0}}>Giảm giá:</div> 
            <Input onChange={handlePromotionCode} status={isValid}></Input>
          </div>
          <div style={{textAlign: "right"  }}>Phí vận chuyển: <b>{formatPrice(shippingCost)}</b></div>
          <div style={{textAlign: "right"}}>Tổng tiền: <b>{formatPrice(totalPrice + shippingCost - totalPrice * discount)}</b></div>
        </div>

        <h3>Thông tin đặt hàng</h3>
        <CustomForm
            id="add-form"
            onFinish={onFinish}
            autoComplete="off"
            labelCol={{span: 6}}
        >
          <Form.Item
              name="user"
              label="Khách hàng"
              rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}
          >
            <Select placeholder="Chọn khách hàng" options={users}/>
          </Form.Item>

          <Form.Item
              name="name"
              label="Tên người nhận"
              rules={[
                {required: true, message: 'Vui lòng điền đầy đủ thông tin'},
              ]}
              initialValue={data?.name || ''}
          >
            <Input
                autoComplete="nope"
                spellCheck={false}
            />
          </Form.Item>

          <Form.Item
              name="city"
              label="Thành phố"
              rules={[
                {required: true, message: 'Vui lòng điền đầy đủ thông tin'},
              ]}
          >
            <Input
                autoComplete="nope"
                spellCheck={false}
            />
          </Form.Item>

          <Form.Item
              name="address"
              label="Địa chỉ nhận hàng"
              rules={[
                {required: true, message: 'Vui lòng điền đầy đủ thông tin'},
              ]}
          >
            <Input
                autoComplete="nope"
                spellCheck={false}
            />
          </Form.Item>

          <Form.Item
              name="contact"
              label="Số điện thoại"
              rules={[
                {required: true, message: 'Vui lòng điền đầy đủ thông tin'},
              ]}
          >
            <Input
                autoComplete="nope"
                spellCheck={false}
            />
          </Form.Item>

          <Form.Item
              name="email"
              label="Email"
              type="email"
              rules={[
                {required: true, message: 'Vui lòng điền đầy đủ thông tin'},
              ]}
          >
            <Input
                autoComplete="nope"
                spellCheck={false}
            />
          </Form.Item>
        </CustomForm>
      </Modal>
  );
});

export default Cart;
