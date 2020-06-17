import { useReducer } from 'react';

function ReducerDemo() {
    const [count, dispatch] = useReducer((state, action) => {
        switch (action) {
            case 'add':
                return state + 1
            case 'sub':
                return state - 1;
            default:
                return state;
        }
    }, 0)

    return (
        <div>
            <h2>现在的count是{count}</h2>
            <button onClick={() => { dispatch('add') }}>increment</button>
            <button onClick={() => { dispatch('sub') }}>descrement</button>
        </div>
    )
}