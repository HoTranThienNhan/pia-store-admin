import AdminPage from "../pages/AdminPage/AdminPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignInAdminPage from "../pages/SignInPage/SignInPage";
import UserEditProfilePage from "../pages/UserEditProfilePage/UserEditProfilePage";
import UserProfilePage from "../pages/UserProfilePage/UserProfilePage";


export const routes = [
    {
        path: '/',
        page: SignInAdminPage,
        isShowHeader: false,
        isPrivate: false,
        exact: false,
    },
    {
        path: '/signin',
        page: SignInAdminPage,
        isShowHeader: false,
        isPrivate: false,
        exact: true,
    },
    {
        path: '/user/profile',
        page: UserProfilePage,
        isShowHeader: true,
        isPrivate: false,
        exact: true,
    },
    {
        path: '/user/profile/edit',
        page: UserEditProfilePage,
        isShowHeader: true,
        isPrivate: false,
        exact: true,
    },
    // admin routes
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: true,
        isPrivate: true,
        exact: true,
    },
    // remaining routes
    {
        path: '*',
        page: NotFoundPage,
        isShowHeader: false,
        isPrivate: false,
        exact: true,
    },
]