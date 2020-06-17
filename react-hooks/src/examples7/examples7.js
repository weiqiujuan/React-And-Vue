import React, { useMemo, useState } from 'react';
function examples7() {
    const [xiaohong, , setXiaohong] = useState('小红在讲课');
    const [xiaowang, setzhiling] = useState('小王在等待讲课');
    return (
        <div>
            <button onClick={() => { setXiaohong(new Date().getTime()) }}>
                小红
            </button>
            <button onClick={() => { setzhiling(new Date().getTime() + '小王在备课中') }}>
                小王
            </button>
            <ChildrenComponent name={xiaohong}>{xiaowang}</ChildrenComponent>
        </div>
    )
}
function ChildrenComponent({ name, children }) {
    function changeXiaohong(name) {
        console.log('他讲完了')
        return name + ',小红讲完了'
    }
    const actionXiaohong = useMemo(() => {
        changeXiaohong(name)
    }, [name])
    return (
        <>
            <div>{actionXiaohong}</div>
            <div>{children}</div>
        </>
    )

}