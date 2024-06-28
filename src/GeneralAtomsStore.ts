
import {atomWithStorage} from 'jotai/utils';
import {atom} from "jotai";
import {testData} from "./TestData";

export const DarkModeAtom = atomWithStorage('darkMode', true)

/*type BookmarkExtraInfo = {
    id: string,
    hidden: boolean,
    pinned: boolean,
    collapsed: boolean,
}*/

const bookmarksAtom = atom<browser.bookmarks.BookmarkTreeNode[]>([]);



bookmarksAtom.onMount = (set) => {

    if (process.env.NODE_ENV !== "production") {
        set(testData);
        return;
    }

    if (typeof browser === 'undefined') {
        console.error('browser is undefined');
        set([]);
        return;
    }

    if ( !browser.bookmarks) {
        console.error('bookmarks API is not available');
        set([]);
        return;
    }
    browser.bookmarks.getTree().then(bookmarkItems => {
        set(bookmarkItems);
        console.debug('bookmarksAtom.onMount', bookmarkItems)
    });
};

export const ReadOnlyBookmarksAtom = atom(
    (get) => get(bookmarksAtom)
);

/*export const AddBookmarkAtom = atom(
    null,
    async (get, set, newBookmark: browser.bookmarks.CreateDetails) => {
        await browser.bookmarks.create(newBookmark).then(async() => {
            await browser.bookmarks.getTree().then(bookmarkItems => {
                set(bookmarksAtom,bookmarkItems);
            });
        });
    }
);*/

/*
export const RemoveBookmarkAtom = atom(
    null,
    async(get, set, id: string) => {
        await browser.bookmarks.remove(id).then(async() => {
            await browser.bookmarks.getTree().then(bookmarkItems => {
                set(bookmarksAtom,bookmarkItems);
            });
        });
    }
);
*/

export const UpdateBookmarkAtom = atom(
    null,
    async(get, set, {id,newBookmark}:{id:string,newBookmark: browser.bookmarks._UpdateChanges}) => {
        /*await browser.bookmarks.update(id,newBookmark).then(async() => {
            await browser.bookmarks.getTree().then(bookmarkItems => {
                set(bookmarksAtom,bookmarkItems);
            });
        });*/
    }
);

/*export const MoveBookmarkAtom = atom(
    null,
    async(get, set, {id,moveDestination}:{id:string,moveDestination: browser.bookmarks._MoveDestination}) => {
        await browser.bookmarks.move(id,moveDestination).then(async() => {
            await browser.bookmarks.getTree().then(bookmarkItems => {
                set(bookmarksAtom,bookmarkItems);
            });
        });
    }
);*/

/*
//storage atom with Record<string, BookmarkExtraInfo>
const bookmarkExtraInfoAtom = atomWithStorage<Record<string, BookmarkExtraInfo>>('bookmarkExtraInfo', {});
*/

export const EditModeAtom = atom(false);


