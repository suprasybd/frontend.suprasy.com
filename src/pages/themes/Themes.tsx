import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { getStoreDetails, getThemeVersion, switchTheme } from '../home/api';

import { Button, useToast } from '@/components';
import { useParams } from '@tanstack/react-router';
import cn from 'classnames';
import { getThemes } from '../admin-themes/api';

const Themes = () => {
  const { data: themeResponse } = useQuery({
    queryKey: ['getThemesList'],
    queryFn: getThemes,
  });

  const themesData = themeResponse?.Data;

  const isActive = false;
  const isPending = false;

  return (
    <section className="p-9">
      <h1 className="mb-5 text-3xl">Explore Themes</h1>
      <div className="flex flex-wrap gap-[20px]">
        {themesData?.map((theme) => (
          <div className="p-2 w-[400px]  rounded-md bg-slate-100">
            <img
              width={'400px'}
              height={'400px'}
              src={theme.Images[0].ImageUrl}
              alt="theme "
            />
            <div className="my-4">
              <h1 className="font-bold text-lg text-slate-800">{theme.Name}</h1>
              <p>{theme.Description}</p>
            </div>

            <div>
              <span
                className={cn(
                  'w-full flex my-2 justify-between items-center border-2 border-blue-400 p-3 rounded-md',
                  isActive && 'bg-green-300'
                )}
              >
                <span>Click to apply theme</span>

                {!isActive && (
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      // handleSwitchTheme(v.Id);
                    }}
                  >
                    {isPending && 'Applying...'}
                    {!isPending && 'Apply'}
                  </Button>
                )}
                {isActive && 'Current'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
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
