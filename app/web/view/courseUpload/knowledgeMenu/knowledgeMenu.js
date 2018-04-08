// import React, {Component, PropTypes} from 'react';
import React, {Component} from 'react';
import PropTypes from 'prop-types';import CSSModules from 'react-css-modules';
import styles from './knowledgeMenu.scss';
import {connect} from 'react-redux';
import { Collapse, Tabs, Button, Row, Col, Tree } from 'antd';
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;

// 知识点菜单
class KnowledgeMenu extends Component {
    constructor (props) {
        super(props)
        this.state = {
            currentClickTree: [],
            selectedTree: [],
            selectedSubject: this.props.subjectArr[0].id,
            selectedKeys: [],
            expandedArr: [],
            panelActiveKey: []
        }
        this.selectedTree = this.selectedTree.bind(this);
        this.deleButton = this.deleButton.bind(this);
        this.knowledgeTree = this.knowledgeTree.bind(this);
        this.tabsChange = this.tabsChange.bind(this);
        this.parsingTreeNode = this.parsingTreeNode.bind(this);
        this.lastKnowledge = this.lastKnowledge.bind(this);
        this.cancelClick = this.cancelClick.bind(this);
        this.ensureClick = this.ensureClick.bind(this);
        this.collapseChange = this.collapseChange.bind(this);
        this.onExpand = this.onExpand.bind(this);
    }
    componentWillReceiveProps (nextProps) {
        if (!nextProps.visible) {
            this.setState({
                currentClickTree: [],
                selectedTree: [],
                expandedArr: [],
                panelActiveKey: []
            })
        }
    }
    selectedTree (data, e) {
        let that = this;
        let arr = [];
        this.setState({
            selectedKeys: data
        });
        if (e.selectedNodes.length) {
            this.props.lastKnowledge.map(function (value) {
                if (parseInt(value.id) === parseInt(e.selectedNodes[0].key.substring(2))) {
                    console.log('run')
                    arr.push(value.data);
                } else if (parseInt(value.data.id) === parseInt(e.selectedNodes[0].key.substring(2))) {
                    arr.push(value.data);
                }
            })
            that.setState({
                currentClickTree: arr
            });
        }
    }
    tabsChange (e) {
        this.setState({
            selectedTree: [],
            currentClickTree: [],
            selectedKeys: [],
            selectedSubject: e.substring(4)
        })
    }
    deleButton (e) {         // 删除按钮
        let that = this;
        let spanValue;
        if (e.target.nodeName === 'I' && navigator.userAgent.indexOf('Chrome') > -1) {
            spanValue = e.target.parentNode.getAttribute('data-value');
            this.state.selectedTree.map(function (data, index) {
                if (data.title === spanValue) {
                    that.state.selectedTree.splice(index, 1);
                    that.setState({
                        selectedTree: that.state.selectedTree
                    })
                }
            })
        } else if (navigator.userAgent.indexOf('Chrome') < 0) {
            spanValue = e.target.getAttribute('data-value');
            this.state.selectedTree.map(function (data, index) {
                if (data.title === spanValue) {
                    that.state.selectedTree.splice(index, 1);
                    that.setState({
                        selectedTree: that.state.selectedTree
                    })
                }
            })
        };
        let boxNode = document.getElementsByClassName('knowledgeMenu')[0].getElementsByClassName('ant-tree-checkbox');
        for (let i = 0; i < boxNode.length; i++) {
            if (boxNode[i].nextSibling.getAttribute('title') === spanValue) {
                boxNode[i].click();
            }
        }
    }
    ensureClick () {
        // TODO  点击确定按钮时
        this.props.collectKnowledge(this.state.selectedTree, this.state.selectedSubject);
        this.refs.myPanel.handleItemClick();
    }
    cancelClick () {
        this.setState({
            selectedTree: [],
            currentClickTree: []
        })
        this.refs.myPanel.handleItemClick();
    }
    // 递归生成知识点树结构
    parsingTreeNode (data, id, bool, a) {
        let that = this;
        ++a;
        return data.map(function (value) {
            if (value.children.length > 0 || bool) {
                return (
                    <TreeNode title={value.name} key={value.id}>
                        {that.parsingTreeNode(value.children, value.id, false, a)}
                    </TreeNode>
                )
            } else if (a < 3) {
                return <TreeNode title={value.name} key={value.id} />
            }
        })
    }

    onExpand (e) {
        this.setState({
            expandedArr: e
        })
    }
    knowledgeTree (id) {
        var that = this;
        return this.props.knowledge.map(function (value) {
            if (value.subjectId === id) {
                let i = 0;
                var tree = <Tree showLine
                  key={value.subjectId}
                  onSelect={that.selectedTree}
                  selectedKeys={that.state.selectedKeys}
                  expandedKeys={that.state.expandedArr}
                  onExpand={that.onExpand}
                >
                    {that.parsingTreeNode(value.data, null, true, i)}
                </Tree>;
                return tree
            }
        })
    }
    lastKnowledge (data, e) {
        let that = this;
        if (e.checkedNodes.length > 0) {                 // tree 被选中时
            this.state.selectedTree.push({
                title: e.checkedNodes[0].props.title,
                id: parseInt(e.checkedNodes[0].key)
            })
            this.setState({
                selectedTree: this.state.selectedTree
            })
        } else {                                       // 取消选中时从已选中数组中删除指定元素
            this.state.selectedTree.map(function (data, index) {
                if (data.title === e.node.props.title) {
                    that.state.selectedTree.splice(index, 1);
                    that.setState({
                        selectedTree: that.state.selectedTree
                    })
                }
            })
        }
    }
    collapseChange (e) {
        if (e.length) {
            this.setState({
                selectedKeys: []
            });
        }
        this.setState({
            panelActiveKey: e
        })
    }
    render () {
        let selectedTreeList = [];
        let tabsList = [];
        let that = this;
        for (let i = 0; i < this.props.subjectArr.length; i++) {
            let subjectId = this.props.subjectArr[i].id;
            tabsList.push(<TabPane tab={this.props.subjectArr[i].name} key={subjectId}>
                <Col span={11} className='knowledgeTreeBox'>{this.knowledgeTree(subjectId)}</Col>
                <Col span={1} />
                <Col span={11} className='knowledgeTreeBox'>{
                    this.state.currentClickTree.map(function (data) {
                        return (
                            <Tree key={data.id} className='knowledgeUl' showLine checkable onCheck={that.lastKnowledge} defaultCheckedKeys={that.state.selectedTree.map(function (value) {
                                return value.id + ''
                            })}>
                                {
                                    <TreeNode title={data.name} key={data.id} />
                                }
                            </Tree>
                        )
                    })
                }</Col>
            </TabPane>)
        };
        for (let i = 0; i < this.state.selectedTree.length; i++) {
            selectedTreeList.push(<Button onClick={this.deleButton} style={{marginLeft: '10px', marginTop: '5px'}} key={i} icon='close' data-value={this.state.selectedTree[i].title}>{this.state.selectedTree[i].title}</Button>)
        };
        return (
            <div className='knowledgeMenu' styleName='knowledgeMenu'>
                <Collapse className='collHeader' onChange={this.collapseChange} activeKey={this.state.panelActiveKey}>
                    <Panel header={this.props.selectedKnowledge.length > 0 ? '更换' : '选择相关知识点'} key='1' ref='myPanel'>
                        <div styleName='knowledgeMenu-tabs' className='knowledgeMenu-tabs'>
                            <Tabs onChange={this.tabsChange}>
                                <TabPane tab='科目' disabled key='disabled' />
                                {tabsList}
                            </Tabs>
                            <div className='selected-list'>
                                <span>已选择 ：{selectedTreeList}</span>
                            </div>
                            <Row className='click'>
                                <Col span={2} offset={8}><Button type='primary' onClick={this.ensureClick} size='large' key='OK'>确定</Button></Col>
                                <Col span={2} offset={2}><Button type='primary' onClick={this.cancelClick} size='large' key='not'>取消</Button></Col>
                            </Row>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        )
    }
}
KnowledgeMenu.propTypes = {
    subjectArr: PropTypes.array,
    knowledge: PropTypes.array,
    lastKnowledge: PropTypes.array,
    collectKnowledge: PropTypes.func,
    visible: PropTypes.any,
    selectedKnowledge: PropTypes.array
};
function mapStateToProps (state) {
    const {course} = state;
    return {
        subjectArr: course.subject.data,
        knowledge: course.uploadKnowledge.data,
        lastKnowledge: course.uploadKnowledge.lastKnowledge
    }
}
export default connect(mapStateToProps)(CSSModules(KnowledgeMenu, styles));
