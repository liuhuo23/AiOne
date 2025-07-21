import { useState, useEffect } from 'react';
import { i18n, Language, t } from '../i18n';

export const useTranslation = () => {
    const [language, setLanguage] = useState<Language>(i18n.getCurrentLanguage());

    useEffect(() => {
        const handleLanguageChange = (event: CustomEvent) => {
            setLanguage(event.detail as Language);
        };

        window.addEventListener('languageChanged', handleLanguageChange as EventListener);

        return () => {
            window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
        };
    }, []);

    const changeLanguage = (newLanguage: Language) => {
        i18n.changeLanguage(newLanguage);
    };

    return {
        t,
        language,
        changeLanguage,
        availableLanguages: i18n.getAvailableLanguages(),
    };
};
