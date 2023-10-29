import FriendList from '@/components/friend/FriendList';
import FriendRequests from '@/components/friend/FriendRequests';
import FriendSendRequests from '@/components/friend/FriendSendRequests';

const Friends = () => {

  return (
    <div className="flex h-full w-full items-center justify-center gap-10 bg-white p-4">
      <FriendRequests />
      <FriendSendRequests />
      <FriendList />
    </div>
  );
};
export default Friends;
