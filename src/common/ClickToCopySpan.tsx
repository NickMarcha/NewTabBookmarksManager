import {useState} from "react";

export function ClickToCopySpan({text, cooldownInSeconds}: { text: string, cooldownInSeconds?: number }) {
    const [lastCopiedTimeStamp, setLastCopiedTimeStamp] = useState(0);

    function HandleCopyClick() {
        if (cooldownInSeconds && lastCopiedTimeStamp + cooldownInSeconds * 1000 > Date.now()) {
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            setLastCopiedTimeStamp(Date.now());
        });
    }

    return <span onClick={HandleCopyClick}>
        {text}
    </span>
}