import {useAtomValue, useSetAtom} from "jotai/react";
import {
    AddBookmarkAtom,
    EditModeAtom,
    ReadOnlyBookmarksAtom,
    SearchQueryAtom,
    UpdateBookmarkAtom
} from "../GeneralAtomsStore";
import React from "react";
import {ClickToCopySpan} from "../common/ClickToCopySpan";

export function BookMarks() {
    const bookmarkItems = useAtomValue(ReadOnlyBookmarksAtom);

    return (
        <div
            className={"mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200  lg:mx-0 lg:max-w-none lg:grid-cols-3"}>
            {bookmarkItems.map(bookmarkItem => {
                return <TreeNode key={bookmarkItem.id} bookmarkTreeNode={bookmarkItem}/>
            })}
        </div>
    )
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
    </div>
}

function BookmarkFolder({bookmarkTreeNode}: { bookmarkTreeNode: browser.bookmarks.BookmarkTreeNode }) {
    const editMode = useAtomValue(EditModeAtom);
    const addBookmark = useSetAtom(AddBookmarkAtom);
    const [newBookmarkTitle, setNewBookmarkTitle] = React.useState("");
    const [newBookmarkUrl, setNewBookmarkUrl] = React.useState("");
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const searchQuery = useAtomValue(SearchQueryAtom);

    if (bookmarkTreeNode.type !== 'folder' || !bookmarkTreeNode.children) {
        throw new Error('BookmarkFolder component can only render folder type');
    }

    function getFilteredChildren() {
        if(bookmarkTreeNode.children === undefined
            ||bookmarkTreeNode.children?.length === 0
        ) {
            return [];
        }
        return bookmarkTreeNode.children.filter(bookmark => {
            if(searchQuery === ""||bookmark.type !== 'bookmark' ) {
                return true;
            }
            return bookmark.title.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }

    return <div className={"flex max-w-xl flex-col items-start justify-between"}>
        <strong
        onClick={() => setIsCollapsed(!isCollapsed)}
        >{bookmarkTreeNode.title}</strong>

        {!isCollapsed && (<>
            <div>
                {getFilteredChildren().length>0 && getFilteredChildren().map(bookmark => {
                    return <TreeNode key={bookmark.id} bookmarkTreeNode={bookmark}/>
                })}

                {getFilteredChildren().length === 0 && <div>{searchQuery === "" ?"...":"No Search results"}</div>}
            </div>
            {editMode && <div>
                <label>Title</label>
                <input className={""} value={newBookmarkTitle}
                       onChange={(value) => setNewBookmarkTitle(value.target.value)}/>
                <label>URL</label>
                <input className={""} value={newBookmarkUrl}
                       onChange={(value) => setNewBookmarkUrl(value.target.value)}/>
                <button onClick={() => {
                    addBookmark({
                        parentId: bookmarkTreeNode.id,
                        title: newBookmarkTitle,
                        url: newBookmarkUrl
                    });
                    setNewBookmarkTitle("");
                    setNewBookmarkUrl("");
                }}>Add Bookmark
                </button>
            </div>}
        </>)}

    </div>
}

function BookmarkElement({bookmark}: { bookmark: browser.bookmarks.BookmarkTreeNode }) {

    const editMode = useAtomValue(EditModeAtom);

    const updateBookmark = useSetAtom(UpdateBookmarkAtom
    );

    if (bookmark.type !== 'bookmark') {
        throw new Error('BookmarkElement component can only render bookmark type');
    }

    async function RemoveBookmarkButtonHandler() {
        await browser.bookmarks.remove(bookmark.id);
    }

    return <div className={"flex max-w-xl flex-col items-start justify-between border-2 border-sky-500"}>
        {editMode && (
            <>
                <input className={""} value={bookmark.title} onChange={async (value) => {
                    await updateBookmark({
                        id: bookmark.id,
                        newBookmark: {
                            title: value.target.value
                        }

                    })
                }}/>
                <input className={""}
                       value={bookmark.url}
                       onChange={async (value) => {
                           await updateBookmark({
                               id: bookmark.id,
                               newBookmark: {
                                   url: value.target.value
                               }
                           })
                       }}
                />
                <button onClick={RemoveBookmarkButtonHandler}>Remove</button>
            </>
        )
        }
        {
            !editMode && (
                <>
                    <a href={bookmark.url}>{bookmark.title}</a>
                    <ClickToCopySpan text={bookmark.url ?? ""} cooldownInSeconds={3}/>
                </>
            )
        }
    </div>
}


// function DebugInfo({bookmark}: { bookmark: browser.bookmarks.BookmarkTreeNode }) {
//
//     const [showDebugInfo, setShowDebugInfo] = React.useState(false);
//
//     return <>
//         <button onClick={() => setShowDebugInfo(!showDebugInfo)}>Toggle Debug Info</button>
//         {showDebugInfo && <>
//             <span>id: {bookmark.id}</span><br/>
//             <span>type: {bookmark.type}</span><br/>
//             <span>url: {bookmark.url}</span><br/>
//             <span>title: {bookmark.title}</span><br/>
//             <span>dateAdded: {bookmark.dateAdded}</span><br/>
//             <span>dateGroupModified: {bookmark.dateGroupModified}</span><br/>
//             <span>index: {bookmark.index}</span><br/>
//             <span>parentId: {bookmark.parentId}</span><br/>
//             <span>unmodifiable: {bookmark.unmodifiable}</span></>}
//     </>
// }