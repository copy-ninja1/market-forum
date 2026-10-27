import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button, Disclosure } from "@heroui/react";
import { ROUTES } from "@/constants/route.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PRIMARY_NAV_ITEMS } from "@/components/layout/nav.constants";

type MobileNavigationProps = {
  readonly tone?: "ink" | "light";
  readonly onOpenChange?: (open: boolean) => void;
};

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "block rounded-xl px-3 py-2.5 text-sm font-semibold ",
    isActive
      ? "bg-campus-ink text-campus-paper"
      : "text-campus-ink hover:bg-campus-mist/70",
  ].join(" ");

export function MobileNavigation({ tone = "ink", onOpenChange }: MobileNavigationProps) {
  const { isAuthenticated, isAdmin, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const setOpen = (open: boolean) => {
    setMenuOpen(open);
    onOpenChange?.(open);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <div className="lg:hidden">
      <Button
        variant={tone === "light" && !menuOpen ? "secondary" : "secondary"}
        size="sm"
        aria-expanded={menuOpen}
        aria-controls="mobile-nav-panel"
        className={
          tone === "light" && !menuOpen ? "bg-white/15 text-white" : undefined
        }
        onPress={() => {
          setOpen(!menuOpen);
        }}
      >
        {menuOpen ? "Close" : "Menu"}
      </Button>

      {menuOpen ? (
        <div
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-full z-50 bg-campus-paper px-4 py-4 shadow-lg"
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

            <Disclosure className="mt-2 pt-2">
              <Disclosure.Heading>
                <Disclosure.Trigger className="w-full justify-between text-sm font-semibold text-campus-ink">
                  Account
                  <Disclosure.Indicator />
                </Disclosure.Trigger>
              </Disclosure.Heading>
              <Disclosure.Content>
                <Disclosure.Body className="flex flex-col gap-1 pt-2">
                  {isAuthenticated ? (
                    <>
                      <NavLink
                        to={ROUTES.profile}
                        className={mobileLinkClass}
                        onClick={closeMenu}
                      >
                        Profile
                      </NavLink>
                      {isAdmin ? (
                        <NavLink
                          to={ROUTES.adminReports}
                          className={mobileLinkClass}
                          onClick={closeMenu}
                        >
                          Admin desk
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
                      <NavLink
                        to={ROUTES.signIn}
                        className={mobileLinkClass}
                        onClick={closeMenu}
                      >
                        Sign in
                      </NavLink>
                      <NavLink
                        to={ROUTES.signUp}
                        className={mobileLinkClass}
                        onClick={closeMenu}
                      >
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
