import { Layout, ConfigProvider, theme } from "antd";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./components/AppRoutes";
import AppSider from "./menus/AppSider";
import CustomTitleBar from "./components/CustomTitleBar";
import NotificationCenter from "./components/NotificationCenter";
import AppStateProvider from "./store/AppStateProvider";
import { useCurrentPage, useTheme } from "./store/AppStateContext";
import { useThemeManager } from "./hooks/useThemeManager";
import ThemeIntegration from "./components/ThemeIntegration";
import menuItems from "./menus/menu";
import "./App.css";

const { Content } = Layout;



// 内部布局组件（包含导航逻辑）
const AppLayout = () => {
  const location = useLocation();
  const { current, setCurrentPage } = useCurrentPage();
  const { theme: appTheme } = useTheme();
  const { currentTheme } = useThemeManager();

  // 获取当前页面标题
  const getCurrentPageTitle = () => {
    const currentPath = location.pathname === '/' ? '/home' : location.pathname;
    const currentMenuItem = menuItems.find(item => item && typeof item === 'object' && 'key' in item && item.key === currentPath);
    if (currentMenuItem && typeof currentMenuItem === 'object' && 'label' in currentMenuItem) {
      const title = currentMenuItem.label as string;
      // 更新全局状态
      if (current.path !== currentPath || current.title !== title) {
        setCurrentPage(currentPath, title);
      }
      return title;
    }
    return '首页';
  };

  // Ant Design 主题配置
  const antdThemeConfig = {
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: appTheme.primaryColor,
    },
  };

  return (
    <ConfigProvider theme={antdThemeConfig}>
      <ThemeIntegration>
        <Layout className="app-layout" style={{ minHeight: '100vh' }}>
          {/* 自定义标题栏 */}
          <CustomTitleBar title={`AiOne - ${getCurrentPageTitle()}`} />

          <AppSider width={appTheme.siderWidth} />

          <Layout style={{ marginLeft: `var(--content-margin-left)` }}>
            <Content className="app-content">
              <AppRoutes />
            </Content>
          </Layout>

          {/* 通知中心抽屉 */}
          <NotificationCenter />
        </Layout>
      </ThemeIntegration>
    </ConfigProvider>
  );
};

// 主应用组件
function App() {
  return (
    <AppStateProvider>
      <Router>
        <AppLayout />
      </Router>
    </AppStateProvider>
  );
}

export default App;
