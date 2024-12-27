import { useEffect, useState } from 'react';
import {Layout, message} from 'antd';
import NiceModal from '@ebay/nice-modal-react';

import api from '@/services/api';
import Detail from './Detail';
import MasterTable from '@/components/MasterTable';
import AppHeader from '@/components/AppHeader';
import {formatDate} from "@/commons/utils.js";


const columns = [
    {
        title: 'Tên liệu trình',
        dataIndex: 'title',
        key: 'beauty_treatment_id.title',
        width: 180,
    },
    {
        title: 'Người đăng ký',
        dataIndex: 'user',
        align: 'center',
        width: 60,
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'phone',
        align: 'center',
        width: 60,
    },
    {
        title: 'Ngày đăng ký',
        dataIndex: 'created_at',
        align: 'center',
        width: 60,
    },
];

const BeautyCalendar= () => {
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
            .getAllCalendarBeauty(query)
            .then(response => {
                setData(response.data?.map((item) => {
                    return {
                        title: item?.beauty_treatment_id?.title,
                        user: item?.user_id?.name,
                        phone: item?.user_id?.phone,
                        created_at: formatDate(item?.createdAt),
                    }
                }));
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
        NiceModal.show('add-calendar-beauty', {
            messageApi,
            onSuccess: () => {
                getBeautyTreatments();
                messageApi.success('Thêm thành công');
            },
        });
    };

    const onEdit = (record, callback) => {
        NiceModal.show('add-calendar-beauty', {
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
                        showActions={false}
                        showFilter={false}
                    />
                )}
            </Layout.Content>
        </Layout>
    );
};

export default BeautyCalendar;
