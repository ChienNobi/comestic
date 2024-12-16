import { useEffect, useState } from 'react';
import {
  Modal,
  Button,
  Form,
  Input,
  Switch, Select,
} from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import styled from 'styled-components';

import api from '@/services/api.js';
import TextEditor from "@/components/TextEditor.jsx";
import UploadWidget from "@/components/ImageUpload.jsx";
import {DeleteOutlined} from "@ant-design/icons";

const CustomForm = styled(Form)({
  marginTop: 24,
  marginBottom: 24,
});

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  padding-bottom: 8px;
`;

const RemoveButton = styled(DeleteOutlined)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 2px 4px;
  background-color: #f56565;
  color: white;
  border: none;
`;

const StyledImage = styled.img`
  object-fit: cover;
  border-radius: 8px;
  width: 100%;
  height: 100%;
`;


const AddBeautyTreatment = NiceModal.create(({ data, onSuccess, messageApi }) => {
  const modal = useModal();
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(false);
  const [img, setImg] = useState(data?.img || '');


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
    const submitData = { ...values, img };
    if (isEditMode) {
      api
          .updateBlogs(data._id, submitData)
          .then(() => {
            onSuccess?.();
            modal.hide();
          })
          .catch(error => {
            console.log('Add product error', error);
            messageApi.error('Lỗi khi thêm blog');
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
      title={data?.id ? 'Chỉnh sửa bài viết' : 'Thêm mới bài viết'}
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
          />
        </Form.Item>

        <Form.Item
            name="category"
            label="Danh mục"
            initialValue={data?.category || null}
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
        >
          <Select allowClear placeholder="Chọn danh mục">
            <Select.Option value="beauty">Làm đẹp</Select.Option>
            <Select.Option value="healthy">Sức khỏe</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="img" label="Cover photo">
          {img !== '' && (
              <ImageContainer>
                <ImageWrapper key={img}>
                  <RemoveButton
                      type="button"
                      onClick={() => setImg('')}
                  ></RemoveButton>
                  <StyledImage src={img} alt="img-product" />
                </ImageWrapper>
              </ImageContainer>
          )}
          <UploadWidget onChange={ (url) => setImg(url) } />
        </Form.Item>

        <Form.Item
            name="description"
            label="Nội dung bài viết"
            rules={[{ required: true, message: "Vui lòng nhập vào nội dung bài viết" }]}
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
