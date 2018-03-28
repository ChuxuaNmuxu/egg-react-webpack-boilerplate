import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './toolBtn.scss';

class ToolBtn extends React.Component {
    render () {
        const {option, content = '', wrapClass = '', iconClass = 'icon-tuichu', textClass = ''} = this.props;

        return <div onClick={option} styleName='tool-btn' className={`tool-btn ${wrapClass}`}>
            <i className={`iconfont ${iconClass}`} />
            <span className={`text ${textClass}`}>
                {content}
            </span>
        </div>
    }
}

ToolBtn.propTypes = {
    option: PropTypes.func,
    content: PropTypes.string,
    wrapClass: PropTypes.string,
    iconClass: PropTypes.string,
    textClass: PropTypes.string
}

export default CSSModules(ToolBtn, styles);
