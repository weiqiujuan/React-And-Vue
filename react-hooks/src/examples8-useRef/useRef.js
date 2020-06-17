import React, { useRef, useState } from 'react';
function examples8() {
    const inputEl = useRef(null);
    const onButtonClick = () => {
        inputEl.current.value = 'hello,weiqiujuan';
        console.log(inputEl)
    }
    const [text, setText] = useState('weiqiujuan');
    const textRef = useRef();
    useEffect(() => {
        textRef.current = text;
        console.log('textRef.current', textRef.current)
    });
    return (
        <div>
            <input ref={inputEl} type='text'></input>
            <button onClick={onButtonClick}>input展示文字</button>
            <br></br>
            <br></br>
            <input value={text} onChange={(e) => { setText(e.target.value) }}></input>
        </div>
    )
}
export default examples8;