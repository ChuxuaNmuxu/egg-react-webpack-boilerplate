import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './Navbar.scss';

export const Component = (props) => {
    return (
        <div className='navbar' styleName='navbar'>
            我是导航栏
        </div>
    )
}

export default CSSModules(Component, styles);
