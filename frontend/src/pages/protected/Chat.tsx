import ChatWorkspace from '@/components/dashboard/ChatWorkspace';
import { useParams } from 'react-router';

function Chat() {
  const { chat_id: chatId } = useParams();

  return <ChatWorkspace mode={chatId ? 'chat' : 'new'} chatId={chatId} />;
}

export default Chat;
