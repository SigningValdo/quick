"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Home,
  Compass,
  Grid3X3,
  Plus,
  TrendingUp,
  Clock,
  BookOpen,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n-context";
// import { LanguageSwitcher } from "@/components/language-switcher";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();

  // Detect scroll to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-white shadow-sm" : "bg-white"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <motion.span
              className="text-2xl font-bold text-teal-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {t("common.appName")}
            </motion.span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-6">
            <NavLink
              href="/"
              label={t("nav.home")}
              icon={<Home className="h-4 w-4" />}
            />
            <NavLink
              href="/explore"
              label={t("nav.explore")}
              icon={<Compass className="h-4 w-4" />}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 h-9"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span>Découvrir</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/trending">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Tendances
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/latest">
                    <Clock className="h-4 w-4 mr-2" />
                    Derniers ajouts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/collections">
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Collections
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/success-stories">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Histoires de réussite
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink
              href="/categories"
              label={t("nav.categories")}
              icon={<Grid3X3 className="h-4 w-4" />}
            />
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop search */}
          <AnimatePresence>
            {isSearchOpen ? (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="hidden md:flex relative overflow-hidden"
                onSubmit={handleSearchSubmit}
              >
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("search.placeholder")}
                  className="w-full pl-8 pr-8 bg-background rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-9 w-9"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden md:block"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-4 w-4" />
                  <span className="sr-only">{t("common.search")}</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Create quick link button */}
          <Button
            asChild
            variant="default"
            className="hidden md:inline-flex bg-teal-600 hover:bg-teal-700 gap-1 rounded-full"
          >
            <Link href="/create">
              <Plus className="h-4 w-4 mr-1" />
              {t("nav.createLink", { defaultValue: "Create quick link" })}
            </Link>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-background border-t"
          >
            <div className="container py-4 space-y-4">
              <form className="relative" onSubmit={handleSearchSubmit}>
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("search.placeholder")}
                  className="w-full pl-8 bg-background rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <nav className="flex flex-col space-y-1">
                <MobileNavLink
                  href="/"
                  label={t("nav.home")}
                  icon={<Home className="h-4 w-4" />}
                />
                <MobileNavLink
                  href="/explore"
                  label={t("nav.explore")}
                  icon={<Compass className="h-4 w-4" />}
                />
                <MobileNavLink
                  href="/trending"
                  label="Tendances"
                  icon={<TrendingUp className="h-4 w-4" />}
                />
                <MobileNavLink
                  href="/latest"
                  label="Derniers ajouts"
                  icon={<Clock className="h-4 w-4" />}
                />
                <MobileNavLink
                  href="/collections"
                  label="Collections"
                  icon={<LayoutGrid className="h-4 w-4" />}
                />
                <MobileNavLink
                  href="/success-stories"
                  label="Histoires de réussite"
                  icon={<BookOpen className="h-4 w-4" />}
                />
                <MobileNavLink
                  href="/categories"
                  label={t("nav.categories")}
                  icon={<Grid3X3 className="h-4 w-4" />}
                />
              </nav>
              <Button
                asChild
                className="w-full bg-teal-600 hover:bg-teal-700 gap-1 rounded-full"
              >
                <Link href="/create">
                  <Plus className="h-4 w-4 mr-1" />
                  {t("nav.createLink", { defaultValue: "Create quick link" })}
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// Desktop navigation link component
function NavLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link href={href} className="relative">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "flex items-center gap-1 h-9",
          isActive && "bg-muted font-medium"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"
          layoutId="navbar-indicator"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
}

// Mobile navigation link component
function MobileNavLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

import { Globe } from "lucide-react";

function LanguageSwitcher() {
  const { locale, changeLocale, locales } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const localeNames: Record<string, string> = {
    fr: "Français",
    en: "English",
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 h-8 px-2"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{localeNames[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            className={`flex items-center gap-2 ${
              locale === loc ? "font-medium" : ""
            }`}
            onClick={() => {
              changeLocale(loc);
              setIsOpen(false);
            }}
          >
            <span
              className={`text-xs ${
                locale === loc ? "opacity-100" : "opacity-0"
              }`}
            >
              •
            </span>
            {localeNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
