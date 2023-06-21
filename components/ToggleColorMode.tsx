
import { Button, Icon } from "@tremor/react";
import React from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";

import { useTheme } from "next-themes";


const ToggleColorMode = () => {
  const { theme, setTheme } = useTheme()

  const handleSetTheme = () => {
    if (theme === 'light'){
      setTheme('dark')
      return
    }
    setTheme('light')
  }

  return (
    <Button
      onClick={handleSetTheme}
      icon={theme === "dark" ? SunIcon : MoonIcon}
    
    >
      {/* {theme === "dark" ? "Light" : "Dark"} */}
    </Button>
  );
};

export default ToggleColorMode;
