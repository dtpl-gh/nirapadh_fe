import { useEffect, useRef } from 'react';

export default function useWebSocket(
  chatId: string,
  onMessage: (message: any) => void
) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!chatId) {
      console.warn('No chatId provided, WebSocket connection not established.');
      return;
    }
    // /api/v1/ws/chat/
    const url = `ws://localhost:8000/api/v1/ws/chat/${chatId}`;

    console.log('Connecting to WebSocket at URL:', url);

    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (onMessage) {
        // Update the message list with the new message
        onMessage(message);
      }
    };

    socketRef.current.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    socketRef.current.onclose = (event) => {
      console.log('WebSocket disconnected', event);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [chatId, onMessage]);

  const sendMessage = (message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not open. Unable to send message:', message);
    }
  };

  return { sendMessage };
}
