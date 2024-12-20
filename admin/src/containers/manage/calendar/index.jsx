import {Alert, Badge, Calendar, message} from 'antd';
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import NiceModal from "@ebay/nice-modal-react";
import api from "@/services/api.js";

const BeautyTreatmentCalendar = () => {
    const [key, setKey] = useState(0);
    const [events, setEvents] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    const onSelect = (newValue, info) => {
        if(info?.source === 'date') {
            NiceModal.show('add-calendar', {
                data: { date: newValue },
                messageApi,
                onSuccess: () => refresh(),
            });
        }
    };

    const onEventClick = (e, selectedItem) => {
        e.stopPropagation();
        e.preventDefault();
        NiceModal.show('add-calendar', {
            data: events.find(item => item._id === selectedItem._id),
            messageApi,
            onSuccess: () => refresh(),
        });
    }
    const getListData = async () => {
        const result = await api.getCalendars();
        const data = result?.data?.map(item => {
            return {
                dateFormated: dayjs(item.date).format('YYYY-MM-DD'),
                date: dayjs(item.date),
                content: item.title,
                _id: item._id,
                user_id: item.user_id,
                employee_id: item.employee_id,
                beauty_treatment_id: item.beauty_treatment_id,
            }
        })
        setEvents(data || [])
    };

    const refresh = async () => {
        await getListData();
        setKey(key + 1);
    }

    useEffect(() => {
        getListData();
    }, []);

    const dateCellRender = (value) => {
        const dateString = value.format('YYYY-MM-DD');
        const data = events
            .filter(event => event.dateFormated === dateString) || [];
        return (
            <div className="events">
                {data.map((item, index) => (
                    <div
                        key={index}
                        style={{ background: "#caeaff", marginBottom: '8px' }}
                        onClick={(e) => onEventClick(e, item)}>
                        {item.content}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <Calendar onSelect={onSelect} cellRender={dateCellRender} key={key}/>
        </>
    );
}

export default BeautyTreatmentCalendar;
