import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button, Disclosure } from "@heroui/react";
import { ROUTES } from "@/constants/route.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PRIMARY_NAV_ITEMS } from "@/components/layout/nav.constants";

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "block rounded-md px-3 py-2 text-sm font-medium focus-ring",
    isActive ? "bg-campus-leaf/15 text-campus-leaf" : "text-campus-ink hover:bg-campus-mist/70",
  ].join(" ");

export function MobileNavigation() {
  const { isAuthenticated, isAdmin, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="md:hidden">
      <Button
        variant="secondary"
        size="sm"
        aria-expanded={menuOpen}
        aria-controls="mobile-nav-panel"
        onPress={() => {
          setMenuOpen((open) => !open);
        }}
      >
        Menu
      </Button>

      {menuOpen ? (
        <div
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-full z-50 border-b border-campus-mist bg-campus-paper/98 px-4 py-4 shadow-sm backdrop-blur-sm"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {PRIMARY_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={mobileLinkClass}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}

            <Disclosure className="mt-2 border-t border-campus-mist pt-2">
              <Disclosure.Heading>
                <Disclosure.Trigger className="w-full justify-between text-sm font-medium text-campus-ink">
                  Account
                  <Disclosure.Indicator />
                </Disclosure.Trigger>
              </Disclosure.Heading>
              <Disclosure.Content>
                <Disclosure.Body className="flex flex-col gap-1 pt-2">
                  {isAuthenticated ? (
                    <>
                      <NavLink to={ROUTES.profile} className={mobileLinkClass} onClick={closeMenu}>
                        Profile
                      </NavLink>
                      {isAdmin ? (
                        <NavLink
                          to={ROUTES.adminReports}
                          className={mobileLinkClass}
                          onClick={closeMenu}
                        >
                          Admin
                        </NavLink>
                      ) : null}
                      <Button
                        variant="tertiary"
                        className="justify-start"
                        onPress={async () => {
                          await signOut();
                          closeMenu();
                        }}
                      >
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <>
                      <NavLink to={ROUTES.signIn} className={mobileLinkClass} onClick={closeMenu}>
                        Sign in
                      </NavLink>
                      <NavLink to={ROUTES.signUp} className={mobileLinkClass} onClick={closeMenu}>
                        Create account
                      </NavLink>
                    </>
                  )}
                </Disclosure.Body>
              </Disclosure.Content>
            </Disclosure>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
