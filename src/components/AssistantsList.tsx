import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from '@/hooks/useTranslation';
import AssistantItems from './assistantlist/AssistantItems';
import TopicList from './assistantlist/TopicList';
import Settings from './assistantlist/Setting';
import { AssistantType, getDefaultAssistant } from '@/store/assistant';

const assistantsMock: AssistantType[] = [
    {
        id: '1',
        name: '助手A',
        model: 'gpt-3.5-turbo',
        modelParams: {
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            max_tokens: 150,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        name: '助手B',
        model: 'gpt-3.5-turbo',
        modelParams: {
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            max_tokens: 150,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];
interface AssistantsListProps { }

interface AssistantsListProps {
    onChange?: (key: string) => void;
}

const AssistantsList: React.FC<AssistantsListProps> = ({ onChange }) => {
    const { t } = useTranslation();
    const defaultAssistant = getDefaultAssistant();
    const [assistant, setAssistant] = useState<AssistantType>(defaultAssistant);
    const [assistants, setAssistants] = useState<AssistantType[]>(assistantsMock);
    useEffect(() => {
        // 获取默认助手列表
        setAssistants(assistantsMock);
        if (assistantsMock.length > 0) {
            setAssistant(assistantsMock[0]);
        } else {
            const defaultAssistant = getDefaultAssistant();
            setAssistants([defaultAssistant])
            setAssistant(defaultAssistant);
        }
    }, []);
    const tabList = [
        {
            key: 'assistants',
            label: t('assistants.assistants'),
            content: <AssistantItems
                assistants={assistants}
                onAssistantChange={(item: AssistantType) => setAssistant(item)}
            />,
        },
        {
            key: 'chats',
            label: t('assistants.topic'),
            content: <TopicList assistant={assistant} />,
        },
        {
            key: 'settings',
            label: t('assistants.settings'),
            content: <Settings />,
        },
    ];
    const ListContainer = styled.div`
        width: 100%;
        height: 100%;
        background: var(--ant-color-bg-container);
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        padding: 2px;
    `;

    const TabsNav = styled.div`
        display: flex;
        width: 100%;
        height: 48px;
        background: transparent;
        border-bottom: 1px solid #eee;
    `;
    const TabButton = styled.button<{ active?: boolean }>`
        flex: 1 1 0;
        height: 100%;
        background: var(--ant-color-bg-container);
        color: ${({ active }) => active ? 'var(--ant-color-primary, #1890ff)' : 'var(--ant-color-text)'};
        border: none;
        border-bottom: ${({ active }) => active ? '2px solid #1890ff' : '2px solid transparent'};
        font-size: 16px;
        cursor: pointer;
        outline: none;
        transition: background 0.2s, color 0.2s;
    `;
    const TabContent = styled.div`
        flex: 1;
        width: 100%;
        height: calc(100% - 48px);
        overflow: auto;
        background: transparent;
    `;



    const [activeKey, setActiveKey] = React.useState(tabList[0].key);

    const handleTabChange = (key: string) => {
        setActiveKey(key);
        if (onChange) {
            onChange(key);
        }
    };

    return (
        <ListContainer>
            <TabsNav>
                {tabList.map(tab => (
                    <TabButton
                        key={tab.key}
                        active={activeKey === tab.key}
                        onClick={() => handleTabChange(tab.key)}
                    >
                        {tab.label}
                    </TabButton>
                ))}
            </TabsNav>
            <TabContent>
                {tabList.find(tab => tab.key === activeKey)?.content}
            </TabContent>
        </ListContainer>
    );
};

export default AssistantsList;