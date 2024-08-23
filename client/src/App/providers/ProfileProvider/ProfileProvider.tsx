import { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import { ProfileContext } from './ProfileContext';
import { Avatar } from '../FullScreenProvider/FullScreenContext';
import {
  useChangeCredentialsMutation,
  useDeleteAvatarMutation,
  useUploadAvatarMutation,
  useUserAllAvatarsLazyQuery,
  useUserAvatarLazyQuery,
} from './profile.generated';
import { ChangeCredentialsInput } from '@shared/types';
import { useAuth } from '../hooks/useAuth';

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: FC<ProfileProviderProps> = ({ children }) => {
  const { user, setUser } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [allAvatars, setAllAvatars] = useState<Avatar[] | []>([]);
  const [avatarUrls, setAvatarUrls] = useState<string[] | []>([]);
  const [profileLoadingStates, setProfileLoadingStates] = useState({
    deleteAvatar: false,
    uploadAvatar: false,
    changeCredentials: false,
    profileData: false,
  });
  const setLoading = useCallback(
    (key: keyof typeof profileLoadingStates, value: boolean) => {
      setProfileLoadingStates((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const [deleteAvatar] = useDeleteAvatarMutation();
  const [uploadAvatar] = useUploadAvatarMutation();
  const [changeCredentials] = useChangeCredentialsMutation();

  const [
    userAvatarQuery,
    {
      loading: loadingQueryAvatar,
      error: errorQueryAvatar,
      refetch: refetchQueryAvatar,
    },
  ] = useUserAvatarLazyQuery();
  const [
    userAllAvatarsQuery,
    {
      loading: loadingQueryAllAvatars,
      error: errorQueryAllAvatars,
      refetch: refetchQueryAllAvatars,
    },
  ] = useUserAllAvatarsLazyQuery();

  const handleDeleteAvatar = async (url: string) => {
    setLoading('deleteAvatar', true);
    try {
      await deleteAvatar({
        variables: {
          avatarUrl: url,
        },
      });
      setAllAvatars(allAvatars.filter((avatar) => avatar.url !== url));

      if (avatarUrl === url) {
        const { data } = await refetchQueryAvatar();
        if (data && data.userAvatar) {
          setAvatarUrl(data.userAvatar.url);
        } else {
          setAvatarUrl(null);
        }
      }

      await refetchQueryAllAvatars();
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading('deleteAvatar', false);
    }
  };

  const handleUploadAvatar = async (avatar: File) => {
    setLoading('uploadAvatar', true);
    if (user && avatar) {
      try {
        const { data } = await uploadAvatar({
          variables: {
            image: avatar,
          },
        });

        if (data) {
          const newAvatarUrl: Avatar = data.uploadAvatar;
          setAvatarUrl(newAvatarUrl.url);
          setAllAvatars([...allAvatars, newAvatarUrl]);
          await refetchQueryAllAvatars();
        }
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setLoading('uploadAvatar', false);
      }
    }
  };

  const handleChangeCredentials = async (
    values: ChangeCredentialsInput,
  ): Promise<string[] | null> => {
    if (!user) return null;

    setLoading('changeCredentials', true);
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
    } finally {
      setLoading('changeCredentials', false);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      setLoading('profileData', true);
      const { data: dataQueryAvatar } = await userAvatarQuery({
        variables: { userUuid: user?.uuid },
        onError: () => {
          setAvatarUrl(null);
        },
      });

      if (dataQueryAvatar && dataQueryAvatar.userAvatar) {
        setAvatarUrl(dataQueryAvatar.userAvatar.url);
      } else {
        setAvatarUrl(null);
      }

      const { data: dataQueryAllAvatars } = await userAllAvatarsQuery({
        variables: {
          userUuid: user.uuid,
        },
        onError: (error) => {
          if (error.message.includes('User not authorized')) {
            setAllAvatars([]);
          }
        },
      });

      if (dataQueryAllAvatars && dataQueryAllAvatars.userAllAvatars) {
        setAllAvatars(dataQueryAllAvatars.userAllAvatars as Avatar[]);
      }

      setLoading('profileData', false);
    };

    fetchProfileData();
  }, [user, userAvatarQuery, userAllAvatarsQuery, setLoading]);

  useEffect(() => {
    if (allAvatars && allAvatars.length > 0) {
      const avatarUrls = allAvatars.map((avatar) => avatar.url);
      setAvatarUrls(avatarUrls);
    }
  }, [allAvatars]);

  if (!user) return null;
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
        profileLoadingStates: profileLoadingStates,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
