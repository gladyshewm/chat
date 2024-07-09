import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import useAuth from '../../hooks/useAuth';
import { useQuery } from '@apollo/client';
import { GET_USER_AVATAR } from '../../graphql/query/user';
import ProfileSettings from './ProfileSettings';
import MessagesList from './MessagesList';

const Sidebar = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isProfileSettings, setIsProfileSettings] = useState(false);
  const { user } = useAuth();
  const {
    data,
    loading,
    error: errorQueryAvatar,
    refetch,
  } = useQuery(GET_USER_AVATAR, {
    variables: {
      userUuid: user?.uuid,
    },
  });

  useEffect(() => {
    if (!loading && !errorQueryAvatar && data) {
      setAvatarUrl(data.userAvatar);
    }
  }, [data, loading, errorQueryAvatar]);

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className="sidebar">
      {isProfileSettings ? (
        <ProfileSettings
          user={user}
          avatarUrl={avatarUrl}
          errorQueryAvatar={errorQueryAvatar}
          setIsProfileSettings={setIsProfileSettings}
        />
      ) : (
        <MessagesList
          avatarUrl={avatarUrl}
          errorQueryAvatar={errorQueryAvatar}
          setIsProfileSettings={setIsProfileSettings}
        />
      )}
    </div>
  );
};

export default Sidebar;
