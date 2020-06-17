import React, { userState } from "react";
function example4() {
    const [count, setCount] = userState(0);
    return (
        <div>
            <p>You click {count} times</p>
            <button
                onClick={() => {
                    setCount(count++);
                }}
            >
                Click me
            </button>
        </div>
    );
}
export default example4;
