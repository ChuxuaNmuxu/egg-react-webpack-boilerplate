import React from 'react';
import Block from '../Block';
import PropTypes from 'prop-types';

import shapes from './ShapeSvg';
import shapeHoc from './shapeHoc';
/**
 * 形状元素块
 */

const ShapeBlock = (props) => {
    // const { shapeType } = props.me;
    const {me} = props;
    const shapeType = me.get('shapeType');
    const shapeSvg = shapes[shapeType.toLowerCase()]
    const border = me.getIn(['props', 'border']);

    const ShapeComponent = shapeHoc({
        borderStyle: border.get('style'),
        borderWidth: border.get('width'),
        borderColor: border.get('color')
    })(shapeSvg);

    return (
        <Block {...props}>
            <div className='shape-block'>
                <ShapeComponent />
            </div>
        </Block>
    )
}
ShapeBlock.propTypes = {
    props: PropTypes.object,
    me: PropTypes.object
}

export default ShapeBlock;
