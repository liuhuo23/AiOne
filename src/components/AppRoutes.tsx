import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import UserManagementPage from "../pages/UserManagementPage";
import DocumentsPage from "../pages/DocumentsPage";
import DatabasePage from "../pages/DatabasePage";
import NotificationsPage from "../pages/NotificationsPage";
import SettingsPage from "../pages/settings/SettingsPage";
import Assistants from "../pages/Assistants";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Assistants />} />
            {/* <Route path="/home" element={<HomePage />} /> */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/user" element={<UserManagementPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/database" element={<DatabasePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings/*" element={<SettingsPage />} />
            <Route path="/assent" element={<Assistants />} />
        </Routes>
    );
};

export default AppRoutes;
