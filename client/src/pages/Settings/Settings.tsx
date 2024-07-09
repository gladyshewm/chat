import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { UPLOAD_AVATAR } from '../../graphql/mutations/user';
import useAuth from '../../hooks/useAuth';

const Settings = () => {
  const { user } = useAuth();
  const [image, setImage] = useState<File>(null as any);
  const [uploadAvatar] = useMutation(UPLOAD_AVATAR);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      try {
        await uploadAvatar({
          variables: {
            image,
            userUuid: user.uuid,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
      <input
        name="file"
        id="file"
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleFileChange(e)
        }
      />
      <button type="submit">Загрузить</button>

      <p>{image?.name}</p>
    </form>
  );
};

export default Settings;
