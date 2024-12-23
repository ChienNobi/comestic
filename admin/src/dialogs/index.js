import NiceModal from '@ebay/nice-modal-react';

import AddRole from './admin/AddRole';
import AddEmployee from './admin/AddEmployee';
import AddDepartment from './admin/AddDepartment';
import AddCategory from './manage/AddCategory';
import AddBrand from './manage/AddBrand';
import AddProduct from './manage/AddProduct';
import AddCoupon from './manage/AddCoupon';
import AddBeautyTreatment from "@/dialogs/admin/AddBeautyTreatment.jsx";
import AddBlog from "@/dialogs/admin/AddBlog.jsx";
import AddCalendar from "@/dialogs/admin/AddCalendar.jsx";

NiceModal.register('add-product', AddProduct);
NiceModal.register('add-employee', AddEmployee);
NiceModal.register('add-role', AddRole);
NiceModal.register('add-department', AddDepartment);
NiceModal.register('add-category', AddCategory);
NiceModal.register('add-brand', AddBrand);
NiceModal.register('add-coupon', AddCoupon);
NiceModal.register('add-beauty-treatment', AddBeautyTreatment);
NiceModal.register('add-blog', AddBlog);
NiceModal.register('add-calendar', AddCalendar);
