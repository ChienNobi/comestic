import { useMemo } from 'react';
import { Dropdown, Empty } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';
import styled from 'styled-components';

import { APP_MENU } from '@/commons/constants';
import { AppLayout, MenuSider, Name, User } from './styles';
import {
  clearAllState,
  selectCurrentMenu,
  selectCurrentUser,
} from '@/store/app';
import colors from '@/theme/color';
import storage from '@/storage';

import AppMenu from '@/components/AppMenu';
import AppSider from '@/components/AppSider';

import Role from '../admin/role';
import Employee from '../admin/employee';
import Department from '../admin/department';
import Product from '../manage/product';
import Category from '../manage/category';
import Brand from '../manage/brand';
import Order from '../manage/order';
import Coupon from '../manage/coupon';
import UserManager from "@/containers/admin/user-manager/index.jsx";
import BeautyTreatment from "@/containers/manage/beauty-treatment/index.jsx";
import Blog from "@/containers/manage/blog/index.jsx";
import BeautyTreatmentCalendar from "@/containers/manage/calendar/index.jsx";
import BeautyCalendar from "@/containers/manage/beauty-calendar/index.jsx";

const EmptyLayout = styled.div({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const getContentLayout = key => {
  switch (key) {
    case APP_MENU.MANAGE_ORDER:
      return <Order />;
    case APP_MENU.MANAGE_PRODUCT:
      return <Product />;
    case APP_MENU.MANAGE_COUPON:
      return <Coupon />;
    case APP_MENU.MANAGE_CATEGORY:
      return <Category />;
    case APP_MENU.MANAGE_BRAND:
      return <Brand />;
    case APP_MENU.MANAGER_BEAUTY_TREATMENT:
        return <BeautyTreatment />;
    case APP_MENU.BLOG:
        return <Blog />;
    case APP_MENU.CALENDAR:
        return <BeautyTreatmentCalendar />;
    case APP_MENU.BEAUTY_CALENDAR:
      return <BeautyCalendar />;

    // ADMIN
    case APP_MENU.ADMIN_ROLE:
      return <Role />;
    case APP_MENU.ADMIN_EMPLOYEE:
      return <Employee />;
    case APP_MENU.ADMIN_DEPARTMENT:
      return <Department />;
    case APP_MENU.USER_MANAGER:
      return <UserManager />

    default:
      return (
        <EmptyLayout>
          <Empty description={false} />
        </EmptyLayout>
      );
  }
};

const Home = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUser);
  const currentMenu = useSelector(selectCurrentMenu);

  const userDropdown = useMemo(
    () => ({
      items: [
        { key: 'personal', label: 'Thông tin cá nhân' },
        {
          key: 'logout',
          label: 'Đăng xuất',
          onClick: () => {
            storage.removeUser();
            dispatch(clearAllState());
          },
        },
      ],
    }),
    [],
  );

  return (
    <AppLayout>
      <AppSider />
      <MenuSider>
        <Dropdown menu={userDropdown}>
          <User>
            <div className="row">
              <FaUserCircle color={colors.primary} size={24} />
              <Name>{currentUser?.name}</Name>
            </div>
            <FaChevronDown color={colors.lightGray} size={12} />
          </User>
        </Dropdown>
        <AppMenu />
      </MenuSider>
      {getContentLayout(currentMenu)}
    </AppLayout>
  );
};

export default Home;
