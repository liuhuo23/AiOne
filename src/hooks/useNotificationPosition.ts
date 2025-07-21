import { useEffect } from 'react';
import { useNotifications } from '@/store/AppStateContext';

/**
 * 设置通知位置的便捷钩子
 * @param position 通知位置
 */
export const useNotificationPosition = (position: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft' | 'top' | 'bottom') => {
    const { setPosition } = useNotifications();

    useEffect(() => {
        setPosition(position);
    }, [position, setPosition]);
};

export default useNotificationPosition;
