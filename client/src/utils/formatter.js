export const formatMoney = (money) => {
    if(!money || isNaN(money)) return '0';
    return money.toLocaleString() + ' ₫';
}
