/**
 * 形状选择工具, 基于ShapeSelector组件封装
 * @author Ouyang
 * */
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import Style from './Shape.scss';
import ShapeSelector from './ShapeSelector';

class Shape extends React.PureComponent {
    static displayName = 'Shape';

    static propTypes = {
        // 添加形状调用
        addBlock: PropTypes.func,
        // 类名, 外部修改样式
        className: PropTypes.string
    }

    static defaultProps = {
        addBlock: (shape) => null
    };

    constructor (props) {
        super(props);
        this.state = {
            modelVisible: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleClick () {
        this.setState({
            modelVisible: !this.state.modelVisible
        });
    }

    handleSelect (shape) {
        const { addBlock } = this.props;
        addBlock && addBlock(shape);
    }

    render () {
        return (
            <div className='shape-tool' styleName='shape-tool'>
                <div className='shape-tool-wrap' onClick={this.handleClick}>
                    <div className='shape-icon' data-type='shape'>
                        <i className='iconfont icon-liubianxing' />
                    </div>
                    <div className='shape-title'>形状</div>
                    <ShapeSelector
                      onSelectShape={this.handleSelect}
                      onClose={this.handleClick}
                      visible={this.state.modelVisible}
                  />
                </div>
            </div>
        )
    }
}

export default CSSModules(Shape, Style);
