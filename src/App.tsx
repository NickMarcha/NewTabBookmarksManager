import React from 'react';
import logo from './logo.svg';
import './App.css';
import {useAtomValue, useSetAtom} from "jotai/react";
import {AddBookmarkAtom, ReadOnlyBookmarksAtom} from "./GeneralAtomsStore";

function App() {
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
        <div className="App">
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
            <button data-id="bookmark.id" onClick={RemoveBookmarkButtonHandler}>Remove</button>
        </div>
    </>
}

function DebugInfo({bookmark}: { bookmark: browser.bookmarks.BookmarkTreeNode }) {

    const [showDebugInfo, setShowDebugInfo] = React.useState(false);

    return <>
        <button onClick={() => setShowDebugInfo(!showDebugInfo)}>Toggle Debug Info</button>
        {showDebugInfo && <>
            <span>id: {bookmark.id}</span><br/>
            <span>type:  {bookmark.type}</span><br/>
            <span>url: {bookmark.url}</span><br/>
            <span>title: {bookmark.title}</span><br/>
            <span>dateAdded: {bookmark.dateAdded}</span><br/>
            <span>dateGroupModified: {bookmark.dateGroupModified}</span><br/>
            <span>index: {bookmark.index}</span><br/>
            <span>parentId: {bookmark.parentId}</span><br/>
            <span>unmodifiable: {bookmark.unmodifiable}</span></>}
    </>
}

export default App;
