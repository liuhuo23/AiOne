import { useState } from "react";
import { Card, Typography, Space, Button, Input, } from "antd";
import { invoke } from "@tauri-apps/api/core";
import { useNotifications } from "../store/AppStateContext";
import { useThemeManager } from "../hooks/useThemeManager";
import { useTranslation } from "../hooks/useTranslation";
import { SunOutlined, MoonOutlined, BellOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const HomePage = () => {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");
    const { success, info, warning, error } = useNotifications();
    const { currentTheme, toggleTheme, getThemeModeText } = useThemeManager();
    const { t } = useTranslation();

    async function greet() {
        try {
            const result = await invoke("greet", { name }) as string;
            setGreetMsg(result);
            // 同时发送全局通知
            success(t("greet.success"), `Hello, ${name}! ${t("greet.welcome_message")}`);
        } catch (error) {
            console.error(error);
        }
    }

    // 测试通知功能
    const testNotifications = () => {
        setTimeout(() => success(t("notification.messages.notification_success"), t("notification.messages.notification_success"), { duration: 3 }), 500);
        setTimeout(() => info(t("notification.messages.notification_info"), t("notification.messages.notification_info"), { duration: 4 }), 1000);
        setTimeout(() => warning(t("notification.messages.notification_warning"), t("notification.messages.notification_warning"), { duration: 5 }), 1500);
        setTimeout(() => error(t("notification.messages.notification_error"), t("notification.messages.notification_error"), {
            duration: 0,
            action: {
                text: t("notification.messages.retry"),
                onClick: () => info(t("notification.messages.retry"), t("notification.messages.retry_clicked"))
            }
        }), 2000);
    };

    // 切换主题并显示通知
    const handleThemeToggle = () => {
        toggleTheme();
        const newTheme = getThemeModeText();
        success(t("notification.messages.theme_switched"), `${t("theme.switched_to")}${newTheme}`, {
            duration: 2
        });
    };

    // 专门测试暗色主题下的字体可见性
    const testDarkModeNotification = () => {
        if (currentTheme === 'light') {
            // 先切换到暗色主题
            toggleTheme();
            setTimeout(() => {
                error(t("notification.messages.dark_test"), t("notification.messages.dark_test_desc"), {
                    duration: 6,
                    action: {
                        text: t("notification.messages.test_success"),
                        onClick: () => success(t("notification.test.title"), t("notification.messages.font_normal"))
                    }
                });
            }, 500);
        } else {
            error(t("notification.messages.dark_test"), t("notification.messages.dark_test_desc"), {
                duration: 6,
                action: {
                    text: t("notification.messages.test_success"),
                    onClick: () => success(t("notification.test.title"), t("notification.messages.font_normal"))
                }
            });
        }
    };    // 测试Badge角标显示
    const testBadgeDisplay = () => {
        // 连续发送多个通知来测试角标数字
        for (let i = 1; i <= 5; i++) {
            setTimeout(() => {
                info(`${t("notification.test.title")} ${i}`, `${t("notification.test.title")} ${i} ${t("notification.test.badge")}`, { duration: 0 });
            }, i * 300);
        }
        success(t("notification.messages.badge_test"), t("notification.messages.badge_test_desc"), { duration: 3 });
    };

    return (
        <div className="page-container">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card className="welcome-card">
                    <Title level={2}>{t("app.welcome")}</Title>
                    <Paragraph>
                        {t("app.description")}
                    </Paragraph>
                    <Paragraph>
                        {t("app.menu_description")}
                    </Paragraph>
                </Card>

                <Card title={t("notification.test.title")} className="interaction-card">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Paragraph>
                            {t("notification.test.description")}
                        </Paragraph>
                        <Space wrap>
                            <Button
                                type="primary"
                                onClick={() => success(t("notification.types.success"), t("notification.messages.success"))}
                            >
                                {t("notification.test.success")}
                            </Button>
                            <Button
                                onClick={() => info(t("notification.types.info"), t("notification.messages.info"))}
                            >
                                {t("notification.test.info")}
                            </Button>
                            <Button
                                type="default"
                                onClick={() => warning(t("notification.types.warning"), t("notification.messages.warning"))}
                            >
                                {t("notification.test.warning")}
                            </Button>
                            <Button
                                danger
                                onClick={() => error(t("notification.types.error"), t("notification.messages.error"), {
                                    duration: 0,
                                    action: {
                                        text: t("notification.messages.retry"),
                                        onClick: () => info(t("notification.messages.retry"), t("notification.messages.retry_clicked"))
                                    }
                                })}
                            >
                                {t("notification.test.error")}
                            </Button>
                            <Button
                                type="dashed"
                                onClick={testNotifications}
                                icon={<BellOutlined />}
                            >
                                {t("notification.test.batch")}
                            </Button>
                            <Button
                                onClick={handleThemeToggle}
                                icon={currentTheme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                            >
                                {t("theme.toggle")} ({getThemeModeText()})
                            </Button>
                            <Button
                                onClick={testDarkModeNotification}
                                type="dashed"
                                danger
                            >
                                {t("notification.test.dark_mode")}
                            </Button>
                            <Button
                                onClick={testBadgeDisplay}
                                type="primary"
                                ghost
                                icon={<BellOutlined />}
                            >
                                {t("notification.test.badge")}
                            </Button>
                        </Space>
                    </Space>
                </Card>

                <Card title={t("greet.title")} className="interaction-card">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Input
                            placeholder={t("greet.placeholder")}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onPressEnter={greet}
                            size="large"
                        />
                        <Button
                            type="primary"
                            onClick={greet}
                            disabled={!name.trim()}
                            size="large"
                            block
                        >
                            {t("greet.button")}
                        </Button>
                        {greetMsg && (
                            <Card size="small" className="success-message">
                                <Typography.Text type="success" strong>{greetMsg}</Typography.Text>
                            </Card>
                        )}
                    </Space>
                </Card>
            </Space>
        </div>
    );
};

export default HomePage;
