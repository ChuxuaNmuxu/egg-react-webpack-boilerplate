import React from 'react';
import PropTypes from 'prop-types';
import {Map} from 'immutable';
import ReactDOM from 'react-dom';

import Block from './Block';
import RichEditor from '../../../../components/RichEditor';
import {saveTextContent, textResize, editorActive} from '../../../../actions/courseware';
// import DispatchAfterResize from './DispatchAfterResize/DispatchAfterResize'
// import Utils from '../../../../utils';
// import { convertToRaw } from 'draft-js';
/**
 * 文本元素块
 */
class TextBlock extends React.Component {
    constructor (props) {
        super(props);
        // const {me} = props;
        // const content = me.get('content');

        this.state = {
            mode: 'view'
            // content
        }

        this.onChange = this.onChange.bind(this);
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
    }
    onChange (value) {
        console.log(value);
        this.textValue = value
    }
    onEditorStateChange (value) {
        // 目前没发现什么用
        console.log(585, value);
    }

    handleBlur () {
        const {dispatch, index, groupIndex, me} = this.props;
        const text = ReactDOM.findDOMNode(this.text); // 文本元素的dom节点

        this.setState({
            mode: 'view'
        })
        if (this.textValue != null && me.get('content') !== this.textValue) {
            dispatch(saveTextContent(Map({
                index: index,
                groupIndex: groupIndex,
                content: this.textValue
            })))
        }
        if (me.getIn(['props', 'size', 'height']) !== text.offsetHeight) {
            dispatch(textResize(Map({
                index: index,
                groupIndex: groupIndex,
                height: text.offsetHeight
            })))
        }
    }

    handleFocus () {
        const {dispatch, index, groupIndex, me} = this.props;
        this.setState({
            mode: 'edit'
        }, () => {
            document.querySelector('.editor-content').click()
        })
        dispatch(editorActive(Map({
            index: index,
            groupIndex: groupIndex,
            blockId: me.get('id')
        })))
    }

    render () {
        const {me} = this.props;
        const content = me.get('content');

        return (
            <Block {...this.props} handleFocus={this.handleFocus} ref={e => { this.text = e }}>
                <div className='text-editor' data-type='text'>
                    <RichEditor
                      mode={this.state.mode}
                      editorClassName='question-editor'
                      toolbar={{
                          options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'textAlign', 'colorPicker']
                      }}
                      onChange={this.onChange}
                      onViewerClick={this.handleFocus}
                      onBlur={() => this.handleBlur()}
                      content={content}
                      contentType='html'
                      placeholder='请输入文字'
                        />
                </div>
            </Block>
        )
    }
}

TextBlock.propTypes = {
    me: PropTypes.object,
    dispatch: PropTypes.func,
    index: PropTypes.number,
    groupIndex: PropTypes.number
}

export default TextBlock;
