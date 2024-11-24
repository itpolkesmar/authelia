import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { Theme, ThemeProvider } from "@mui/material";

import { LocalStorageThemeName } from "@constants/LocalStorage";
import { localStorageAvailable } from "@services/LocalStorage";
import * as themes from "@themes/index";
import { getTheme } from "@utils/Configuration";

const MediaQueryDarkMode = "(prefers-color-scheme: dark)";

export const ThemeContext = createContext<ValueProps | null>(null);

export interface Props {
    children: React.ReactNode;
}

export interface ValueProps {
    theme: Theme;
    themeName: string;
    setThemeName: (value: string) => void;
}

export default function ThemeContextProvider(props: Props) {
    const [theme, setTheme] = useState(GetCurrentTheme());
    const [themeName, setThemeName] = useState(GetCurrentThemeName());
    const isLocalStorageAvailable = localStorageAvailable();

    const mediaQueryListener = useCallback((ev: MediaQueryListEvent) => {
        setTheme(ev.matches ? themes.Dark : themes.Light);
    }, []);

    const storageListener = (ev: StorageEvent) => {
        console.log("storage event");
        if (ev.key !== LocalStorageThemeName) {
            console.log(`storage event: wrong key ${ev.key}`);
            return;
        }

        console.log(`storage event: correct key ${ev.key}`);

        if (ev.newValue && ev.newValue !== "") {
            setThemeName(ev.newValue);
        } else {
            setThemeName(getUserThemeName());
        }
    };

    useEffect(() => {
        if (themeName === themes.ThemeNameAuto) {
            const query = window.matchMedia(MediaQueryDarkMode);

            if (query.addEventListener) {
                query.addEventListener("change", mediaQueryListener);

                return () => {
                    query.removeEventListener("change", mediaQueryListener);
                };
            }
        }

        const theme = ThemeFromName(themeName);

        setTheme(theme);
    }, [mediaQueryListener, themeName]);

    useEffect(() => {
        window.addEventListener("storage", storageListener);
        return () => {
            window.removeEventListener("storage", storageListener);
        };
    }, []);

    const callback = useCallback(
        (name: string) => {
            setThemeName(name);

            if (isLocalStorageAvailable) {
                window.localStorage.setItem(LocalStorageThemeName, name);
            }
        },
        [isLocalStorageAvailable],
    );

    return (
        <ThemeContext.Provider
            value={{
                theme,
                themeName,
                setThemeName: callback,
            }}
        >
            <ThemeWrapper>{props.children}</ThemeWrapper>
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeContext must be used within a ThemeContextProvider");
    }

    return context;
}

function ThemeWrapper(props: Props) {
    const { theme } = useThemeContext();

    return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}

function GetCurrentThemeName() {
    if (localStorageAvailable()) {
        const local = window.localStorage.getItem(LocalStorageThemeName);

        if (local) {
            return local;
        }
    }

    return getTheme();
}

function GetCurrentTheme() {
    return ThemeFromName(GetCurrentThemeName());
}

function ThemeFromName(name: string) {
    switch (name) {
        case themes.ThemeNameLight:
            return themes.Light;
        case themes.ThemeNameDark:
            return themes.Dark;
        case themes.ThemeNameGrey:
            return themes.Grey;
        case themes.ThemeNameAuto:
            return window.matchMedia(MediaQueryDarkMode).matches ? themes.Dark : themes.Light;
        default:
            return window.matchMedia(MediaQueryDarkMode).matches ? themes.Dark : themes.Light;
    }
}

const getUserThemeName = () => {
    if (localStorageAvailable()) {
        const value = window.localStorage.getItem(LocalStorageThemeName);

        if (value) {
            return value;
        }
    }

    return getTheme();
};
