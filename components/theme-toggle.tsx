// "use client";
// import { Moon, Sun } from "lucide-react";
// import { useTheme } from "next-themes";

// export function ThemeToggle() {
//   const { theme, setTheme } = useTheme();

//   return (
//     <button
//       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//       className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-black dark:focus:ring-white relative"
//       aria-label="Toggle theme"
//     >
//       <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//       <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-2 left-2" />
//       <span className="sr-only">Toggle theme</span>
//     </button>
//   );
// }

"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-md border border-transparent hover:border-black dark:hover:border-white transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 md:h-[1.2rem] md:w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 md:h-[1.2rem] md:w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
