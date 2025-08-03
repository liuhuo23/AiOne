import { Splitter } from 'antd';
import React from 'react';
import AssistantsList from '@/components/AssistantsList';
import AiChat from '@/components/AiChat';
interface AssistantsProps { }
const Assistants: React.FC<AssistantsProps> = () => {
    return (
        <div className='page-container'>
            <Splitter layout="horizontal" style={{ height: '100%', width: '100%', minHeight: 0, minWidth: 0, flex: 1 }}>
                <Splitter.Panel defaultSize="25%" min="25%" max="30%" >
                    <AssistantsList />
                </Splitter.Panel>
                <Splitter.Panel>
                    <AiChat />
                </Splitter.Panel>
            </Splitter>
        </div>
    );
}

export default Assistants;