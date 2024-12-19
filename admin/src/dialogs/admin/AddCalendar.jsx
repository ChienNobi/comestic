import { useEffect, useState } from 'react';
import {
  Modal,
  Button,
  Form,
  Select,
  DatePicker,
} from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import styled from 'styled-components';

import api from '@/services/api.js';

const CustomForm = styled(Form)({
  marginTop: 24,
  marginBottom: 24,
});


const AddCalendar = NiceModal.create(({ data, onSuccess, messageApi }) => {
  const modal = useModal();
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(false);
  const [beautyTreatments, setBeautyTreatment] = useState([]);
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);


  useEffect(() => {
    api.getBeautyTreatments().then(response => {
      response.data = response.data.map(item => ({
        label: item.title,
        value: item._id,
      }));
      setBeautyTreatment(response.data);
    }).catch(error => {
        console.log('Get beauty treatment error', error);
        messageApi.error('Lỗi khi tải danh sách lịch');
    });

    api.getUsers().then(response => {
      response.data = response.data.map(item => ({
        label: item.name,
        value: item.phone,
      }));
      setUsers(response.data);
    }).catch(error => {
      console.log('Get users error', error);
      messageApi.error('Lỗi khi tải danh sách người dùng');
    });

    api.getEmployees().then(response => {
      response.data = response.data.map(item => ({
        label: item.name,
        value: item.phone,
      }));
        setEmployees(response.data);
    }).catch(error => {
        console.log('Get employees error', error);
        messageApi.error('Lỗi khi tải danh sách nhân viên');
    });
  }, []);


  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
      });
      setIsEditMode(true);
    } else {
      form.setFieldsValue({status: true})
    }
  }, [data, form]);

  const onFinish = values => {
    const submitData = { ...values };
    if (isEditMode) {
      api
          .updateBlogs(data._id, submitData)
          .then(() => {
            onSuccess?.();
            modal.hide();
          })
          .catch(error => {
            console.log('Add product error', error);
            messageApi.error('Lỗi khi thêm lịch');
          });
      return
    }

    api
      .createBlogs(submitData)
      .then(() => {
        onSuccess?.();
        modal.hide();
      })
      .catch(error => {
        console.log('Add product error', error);
        messageApi.error('Lỗi khi thêm bài viết');
      });
  };

  return (
    <Modal
      title={data?.id ? 'Chỉnh sửa bài viết' : 'Thêm mới Lịch'}
      open={modal.visible}
      onCancel={modal.hide}
      afterClose={modal.remove}
      width={1000}
      footer={[
        <Button key="cancel" onClick={modal.hide}>
          Hủy
        </Button>,
        <Button form="add-form" key="submit" htmlType="submit" type="primary">
          {data?._id ? 'Cập nhật' : 'Thêm'}
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
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng chọn tiêu đề' }]}
        >
          <Select allowClear placeholder="Chọn tiêu đề" options={beautyTreatments} />
        </Form.Item>

        <Form.Item
            name="beauty_treatment_id"
            label="Chọn liệu trình"
            rules={[{ required: true, message: 'Vui lòng chọn liệu trình' }]}
        >
          <Select allowClear placeholder="Chọn liệu trình" options={beautyTreatments} />
        </Form.Item>

        <Form.Item
            name="user_phone"
            label="Khách hàng"
            rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}
        >
          <Select placeholder="Chọn khách hàng" options={users}/>
        </Form.Item>

        <Form.Item
            name="employee_phone"
            label="Nhân viên"
            rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
        >
          <Select placeholder="Chọn nhân viên" options={employees}/>
        </Form.Item>

        <Form.Item
            name="date"
            label="Ngày"
            initialValue={data?.date}
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
        >
          <DatePicker allowClear placeholder="Chọn ngày" size="large"/>
        </Form.Item>

      </CustomForm>
    </Modal>
  );
});

export default AddCalendar;
