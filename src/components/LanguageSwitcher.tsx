import React from 'react';
import { Button, Dropdown, Space } from 'antd';
import { useTranslation } from '../hooks/useTranslation';
import type { MenuProps } from 'antd';

const LanguageSwitcher: React.FC = () => {
    const { t, language, changeLanguage, availableLanguages } = useTranslation();

    const items: MenuProps['items'] = availableLanguages.map((lang) => ({
        key: lang,
        label: (
            <Space>
                {lang === 'zh-CN' ? '🇨🇳' : '🇺🇸'}
                {t(`language.${lang === 'zh-CN' ? 'chinese' : 'english'}`)}
            </Space>
        ),
        onClick: () => changeLanguage(lang),
    }));

    const getCurrentLanguageDisplay = () => {
        return language === 'zh-CN' ? '🇨🇳' : '🇺🇸';
    };

    return (
        <Dropdown
            menu={{ items }}
            placement="topCenter"
            trigger={['click']}
        >
            <Button
                type="text"
                style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    background: 'transparent',
                    width: '32px',
                    height: '32px',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    fontSize: '18px'
                }}
                size="small"
            >
                {getCurrentLanguageDisplay()}
            </Button>
        </Dropdown>
    );
};

export default LanguageSwitcher;
