import { FC, ReactNode, useEffect, useState } from 'react';
import { ProfileContext } from './ProfileContext';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_USER_ALL_AVATARS,
  GET_USER_AVATAR,
} from '../../graphql/query/user';
import {
  CHANGE_CREDENTIALS,
  DELETE_AVATAR,
  UPLOAD_AVATAR,
} from '../../graphql/mutations/user';
import useAuth from '../../hooks/useAuth';
import { Avatar } from '../FullScreen/FullScreenContext';
import { ChangeCredentialsSchema } from '../../utils/validationSchemas';

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: FC<ProfileProviderProps> = ({ children }) => {
  const { user, setUser, refetchUser } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [allAvatars, setAllAvatars] = useState<Avatar[] | []>([]);
  const [avatarUrls, setAvatarUrls] = useState<string[] | []>([]);
  const [deleteAvatar] = useMutation(DELETE_AVATAR);
  const [uploadAvatar] = useMutation(UPLOAD_AVATAR);
  const [changeCredentials] = useMutation(CHANGE_CREDENTIALS);
  const {
    data: dataQueryAvatar,
    loading: loadingQueryAvatar,
    error: errorQueryAvatar,
    refetch: refetchQueryAvatar,
  } = useQuery(GET_USER_AVATAR, {
    variables: {
      userUuid: user?.uuid,
    },
  });

  const {
    data: dataQueryAllAvatars,
    loading: loadingQueryAllAvatars,
    error: errorQueryAllAvatars,
    refetch: refetchQueryAllAvatars,
  } = useQuery(GET_USER_ALL_AVATARS, {
    variables: {
      userUuid: user?.uuid,
    },
    skip: !user,
    onCompleted: (data) => {
      if (user) {
        setAllAvatars(data.userAllAvatars);
      }
    },
    onError: (error) => {
      if (error.message.includes('User not authorized')) {
        setAllAvatars([]);
      }
    },
  });

  const handleDeleteAvatar = async (url: string) => {
    try {
      await deleteAvatar({
        variables: {
          userUuid: user?.uuid,
          avatarUrl: url,
        },
      });
      setAllAvatars(allAvatars.filter((avatar) => avatar.url !== url));
      if (avatarUrl === url) {
        const { data } = await refetchQueryAvatar();
        setAvatarUrl(data.userAvatar.url);
      }
      await refetchQueryAllAvatars();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleUploadAvatar = async (avatar: File) => {
    if (user && avatar) {
      try {
        const { data } = await uploadAvatar({
          variables: {
            image: avatar,
            userUuid: user.uuid,
          },
        });
        const newAvatarUrl: Avatar = data.uploadAvatar;
        setAvatarUrl(newAvatarUrl.url);
        setAllAvatars([...allAvatars, newAvatarUrl]);
        await refetchQueryAllAvatars();
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  };

  const handleChangeCredentials = async (
    values: ChangeCredentialsSchema,
  ): Promise<string[] | null> => {
    if (!user) return null;

    try {
      const { data } = await changeCredentials({
        variables: {
          credentials: values,
        },
      });

      if (data && data.changeCredentials) {
        setUser({
          uuid: data.changeCredentials.uuid,
          name: data.changeCredentials.name,
          email: data.changeCredentials.email,
        });
      }

      const successMessage = Object.entries(values)
        .filter(
          ([_, value]) => value !== '' && value !== null && value !== undefined,
        )
        .map(([key, _]) => {
          switch (key) {
            case 'name':
              return 'Имя успешно изменено';
            case 'email':
              return 'Email успешно изменён';
            case 'password':
              return 'Пароль успешно изменён';
            default:
              return '';
          }
        });
      return successMessage;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    if (
      !loadingQueryAvatar &&
      !errorQueryAvatar &&
      dataQueryAvatar &&
      dataQueryAvatar.userAvatar
    ) {
      setAvatarUrl(dataQueryAvatar.userAvatar.url);
    }
  }, [dataQueryAvatar, loadingQueryAvatar, errorQueryAvatar]);

  useEffect(() => {
    if (allAvatars && allAvatars.length > 0) {
      const avatarUrls = allAvatars.map((avatar) => avatar.url);
      setAvatarUrls(avatarUrls);
    }
  }, [allAvatars]);

  if (!user) return null;
  /* if (loadingQueryAvatar) return <p>Loading...</p>; */
  if (errorQueryAvatar) console.error(errorQueryAvatar);
  if (errorQueryAllAvatars) console.error(errorQueryAllAvatars);

  return (
    <ProfileContext.Provider
      value={{
        avatarUrl: avatarUrl,
        setAvatarUrl: setAvatarUrl,
        errorQueryAvatar: errorQueryAvatar,
        refetchQueryAvatar: refetchQueryAvatar,
        allAvatars: allAvatars,
        setAllAvatars: setAllAvatars,
        avatarUrls: avatarUrls,
        handleDeleteAvatar: handleDeleteAvatar,
        handleUploadAvatar: handleUploadAvatar,
        handleChangeCredentials: handleChangeCredentials,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
