import React from 'react';
import logo from './logo.svg';
import './App.css';
import {useAtomValue, useSetAtom, useAtom} from "jotai/react";
import {AddBookmarkAtom, DarkModeAtom, EditModeAtom, ReadOnlyBookmarksAtom} from "./GeneralAtomsStore";
import {Navbar} from "./Navbar/Navbar";

function App() {
    const darkMode = useAtomValue(DarkModeAtom);

    const [newBookmarkTitle, setNewBookmarkTitle] = React.useState('');
    const [newBookmarkUrl, setNewBookmarkUrl] = React.useState('');

    const bookmarkItems = useAtomValue(ReadOnlyBookmarksAtom);

    const AddBookmark = useSetAtom(AddBookmarkAtom);

    async function addBookmarkButtonHandler() {

        if (newBookmarkTitle && newBookmarkUrl) {
            await AddBookmark({
                title: newBookmarkTitle,
                url: newBookmarkUrl
            });

        }
    }

    console.log(bookmarkItems);


    return (
        <div className={"App " + (darkMode ? "dark" : "")}>
            <Navbar/>
            {/*<header className="App-header">*/}
            {/*    <img src={logo} className="App-logo" alt="logo"/>*/}
            {/*    <p>*/}
            {/*        Edit <code>src/App.tsx</code> and save to reload.*/}
            {/*    </p>*/}
            {/*    <a*/}
            {/*        className="App-link"*/}
            {/*        href="https://reactjs.org"*/}
            {/*        target="_blank"*/}
            {/*        rel="noopener noreferrer"*/}
            {/*    >*/}
            {/*        Learn React*/}
            {/*    </a>*/}
            {/*</header>*/}
            <DarkModeTest/>
            <div>
                <div id="bookmarks">
                    {bookmarkItems.map(bookmarkItem => {
                        return <TreeNode bookmarkTreeNode={bookmarkItem}/>
                    })}


                </div>


                <input type="text" id="bookmarkTitle" placeholder="Title"
                       value={newBookmarkTitle}
                       onChange={event => setNewBookmarkTitle(event.target.value)}
                />
                <input type="url" id="bookmarkUrl" placeholder="URL"
                       value={newBookmarkUrl}
                       onChange={event => setNewBookmarkUrl(event.target.value)}
                />
                <button id="addBookmark"
                        onClick={addBookmarkButtonHandler}
                >Add Bookmark
                </button>
            </div>
        </div>
    );
}

function TreeNode({bookmarkTreeNode}: { bookmarkTreeNode: browser.bookmarks.BookmarkTreeNode }) {
    function RenderType() {
        switch (bookmarkTreeNode.type) {
            case 'folder':
                return <BookmarkFolder bookmarkTreeNode={bookmarkTreeNode}/>
            case 'bookmark':
                return <BookmarkElement bookmark={bookmarkTreeNode}/>
            case 'separator':
                return <>Separator</>
            default:
                return <>Not Supported</>
        }
    }

    return <div className={"tree-node"}>
        <RenderType/>
        {/*<DebugInfo bookmark={bookmarkTreeNode}/>*/}
    </div>
}


function BookmarkFolder({bookmarkTreeNode}: { bookmarkTreeNode: browser.bookmarks.BookmarkTreeNode }) {
    if (bookmarkTreeNode.type !== 'folder' || !bookmarkTreeNode.children) {
        throw new Error('BookmarkFolder component can only render folder type');
    }

    return <div className={"bookmark-folder"}>
        <strong>{bookmarkTreeNode.title}</strong>

        <div>
            {bookmarkTreeNode.children.map(bookmark => {
                return <TreeNode bookmarkTreeNode={bookmark}/>
            })}
        </div>
    </div>
}

function BookmarkElement({bookmark}: { bookmark: browser.bookmarks.BookmarkTreeNode }) {

    const [editMode, setEditMode] = useAtom(EditModeAtom);

    if (bookmark.type !== 'bookmark') {
        throw new Error('BookmarkElement component can only render bookmark type');
    }

    async function RemoveBookmarkButtonHandler() {
        await browser.bookmarks.remove(bookmark.id);
    }


    return <>
        <span>{bookmark.title}</span>
        <div>
            <a href={bookmark.url} target="_blank" rel={"noreferrer"}>Visit</a>
            <button data-id="bookmark.id"
                    style={{
                        display: editMode ? 'none' : 'block'
                    }} onClick={RemoveBookmarkButtonHandler}>Remove
            </button>
        </div>
    </>
}

function DebugInfo({bookmark}: { bookmark: browser.bookmarks.BookmarkTreeNode }) {

    const [showDebugInfo, setShowDebugInfo] = React.useState(false);

    return <>
        <button onClick={() => setShowDebugInfo(!showDebugInfo)}>Toggle Debug Info</button>
        {showDebugInfo && <>
            <span>id: {bookmark.id}</span><br/>
            <span>type: {bookmark.type}</span><br/>
            <span>url: {bookmark.url}</span><br/>
            <span>title: {bookmark.title}</span><br/>
            <span>dateAdded: {bookmark.dateAdded}</span><br/>
            <span>dateGroupModified: {bookmark.dateGroupModified}</span><br/>
            <span>index: {bookmark.index}</span><br/>
            <span>parentId: {bookmark.parentId}</span><br/>
            <span>unmodifiable: {bookmark.unmodifiable}</span></>}
    </>
}

function DarkModeTest() {
    return <div className="bg-white dark:bg-slate-800 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
        <div>
    <span className="inline-flex items-center justify-center p-2 bg-indigo-500 rounded-md shadow-lg">
      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
           stroke="currentColor" aria-hidden="true"></svg>
    </span>
        </div>
        <h3 className="text-slate-900 dark:text-white mt-5 text-base font-medium tracking-tight">Writes Upside-Down</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            The Zero Gravity Pen can be used to write in any orientation, including upside-down. It even works in outer
            space.
        </p>
    </div>;
}

export default App;
