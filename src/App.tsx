import React from 'react';
import './App.css';
import {useAtomValue} from "jotai/react";
import {DarkModeAtom} from "./GeneralAtomsStore";
import {Navbar} from "./Navbar/Navbar";
import {BookMarks} from "./Bookmarks/Bookmarks";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    console.log('env is:', process.env.NODE_ENV);
    const darkMode = useAtomValue(DarkModeAtom);

    return (
        <div className={"App " + (darkMode ? "dark" : "")}>
            <Navbar/>
            <BookMarks/>
            <ToastContainer />
        </div>
    );
}

export default App;