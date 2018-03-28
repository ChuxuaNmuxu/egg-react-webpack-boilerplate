/**
 * 生成blockHTML的配置
 */

import {Map} from 'immutable';
import shapes from '../components/Block/ShapeBlock/ShapeSvg';

const blockHtml = Map({
    text: (block) => {
        return block.get('content') || '';
    },
    shape: (block) => {
        const shapeType = block.get('shapeType');
        return shapes[shapeType]
    },
    table: (block) => {
        return block.get('content')
    },
    image: (block) => {
        const url = block.get('url');
        return `<img src='${url}' alt='img' style='width: 100%; height: 100%; margin: 0px; border: 0px; box-shadow: none; max-width: 100%; background: none;'>`
    }
})

export default blockHtml
