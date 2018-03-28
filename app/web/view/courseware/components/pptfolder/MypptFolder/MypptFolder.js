import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Icon, Menu, Row, Col, Input, Dropdown, Modal } from 'antd'
import CSSModules from 'react-css-modules';
import styles from './MypptFolder.scss';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { fetchMyCourseFolder, fetchMyCourseNewFolder, fetchMyCourseEditFolder, fetchMyCourseFolderSort, fetchDeleteMyCourseFolder } from '../../../../../actions/courseEntry';

class Folder extends Component {
    constructor (props) {
        super(props);
        this.textInput = null;
        this.state = {
            folderData: [],
            opIndex: null,
            selectedKeys: []
        }
        this.handlePlusClick = this.handlePlusClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleVisibleChange = this.handleVisibleChange.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleChildMenuClick = this.handleChildMenuClick.bind(this);
        this.sortFolder = this.sortFolder.bind(this);
        this.saveFolderDataToStore = this.saveFolderDataToStore.bind(this);
    }

    componentWillMount () {
        const { dispatch, type } = this.props;
        let readIndex = this.props.location && this.props.location.query.readIndex;
        dispatch(fetchMyCourseFolder()).then((json) => {
            let folderData;
            let defaultData = [{
                id: '0',
                name: '默认文件夹'
            }];
            if (json.code === 0) {
                folderData = defaultData.concat(json.data)
                folderData.map((data, index) => {
                    data.index = index;
                });
                this.setState({
                    folderData: folderData,
                    selectedKeys: ['.$0']
                }, () => {
                    this.saveFolderDataToStore();
                })
                if (readIndex) {
                    type !== 2 && this.props.folderSwitch(folderData[readIndex].id, ['.$' + readIndex]);
                } else {
                    type !== 2 && this.props.folderSwitch(0, ['.$0']);
                }
            };
        })
    }

    static defaultProps = {
        title: '文件夹',                   // title文案
        type: 1                            // 当前状态  1表示属于我的课件的时候  2表示属于保存modal内的文件夹
    }
        // 增加文件夹按钮
    handlePlusClick () {
        this.state.folderData.map((data, index) => {
            data.new = false
        });
        this.state.folderData.push({
            index: this.state.folderData.length,
            editor: true,
            name: '新建文件夹',
            new: true
        });
        this.setState({
            folderData: this.state.folderData
        }, () => {
            this.textInput.focus();
            this.saveFolderDataToStore();
        })
    }

    // 新建input时默认全选中
    handleFocus (e) {
        e.target.select()
    }

    // 文件夹重命名input
    handleInputChange (e, index) {
        if (e.target.value.length <= 10) {
            let reg = new RegExp(/^[^<>|*?"/\\:]{0,10}$/);
            if (reg.test(e.target.value)) {
                this.state.folderData[index].err = false
            } else {
                this.state.folderData[index].err = true
            }
            this.state.folderData[index].name = e.target.value;
            this.setState({
                folderData: this.state.folderData
            }, () => {
                this.saveFolderDataToStore();
            });
        }
    }

    // dispatch 保存文件夹当前的状态
    saveFolderDataToStore () {
        const { dispatch } = this.props;
        dispatch({
            type: 'SAVE_MY_FOLDER_DATA',
            data: this.state.folderData
        })
    }

    // 输入框失去焦点事件
    handleInputOnBlur (index, data) {
        const { dispatch, type } = this.props;
        let currentFolderData = this.state.folderData[index];
        if (!data.err) {
            if (currentFolderData.new) {          // 新建的文件夹失焦事件
                currentFolderData.editor = false;
                currentFolderData.new = false;
                this.setState({
                    folderData: this.state.folderData
                }, () => {
                    dispatch(fetchMyCourseNewFolder({
                        name: currentFolderData.name
                    })).then((json) => {
                        currentFolderData.id = json.data;
                        type === 1 && this.props.folderSwitch(currentFolderData.id, ['.$' + index]);
                        this.setState({
                            folderData: this.state.folderData
                        }, () => {
                            this.saveFolderDataToStore();
                        })
                    })
                });
            } else {                                        // 非新建文件夹重命名
                dispatch(fetchMyCourseEditFolder(currentFolderData.id, currentFolderData.name))
                currentFolderData.editor = false;
                this.setState({
                    folderData: this.state.folderData
                }, () => {
                    this.saveFolderDataToStore();
                });
            };
        }
    }

    // 鼠标进入事件
    handleMouseEnter (e, index) {
        this.state.folderData[index].hover = true;
        this.setState({
            folderData: this.state.folderData
        }, () => {
            this.saveFolderDataToStore();
        })
    }

    // 鼠标离开事件
    handleMouseLeave (e, index) {
        if (!this.state.folderData[index].open) {
            this.state.folderData[index].hover = false;
            this.setState({
                folderData: this.state.folderData
            }, () => {
                this.saveFolderDataToStore();
            })
        }
    }

    // 下拉项展开回调
    handleVisibleChange (e, index) {
        this.state.folderData.map((data, key) => {
            if (key !== index) {
                data.hover = false
            }
        });
        this.state.folderData[index].open = e;
        this.setState({
            folderData: this.state.folderData,
            opIndex: index
        }, () => {
            this.saveFolderDataToStore();
        })
    }

    // menu点击事件
    handleMenuClick (a) {
        const { type } = this.props;
        let index = parseInt(a.key.substring(2));
        let folderId = this.state.folderData[index].id;
        if (type === 1 && (this.props.selectedKeys[0] !== a.key)) {
            this.state.folderData.map((data, key) => {
                if (key !== index) {
                    data.hover = false;
                    data.open = false
                } else {
                    data.hover = true;
                }
            });
            this.setState({
                folderData: this.state.folderData,
                selectedKeys: [a.key]
            }, () => {
                this.saveFolderDataToStore();
            });
            this.props.folderSwitch(folderId, [a.key])
        }
        type !== 1 && this.props.myFolderModalClick([a.key])
    }

    handleChildMenuClick (e) {
        const { folderData, opIndex } = this.state;
        const { dispatch } = this.props;
        let key = parseInt(e.key.replace(/\.\$/g, ''));
        let that = this;
        // let index;
        if (key === 0) {
            // 重命名状态
            folderData[opIndex].editor = true;
            this.setState({
                folderData: folderData
            }, () => {
                this.saveFolderDataToStore();
                this.textInput.focus();
            });
        } else if (key === 1) {
            let a = folderData[opIndex - 1];
            folderData[opIndex - 1] = folderData[opIndex];
            folderData[opIndex] = a;
            this.setState({
                selectedKeys: ['.$' + (opIndex - 1)],
                folderData: folderData
            }, () => {
                this.sortFolder();
                this.saveFolderDataToStore();
            });
        } else if (key === 2) {
            let b = folderData[opIndex + 1];
            folderData[opIndex + 1] = folderData[opIndex];
            folderData[opIndex] = b;
            this.setState({
                selectedKeys: ['.$' + (opIndex + 1)],
                folderData: folderData
            }, () => {
                this.sortFolder();
                this.saveFolderDataToStore();
            });
        } else {
            Modal.confirm({
                iconType: 'exclamation-circle',
                title: '您确定要删除此文件夹吗？',
                content: '文件夹删除后里面的课件将被移动到默认文件夹',
                className: 'delete-modal',
                width: '303',
                onOk () {
                    dispatch(fetchDeleteMyCourseFolder(folderData[opIndex].id)).then((json) => {
                        folderData.splice(opIndex, 1);
                        that.setState({
                            folderData: that.state.folderData,
                            selectedKeys: ['.$0']
                        }, () => {
                            that.props.folderSwitch(0, ['.$0']);
                            that.saveFolderDataToStore();
                        });
                    })
                },
                onCancel () {
                    console.log('Cancel');
                }
            });
        };
    }

    // 获取当前文件夹的排序状态并上传
    sortFolder () {
        const { dispatch } = this.props;
        const { folderData } = this.state;
        let ids = folderData.map((data, index) => {
            return data.id
        });
        ids.splice(0, 1);
        dispatch(fetchMyCourseFolderSort(ids))
    }

    render () {
        const { title, selectedKeys, myFolderData, type, myFolderSelected } = this.props;
        const { opIndex } = this.state;
        const menu = (
            <Menu className='hover-menu' onClick={this.handleChildMenuClick}>
                <Menu.Item disabled={opIndex === 0} key={0}>
                  重命名
              </Menu.Item>
                <Menu.Item disabled={opIndex === 0 || opIndex === 1} key={1}>
                  上移一个
              </Menu.Item>
                <Menu.Item disabled={opIndex === 0 || opIndex === myFolderData.length - 1} key={2}>
                  下移一个
              </Menu.Item>
                <Menu.Item disabled={opIndex === 0} key={3}>
                  删除
              </Menu.Item>
            </Menu>
        )
        return (
            <div className='folder' styleName='folder' ref={this.props.FolderRef}>
                {
                  type !== 2 && <Row className='title'>
                      <Col span={12}>{title}</Col>
                      <Col span={12}>
                          <div style={{float: 'right'}}>
                              <Icon className='icon-plus' type='plus' onClick={this.handlePlusClick} />
                          </div>
                      </Col>
                  </Row>
                }
                <Row className='folder-box'>
                    <Menu onClick={this.handleMenuClick} selectedKeys={type === 1 ? selectedKeys : myFolderSelected} defaultSelectedKeys={['.$0']}>
                        {
                          myFolderData.map((data, index) => {
                              return (
                                  <Menu.Item style={{borderLeft: type === 2 && 'none'}} key={index} className={classnames({editoring: data.editor}, 'menu-item' + index)} onMouseLeave={(e) => { type !== 2 && this.handleMouseLeave(e, index) }} onMouseEnter={(e) => { type !== 2 && this.handleMouseEnter(e, index) }} >
                                      <i className='icon iconfont icon-iconfont89' />
                                      {data.editor ? <div className='input-box'>
                                          <Input onFocus={this.handleFocus} ref={(e) => { this.textInput = e }} onBlur={() => { this.handleInputOnBlur(index, data) }} className={classnames('folder-input-editor', {editorErr: data.err})} value={data.name} onChange={(e) => { this.handleInputChange(e, index) }} />
                                          <span className='count'>{data.name.length}/10</span>
                                      </div> : <span>{data.name}</span>}
                                      {data.editor && data.err && <div className='err'>{'文件名不能包含<>|*?\\/:"'}</div>}
                                      {data.hover && !data.editor && <Dropdown onVisibleChange={(e) => { this.handleVisibleChange(e, index) }} trigger={['click']} overlay={menu} className='drop-down' placement='bottomRight' getPopupContainer={() => { return document.getElementsByClassName('folder-box')[0] }}>
                                          <Icon type='ellipsis drop-down-icon' />
                                      </Dropdown>}
                                  </Menu.Item>
                              )
                          })
                      }
                    </Menu>
                </Row>
            </div>
        )
    }
}

Folder.propTypes = {
    title: PropTypes.string,
    type: PropTypes.number,
    subjectData: PropTypes.array,
    folderData: PropTypes.array,
    dispatch: PropTypes.func,
    folderSwitch: PropTypes.func,
    selectedKeys: PropTypes.array,
    myFolderData: PropTypes.array,
    myFolderSelected: PropTypes.array,
    myFolderModalClick: PropTypes.func,
    location: PropTypes.object,
    FolderRef: PropTypes.func
}

const select = (store) => {
    const { courseEntry: { myCourse: { myFolderData } } } = store;
    return {
        myFolderData: myFolderData
    }
}
export default connect(select)(CSSModules(Folder, styles));
