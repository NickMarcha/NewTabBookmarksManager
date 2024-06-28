import React from 'react';
/*import logo from './logo.svg';*/
import './App.css';
import {useAtomValue} from "jotai/react";
import {DarkModeAtom} from "./GeneralAtomsStore";
import {Navbar} from "./Navbar/Navbar";
import {BookMarks} from "./Bookmarks/Bookmarks";

function App() {
    console.log('env is:', process.env.NODE_ENV);
    const darkMode = useAtomValue(DarkModeAtom);

    return (
        <div className={"App " + (darkMode ? "dark" : "")}>
            <Navbar/>
            <BookMarks/>
        </div>
    );
}

export default App;