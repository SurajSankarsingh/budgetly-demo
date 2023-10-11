import { Moon, Sun } from 'lucide-react';
import { Theme, useTheme } from '~/utils/theme-provider';

import { Button } from '~/components/ui/button';

export default function ThemeToggle() {
  const [, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    );
  };

  return (
    <Button variant='outline' size='icon' className='' onClick={toggleTheme}>
      <Sun className='h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground dark:text-foreground' />
      <Moon className='absolute h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground dark:text-foreground' />
    </Button>
  );
}
