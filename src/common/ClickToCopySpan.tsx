import {useState} from "react";
import {toast} from "react-toastify";

export function ClickToCopySpan({text, cooldownInSeconds}: { text: string, cooldownInSeconds?: number }) {
    const [lastCopiedTimeStamp, setLastCopiedTimeStamp] = useState(0);

    function HandleCopyClick() {
        if (cooldownInSeconds && lastCopiedTimeStamp + cooldownInSeconds * 1000 > Date.now()) {
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Copied to clipboard');
            setLastCopiedTimeStamp(Date.now());
        }).catch(() => {
            toast.error('Failed to copy to clipboard');
        });
    }

    return <span onClick={HandleCopyClick}>
        {text}
    </span>
}