import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { getStoreDetails, switchTheme } from '../home/api';

import { Button, toast, useToast } from '@/components';
import { useParams } from '@tanstack/react-router';
import cn from 'classnames';
import { getGuestThemes, getThemeImages, GuestThemeType } from './api';

const Themes = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: themeResponse } = useQuery({
    queryKey: ['getThemesList', page, limit],
    queryFn: () => getGuestThemes({ Page: page, Limit: limit }),
  });

  const { data: storeDetailsResponse } = useQuery({
    queryKey: ['getStoreDetails', storeKey],
    queryFn: () => getStoreDetails(storeKey),
  });

  const themesData = themeResponse?.Data;
  const activeThemeId = storeDetailsResponse?.Data?.ThemeId;
  const pagination = themeResponse?.Pagination;

  return (
    <section className="p-9">
      <h1 className="mb-5 text-3xl">Explore Themes</h1>
      <div className="flex flex-wrap gap-[20px]">
        {themesData?.map((theme: GuestThemeType) => (
          <ThemeCard
            key={theme.Id}
            theme={theme}
            isActive={theme.Id === activeThemeId}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="mx-4">
            Page {pagination.Page} of {pagination.TotalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === pagination.TotalPages}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
};

const ThemeCard: React.FC<{ theme: GuestThemeType; isActive: boolean }> = ({
  theme,
  isActive,
}) => {
  const { data: themeImagesResponse } = useQuery({
    queryKey: ['getThemeImages', theme.Id],
    queryFn: () => getThemeImages(theme.Id),
  });

  const themeImages = themeImagesResponse?.Data || [];

  const { mutate: handleSwitchTheme, isPending } = useMutation({
    mutationFn: (themeId: number) => switchTheme(themeId),
    onSuccess: () => {
      toast({
        title: 'Theme Enabled',
        description: 'The theme has been enabled successfully.',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description:
          error.response?.data?.Message ||
          error.response?.data?.message ||
          'Failed to enable theme.',
        variant: 'destructive',
      });
    },
  });

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

        {/* Action buttons */}
        <div
          className={cn(
            'flex flex-col gap-2 p-3 rounded-lg border',
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
              onClick={() => handleSwitchTheme(theme.Id)}
              disabled={isPending}
            >
              {isPending ? 'Applying...' : 'Enable Theme'}
            </Button>
          )}
          {isActive && (
            <>
              <span className="text-green-600 font-medium">✓ Active</span>
              <Button
                variant={'outline'}
                className="hover:bg-blue-50"
                onClick={() => handleSwitchTheme(theme.Id)}
                disabled={isPending}
              >
                {isPending ? 'Syncing...' : 'Sync Theme'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Themes;
