import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { getStoreDetails, switchTheme, getPlan } from '../home/api';

import { Button, toast, useToast } from '@/components';
import { useNavigate, useParams } from '@tanstack/react-router';
import cn from 'classnames';
import {
  getGuestThemes,
  getThemeImages,
  GuestThemeType,
  getSubDetails,
} from './api';
import { Github, Crown, Gift, ExternalLink } from 'lucide-react';

const Themes = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };
  const [page, setPage] = useState(1);
  const limit = 5;
  const [isThemeSwitching, setIsThemeSwitching] = useState(false);

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
            isThemeSwitching={isThemeSwitching}
            setIsThemeSwitching={setIsThemeSwitching}
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

const ThemeCard: React.FC<{
  theme: GuestThemeType;
  isActive: boolean;
  isThemeSwitching: boolean;
  setIsThemeSwitching: (value: boolean) => void;
}> = ({ theme, isActive, isThemeSwitching, setIsThemeSwitching }) => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  // Get subscription details
  const { data: subResponse } = useQuery({
    queryKey: ['getStoreSub', storeKey],
    queryFn: () => getSubDetails(storeKey),
  });

  // Get plans to determine if current plan is premium
  const { data: planResponse } = useQuery({
    queryKey: ['getPlan'],
    queryFn: getPlan,
  });

  const subscription = subResponse?.Data;
  const plans = planResponse?.Data || [];

  // Find current plan details
  const currentPlan = plans.find((plan) => plan.Id === subscription?.PlanId);
  const hasValidSubscription = currentPlan && currentPlan.MonthlyPrice > 0;

  const { data: themeImagesResponse } = useQuery({
    queryKey: ['getThemeImages', theme.Id],
    queryFn: () => getThemeImages(theme.Id),
  });

  const themeImages = themeImagesResponse?.Data || [];

  const { mutate: handleSwitchTheme, isPending } = useMutation({
    mutationFn: (themeId: number) => switchTheme(themeId),
    onMutate: () => {
      setIsThemeSwitching(true);
    },
    onSettled: () => {
      setIsThemeSwitching(false);
    },
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

  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
      {/* Image container with overlay */}
      <div className="relative">
        {themeImages.length > 0 ? (
          <div className="relative">
            <img
              className="w-[400px] h-[250px] object-cover"
              src={themeImages[0].ImageUrl}
              alt={theme.Name}
            />
            {theme.Type === 'paid' && !hasValidSubscription && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center p-4">
                  <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-white font-medium">Premium Theme</p>
                  <Button
                    variant="default"
                    size="sm"
                    className="mt-2 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"
                    onClick={() =>
                      navigate({ to: `/store/${storeKey}/subscription` })
                    }
                  >
                    Upgrade to Access
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-[400px] h-[250px] bg-slate-200 flex items-center justify-center">
            <span className="text-slate-500">No preview available</span>
          </div>
        )}
        {/* Theme type badge */}
        <span
          className={cn(
            'absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2',
            theme.Type === 'free'
              ? 'bg-green-100 text-green-800'
              : 'bg-gradient-to-r from-yellow-400/90 to-yellow-600/90 text-white shadow-lg'
          )}
        >
          {theme.Type === 'free' ? (
            <>
              <Gift className="w-4 h-4" />
              <span>Free</span>
            </>
          ) : (
            <>
              <Crown className="w-4 h-4" />
              <span>Premium</span>
            </>
          )}
        </span>
      </div>

      {/* Content section */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-xl text-slate-800">{theme.Name}</h2>
          <div className="flex items-center gap-2">
            {theme.PreviewUrl && (
              <a
                href={theme.PreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                title="Visit live preview"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Preview</span>
              </a>
            )}
            {theme.GithubLink && (
              <a
                href={theme.GithubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                title="View source code on GitHub"
              >
                <Github className="w-4 h-4" />
                <span>View Source</span>
              </a>
            )}
          </div>
        </div>
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
              disabled={
                isThemeSwitching ||
                isPending ||
                (theme.Type === 'paid' && !hasValidSubscription)
              }
            >
              {isPending
                ? 'Applying...'
                : theme.Type === 'paid' && !hasValidSubscription
                ? 'Upgrade to Enable'
                : 'Enable Theme'}
            </Button>
          )}
          {isActive && (
            <>
              <span className="text-green-600 font-medium">✓ Active</span>
              <Button
                variant={'outline'}
                className="hover:bg-blue-50"
                onClick={() => handleSwitchTheme(theme.Id)}
                disabled={isThemeSwitching || isPending}
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
