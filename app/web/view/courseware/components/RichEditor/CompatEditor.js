import React, {Component} from 'react';
import { Popover } from 'antd';
import OptionMenu from './OptionMenu';
import PropTypes from 'prop-types';

class CompatEditor extends Component {
    constructor (props) {
        super(props);

        this.state = {
            visible: false,
            toolbar: {
                // options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'image'],
                options: ['inline', 'blockType', 'fontSize', 'textAlign'],
                inline: {
                    inDropdown: true,
                    options: ['bold', 'italic', 'underline']
                },
                blockType: {
                    options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']
                },
                textAlign: { inDropdown: true }
            }
        }
    }

    hide = () => {
        this.setState({
            visible: false
        });
    }
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    }

    hanldeMouseDown = (e) => {
        e.stopPropagation();
    }

    handleMouseMove = (e) => {
        e.stopPropagation();
    }

    render () {
        const {type, children, index, handleRankChange} = this.props;
        const {toolbar, content} = this.state;

        if (type === 'table') {
            return (
                <Popover
                  content={<OptionMenu index={index} visible={this.state.visible} handleRankChange={handleRankChange} />}
                  trigger='focus'
                  placement='rightTop'
                  visible={this.state.visible}
                  onVisibleChange={this.handleVisibleChange}
                >
                    <div onMouseDown={this.hanldeMouseDown} onMouseMove={this.handleMouseMove}>
                        {
                        React.cloneElement(children, {toolbar, content})
                    }
                    </div>
                </Popover>
            )
        } else {
            return <div onMouseDown={this.hanldeMouseDown} onMouseMove={this.handleMouseMove}>
                {children}
            </div>
        }
    }
}

CompatEditor.propTypes = {
    type: PropTypes.string,
    children: PropTypes.node,
    index: PropTypes.object,
    handleRankChange: PropTypes.func
}

export default CompatEditor;
