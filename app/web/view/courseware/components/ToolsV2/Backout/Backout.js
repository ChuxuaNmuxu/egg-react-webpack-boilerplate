/**
 * 撤销备课编辑区操作工具组件
 * @author Ouyang
 * */
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import ClassNames from 'classnames';
import Styles from './Backout.scss';

class BackOut extends React.PureComponent {
    static displayName = 'BackOut';

    static propTypes = {
        className: PropTypes.string,
        // 后退操作缓存
        backCache: PropTypes.array,
        // 是否可操作
        visible: PropTypes.bool,
        // 点击事件
        onClick: PropTypes.func
    };

    static defaultProps = {
        backCache: []
    };

    getVisible = (cache = []) => {
        return cache && cache.length > 1;
    }

    // 点击处理
    handleClick = (event) => {
        const { onClick } = this.props;
        onClick && onClick(event);
    }

    render () {
        const { visible } = this.props;
        const iconCls = ClassNames('icon-Group4', 'iconfont', 'back-out-icon');
        const mergeCls = ClassNames(iconCls, visible ? 'visible' : 'invisible');
        return (
            <div className='back-out' styleName='back-out'>
                <div className='back-out-wrap' onClick={this.handleClick}>
                    <i className={mergeCls} />
                </div>
            </div>
        );
    }
}

export default CSSModules(BackOut, Styles);
