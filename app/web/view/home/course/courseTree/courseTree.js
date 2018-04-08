// import React, {Component, PropTypes} from 'react';
import React, {Component} from 'react';
import PropTypes from 'prop-types';import CSSModules from 'react-css-modules';
import styles from './courseTree.scss';
import {connect} from 'react-redux';
import {Tree, Select, Alert, Button} from 'antd';
import utils from '../../../../utils/utils'
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

class CourseTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            defaultValue: this.props.firstValue,
            allSelected: true,
            selectedKeys: []
        };
        this.onChange = this.onChange.bind(this, this.props.onChange);
        this.parsingTreeNode = this.parsingTreeNode.bind(this);
        this.allSelected = this.allSelected.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.firstValue !== nextProps.firstValue) {
            this.setState({
                defaultValue: nextProps.firstValue
            })
        }
    }

    onChange (onChange, value) {
        if (window.localStorage) {        // 记住用户每次修改后的选择，并在下次登录时使用
            localStorage.setItem(this.props.account.id + this.props.account.userName, value);
        } else {
            utils.setCookie('defaultSubjectValue', value)
        };
        this.setState({
            allSelected: true,
            selectedKeys: [],
            defaultValue: value
        }, () => onChange(value));
    }
    parsingTreeNode (data) {
        let that = this;
        if (data.length > 0) {
            return data.map(function (value) {
                return (
                    <TreeNode title={value.name} key={value.id}>
                        {value.children.length > 0 ? that.parsingTreeNode(value.children) : null}
                    </TreeNode>
                )
            })
        } else {
            return null
        }
    }
    allSelected () {
        this.setState({
            allSelected: true,
            selectedKeys: []
        })
        this.props.onChange(this.state.defaultValue);
    }
    render () {
        let this1 = this;
        let defaultSubject;
        if (window.localStorage) {
            defaultSubject = localStorage.getItem(this.props.account.id + this.props.account.userName);
        } else {
            defaultSubject = utils.getCookie('defaultSubjectValue');
        }
        const tree = <Tree className='myCls' showLine
          onSelect={(e) => {
              this1.setState({
                  selectedKeys: e,
                  allSelected: false
              });
              this.props.onSelect(e);
          }}
          selectedKeys={this.state.selectedKeys}
        >
            {
                this1.parsingTreeNode(this.props.knowledgeData)
            }
        </Tree>;
        return (
            <div className='courseTree' styleName='courseTree'>
                <div className='treeHeader'>
                    <span className='courseHeaderLeft'>知识点</span>
                    <span className='courseHeaderRight'>
                        <Select value={defaultSubject || this.state.defaultValue} onChange={this.onChange} notFoundContent='获取学科列表失败'>
                            {
                                this.props.subjectData.map(function (item) {
                                    return <Option value={item.name} key={item.id}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </span>
                </div>
                <Button type='primary' size='large' className={this.state.allSelected ? 'allSelected' : 'allSelect'} onClick={this.allSelected}>全选</Button>
                {
                    this.props.knowledgeData.length ? tree : <Alert message='没有该科目知识点数据' type='warning' />
                }
            </div>
        );
    }
}

CourseTree.propTypes = {
    subjectData: PropTypes.array.isRequired,
    knowledgeData: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    firstValue: PropTypes.string,
    account: PropTypes.object.isRequired
};

export default connect()(CSSModules(CourseTree, styles));
