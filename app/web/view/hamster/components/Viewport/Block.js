import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';

import styles from './Block.scss';
import configHelper from '../../config/configHelper';
import BlockUtils from '../../Utils/BlockUtils';

const handleClick = (e, block) => {
    BlockUtils.activateBlock([block.get('id')]);
}

export const Component = ({block, active}) => {
    let classes = ['block'];
    active && classes.push('active');
    classes = classNames(...classes);
    return (
        <div className={classes} styleName={classes} onClick={e => handleClick(e, block)}>
            <h4>{block.get('type')}</h4>
            <hr />
            {
                block.get('props').map((v, k) => <p>{`${k}：${v}`}</p>)
            }
        </div>
    )
}

Component.propTypes = {
    block: PropTypes.any,
    active: PropTypes.bool
}

export default CSSModules(Component, styles, {allowMultiple: true});
