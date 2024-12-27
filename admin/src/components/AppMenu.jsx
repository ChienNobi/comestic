import { Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { APP_MENU, APP_MODULES } from '@/commons/constants';
import { selectCurrentModule, setCurrentMenu } from '@/store/app';
import fonts from '@/theme/font';

const menuManageItems = [
  {
    key: 'manage',
    label: 'Quản lý',
    children: [
      { key: APP_MENU.MANAGE_PRODUCT, label: 'Sản phẩm' },
      {
        key: APP_MENU.MANAGE_ORDER,
        label: 'Đơn hàng',
      },
      {
        key: APP_MENU.MANAGE_COUPON,
        label: 'Phiếu giảm giá',
      },
      { key: APP_MENU.MANAGE_CATEGORY, label: 'Loại sản phẩm' },
      { key: APP_MENU.MANAGE_BRAND, label: 'Hãng sản phẩm' },
      { key: APP_MENU.MANAGER_BEAUTY_TREATMENT, label: 'Liệu trình làm đẹp' },
      { key: APP_MENU.BLOG, label: 'Blog' },
      { key: APP_MENU.CALENDAR, label: 'Lịch' },
      { key: APP_MENU.BEAUTY_CALENDAR, label: 'Đăng ký liệu trình' },
    ],
    type: 'group',
  },
];

const menuAdminItems = [
  {
    key: 'admin',
    label: 'ADMIN',
    children: [
      { key: APP_MENU.ADMIN_EMPLOYEE, label: 'Nhân viên' },
      { key: APP_MENU.USER_MANAGER, label: 'Quản lý user' }
    ],
    type: 'group',
  },
];

const CustomMenu = styled(Menu)({
  overflow: 'auto',
  '.ant-menu-item': {
    fontSize: 13,
  },
  '.ant-menu-item-selected': {
    fontFamily: fonts.Medium,
  },
});

const AppMenu = () => {
  const dispatch = useDispatch();

  const currentModule = useSelector(selectCurrentModule);

  const onClick = e => {
    dispatch(setCurrentMenu(e.key));
  };

  const getMenuData = () => {
    switch (currentModule) {
      case APP_MODULES.ADMIN:
        return menuAdminItems;
      case APP_MODULES.MANAGE:
        return menuManageItems;
    }
  };

  return (
    <CustomMenu
      defaultSelectedKeys={['product']}
      mode="inline"
      items={getMenuData()}
      onClick={onClick}
    />
  );
};

export default AppMenu;
