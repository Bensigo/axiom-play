
import { Button, Icon } from "@tremor/react";
import React, { useContext } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import { ColorModeContext } from "../context/theme";


const ToggleColorMode = () => {
  const { colorMode, toggleColorMode } = useContext(ColorModeContext);

  return (
    <Button
      onClick={toggleColorMode}
      icon={colorMode === "dark" ? SunIcon : MoonIcon}
      className={`mb-4 mt-2 flex self-center border-0 hover:border-0  bg-inherit hover:bg-inherit ${
        colorMode === "dark" ? "text-white " : "text-black"
      }  `}
    >
      {colorMode === "dark" ? "Light" : "Dark"}
    </Button>
  );
};

export default ToggleColorMode;
