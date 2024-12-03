import { useEffect, useState } from 'react';
import { Layout, Tag, message } from 'antd';
import NiceModal from '@ebay/nice-modal-react';

import { sortByAlphabet } from '@/commons/utils';
import api from '@/services/api';
import Detail from './Detail';
import MasterTable from '@/components/MasterTable';
import AppHeader from '@/components/AppHeader';
import LogsDrawer from '@/components/LogsDrawer';
import { getFeatureName } from '@/commons/locale';
import { FeatureTag } from './styles';

const localeFields = {
  id: 'Mã vai trò',
  name: 'Tên vai trò',
  accessibleFeatures: 'Tính năng truy cập',
};

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
];

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

  useEffect(() => {
    getUser();
  }, []);

  const backToTable = () => {
    setDetail();
  };

  const displayDetail = (record, index) => {
    setDetail(record);
  };
  const onSearch = value => {
    getRoles({ keyword: value });
  };

  const onAdd = () => {
    NiceModal.show('add-role', {
      messageApi,
      onSuccess: () => {
        getRoles();
        messageApi.success('Thêm thành công');
      },
    });
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
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
            showActions={false}
          />
        )}
      </Layout.Content>
    </Layout>
  );
};

export default Role;
