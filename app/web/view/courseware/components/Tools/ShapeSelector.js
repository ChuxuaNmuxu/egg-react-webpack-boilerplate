import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';

import shape from '../Block/ShapeBlock/ShapeSvg';

class ShapeSelector extends React.Component {
    constructor (props) {
        super(props);
        this.handleShapeSelect = this.handleShapeSelect.bind(this);
    }

    // 选择图形
    handleShapeSelect (shape) {
        // Message.info(`您选中的图形是：${shape}`);
        const {handleVisible, addBlock} = this.props;
        handleVisible();
        addBlock(shape);
    }

    render () {
        const {handleVisible, visible} = this.props;
        return <Modal
          title='选择添加的形状'
          visible={visible}
          onOk={handleVisible}
          onCancel={handleVisible}
          footer={null}
            >

            <div className='tool-shape'>
                {
                        Object.keys(shape).map((value, index) => {
                            const ShapeComponent = shape[value];
                            return <div className='select-shape'
                              key={index}
                              onClick={() => { this.handleShapeSelect(value) }}
                                >
                                <ShapeComponent />
                            </div>
                        })
                    }
            </div>
        </Modal>
    }
}

ShapeSelector.propTypes = {
    visible: PropTypes.bool,
    selectShape: PropTypes.func,
    handleVisible: PropTypes.func,
    addBlock: PropTypes.func
}

export default ShapeSelector;
