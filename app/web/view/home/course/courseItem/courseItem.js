import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './courseItem.scss';
import { connect } from 'react-redux';
import { Pagination, Button, Modal, Alert, Icon } from 'antd';
import moment from 'moment';
import config from '../../../../../config';
import ppt from '../../../../public/images/ppt.png';
import image from '../../../../public/images/img.png';
import pdf from '../../../../public/images/pdf.png';
import rar from '../../../../public/images/rar.png';
import video from '../../../../public/images/video.png';
import word from '../../../../public/images/word.png';
const confirm = Modal.confirm;

class CourseItem extends Component {
    constructor (props) {
        super(props);
        this.showConfirm = this.showConfirm.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
    }
    downloadFile (e) {               // 下载课件
        let nodeType = e.target.nodeName;        // 获取课件ID
        let courseId;
        if (nodeType === 'SPAN') {
            courseId = e.target.parentNode.getAttribute('data-id');
        } else if (nodeType === 'BUTTON') {
            courseId = e.target.getAttribute('data-id');
        }
        try {
            let elemIF = document.createElement('iframe');
            elemIF.src = config.apiResolve('cjcms', 'res/user/resource.do?id=' + courseId + '&token=' + this.props.token);
            elemIF.style.display = 'none';
            document.body.appendChild(elemIF);
        } catch (e) {
            console.log(e);
        }
    }

    showConfirm (e) {
        var this1 = this;
        const {items, page} = this.props.data;
        let nodeType = e.target.nodeName;    // 获取课件ID
        let courseId;
        if (nodeType === 'SPAN') {
            courseId = e.target.parentNode.getAttribute('data-id');
        } else if (nodeType === 'BUTTON') {
            courseId = e.target.getAttribute('data-id');
        }
        confirm({
            title: '你确定要删除文件吗?',
            content: '删除文件后不可恢复',
            okText: '确定删除',
            onOk () {
                return new Promise((resolve, reject) => {
                    this1.props.deleteCourse(courseId);
                    setTimeout(() => {
                        if (items.length === 1 && page !== 0) {
                            // 删除最后一页最后一条
                            this1.props.onChange(this1.props.current - 1);
                        } else {
                            this1.props.onChange(this1.props.current);
                        }
                        resolve(1)
                    }, 2000);
                });
            },
            onCancel () { }
        });
    }
    render () {
        if (this.props.data.items) {
            var that = this;
            var list = this.props.data.items.map(function (course, index) {
                let fileType = course.fileExtension;
                let imgSrc;
                if ('pptpptx'.indexOf(fileType) > -1) {
                    imgSrc = ppt;
                } else if ('docdocx'.indexOf(fileType) > -1) {
                    imgSrc = word;
                } else if ('pdf'.indexOf(fileType) > -1) {
                    imgSrc = pdf;
                } else if ('pngjpggifjpegbmp'.indexOf(fileType) > -1) {
                    imgSrc = image;
                } else if ('aviwmvmkvflvwmarmvbrmmp43gp'.indexOf(fileType) > -1) {
                    imgSrc = video;
                } else if ('ziprar7z'.indexOf(fileType) > -1) {
                    imgSrc = rar;
                };
                return <
                    div className='item itemList' key={index} style={{ borderTop: 'none' }}>
                    <div className='content'>
                        <div className='header'>
                            <img src={imgSrc} className='fileTypeImg' />
                            <a className='headerLeft'>【课件】{course.name}</a>
                            <div className='headerBtn'><Button className='headerBtn1' data-id={course.id} onClick={that.showConfirm}>
                                删除
                            </Button></div>
                        </div>
                        <div className='itemContent'>
                            <div>
                                <div className='meta'>
                                    <span className='knowledgeSpan'><span style={{ fontWeight: '1000' }}>知识点：</span>{course.knowledge}</span>
                                    <Button onClick={that.downloadFile} className='itemBtn' data-id={course.id}>下载</Button>
                                </div>
                                <div className='description'>
                                    <p />
                                </div>
                                <div className='extra'>
                                    <Icon type='clock-circle' />
                                    {moment(course.createdOn).format('YYYY-MM-DD HH:mm:ss')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            });
        }
        return (
            <div className='ui divided items courseItem' styleName='courseItem'>
                {list && list.length ? list : <Alert
                  message='暂未有课件信息'
                  type='warning'
                  showIcon
                /> }
                <div className='itemPagination'>
                    {/* <Pagination
                    defaultCurrent={1}
                    current={this.props.current}
                    total={Math.ceil(this.props.data.total / this.props.data.limit) ? Math.ceil(this.props.data.total / this.props.data.limit) : 0}
                    onChange={this.props.onChange}
                    pageSize={1}
                    /> */}
                    {
                        this.props.data.total > 5 && <div className='pagination'>
                            <Pagination
                              total={Math.ceil((this.props.data.total)) ? Math.ceil(this.props.data.total) : 0}
                              defaultPageSize={20}
                                //   pageSize={5}
                              current={this.props.data.page + 1}
                              showTotal={(total, range) => `总记录：${Math.ceil(this.props.data.total) ? Math.ceil(this.props.data.total) : 0}`}
                                //  showTotal={(total, range) => `总记录：${Math.ceil(this.props.data.total) ? Math.ceil(this.props.data.total) : 0}`}
                              defaultCurrent={1}
                              showQuickJumper
                              showSizeChanger
                              pageSizeOptions={['5', '10', '15', '20']}
                              onChange={this.props.onChange}
                              onShowSizeChange={this.props.handleShowSizeChange}
                            />
                        </div>
                    }
                </div>
            </div>

        )
    }
}
CourseItem.propTypes = {
    dispatch: PropTypes.func,
    data: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    current: PropTypes.number,
    deleteCourse: PropTypes.func,
    token: PropTypes.string,
    handleShowSizeChange: PropTypes.func
};
function select (state) {
    const { account } = state;
    return {
        token: account.token
    }
}
export default connect(select)(CSSModules(CourseItem, styles));
