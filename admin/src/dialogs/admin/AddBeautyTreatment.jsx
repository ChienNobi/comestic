import { useEffect, useState } from 'react';
import {
  Modal,
  Button,
  Form,
  Input,
  Switch,
} from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import styled from 'styled-components';
import { DeleteOutlined } from '@ant-design/icons';

import api from '@/services/api.js';
import TextEditor from "@/components/TextEditor.jsx";

const CustomForm = styled(Form)({
  marginTop: 24,
  marginBottom: 24,
});


const AddBeautyTreatment = NiceModal.create(({ data, onSuccess, messageApi }) => {
  const modal = useModal();
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
      });
    } else {
      form.setFieldsValue({status: true})
    }
  }, [data, form]);

  const onFinish = values => {
    const submitData = { ...values };

    // if (data?.id) {
    //   const updatedValues = {};
    //   Object.keys(values).forEach(key => {
    //     if (typeof values[key] !== 'object') {
    //       if (values[key] !== data[key]) {
    //         updatedValues[key] = values[key];
    //       }
    //     } else {
    //       if (JSON.stringify(values[key]) !== JSON.stringify(data[key])) {
    //         updatedValues[key] = values[key];
    //       }
    //     }
    //   });
    //   if (!Object.keys(updatedValues).length) {
    //     return;
    //   }
    //
    //   api
    //     .updateProduct(data.id, { ...updatedValues })
    //     .then(() => {
    //       onSuccess?.();
    //       modal.hide();
    //     })
    //     .catch(error => {
    //       console.log('Update product error', error);
    //       if (error?.response?.data?.message === 'Product is already exists') {
    //         messageApi.error('Mã sản phẩm đã tồn tại');
    //       } else {
    //         messageApi.error('Lỗi khi cập nhật sản phẩm');
    //       }
    //     });
    // } else {

    api
      .createBeautyTreatment(submitData)
      .then(() => {
        onSuccess?.();
        modal.hide();
      })
      .catch(error => {
        console.log('Add product error', error);
        messageApi.error('Lỗi khi thêm liệu trình làm đẹp');
      });
  };

  return (
    <Modal
      title={data?.id ? 'Chỉnh sửa liệu trình' : 'Thêm mới liệu trình'}
      open={modal.visible}
      onCancel={modal.hide}
      afterClose={modal.remove}
      width={1000}
      footer={[
        <Button key="cancel" onClick={modal.hide}>
          Hủy
        </Button>,
        <Button form="add-form" key="submit" htmlType="submit" type="primary">
          {data?.id ? 'Cập nhật' : 'Thêm'}
        </Button>,
      ]}
    >
      <CustomForm
        id="add-form"
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        labelCol={{ span: 4 }}
      >
        <Form.Item
          name="title"
          label="Tiêu đề liệu trình"
          rules={[
            { required: true, message: 'Vui lòng nhập vào tiêu đề' },
          ]}
          initialValue={data?.title || ''}
        >
          <Input
            placeholder=""
            autoComplete="nope"
            spellCheck={false}
            allowClear
            disabled={!!data?.id}
          />
        </Form.Item>

        <Form.Item
            name="day"
            label="Số ngày của liệu trình"
            rules={[
              { required: true, message: 'Vui lòng nhập vào số ngày của liệu trình' },
            ]}
            initialValue={data?.title || ''}
        >
          <Input
              placeholder=""
              autoComplete="nope"
              spellCheck={false}
              allowClear
              disabled={!!data?.id}
          />
        </Form.Item>

        <Form.Item
            name="description"
            label="Nội dung liệu trình"
            rules={[{ required: true, message: "Vui lòng nhập vào nội dung liệu trình" }]}
        >
          <TextEditor
              value={form.getFieldValue("description")}
              onChange={(description) => form.setFieldsValue({ description })}
          />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status" valuePropName="checked">
          <Switch />
        </Form.Item>

      </CustomForm>
    </Modal>
  );
});

export default AddBeautyTreatment;
