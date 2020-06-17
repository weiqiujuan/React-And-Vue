import React, { useCallback, useEffect, useState } from 'react'
function useWinSize() {
    const [size, setSize] = useState({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
    })
    //缓存方法
    const onResize = useCallback(() => {
        setSize({
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
        })
    }, [])
    useEffect(() => {
        window.addEventListener('resize', onResize)
        //销毁的时候返回
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [])
    return size;
}

//使用
function example() {
    const size = useWinSize()
    return (
        <div>页面size:{size.width} * {size.height}</div>
    )
}
export default example;