import React, {Component} from 'react';
import PropTypes from 'prop-types';

import RichEditor from '../../../../../components/RichEditor';
import {onContextMenu} from '../../../../../components/ContextMenu';
import OptionMenu from './OptionMenu';
import {Map} from 'immutable';

class Td extends Component {
    constructor (props) {
        super(props);

        this.state = {
            visible: false,
            mode: 'view',
            saveValue: true
        }

        this.handleBlur = this.handleBlur.bind(this);
        this.onChange = this.onChange.bind(this);
        // this.handleRankChange = this.handleRankChange.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
    }

    onChange (value) {
        console.log(24)
        this.textValue = value;
    }

    onEditorStateChange (value) {
        // 目前没发现什么用
        console.log(value);
    }

    handleBlur () {
        const {index, handleTableChange, me} = this.props;
        const {rowIndex, columnIndex} = index;
        this.setState({
            mode: 'view'
        }, () => {
            if (me.getIn(['tableArr', rowIndex, columnIndex]) !== this.textValue) {
                handleTableChange(index, this.textValue);
            }
        })
    }

    handleFocus = () => {
        this.setState({
            mode: 'edit'
        }, () => {
            document.querySelector('.editor-content').click()
        })
    }

    onContextMenu (e) {
        onContextMenu(e, (
            <OptionMenu dispatch={this.props.dispatch} index={this.props.index} />
        ));
    }

    render () {
        const {index, content = ''} = this.props;
        const tdContent = Map.isMap(content) ? content.get('value') : content;
        return (
            <td style={{position: 'relative', verticalAlign: 'middle'}} onContextMenu={this.onContextMenu}>
                <RichEditor
                  styleName='simple-editor'
                  type='table'
                  toolbar={{
                      options: ['inline', 'blockType', 'fontSize', 'textAlign', 'colorPicker']
                  }}
                  index={index}
                  mode={this.state.mode}
                  onChange={this.onChange}
                  onBlur={() => this.handleBlur()}
                  onViewerClick={this.handleFocus}
                //   handleRankChange={this.handleRankChange}
                  content={tdContent}
                  contentType='html'
                  placeholder='&nbsp;'
                />
            </td>
        )
    }
}

Td.propTypes = {
    index: PropTypes.object,
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),
    dispatch: PropTypes.func,
    saveHtml: PropTypes.func,
    me: PropTypes.object,
    handleTableChange: PropTypes.func
}

export default Td;
