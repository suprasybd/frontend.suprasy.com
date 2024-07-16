import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  getStoreDetails,
  getThemes,
  getThemeVersion,
  switchTheme,
} from '../home/api';
import { activeFilters } from '@customer/libs/helpers/filters';
import { Button, ScrollArea, useToast } from '@customer/components';
import { useParams } from '@tanstack/react-router';
import cn from 'classnames';

const Themes = () => {
  const { data: themesListResponse } = useQuery({
    queryKey: ['getThemesList'],
    queryFn: () =>
      getThemes({
        Page: 1,
        Limit: 10,
      }),
  });

  const themesData = themesListResponse?.Data;

  return (
    <section className="p-9">
      <h1 className="mb-5 text-3xl">Explore Themes</h1>
      {themesData?.map((theme) => (
        <div className="p-2 w-[400px]  rounded-md bg-slate-100">
          <img
            width={'400px'}
            height={'400px'}
            src={theme.Thumbnail}
            alt="theme "
          />
          <div className="my-4">
            <h1 className="font-bold text-lg text-slate-800">{theme.Name}</h1>
            <p>{theme.Description}</p>
          </div>

          <div>
            <ScrollArea className="h-[150px] bg-white w-full rounded-md border p-4">
              <Version ThemeId={theme.Id} />
            </ScrollArea>
          </div>
        </div>
      ))}
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
