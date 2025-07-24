import React, { useEffect } from "react";
import { AssistantType } from "@/store/assistant";

interface TopicListProps {
    assistant: AssistantType;
}
const TopicList: React.FC<TopicListProps> = ({ assistant }) => {
    useEffect(() => {
        // 这里可以添加副作用逻辑，比如获取话题列表等
        console.log(`当前助手: ${assistant.name}`);
    }, [assistant]);
    return (
        <div>
            {/* 聊天列表内容 */}
            <h2>聊天列表</h2>
            <p>这里将展示可用的聊天记录。</p>
        </div>
    );
}

export default TopicList;