import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from '@/hooks/useTranslation';
import AssistantItems from './assistantlist/AssistantItems';
import TopicList from './assistantlist/TopicList';
import Settings from './assistantlist/Setting';
import { AssistantType, getDefaultAssistant } from '@/store/assistant';
import { List, Tabs } from 'antd';

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
            children: <AssistantItems
                assistants={assistants}
                onAssistantChange={(item: AssistantType) => setAssistant(item)}
            />,
        },
        {
            key: 'chats',
            label: t('assistants.topic'),
            children: <TopicList assistant={assistant} />,
        },
        {
            key: 'settings',
            label: t('assistants.settings'),
            children: <Settings />,
        },
    ];

    const ListContainer = styled.div`
        min-height: 100%;
    `;
    return (
        <ListContainer>
            <Tabs defaultActiveKey="assistants" items={tabList} onChange={onChange} />
        </ListContainer>
    );
};

export default AssistantsList;