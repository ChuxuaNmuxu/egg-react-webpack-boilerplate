import { EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {isString} from 'lodash';

/**
 * 富文本编辑器帮助类
 */
const Helper = {
    /**
     * 从内容转成EditorState
     */
    convertFromContent: (content, type = 'raw') => {
        if (content) {
            try {
                if (type === 'html') {
                    const blocksFromHTML = htmlToDraft(content);
                    content = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks);
                } else {
                    content = convertFromRaw(isString(content) ? JSON.parse(content) : content);
                }
            } catch (e) {
                content = ContentState.createFromText(content.toString());
            }
            return EditorState.createWithContent(content);
        }
        return EditorState.createEmpty();
    },

    /**
     * 从EditorState转化成内容
     */
    convertToContent: (editorState, type = 'raw') => {
        const raw = convertToRaw(editorState.getCurrentContent());
        return type === 'html' ? draftToHtml(raw) : JSON.stringify(raw);
    },

    /**
     * 从EditorState转化成html
     */
    convertToHtml: (editorState) => {
        return Helper.convertToContent(editorState, 'html');
    }
}

export default Helper;
