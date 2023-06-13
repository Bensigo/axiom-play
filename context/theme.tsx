'use client'
import React, { createContext, useState, useEffect } from "react";
import cookie from "js-cookie";
export const ColorModeContext = createContext({
  colorMode: "light",
  toggleColorMode: () => {},
});

export const ColorModeProvider = ({ children }: any) => {
  const [colorMode, setColorMode] = useState(cookie.get("mode") || "light");

  const toggleColorMode = () => {
    setColorMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(`${colorMode}-mode`);
    cookie.set("mode", colorMode);
  }, [colorMode]);

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};
