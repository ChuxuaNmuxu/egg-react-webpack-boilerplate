import {Base64} from 'js-base64';
import Cookies from 'js-cookie';
import uuid from 'uuid';
import {merge} from 'lodash';

import {createNewSlide, createNewLink} from './courseware/helper';
// import pptData from '../view/courseware/components/play/dataTransform'; // 测试后台数据

let visitor = Cookies.get('visitor');
try {
    visitor = visitor && JSON.parse(Base64.decode(visitor.replace(/ /g, '+')));
} catch (e) {
    visitor = null;
}
// window.visitor = visitor;
const isAdmin = Cookies.get('isAdmin');
const id = uuid.v4();
export default {
    // 账号
    account: {
        visitor: visitor,
        isAdmin: parseInt(isAdmin),                   // 0代表不是管理员，1代表系统管理员，2代表学校管理员
        isLoggedOut: false
    },

    course: {
        // 这里存放科目
        subject: {
            isFetching: false,
            meta: {
                firstValue: undefined,
                firstValueId: undefined
            },
            data: []
        },
        // 对应科目的章节
        knowledge: {
            isFetching: false,
            meta: {
                subjectId: 0
            },
            data: []
        },
        // 这里存放具体的课件,内容是根据所选科目的章节确定的(具体实现应该传对应科目的ID,和对应具体节的ID)
        courseData: {
            isFetching: false,
            meta: {
                subjectId: 0
            },
            data: {
                items: []
            }
        },
        // 这里存放上传课件所需的知识点数据，在第一次请求时拿到所有的知识点数据，处理后供上传课件部分使用
        uploadKnowledge: {
            isFetching: false,
            data: [],
            lastKnowledge: []
        },
        // 这里放上传课件后的返回情况
        uploadCourse: {
            isFetching: false,
            data: null
        }
    },

    courseware: {
        title: '课件名称',
        current: {
            stateTransformed: false, // 初始化数据的标志
            totalSlides: 1,  // 总的slide数
            isDraging: false,   // 是否有block正在在被拖拽的标识
            isCrop: false,   // 是否正在裁剪图片的标识
            isResizing: false,  // 是否有block正在改变block大小的标识
            isRotating: false,  // 是否有block可旋转的标识
            isEditing: false,   // 是否有blick在编辑的的标识
            isGroupSelect: false,   // 是否圈选
            linkIndex: 0, // 当前操作的teachingLink索引
            slideIndex: 0,  // 当前操作的slide页数
            blockIndex: [], // 当前操作的blockIndex
            teachLinkId: '',  // 当前操作teachLink对象ID
            slideId: '',  // 当前操作slide对象的ID
            blocks: [], // 当前操作的blocks
            snapBounds: [], // 用于snap计算的block的位置信息
            snapGuides: [], // snap导航线的状态数组
            cropSelector: [],
            initPageX: 0,   // 鼠标位置横坐标
            initPageY: 0,   // 鼠标当前位置纵坐标
            shiftKey: false, // 是否按住shift键操做，多选
            zIndexs: [],  // block的层级
            memberZIndexs: [], // 组合习题中元素的层级
            copys: [],   // 当前block的拷贝
            preview: false, // 预览模式
            // groupCreating: false // 生成group类型的block的标识
            questionOverNumber: ''
        },
        index: {    // 各种索引
            slides: {},
            blocks: {}
        },
        ppt: {
            // 当前属性
            props: {
                style: {},
                animation: {}  // 动画
            },
            // 卡片列表
            slides: [createNewSlide(id).toJS()],
            // 环节列表
            teachingLinks: [merge(createNewLink(id).toJS(), {
                slides: ['slide-' + id]
            })],
            // 练习列表
            exercises: []
        }
    },

    hamster: {
        blocks: [],
        current: {
            blocks: []
        }
    }
};
