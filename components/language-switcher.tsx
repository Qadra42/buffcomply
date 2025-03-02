'use client';

import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { GB, ES, FR, PT } from 'country-flag-icons/react/3x2';

const languages = [
  { code: 'en', name: 'English', Flag: GB },
  { code: 'es', name: 'Español', Flag: ES },
  { code: 'fr', name: 'Français', Flag: FR },
  { code: 'pt', name: 'Português', Flag: PT }
] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];
  const CurrentFlag = currentLanguage.Flag;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start gap-2 px-2"
        >
          <CurrentFlag className="h-4 w-4" />
          <span className="capitalize">
            {currentLanguage.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-[200px]"
      >
        {languages.map((language) => {
          const Flag = language.Flag;
          return (
            <DropdownMenuItem
              key={language.code}
              onClick={() => i18n.changeLanguage(language.code)}
              className="gap-2"
            >
              <Flag className="h-4 w-4" />
              <span className="flex-1">{language.name}</span>
              {i18n.language === language.code && (
                <Check className="h-4 w-4" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 