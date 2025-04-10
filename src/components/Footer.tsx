"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Github } from "lucide-react";
import { useI18n } from "@/i18n/i18n-context";

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t py-12">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-teal-600">
                {t("common.appName")}
              </span>
            </Link>
            <p className="text-gray-600 max-w-md">
              Quick est une plateforme de financement participatif qui permet
              aux créateurs de donner vie à leurs projets et aux contributeurs
              de soutenir des idées qui les passionnent.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-500 hover:text-teal-600 transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-teal-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-teal-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-teal-600 transition-colors"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">Youtube</span>
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-teal-600 transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">Github</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
              Explorer
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/explore"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Explorer
                </Link>
              </li>
              <li>
                <Link
                  href="/trending"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Tendances
                </Link>
              </li>
              <li>
                <Link
                  href="/latest"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Derniers ajouts
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/success-stories"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Histoires de réussite
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
              Ressources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Événements
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Communauté
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
              Légal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  {"Conditions d'utilisation"}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Cookies
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Accessibilité
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Charte éthique
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Quick. Tous droits réservés.
            </p>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
              <Link
                href="#"
                className="text-sm text-gray-500 hover:text-teal-600 transition-colors"
              >
                Statut du service
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-500 hover:text-teal-600 transition-colors"
              >
                Nous contacter
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-500 hover:text-teal-600 transition-colors"
              >
                Presse
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-500 hover:text-teal-600 transition-colors"
              >
                Carrières
              </Link>
              <CurrencySwitcher />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type LucideIcon, DollarSign, Euro } from "lucide-react";

interface Currency {
  code: string;
  name: string;
  icon: LucideIcon;
}

function CurrencySwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale } = useI18n();

  const currencies: Record<string, Currency> = {
    usd: {
      code: "usd",
      name: "USD",
      icon: DollarSign,
    },
    eur: {
      code: "eur",
      name: "EUR",
      icon: Euro,
    },
  };

  const currentCurrency = currencies[locale === "fr" ? "eur" : "usd"];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 h-8 px-2"
        >
          <currentCurrency.icon className="h-4 w-4" />
          <span className="hidden md:inline">{currentCurrency.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {Object.entries(currencies).map(([code, currency]) => (
          <DropdownMenuItem
            key={code}
            className={`flex items-center gap-2 ${
              currentCurrency.code === code ? "font-medium" : ""
            }`}
            onClick={() => {
              // changeLocale(code as any)
              setIsOpen(false);
            }}
          >
            <span
              className={`text-xs ${
                currentCurrency.code === code ? "opacity-100" : "opacity-0"
              }`}
            >
              •
            </span>
            {currency.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
