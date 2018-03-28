/**
 * 形状选择框组件
 * */
import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import Styles from './ShapeSelector.scss';
import ShapeSvg from '../../Block/ShapeBlock/ShapeSvg/index';

class ShapeSelector extends React.PureComponent {
    static displayName = 'ShapeSelector';

    static propTypes = {
        visible: PropTypes.bool,
        onSelectShape: PropTypes.func,
        onClose: PropTypes.func
    };

    static defaultProps = {
        onSelectShape: (shape) => null
    };

    constructor (props) {
        super(props);
        this.state = {};
    }

    // 选择图形
    handleShapeSelect = ({shape}) => {
        // Message.info(`您选中的图形是：${shape}`);
        const { onSelectShape, onClose } = this.props;
        onClose && onClose(null);
        onSelectShape && onSelectShape(shape);
    }

    // 关闭选择器
    handleClose = (event) => {
        const { onClose } = this.props;
        onClose && onClose(event);
    }

    // 创建形状列表视图
    createShapeListView = (values = {}) => {
        return Object.keys(values).map((value, index) => {
            const ShapeComponent = ShapeSvg[value];
            return (
                <div
                  className='shape-view'
                  key={index}
                  onClick={(event) => this.handleShapeSelect({event: event, shape: value})}
                >
                    <ShapeComponent />
                </div>
            );
        })
    }

    render () {
        const { visible } = this.props;
        const shapeListView = this.createShapeListView(ShapeSvg);
        return (
            <div className='shape-selector' id='shape-selector' styleName='shape-selector'>
                <Modal
                  title='选择添加的形状'
                  visible={visible}
                  onCancel={this.handleClose}
                  footer={null}
                  getContainer={() => document.getElementById('shape-selector')}
                >
                    <div className='shape-selector-wrap'>
                        {shapeListView}
                    </div>
                </Modal>
            </div>
        )
    }
}

export default CSSModules(ShapeSelector, Styles);
