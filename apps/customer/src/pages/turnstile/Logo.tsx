import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { getLogo, updateLogo } from './api';
import { Button } from '@customer/components';
import { useModalStore } from '@customer/store/modalStore';
import { useMediaFormStore } from '@customer/store/mediaFormStore';

const Logo = () => {
  const { setModalPath } = useModalStore((state) => state);
  const { data: logoResponse, refetch } = useQuery({
    queryKey: ['getLogo'],
    queryFn: getLogo,
  });
  const [logoType, setLogoType] = useState<'fav' | 'logo'>('fav');

  const { mutate: handleUpdateLogo } = useMutation({
    mutationFn: updateLogo,
    onSuccess: () => {
      refetch();
    },
  });

  const { imagesList, setImagesList } = useMediaFormStore((state) => state);

  useEffect(() => {
    if (imagesList && imagesList.length > 0) {
      if (logoType === 'logo') {
        handleUpdateLogo({ LogoLink: imagesList[0] });
        setImagesList([]);
      }

      if (logoType === 'fav') {
        handleUpdateLogo({ FaviconLink: imagesList[0] });
        setImagesList([]);
      }
    }
  }, [imagesList]);

  const logo = logoResponse?.Data;

  return (
    <div>
      <div>
        <h1 className="font-bold text-lg my-7">Logo</h1>
        <img height={'auto'} width={'300px'} src={logo?.LogoLink} alt="logo" />
        <Button
          onClick={() => {
            setLogoType('logo');
            setModalPath({ modal: 'media' });
          }}
          className="my-3"
        >
          Update Logo
        </Button>
      </div>

      <div>
        <h1 className="font-bold text-lg my-7">Favicon</h1>
        <img
          height={'auto'}
          width={'200px'}
          src={logo?.FaviconLink}
          alt="favicon"
        />
        <Button
          className="my-3"
          onClick={() => {
            setLogoType('fav');
            setModalPath({ modal: 'media' });
          }}
        >
          {' '}
          Update Favicon
        </Button>
      </div>
    </div>
  );
};

export default Logo;
