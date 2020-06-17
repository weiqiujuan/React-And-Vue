import React, { useContext } from 'react';
import { ColorContext } from './color';
function ShowAreas() {
    const { color } = useContext(ColorContext);
    return (
        <div style={{ color: color }}>字体颜色是{color}</div>
    )
}
export default ShowAreas;