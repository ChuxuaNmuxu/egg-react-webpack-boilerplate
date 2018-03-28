import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './Toolbar.scss';
import Blocks from './Blocks';

export const Component = (props) => {
    return (
        <div className='toolbar' styleName='toolbar'>
            <Blocks />
        </div>
    )
}

export default CSSModules(Component, styles);
