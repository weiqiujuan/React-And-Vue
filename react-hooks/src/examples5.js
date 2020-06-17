import React, { createContext, useContext, useState } from 'react';
const countContext = createContext();
function childrenCount() {
    const count = useContext(contextValue);
    return (
        <p>context傳過來的count是{count}</p>
    )
}
function examples() {
    const [count, setCount] = useState(0);
    return (
        <div>
            <p>you click {count} times</p>
            <button onClick={() => { setCount(count + 1) }}>click me</button>
            <countContext.Provider value={count}>
                <childrenCount></childrenCount>
            </countContext.Provider>
        </div>

    )
}
export default examples