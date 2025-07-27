import { Layout, Menu, Typography, Badge } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { MoonOutlined, SunOutlined, DesktopOutlined, BellOutlined } from "@ant-design/icons";
import { useTheme, useNotifications } from "../store/AppStateContext";
import { useThemeManager } from "../hooks/useThemeManager";
import { useTranslation } from "../hooks/useTranslation";
import LanguageSwitcher from "../components/LanguageSwitcher";
import menuItems from "./menu";
const { Sider } = Layout;
const { Title } = Typography;

interface AppSiderProps {
    width?: number;
}

const AppSider: React.FC<AppSiderProps> = ({ width }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();
    const { notifications, togglePanel } = useNotifications();
    const { currentTheme, toggleTheme, getThemeModeText, getThemeModeIcon } = useThemeManager();
    const { success } = useNotifications();
    const { t } = useTranslation();

    // 使用全局状态中的宽度，如果没有传入 width 参数
    const siderWidth = width || theme.siderWidth;

    // 处理菜单点击
    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === 'theme-toggle') {
            // 切换主题模式
            toggleTheme();
            success(`已切换至${getThemeModeText()}`);
            return;
        }
        if (key === '/notifications') {
            // 打开通知面板，不导航到新页面
            togglePanel();
            return;
        }
        navigate(key);
    };

    // 确保 selectedKeys 正确反映当前路径
    const selectedKeys = useMemo(() => {
        return [location.pathname];
    }, [location.pathname]);

    // 获取主题图标
    const getThemeIcon = () => {
        const iconType = getThemeModeIcon();
        switch (iconType) {
            case 'sun':
                return <SunOutlined />;
            case 'moon':
                return <MoonOutlined />;
            case 'desktop':
                return <DesktopOutlined />;
            default:
                return <SunOutlined />;
        }
    };

    // 过滤顶部和底部菜单项，只保留icon
    const createMenuItemsWithIconOnly = (items: any[]) => {
        return items.map(item => {
            // 为主题切换按钮使用动态图标和标签
            if (item.key === 'theme-toggle') {
                return {
                    key: item.key,
                    icon: getThemeIcon(),
                    label: t(item.translationKey || 'theme.toggle'),
                };
            }
            // 为通知菜单项添加徽章
            if (item.key === '/notifications') {
                return {
                    key: item.key,
                    icon: notifications.unreadCount > 0 ? (
                        <Badge count={notifications.unreadCount} size="small">
                            <BellOutlined />
                        </Badge>
                    ) : <BellOutlined />,
                    label: t(item.translationKey || 'menu.notifications'),
                };
            }
            return {
                key: item.key,
                icon: item.icon,
                label: t(item.translationKey || item.label), // 使用翻译键，如果没有则使用原始标签
            };
        });
    };

    const topMenuItems = createMenuItemsWithIconOnly(
        menuItems.filter(item =>
            item && typeof item === 'object' && 'position' in item && item.position === 'top'
        )
    );

    const bottomMenuItems = createMenuItemsWithIconOnly(
        menuItems.filter(item =>
            item && typeof item === 'object' && 'position' in item && item.position === 'bottom'
        )
    );

    return (
        <Sider
            width={siderWidth}
            theme={currentTheme}

        >
            <div className="app-logo">
                <Title level={3}>AI</Title>
            </div>

            <div className="menu-container" style={{ overflow: 'visible' }}>
                <Menu
                    className="app-menu app-menu-top"
                    theme={currentTheme}
                    mode="inline"
                    selectedKeys={selectedKeys}
                    onClick={handleMenuClick}
                    items={topMenuItems}
                    inlineCollapsed={false}
                    style={{ overflow: 'visible' }}
                />

                <Menu
                    className="app-menu app-menu-bottom"
                    theme={currentTheme}
                    mode="inline"
                    selectedKeys={selectedKeys} // 底部菜单也使用选中状态
                    onClick={handleMenuClick}
                    items={bottomMenuItems}
                    inlineCollapsed={false}
                    style={{ overflow: 'visible' }}
                />
            </div>
        </Sider>
    );
};

export default AppSider;
