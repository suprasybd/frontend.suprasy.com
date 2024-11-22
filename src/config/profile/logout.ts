import { router } from '../../app';
import { cleanRemoveTokens } from '../../libs/api/ResponseHandler';
import { useAuthStore } from '../../store/authStore';

export const logoutUser = () => {
  useAuthStore.getState().logout();
  cleanRemoveTokens();

  // Get the current hostname and extract the main domain
  const hostname = window.location.hostname;
  const mainDomain = hostname.split('.').slice(-2).join('.');

  // Construct the main site URL
  const mainSiteUrl = `https://www.${mainDomain}`;

  // Redirect to main site
  window.location.href = mainSiteUrl;
};
