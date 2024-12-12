import { useEffect, useState } from 'react';
import {Layout, message, Tag} from 'antd';
import NiceModal from '@ebay/nice-modal-react';

import api from '@/services/api';
import MasterTable from '@/components/MasterTable';
import AppHeader from '@/components/AppHeader';


const columns = [
    {
        title: 'Tiêu đề',
        dataIndex: 'title',
        key: 'title',
        width: 180,
    },
    {
        title: 'Danh mục',
        dataIndex: 'category_id',
        align: 'center',
        width: 60,
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        align: 'center',
        render: status => {
            const color = status ? 'green' : 'red';
            return <Tag color={color}>{status ? 'Hoạt động' : 'Tạm dừng'}</Tag>;
        },
    },
];

const Blog = () => {
    const [data, setData] = useState();
    const [detail, setDetail] = useState();
    const [loading, setLoading] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const getBlogs = query => {
        if (loading) {
            return;
        }
        setLoading(true);
        api
            .getBlogs(query)
            .then(response => {
                setData(response.data);
            })
            .catch(() => {
                messageApi.error('Tải danh sách thất bại');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getBlogs();
    }, []);


    const backToTable = () => {
        setDetail();
    };

    const displayDetail = (record, index) => {
        setDetail(record);
    };

    const onSearch = value => {
        getBlogs({ keyword: value });
    };

    const onAdd = () => {
        NiceModal.show('add-blog', {
            messageApi,
            onSuccess: () => {
                getBlogs();
                messageApi.success('Thêm thành công');
            },
        });
    };

    const onEdit = (record, callback) => {
        NiceModal.show('add-blog', {
            data: record,
            messageApi,
            onSuccess: () => {
                getBlogs();
                messageApi.success('Cập nhật thành công');
                callback?.();
            },
        });
    };

    const onDelete = record => {
        api
            .deleteBeautyTreatment(record._id)
            .then(() => {
                getBlogs();
            })
            .catch(error => {
                console.log('Delete error', error);
                messageApi.error('Xóa thất bại');
            });
    };

    return (
        <Layout>
            {contextHolder}
            <AppHeader
                detailText="Chi tiết hãn"
                showDetailText={detail?.id}
                onMenuClick={backToTable}
            />
            <Layout.Content>
                <MasterTable
                    columns={columns}
                    data={data}
                    loading={loading}
                    onClick={displayDetail}
                    onSearch={onSearch}
                    onAdd={onAdd}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    showLog={false}
                />
            </Layout.Content>
        </Layout>
    );
};

export default Blog;
