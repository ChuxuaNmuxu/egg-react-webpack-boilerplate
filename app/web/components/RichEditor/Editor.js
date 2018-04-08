// import React, {Component, PropTypes} from 'react';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {indexOf, pick, isEqual} from 'lodash';
import {message} from 'antd';
import draftToHtml from 'draftjs-to-html';

import styles from './Editor.scss';
import Utils from '../../utils';
import config from '../../../config';
import api from '../../utils/api';
import Helper from './Helper';

// wysiwyg自带属性
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

// 本组件默认配置
const defaultToolbar = {
    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'image'],
    inline: {
        inDropdown: true,
        options: ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript']
    },
    blockType: {
        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']
    },
    fontFamily: {
        options: ['黑体', '宋体', '楷体', '隶书']
    },
    fontSize: {
        options: [12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96]
    },
    list: { inDropdown: true },
    textAlign: { inDropdown: true },
    image: {
        alignmentEnabled: false
    },
    colorPicker: {
        // icon: color,
        // className: undefined,
        // component: undefined,
        // popupClassName: undefined,
        colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
            'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
            'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
            'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
            'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
            'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)', 'rgba(0,0,0,0)']
    }
};

// 阅读器中的placeholder
const viewerPlaceholder = (placeholder) => {
    return `<div class="viewer-placeholder">${placeholder}</div>`;
}

/**
 * 自定义富文本组件
 */
class RichEditor extends Component {
    constructor (props) {
        super(props);

        const content = this.props.content || '';
        const editorState = Helper.convertFromContent(content, this.props.contentType);
        this.oldEditorState = editorState;
        this.state = {
            editorState
        }

        this.onChange = this.onChange.bind(this);
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.onViewerClick = this.onViewerClick.bind(this);
        this.uploadImageCallBack = this.uploadImageCallBack.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.content !== this.props.content) {
            const content = nextProps.content || '';
            this.state = {
                editorState: Helper.convertFromContent(content, nextProps.contentType)
            }
        }
    }

    onChange (content) {
        if (!isEqual(convertToRaw(this.oldEditorState.getCurrentContent()), content)) {
            const {onChange, contentType} = this.props;
            onChange(contentType === 'html' ? draftToHtml(content) : content);
        }
    }

    onEditorStateChange (editorState) {
        const {onEditorStateChange} = this.props;
        this.oldEditorState = this.state.editorState;
        this.setState({
            editorState
        }, () => onEditorStateChange && onEditorStateChange(editorState));
    }

    /**
     * 只读层点击事件
     * @param {*} e 事件
     */
    onViewerClick (e) {
        const {onViewerClick} = this.props;
        onViewerClick && onViewerClick(e);
    }

    /**
     * 上传图片
     * @param {*} file
     */
    uploadImageCallBack (file) {
        const {uploadCallback} = this.props;
        if (uploadCallback) {
            return uploadCallback(file);
        }
        let me = this;
        return new Promise((resolve, reject) => {
            if (indexOf(['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp'], file.type) < 0) {
                reject(new Error('不支持该格式图片上传'));
            } else {
                Utils.compressImg(file, {
                    width: 800,
                    returnType: 'blob',
                    success: (result) => {
                        if (me.props.imgUploadMode === 'locale') {
                            resolve({data: {link: result['base64']}});
                        } else {
                            let uploadFormData = new FormData();
                            uploadFormData.append('uploadedFile', result.blob, file.name);
                            api.post(config.apiResolve('cjyun', 'unverify/fileUpload.cbp', 'file'), uploadFormData, 'file').then((json) => {
                                if (json.code === 0) {
                                    resolve({data: {link: config.apiResolve('cjyun', json.data)}});
                                } else {
                                    reject(new Error(`请求失败：${json.code} ${json.data}`));
                                }
                            })
                        }
                    }
                });
            }
        }).catch(err => message.error(err.message));
    }

    stopPropagation (e) {
        e.stopPropagation();
    }

    /**
     * 阅读视图界面渲染
     */
    renderViewer () {
        const {editorState} = this.state;
        const {placeholder} = this.props;
        const hasText = editorState.getCurrentContent().hasText()
        return hasText ? Helper.convertToHtml(editorState) : (placeholder ? viewerPlaceholder(placeholder) : '<p></p>');
    }

    render () {
        const props = pick(this.props, wysiwygProps);
        const {editorClassName, className, mode} = this.props;
        // const {editorClassName, className} = this.props;
        const {editorState} = this.state;
        const toolbar = Object.assign(defaultToolbar, this.props.toolbar);
// const mode = ''
        return (
            <div
              styleName='rich-editor'
              className={'rich-editor' + (className ? ` ${className}` : '')}
            //  onMouseMove={this.stopPropagation}
            //  onMouseDown={this.stopPropagation}
            //  onMouseUp={this.stopPropagation}
              style={{fontSize: 18}}>
                <div className='rich-editor-wrapper'>
                    {
                        mode === 'view'
                        ? <div
                          className='viewer-content'
                          dangerouslySetInnerHTML={{__html: this.renderViewer()}}
                          onClick={this.onViewerClick} />
                        : <div
                          onMouseDown={this.stopPropagation}
                          onMouseMove={this.stopPropagation}
                          onCopy={this.stopPropagation}
                          onPaste={this.stopPropagation}
                          >
                            <Editor {...props}
                              locale='zh'
                              editorState={editorState}
                              onChange={this.onChange}
                              onEditorStateChange={this.onEditorStateChange}
                              editorClassName={'editor-content' + (editorClassName ? ` ${editorClassName}` : '')}
                              toolbarClassName='courseware-editor-toolbar'
                              uploadCallback={this.uploadImageCallBack}
                              toolbar={toolbar} />
                        </div>
                    }
                </div>
            </div>
        )
    }
}

RichEditor.propTypes = {
    content: PropTypes.string,
    contentType: PropTypes.oneOf(['row', 'html']), // 值类型
    mode: PropTypes.oneOf(['edit', 'view']), // 组件模式
    imgUploadMode: PropTypes.oneOf(['upload', 'locale']), // 图片上传模式
    onChange: PropTypes.func, // 内容变化时触发，会往回调传当前值，该值类型与contentType一致
    onViewerClick: PropTypes.func, // 视图点击事件
    className: PropTypes.string,
    // ----------------------------------
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
    ariaHasPopup: PropTypes.string
}

RichEditor.defaultProps = {
    mode: 'edit',
    imgUploadMode: 'upload'
}

export default CSSModules(RichEditor, styles);
