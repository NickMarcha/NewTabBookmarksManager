import {MoonIcon, SunIcon} from "@radix-ui/react-icons"
/*import {Button} from "./../../components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./../../components/ui/dropdown-menu"*/
import {DarkModeAtom, EditModeAtom} from "./../GeneralAtomsStore";
import {useAtom} from "jotai/react";
import React from "react";


export function Navbar() {
    const [darkMode, setDarkMode] = useAtom(DarkModeAtom);

    return <div>
        <ToggleEditMode/>
        <ModeToggle/>
    </div>
}

function ToggleEditMode() {
    const [editMode, setEditMode] = useAtom(EditModeAtom);

    return (
        <button onClick={() => setEditMode((old) => !old)}>Toggle Edit Mode {editMode ? "off" : "yes"}</button>
    )
}

function ModeToggle() {
    const [darkMode, setDarkMode] = useAtom(DarkModeAtom);

    return (
        <>
            <button onClick={() => setDarkMode((old) => !old)}>Toggle Dark Mode {darkMode ? "off" : "yes"}</button>
        </>
   /*     <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <SunIcon
                        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
                    <MoonIcon
                        className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setDarkMode(false)}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDarkMode(true)}>
                    Dark
                </DropdownMenuItem>
                {/!*<DropdownMenuItem onClick={() => setTheme("system")}>*!/}
                {/!*    System*!/}
                {/!*</DropdownMenuItem>*!/}
            </DropdownMenuContent>
        </DropdownMenu>*/
    )
}