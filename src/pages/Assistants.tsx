import { Splitter } from 'antd';
import React from 'react';
import AssistantsList from '@/components/AssistantsList';
interface AssistantsProps { }
const Assistants: React.FC<AssistantsProps> = () => {
    return (
        <>
            <Splitter>
                <Splitter.Panel defaultSize="20%" min="20%" max="20%">
                    <AssistantsList />
                </Splitter.Panel>
                <Splitter.Panel>
                </Splitter.Panel>
            </Splitter>
        </>
    );
}

export default Assistants;