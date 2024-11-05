import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { getStoreDetails, getThemeVersion, switchTheme } from '../home/api';

import { Button, useToast } from '@/components';
import { useParams } from '@tanstack/react-router';
import cn from 'classnames';
import {
  getGuestThemes,
  getThemeImages,
  GuestThemeType,
  ThemeImageType,
} from './api';

const Themes = () => {
  const { data: themeResponse } = useQuery({
    queryKey: ['getThemesList'],
    queryFn: getGuestThemes,
  });

  const themesData = themeResponse?.Data;

  return (
    <section className="p-9">
      <h1 className="mb-5 text-3xl">Explore Themes</h1>
      <div className="flex flex-wrap gap-[20px]">
        {themesData?.map((theme) => (
          <ThemeCard key={theme.Id} theme={theme} />
        ))}
      </div>
    </section>
  );
};

const ThemeCard: React.FC<{ theme: GuestThemeType }> = ({ theme }) => {
  const { data: themeImagesResponse } = useQuery({
    queryKey: ['getThemeImages', theme.Id],
    queryFn: () => getThemeImages(theme.Id),
  });

  const themeImages = themeImagesResponse?.Data || [];
  const isActive = false;
  const isPending = false;

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
      {/* Image container with overlay */}
      <div className="relative">
        {themeImages.length > 0 ? (
          <img
            className="w-[400px] h-[250px] object-cover"
            src={themeImages[0].ImageUrl}
            alt={theme.Name}
          />
        ) : (
          <div className="w-[400px] h-[250px] bg-slate-200 flex items-center justify-center">
            <span className="text-slate-500">No preview available</span>
          </div>
        )}
        {/* Theme type badge */}
        <span
          className={cn(
            'absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium',
            theme.Type === 'free'
              ? 'bg-green-100 text-green-800'
              : 'bg-purple-100 text-purple-800'
          )}
        >
          {theme.Type === 'free' ? 'Free' : 'Premium'}
        </span>
      </div>

      {/* Content section */}
      <div className="p-5">
        <h2 className="font-bold text-xl text-slate-800 mb-2">{theme.Name}</h2>
        <p className="text-slate-600 mb-4">{theme.Description}</p>

        {/* Action button */}
        <div
          className={cn(
            'flex justify-between items-center p-3 rounded-lg border',
            isActive
              ? 'bg-green-50 border-green-200'
              : 'border-blue-200 hover:border-blue-300'
          )}
        >
          <span className="text-sm text-slate-700">
            {isActive ? 'Current Theme' : 'Click to apply theme'}
          </span>

          {!isActive && (
            <Button
              variant={'outline'}
              className="hover:bg-blue-50"
              onClick={() => {
                // handleSwitchTheme(v.Id);
              }}
            >
              {isPending ? 'Applying...' : 'Apply Theme'}
            </Button>
          )}
          {isActive && (
            <span className="text-green-600 font-medium">✓ Active</span>
          )}
        </div>
      </div>
    </div>
  );
};

const Version: React.FC<{ ThemeId: number }> = ({ ThemeId }) => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };
  const { data: themesResponse } = useQuery({
    queryKey: ['getThemeVersion', ThemeId],
    queryFn: () => getThemeVersion(ThemeId),
    enabled: !!ThemeId,
  });

  const { toast } = useToast();

  const { data: storeDetailsResponse, refetch } = useQuery({
    queryKey: ['getStoreDetails'],
    queryFn: () => getStoreDetails(storeKey),
  });

  const { mutate: handleSwitchTheme, isPending } = useMutation({
    mutationFn: switchTheme,
    onSuccess: () => {
      refetch();
      toast({
        title: 'Theme Changes',
        description: 'Theme switched successfully',
        variant: 'default',
      });
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Theme change',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  const storeData = storeDetailsResponse?.Data;

  const themeVersionsData = themesResponse?.Data;

  return (
    <div>
      {themeVersionsData?.map((v) => {
        const isActive =
          storeData?.ThemeId === ThemeId && v.Id === storeData.ThemeVersionId;
        return (
          <span
            className={cn(
              'w-full flex my-2 justify-between items-center border-2 border-blue-400 p-3 rounded-md',
              isActive && 'bg-green-300'
            )}
          >
            <span>v{v.Version} </span>

            {!isActive && (
              <Button
                disabled={isPending}
                variant={'outline'}
                onClick={() => {
                  handleSwitchTheme(v.Id);
                }}
              >
                {isPending && 'Switching...'}
                {!isPending && 'Switch'}
              </Button>
            )}
            {isActive && 'Current'}
          </span>
        );
      })}
    </div>
  );
};

export default Themes;
