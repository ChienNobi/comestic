import { useEffect, useState } from 'react';
import {Layout, Tag, message, Button, Popconfirm, Space} from 'antd';
import NiceModal from '@ebay/nice-modal-react';

import api from '@/services/api';
import Detail from './Detail';
import MasterTable from '@/components/MasterTable';
import AppHeader from '@/components/AppHeader';

const Role = () => {
  const [data, setData] = useState();
  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const getUser = query => {
    if (loading) {
      return;
    }
    setLoading(true);
    api
      .getUsers(query)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log('Get roles error', error);
        messageApi.error('Tải danh sách thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onUpdate = record => {
    api
        .updateUser({
          email: record.email,
          status: record.status === 'active' ? 'deactive' : 'active',
        })
        .then(() => {
          getUser();
          messageApi.success('Cập nhật thành công');
        })
        .catch(error => {
          console.log('Update user error', error);
          messageApi.error('Cập nhật thất bại');
        });
  }

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        const color = status === 'active' ? 'green' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
          <Space size="middle">
            <Popconfirm
                title="Bạn có chắc muốn thực hiện hành động này?"
                description="Thao tác này có thể ảnh hưởng tới các tính năng khác"
                okText="OK"
                cancelText="Hủy"
                onConfirm={() => onUpdate?.(record)}
            >
              <Button size="small">{ record.status === 'active' ? 'Khóa' : 'Mở khóa' }</Button>
            </Popconfirm>
          </Space>
      ),
    },
  ];


  useEffect(() => {
    getUser();
  }, []);

  const backToTable = () => {
    setDetail();
  };

  const displayDetail = (record, index) => {
    setDetail(record);
  };

  const onEdit = (record, callback) => {
    NiceModal.show('add-role', {
      data: record,
      messageApi,
      onSuccess: () => {
        getRoles();
        messageApi.success('Cập nhật thành công');
        callback?.();
      },
    });
  };

  const onDelete = record => {
    api
      .deleteRole(record.id)
      .then(() => {
        getRoles();
      })
      .catch(error => {
        messageApi.error('Xóa thất bại');
      });
  };

  return (
    <Layout>
      {contextHolder}
      <AppHeader
        detailText="Chi tiết vai trò"
        showDetailText={detail?.id}
        onMenuClick={backToTable}
      />
      <Layout.Content>
        {detail?.id ? (
          <Detail
            data={detail}
            onEdit={onEdit}
            onDelete={onDelete}
            onBack={backToTable}
          />
        ) : (
          <MasterTable
            columns={columns}
            data={data}
            loading={loading}
            onClick={displayDetail}
            onSearch={onSearch}
            onAdd={false}
            onEdit={false}
            onDelete={onDelete}
            showActions={false}
            showLog={false}
          />
        )}
      </Layout.Content>
    </Layout>
  );
};

export default Role;
