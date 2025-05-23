"use client";

import { cn, THEME_MEDIA_QUERY, THEME_STORAGE_KEY } from "@/lib/utils";
import { MoonIcon, SunIcon, MonitorIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { ThemeMode } from "@/lib/types";

const THEME_SCRIPT = `
  const doc = document.documentElement;
  const theme = localStorage.getItem("${THEME_STORAGE_KEY}") ?? "system";

  if (theme === "system") {
    if (window.matchMedia("${THEME_MEDIA_QUERY}").matches) {
      doc.classList.add("dark");
    } else {
      doc.classList.add("light");
    }
  } else {
    doc.classList.add(theme);
  }
`
  .trim()
  .replace(/\n/g, "")
  .replace(/\s+/g, " ");

function applyTheme(theme: ThemeMode) {
  const doc = document.documentElement;

  doc.classList.remove("dark", "light");
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  if (theme === "system") {
    if (window.matchMedia(THEME_MEDIA_QUERY).matches) {
      doc.classList.add("dark");
    } else {
      doc.classList.add("light");
    }
  } else {
    doc.classList.add(theme);
  }
}

interface ThemeToggleProps {
  className?: string;
}

export function ApplyThemeScript() {
  return <script id="theme-script">{THEME_SCRIPT}</script>;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode | undefined>(undefined);

  useEffect(() => {
    const storedTheme =
      (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) ?? "system";

    setTheme(storedTheme);
  }, []);

  function handleThemeChange(theme: ThemeMode) {
    applyTheme(theme);
    setTheme(theme);
  }

  return (
    <div
      className={cn(
        "flex border rounded divide-x overflow-hidden text-foreground bg-background",
        className
      )}
    >
      <span className="sr-only">Color scheme toggle</span>
      <button
        type="button"
        onClick={() => handleThemeChange("dark")}
        className={cn("p-1 cursor-pointer", theme !== "dark" && "opacity-25")}
      >
        <span className="sr-only">Enable dark color scheme</span>
        <MoonIcon size={16} weight="bold" />
      </button>
      <button
        type="button"
        onClick={() => handleThemeChange("light")}
        className={cn("p-1 cursor-pointer", theme !== "light" && "opacity-25")}
      >
        <span className="sr-only">Enable light color scheme</span>
        <SunIcon size={16} weight="bold" />
      </button>
      <button
        type="button"
        onClick={() => handleThemeChange("system")}
        className={cn("p-1 cursor-pointer", theme !== "system" && "opacity-25")}
      >
        <span className="sr-only">Enable system color scheme</span>
        <MonitorIcon size={16} weight="bold" />
      </button>
    </div>
  );
}
