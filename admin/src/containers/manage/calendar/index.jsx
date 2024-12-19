import {Alert, Badge, Calendar, message} from 'antd';
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import NiceModal from "@ebay/nice-modal-react";

const BeautyTreatmentCalendar = () => {
    const [value, setValue] = useState(() => dayjs());
    const [events, setEvents] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    const onSelect = (newValue, info) => {
        if(info?.source === 'date') {
            NiceModal.show('add-calendar', {
                data: { date: newValue },
                messageApi,
                onSuccess: () => {
                    messageApi.success('Thêm thành công');
                },
            });
        }
    };
    const onPanelChange = (newValue) => {
        setValue(newValue);
    };

    const onEventClick = () => {
        console.log('event click');
    }

    useEffect(() => {
        setEvents([
            { "date": "2024-12-20", "event": "Meeting with Team A" },
            { "date": "2024-12-20", "event": "Meeting with Team B" },
            { "date": "2024-12-20", "event": "Meeting with Team C" },
            { "date": "2024-12-20", "event": "Meeting with Team D" },
            { "date": "2024-12-20", "event": "Meeting with Team E" },
            { "date": "2024-12-22", "event": "Project Deadline" }
        ])
    }, []);
    const getListData = (value) => {
        const dateString = value.format('YYYY-MM-DD');
        return events
            .filter(event => event.date === dateString)
            .map(event => ({ type: 'success', content: event.event }));
    };

    const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
            <div className="events">
                {listData.map((item, index) => (
                    <div key={index} style={{ background: "#caeaff", marginBottom: '8px' }} onClick={onEventClick}>
                        {item.content}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange} cellRender={dateCellRender}/>
        </>
    );
}

export default BeautyTreatmentCalendar;
