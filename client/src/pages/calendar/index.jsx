import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import SectionTitle from "@/components/blog/blog-grid/section-title";
import viLanguage from '@fullcalendar/core/locales/vi';
import Footer from "@/layout/footers/footer";
import Wrapper from "@/layout/wrapper";
import React from "react";
import {useGetCalendarQuery} from "@/redux/features/blogApi";
import dayjs from "dayjs";


const Calendar = () => {
    const [eventContent, setEventContent] = React.useState(null);
    const {data} = useGetCalendarQuery();

    React.useEffect(() => {
        if (data) {
            setEventContent(data.data.map(item => {
                return {
                    title: item.title,
                    date: dayjs(item.date).format('YYYY-MM-DD')
                }
            }));
        }
    }, [data]);


    return (
            <Wrapper>
                <SEO pageTitle="Calendar"/>
                <HeaderTwo style_2={true}/>
                <SectionTitle text="Lịch hẹn"/>
                <div className="container mb-4">
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView='dayGridMonth'
                        weekends={false}
                        events={eventContent}
                        locale={viLanguage}
                    />
                </div>
                <Footer primary_style={true}/>
            </Wrapper>
    )
}

export default Calendar;
