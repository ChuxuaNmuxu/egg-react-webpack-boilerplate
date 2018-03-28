import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import draftToHtml from 'draftjs-to-html';
import CSSModules from 'react-css-modules';
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {pick} from 'lodash';
// import {message} from 'antd';
import styles from './RichEditor.scss';

import Utils from '../../../../utils';
import CompatEditor from './CompatEditor';
// import config from '../../../config';
// import api from '../../utils/api';
const wysiwygProps = [
    // 'onChange',
    'onContentStateChange',
    'initialContentState',
    'defaultContentState',
    'contentState',
    'defaultEditorState',
    'toolbarOnFocus',
    'spellCheck',
    'stripPastedStyles',
    'toolbarClassName',
    'editorClassName',
    'wrapperClassName',
    'toolbarStyle',
    'editorStyle',
    'wrapperStyle',
    'uploadCallback',
    'onFocus',
    'onBlur',
    'mention',
    'textAlignment',
    'readOnly',
    'tabIndex',
    'placeholder',
    'ariaLabel',
    'ariaOwneeID',
    'ariaActiveDescendantID',
    'ariaAutoComplete',
    'ariaDescribedBy',
    'ariaExpanded',
    'ariaHasPopup'
];
class RichEditor extends Component {
    constructor (props) {
        super(props);
        const content = this.props.content || '';

        const blocksFromHTML = convertFromHTML(content);
        const contentState = ContentState.createFromBlockArray(blocksFromHTML);
        const editorState = EditorState.createWithContent(contentState)
        // const editorState = Utils.convertFromContent(content);
        this.oldEditorState = editorState;
        this.state = {
            editorState
        }
        this.onChange = this.onChange.bind(this);
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        // this.uploadImageCallBack = this.uploadImageCallBack.bind(this);
    }
    componentWillReceiveProps (nextProps) {
        // debugger
        if (nextProps.content !== this.props.content) {
            const content = nextProps.content || '';
            const blocksFromHTML = convertFromHTML(content);
            const contentState = ContentState.createFromBlockArray(blocksFromHTML);
            this.state = {
                editorState: EditorState.createWithContent(contentState)
                // editorState: Utils.convertFromContent(content)
            }
        }
    }
    onChange (value) {
        // if (!isEqual(convertToRaw(this.oldEditorState.getCurrentContent()), value)) {
        value = Utils.convertToHtml(this.state.editorState); // 转化为html传出去
        this.props.onChange(value);
        // }
    }
    onEditorStateChange (editorState) {
        // console.log('onEditorStateChange', editorState);
        const {onEditorStateChange} = this.props;
        this.oldEditorState = this.state.editorState;
        this.setState({
            editorState
        }, () => onEditorStateChange && onEditorStateChange(editorState));
    }
    // uploadImageCallBack (file) {
    //     let me = this;
    //     return new Promise((resolve, reject) => {
    //         if (indexOf(['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp'], file.type) < 0) {
    //             reject(new Error('不支持该格式图片上传'));
    //         } else {
    //             Utils.compressImg(file, {
    //                 width: 800,
    //                 returnType: 'blob',
    //                 success: (result) => {
    //                     if (me.props.imgUploadMode === 'locale') {
    //                         resolve({data: {link: result['base64']}});
    //                     } else {
    //                         let uploadFormData = new FormData();
    //                         uploadFormData.append('uploadedFile', result.blob, file.name);
    //                         api.post(config.apiResolve('cjyun', 'unverify/fileUpload.cbp', 'file'), uploadFormData, 'file').then((json) => {
    //                             if (json.code === 0) {
    //                                 resolve({data: {link: config.apiResolve('cjyun', json.data)}});
    //                             } else {
    //                                 reject(new Error(`请求失败：${json.code} ${json.data}`));
    //                             }
    //                         })
    //                     }
    //                 }
    //             });
    //         }
    //     }).catch(err => message.error(err.message));
    // }

    render () {
        const props = pick(this.props, wysiwygProps);
        const {editorClassName, toolbar, mode, handleBlur, handleFocus, index, type, initialContent, handleRankChange} = this.props;
        let {editorState} = this.state;
        const defaultToolbar = {
            // options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'image'],
            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker'],
            inline: {
                inDropdown: true,
                options: ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript']
            },
            blockType: {
                options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']
            },
            fontSize: {
                options: ['12', '14', '16', '18', '24', '30', '36', '48', '60', '72', '96']
            },
            fontFamily: {
                options: ['黑体', '宋体', '楷体', '隶书']
            },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            image: {
                alignmentEnabled: false
            }
        };
        const viewContent = convertToRaw(editorState.getCurrentContent());
        let contentEmpty = true;
        viewContent.blocks.forEach((block, index) => {
            if (block.text !== '') contentEmpty = false
        })
        const contentHtml = contentEmpty ? initialContent : Utils.convertToHtml(editorState);
        // console.log(89, mode)
        return (
            <div styleName='rich-editor' className='rich-editor' >
                {
                    mode === 'editor'
                    ? <CompatEditor index={index} type={type} handleRankChange={handleRankChange}>
                        <Editor {...props}
                          locale='zh'
                        // toolbarHidden // 控制工具栏的显示隐藏 (默认隐藏)
                        // 开始编辑的时候自动弹出工具栏
                          toolbarOnFocus
                        /* toolbarClassName="demo-toolbar"
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor" */
                          editorState={editorState}
                          onChange={this.onChange}
                          onEditorStateChange={this.onEditorStateChange}
                          editorClassName={'editor-content' + (editorClassName && ` ${editorClassName}`)}
                          toolbarClassName='editor-toolbar'
                          onBlur={handleBlur}
                          textAlignment='left'
                          onMouseDown={this.handlleMouseDown}
                        // uploadCallback={this.uploadImageCallBack}
                          toolbar={toolbar || defaultToolbar} />
                    </CompatEditor>
                    : <div className='viewer-content' dangerouslySetInnerHTML={{__html: contentHtml}} onClick={handleFocus} />
                }
            </div>
        )
    }
}
RichEditor.propTypes = {
    content: PropTypes.string,
    mode: PropTypes.string,   // 'edit' || 'view',
    imgUploadMode: PropTypes.string,    // 'upload' || 'locale'
    onChange: PropTypes.func,
    onEditorStateChange: PropTypes.func,
    onContentStateChange: PropTypes.func,
    // initialContentState is deprecated
    initialContentState: PropTypes.object,
    defaultContentState: PropTypes.object,
    contentState: PropTypes.object,
    editorState: PropTypes.object,
    defaultEditorState: PropTypes.object,
    toolbarOnFocus: PropTypes.bool,
    spellCheck: PropTypes.bool,
    stripPastedStyles: PropTypes.bool,
    toolbar: PropTypes.object,
    toolbarClassName: PropTypes.string,
    editorClassName: PropTypes.string,
    wrapperClassName: PropTypes.string,
    toolbarStyle: PropTypes.object,
    editorStyle: PropTypes.object,
    wrapperStyle: PropTypes.object,
    uploadCallback: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    mention: PropTypes.object,
    textAlignment: PropTypes.string,
    readOnly: PropTypes.bool,
    tabIndex: PropTypes.number,
    placeholder: PropTypes.string,
    ariaLabel: PropTypes.string,
    ariaOwneeID: PropTypes.string,
    ariaActiveDescendantID: PropTypes.string,
    ariaAutoComplete: PropTypes.string,
    ariaDescribedBy: PropTypes.string,
    ariaExpanded: PropTypes.string,
    ariaHasPopup: PropTypes.string,
    handleBlur: PropTypes.func,
    handleFocus: PropTypes.func,
    index: PropTypes.object,
    type: PropTypes.string,
    initialContent: PropTypes.string,
    handleRankChange: PropTypes.func
}
RichEditor.defaultProps = {
    mode: 'edit',
    imgUploadMode: 'upload'
}
export default CSSModules(RichEditor, styles);
