/**
 * 插入文本工具组件
 * */
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import Style from './Text.scss';

class Text extends React.PureComponent {
    static displayName = 'Text';

    static propTypes = {
        addBlock: PropTypes.func
    };

    static defaultProps = {
        addBlock: () => null
    }

    constructor (props) {
        super(props);
        this.state = {};
    }

    handleClick = (event) => {
        const { addBlock } = this.props;
        addBlock && addBlock();
    }

    render () {
        return (
            <div className='text-tool' styleName='text-tool'>
                <div className='text-tool-wrap' onClick={this.handleClick}>
                    <div className='text-icon' data-type='text'>
                        <i className='iconfont icon-wenben' />
                    </div>
                    <div className='text-title' data-type='text'>文本</div>
                </div>
            </div>
        )
    }
}

export default CSSModules(Text, Style);
