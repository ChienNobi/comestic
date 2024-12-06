import { useEffect, useState } from 'react';
import {Image, Layout, message, Tag} from 'antd';
import NiceModal from '@ebay/nice-modal-react';
import styled from 'styled-components';

import api from '@/services/api';
import Detail from './Detail';
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
        title: 'Số ngày',
        dataIndex: 'day',
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

const BeautyTreatment = () => {
    const [data, setData] = useState();
    const [detail, setDetail] = useState();
    const [loading, setLoading] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const getBeautyTreatments = query => {
        if (loading) {
            return;
        }
        setLoading(true);
        api
            .getBeautyTreatments(query)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                messageApi.error('Tải danh sách thất bại');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getBeautyTreatments();
    }, []);


    const backToTable = () => {
        setDetail();
    };

    const displayDetail = (record, index) => {
        setDetail(record);
    };

    const onSearch = value => {
        getBeautyTreatments({ keyword: value });
    };

    const onAdd = () => {
        NiceModal.show('add-beauty-treatment', {
            messageApi,
            onSuccess: () => {
                getBeautyTreatments();
                messageApi.success('Thêm thành công');
            },
        });
    };

    const onEdit = (record, callback) => {
        NiceModal.show('add-beauty-treatment', {
            data: record,
            messageApi,
            onSuccess: () => {
                getBeautyTreatments();
                messageApi.success('Cập nhật thành công');
                callback?.();
            },
        });
    };

    const onDelete = record => {
        api
            .deleteBeautyTreatment(record._id)
            .then(() => {
                getBeautyTreatments();
            })
            .catch(error => {
                console.log('Delete brand error', error);
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
                        showLog={false}
                    />
                )}
            </Layout.Content>
        </Layout>
    );
};

export default BeautyTreatment;
