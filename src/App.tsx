import { Layout, ConfigProvider, theme, Card } from "antd";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./components/AppRoutes";
import AppSider from "./menus/AppSider";
import CustomTitleBar from "./components/CustomTitleBar";
import NotificationCenter from "./components/NotificationCenter";
import AppStateProvider from "./store/AppStateProvider";
import { useCurrentPage, useTheme } from "./store/AppStateContext";
import { useThemeManager } from "./hooks/useThemeManager";
import menuItems from "./menus/menu";
import "./App.css";


const { Content, } = Layout;


// 内部布局组件（包含导航逻辑）
const AppLayoutInner = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const location = useLocation();
  const { current, setCurrentPage } = useCurrentPage();
  const { theme: appTheme } = useTheme();
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

  return (
    <Layout className="app-layout">
      {/* 侧边栏无右边框 */}
      <AppSider width={appTheme.siderWidth} />
      <Layout>
        {/* 自定义标题栏，无下边框 */}
        <CustomTitleBar title={`AiOne - ${getCurrentPageTitle()}`} style={{ background: colorBgContainer }} />
        <Card
          className="app-content"
          style={{
            position: 'relative',
            top: '-3px',
            zIndex: 300,
            borderRadius: '12px',
            left: '-2px',
          }}
        >
          <AppRoutes />
        </Card>
      </Layout>
      {/* 通知中心抽屉 */}
      <NotificationCenter />
    </Layout>
  );
};

const AppLayout = () => {
  const { theme: appTheme } = useTheme();
  const { currentTheme } = useThemeManager();
  // Ant Design 主题配置
  const antdThemeConfig = {
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: appTheme.primaryColor,
      Component: {
        Menu: {
          isconOnly: true, // 仅显示图标
          collapsedIconSize: 24, // 图标大小
        }
      }
    },
  };
  return (
    <ConfigProvider theme={antdThemeConfig}>
      <AppLayoutInner />
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
