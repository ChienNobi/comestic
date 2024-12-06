import dayjs from "dayjs";

export const formatMoney = (money) => {
    if(!money || isNaN(money)) return '0';
    return money.toLocaleString() + ' ₫';
}

export const formatFullDateTime = date => {
    if (!date) {
        return '';
    }
    return dayjs(date).format('DD/MM/YYYY HH:mm');
}
