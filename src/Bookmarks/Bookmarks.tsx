import {useAtomValue, useSetAtom} from "jotai/react";
import {EditModeAtom, ReadOnlyBookmarksAtom, UpdateBookmarkAtom} from "../GeneralAtomsStore";
import React from "react";
import {ClickToCopySpan} from "../common/ClickToCopySpan";

export function BookMarks() {
    const bookmarkItems = useAtomValue(ReadOnlyBookmarksAtom);

    return (
        <div id="bookmarks">
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
    if (bookmarkTreeNode.type !== 'folder' || !bookmarkTreeNode.children) {
        throw new Error('BookmarkFolder component can only render folder type');
    }

    return <div className={"bookmark-folder"}>
        <strong>{bookmarkTreeNode.title}</strong>

        <div>
            {bookmarkTreeNode.children.map(bookmark => {
                return <TreeNode key={bookmark.id} bookmarkTreeNode={bookmark}/>
            })}
        </div>
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

    return <div className={"bookmark-element"}>
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
        <span>{bookmark.title}</span>
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