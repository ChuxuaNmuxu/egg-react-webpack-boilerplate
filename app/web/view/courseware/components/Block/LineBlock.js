import React from 'react';

import TransformLine from './TransformLine';
import Block from './Block';

/**
 * 线条元素块
 */
class LineBlock extends React.Component {
    render () {
        return (
            <Block transform={TransformLine}>
                线条元素
            </Block>
        )
    }
}

export default LineBlock;
