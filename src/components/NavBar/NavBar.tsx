import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/index';
import { Link } from '@tanstack/react-router';
import { Power, UserRound } from 'lucide-react';
import { logoutUser } from '../../config/profile/logout';
import { useAuthStore } from '../../store/authStore';
import { useSidebarStore } from '../../store/sidebarStore';

const NavBar = () => {
  const user = useAuthStore((state) => state.user);

  const pathName = window.location.pathname;

  const toggleSidebar = useSidebarStore((state) => state.toggleSideBar);

  return (
    <nav className="bg-gradient-to-r bg-muted/40 border-b-2">
      {!pathName.includes('viseditor') && (
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="ml-6">
                <div className="flex space-x-4">
                  <Link
                    to={'/'}
                    className="[&.active]:bg-gradient-to-r [&.active]:from-blue-800 [&.active]:to-indigo-900 [&.active]:text-white   rounded-md px-3 py-2 text-sm font-medium bg-slate-300"
                    aria-current="page"
                  >
                    Stores
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="relative ml-3">
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-muted/60"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserRound size={16} className="text-primary" />
                      </div>
                      <span className="font-medium">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64">
                    <DropdownMenuLabel className="p-4">
                      <div className="space-y-1.5">
                        <p className="text-sm text-muted-foreground">
                          Signed in as
                        </p>
                        <p className="font-medium truncate">{user?.Email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Button
                        onClick={logoutUser}
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Power size={16} className="mr-2" />
                        Sign out
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
