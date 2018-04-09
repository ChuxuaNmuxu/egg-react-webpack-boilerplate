import React from 'react';
import Reveal from 'reveal.js';
// let reveal = {}
import CSSModules from 'react-css-modules';
import domtoimage from 'dom-to-image';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import styles from './editor.scss';
import PPTHeader from './components/Header';
import PPTTools from './components/Tools';
import Navbar from './components/Navbar';
import PropsBar from './components/PropsBar';
import {List, Map} from 'immutable';

import Crop from './components/Crop/Crop';
import Viewport from './components/Viewport';
import Tips from './components/Tips'
import PreviewTools from './components/PreviewTools';
import utils from '../../utils/utils';
import {
    arrowEvent, timingSavePPT,
    unmountInitState, deleteBlock,
    changeSlideIndex, selectAll,
    addSlide, deleteSlide
} from '../../actions/courseware';
import * as courseEntryActions from '../../actions/courseEntry';
import { ActionCreators } from 'redux-undo'; // 撤销恢复插件的action
import {SLIDE_HEIGHT, SLIDE_WIDTH, REAL_TIME_SAVE_COURSE, EMPTY_SLIDE_THUMNAIL} from './config/constant';
import PPTHeaderV2 from './components/HeaderV2';
import Text from './components/ToolsV2/InjectTextTool';
import Shape from './components/ToolsV2/InjectShapeTool';
import Image from './components/ToolsV2/InjectImageTool';
import BackOut from './components/ToolsV2/Backout';

// const SLIDE_WIDTH = 1120;
// const SLIDE_HEIGHT = 630;

class PPTEditor extends React.PureComponent { // 入口用pure组件关注整个courseware变化，在子组件中用connect注入props的用pure组件
    constructor (props) {
        super(props);
        this.state = {
            revealScale: 1,
            timingToSavePPT: '所有更改已保存',
            courseId: '',
            currentSlide: null,
            // guides: new Array(6).fill(null),
            guides: List().setSize(6),
            courseware: null,
            moveCoor: {},
            layoutChange: {
                rightBar: 'right-out', // right-in
                leftBar: 'left-out', // left-in
                toolbar: 'tool-out', // tool-in
                header: 'header-out' // header-in
            },
            loading: true
        }

        this.onSlideKeyPress = this.onSlideKeyPress.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        // 控制 Reveal.scale
        this.handleToRevealScale = this.handleToRevealScale.bind(this);
        // 保存ppt
        this.timingToSavePPT = this.timingToSavePPT.bind(this);
        this.timingToSavePPTSetState = this.timingToSavePPTSetState.bind(this);
        this.coverSnapshoot = this.coverSnapshoot.bind(this);
        this.quitPPT = this.quitPPT.bind(this);
        // 改变布局
        this.layoutChange = this.layoutChange.bind(this);
        this.preview = this.preview.bind(this);
        this.exitPreview = this.exitPreview.bind(this);
    }
    
    componentDidMount () {
        // import Reveal from 'reveal.js';
        // Reveal = require('reveal.js').default;
        window.Reveal = Reveal;
        Reveal.initialize({
            minScale: this.state.revealScale,
            maxScale: this.state.revealScale,
            width: SLIDE_WIDTH,
            height: SLIDE_HEIGHT,
            backgroundTransition: 'fade',
            history: true,
            keyboard: false,
            touch: false,
            controls: false
        });

        // 监听键盘事件

        // 把url里的id保存至局部state
        this.setState({
            courseId: this.props.match.params.id
        }, () => {
            // this.props.dispatch(courseEntryActions.getEditCourseData(this.state.courseId)).then(() => {
            //     // 在获取数据之前禁用键盘事件
            //     document.addEventListener('keydown', this.onSlideKeyPress, false);
            //     window.addEventListener('resize', this.onWindowResize, false);
            //     this.onWindowResize();
            //     this.setState({
            //         loading: false
            //     })
            //     Reveal.sync();
            // })
            document.addEventListener('keydown', this.onSlideKeyPress, false);
            window.addEventListener('resize', this.onWindowResize, false);
            this.onWindowResize();
            this.setState({
                loading: false
            })
            Reveal.sync();

        });

        // window.location.hash = '/0'
        Reveal.addEventListener('slidechanged', (event) => {
            // event.previousSlide, event.currentSlide, event.indexh, event.indexv
            // console.log(88, this.props)// const {dispatch, courseware: {current: {slideIndex}}} = _this.props; // TODO: this的指向

            const {dispatch, courseware} = this.props;
            const slideIndex = courseware.getIn(['current', 'slideIndex']);
            slideIndex === event.indexh || dispatch(changeSlideIndex(Map({slideIndex: event.indexh})));
            // window.location.hash = `/${event.indexh}`;
        });
    }

    componentWillUnmount () {
        const slide = document.querySelector('.ppt-viewport');
        slide.removeEventListener('keydown', this.onSlideKeyPress, false);

        clearTimeout(this.saveTimer);

        console.log('离开editor组件');
        this.props.dispatch(unmountInitState());
    }

    componentWillReceiveProps (nextProps, nextState) {
        // 刷新卡片thumnail
        // this.refreshSlideThumnail(nextProps, nextState); TODO: 暂时注释
        // TODO: 保存到服务器
        console.log('editor reveive props')
        this.timingToSavePPT(nextProps, nextState);
    }

    preview () {
        this.setState({
            layoutChange: {
                rightBar: 'right-in', // right-in
                leftBar: 'left-in', // left-in
                toolbar: 'tool-in', // tool-in
                header: 'header-in' // header-in
            },
            preview: true
        }, () => {
            Reveal.sync();
        })
    }

    exitPreview (e) {
        this.setState({
            layoutChange: {
                rightBar: 'right-out', // right-in
                leftBar: 'left-out', // left-in
                toolbar: 'tool-out', // tool-in
                header: 'header-out' // header-in
            },
            preview: false
        }, () => {
            Reveal.sync();
        })
    }

    // 定时保存
    timingToSavePPT (nextProps, nextState) {
        const { courseware: prevCourseware } = this.props;
        const {courseware} = nextProps;
        if (prevCourseware.getIn(['current', 'stateTransformed']) && !courseware.get('ppt').equals(prevCourseware.get('ppt'))) {
            clearTimeout(this.timingSave);
            this.timingSave = setTimeout(() => {
                this.timingToSavePPTSetState(nextProps.courseware.get('ppt'), this.state.courseId, '');
            }, REAL_TIME_SAVE_COURSE);
        }
    }

    // 生成ppt首页封面
    coverSnapshoot (courseware) {
        const {uploadGetParams} = this.props;
        const defaultImg = EMPTY_SLIDE_THUMNAIL;
        const slide = courseware.getIn(['ppt', 'slides', 0]); // 首页卡片
        const image = slide.getIn(['props', 'background', 'image']);
        const color = slide.getIn(['props', 'background', 'color']);

        let backgroundImage = color ? (image === defaultImg ? '' : `url(${image})`) : `url(${image || defaultImg})`;

        const createFile = domtoimage.impl.inliner.inlineAll(backgroundImage)
            .then(backgroundImage => {
                const style = {
                    margin: 0,
                    overflow: 'hidden',
                    width: SLIDE_WIDTH,
                    height: SLIDE_HEIGHT,
                    backgroundColor: color || 'transparent',
                    backgroundImage,
                    backgroundPosition: '50% 50%',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    opacity: 1,
                    transform: 'none'
                };
                const filter = node => ['eb-transform'].indexOf(node.className) === -1;
                const options = {filter: filter, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, style}
                return domtoimage.toBlob(document.querySelector('.ppt-home-page'), options)
            })
        const getOssParams = uploadGetParams() // 请求阿里云参数
            .then(res => {
                if (res.code === 0) { // 请求阿里云参数成功
                    const {data} = res;
                    const uploadData = {
                        key: data.objectKey,
                        OSSAccessKeyId: data.accessId,
                        callback: data.callback,
                        signature: data.signature,
                        success_action_status: 200,
                        policy: data.policy,
                        'x:filename': `1.png`
                    }
                    return {
                        updataUrl: data.uploadUrl,
                        uploadData
                    }
                } else {
                    throw new Error(res)
                }
            })
        return Promise.all([createFile, getOssParams])
            .then(res => {
                const blob = res[0];
                const {updataUrl, uploadData} = res[1];
                return utils.uploadImgToAli(updataUrl, blob, uploadData)
            })
            .catch(error => {
                throw new Error(error.type);
            })
    }

    // 提取出来 方便 保存的时候调用
    timingToSavePPTSetState (ppt, courseId, coverId) {
        const { dispatch } = this.props;
        this.setState({
            timingToSavePPT: '保存中...'
        });
        return dispatch(timingSavePPT(ppt, courseId, coverId)).then(res => {
            console.log(149, res);
            if (res.code === 0) {
                this.setState({
                    timingToSavePPT: '所有更改已保存'
                });
            }
            return res;
        }).catch(err => {
            console.log(err);
            return {err}
        })
    }

    // 控制Reveal 视图大小
    handleToRevealScale (args) {
        if (typeof args === 'number') {
            // console.log(this.state.revealScale);
            if (args < 0 && this.state.revealScale <= 0.2) {
                // Message.warn('已经到达最小！');
                return;
            }
            if (args > 0 && this.state.revealScale >= 4) {
                // console.log('达到最大!');
                return;
            }
            this.setState({
                revealScale: this.state.revealScale + args
            }, () => {
                this.revealScale(this.state.revealScale);
            })
        } else {
            this.setState({
                revealScale: 1
            }, () => {
                this.revealScale(this.state.revealScale);
            })
        }
    }

    revealScale (scale) {
        scale = scale || 1;
        Reveal.configure({
            minScale: scale,
            maxScale: scale
        });
        document.querySelector('.slide-container').style.zoom = scale;
    }

    componentDidUpdate (prevProps, prevState) {
        // const {slideIndex} = this.props.courseware.current;
        const {courseware} = this.props;
        const slideIndex = courseware.getIn(['current', 'slideIndex']);

        // const {slideIndex: prevSlideIndex} = prevProps.courseware.current;
        const prevSlideIndex = prevProps.courseware.getIn(['current', 'slideIndex'])
        if (slideIndex !== prevSlideIndex) {
            // 滑动到相应卡片
            Reveal.slide(slideIndex);
        }
    }

    /**
     * 窗口尺寸改变
     */
    onWindowResize (e) {
        clearTimeout(this.resizeTimer); // 节流
        this.resizeTimer = setTimeout(() => {
            const currentWidth = document.body.clientWidth || document.documentElement.clientWidth; // 可视区宽度
            let revealScale = (currentWidth - 595) / 1105; // 线性 1280 ~ 1700
            revealScale = revealScale > 0.62 ? revealScale : 0.62;
            revealScale = revealScale < 1 ? revealScale : 1;
            this.revealScale(revealScale);
        }, 300)
    }

    /**
     * 键盘事件
     */
    onSlideKeyPress (e) {
        if (e.target.tagName.toLowerCase() === 'input' || this.isEditing()) return false; // 编辑状态禁用后面的键盘事件
        const {dispatch, courseware, past, addSlide} = this.props;
        const key = e.key.toLowerCase();
        const isSelectBlock = courseware.getIn(['current', 'blocks']).size > 0; // 有元素被选中

        console.log(80, key)
        if (key === 's' && e.ctrlKey) { // 保存
            e.preventDefault()
            clearTimeout(this.saveTimer);
            this.saveTimer = setTimeout(() => { // 防止用户重复提交保存，多次连续保存，只提交最后一次
                this.timingToSavePPTSetState(courseware.get('ppt').toJS(), this.state.courseId, '')
            }, 300)
        } else if (key === 'delete') { // 删除元素
            if (!isSelectBlock) {
                dispatch(deleteSlide());
                Reveal.sync()
            }
            dispatch(deleteBlock());
        } else if (key === 'backspace') {
            dispatch(deleteBlock());
        } else if (key === 'z' && e.ctrlKey && e.shiftKey) { // 重做
            dispatch(ActionCreators.redo());
            Reveal.sync();
        } else if (key === 'z' && e.ctrlKey && past.length > 1) { // 后退
            dispatch(ActionCreators.undo());
            Reveal.sync();
        } else if (/arrowup|arrowdown|arrowleft|arrowright/.test(key)) { // 上下左右箭头控制元素位移
            if (isSelectBlock) {
                dispatch(arrowEvent(Map({
                    arrawDirection: key
                })))
            }
        } else if (key === 'a' && e.ctrlKey) {
            e.preventDefault()
            dispatch(selectAll())
        } else if (key === 'enter' && !isSelectBlock) {
            addSlide()
        }
    }

    isEditing () {
        const toolbar = document.querySelector('.courseware-editor-toolbar');
        return !!toolbar
    }

    layoutChange (change) {
        this.setState({
            layoutChange: Object.assign({}, this.state.layoutChange, change)
        })
    }

    quitPPT () {
        const {courseware} = this.props;
        return this.coverSnapshoot(courseware)
        .catch(() => {
            return {
                fileId: ''
            }
        })
        .then(data => {
            return this.timingToSavePPTSetState(courseware.get('ppt'), this.state.courseId, data.fileId);
        })
    }

    render () {
        const { courseware, dispatch, past, future, uploadGetParams, match:{params: {id}} } = this.props;
        const {layoutChange: {rightBar, leftBar, toolbar, header}, preview, loading} = this.state;
        const isCrop = courseware.getIn(['current', 'isCrop']);
        const noStyle = {
            display: 'none'
        };
        return (
            <div className='ppt-editor' styleName='ppt-editor'>
                <div className={loading ? 'ppt-loading' : 'ppt-loaded'}>
                    <Spin
                      spinning={loading}
                      size='large'
                      tip='加载数据...'
                    />
                </div>
                <div className='ppt-header-v2'>
                    <PPTHeaderV2
                      id={id}
                      title={courseware.get('title')}
                      toolsArea={[
                          <Text />,
                          <Shape />,
                          <Image />
                      ]}
                      operationArea={[
                          <BackOut />
                      ]}
                    />
                </div>
                <div className={`ppt-header ${header}`} style={noStyle}>
                    <PPTHeader
                      title={courseware.get('title')}
                      dispatch={dispatch}
                      timingToSavePPT={this.state.timingToSavePPT}
                      quitPPT={this.quitPPT}
                      preview={this.preview}
                      courseId={id}
                      courseware={courseware}
                    />
                </div>
                <div className={`ppt-toolbar ${toolbar}`} style={noStyle}>
                    <PPTTools
                      dispatch={dispatch}
                      ActionCreators={ActionCreators}
                      past={past}
                      future={future}
                      controlRevealScale={this.handleToRevealScale}
                      layoutChange={this.layoutChange}
                    />
                </div>
                <div className={`ppt-main ${header} ${toolbar}`}>
                    <div className={`sidebar-left ${leftBar}`}>
                        <Navbar layoutChange={this.layoutChange} />
                    </div>
                    <div className={`ppt-viewport ${rightBar} ${leftBar}`} >
                        <Viewport
                          courseware={courseware}
                          currentSlideIndex={courseware.getIn(['current', 'slideIndex'])}
                          dispatch={dispatch}
                          isEditing={this.isEditing}
                          uploadGetParams={uploadGetParams}
                          preview={preview}
                          exitPreview={this.exitPreview}
                        />
                    </div>
                    <div className={`sidebar-right ${rightBar}`} >
                        <PropsBar courseware={courseware} dispatch={dispatch} layoutChange={this.layoutChange} />
                    </div>
                </div>

                {isCrop ? <Crop courseware={courseware} dispatch={dispatch} uploadGetParams={uploadGetParams} /> : null}
                {preview && <PreviewTools exitPreview={this.exitPreview} />}
                <Tips />
            </div>
        )
    }
}
PPTEditor.propTypes = {
    courseware: PropTypes.object,
    dispatch: PropTypes.func,
    past: PropTypes.array,
    future: PropTypes.array,
    params: PropTypes.object,
    uploadGetParams: PropTypes.func,
    addSlide: PropTypes.func
}

const mapStateToProps = (state) => {
    // const courseware = fromJS(state.courseware.present);
    const { past, future } = state.courseware;
    let courseware = state.courseware.present;

    return {
        courseware,
        past,
        future
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        dispatch,
        uploadGetParams: () => dispatch(courseEntryActions.uploadGetParams()),
        addSlide: () => {
            dispatch(addSlide())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CSSModules(PPTEditor, styles));
