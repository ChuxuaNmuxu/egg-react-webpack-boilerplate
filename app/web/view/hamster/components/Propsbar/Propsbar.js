import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './Propsbar.scss';
import configHelper from '../../config/configHelper';

/**
 * 需要block数据
 * 需要block配置数据
 * 属性变化要经过验证
 * @param {*} props
 */
export const Component = ({data, onPropChange}) => {
    if (!data.size) {
        return <div />
    }
    const dataPropsConfig = data.map(item => configHelper.getBlock(item.get('type')).get('props'))
    let mergedPropsConfig = dataPropsConfig;
    if (data.size === 1) {
        mergedPropsConfig = dataPropsConfig.get(0);
    } else {
        // 需要合并处理多个情况
    }
    const mergedProps = data.getIn([0, 'props']);
    return (
        <div className='propsbar' styleName='propsbar'>
            <h3>属性栏</h3>
            {
                mergedPropsConfig.map((prop, key) =>
                    <div key>
                        {prop.get('title')}：
                        <input
                          name={key}
                          value={mergedProps.get(key)}
                          onChange={e => onPropChange(key, e.target.value, data.get(0))}
                          />
                    </div>
                )
            }
        </div>
    )
}

Component.propTypes = {
    data: PropTypes.any,
    onPropChange: PropTypes.func.isRequired
}

export default CSSModules(Component, styles);
