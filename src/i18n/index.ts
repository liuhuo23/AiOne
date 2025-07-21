// 简化版国际化配置，待安装依赖后可升级
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';

export type Language = 'zh-CN' | 'en-US';

export interface I18nResources {
    'zh-CN': typeof zhCN;
    'en-US': typeof enUS;
}

export const resources: I18nResources = {
    'zh-CN': zhCN,
    'en-US': enUS
};

class SimpleI18n {
    private currentLanguage: Language = 'zh-CN';
    private resources = resources;

    constructor() {
        // 尝试从 localStorage 获取保存的语言设置
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage && this.resources[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        }
    }

    // 获取当前语言
    getCurrentLanguage(): Language {
        return this.currentLanguage;
    }

    // 切换语言
    changeLanguage(language: Language) {
        if (this.resources[language]) {
            this.currentLanguage = language;
            localStorage.setItem('language', language);
            // 触发语言变化事件
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
        }
    }

    // 翻译函数
    t(key: string, params?: Record<string, string | number>): string {
        const keys = key.split('.');
        let value: any = this.resources[this.currentLanguage];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`Translation key "${key}" not found for language "${this.currentLanguage}"`);
                return key; // 返回原始 key 作为后备
            }
        }

        if (typeof value === 'string' && params) {
            // 简单的参数替换
            return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
                return params[paramKey]?.toString() || match;
            });
        }

        return typeof value === 'string' ? value : key;
    }

    // 获取所有可用语言
    getAvailableLanguages(): Language[] {
        return Object.keys(this.resources) as Language[];
    }
}

// 创建全局实例
export const i18n = new SimpleI18n();

// 导出翻译函数
export const t = (key: string, params?: Record<string, string | number>) => i18n.t(key, params);

export default i18n;
