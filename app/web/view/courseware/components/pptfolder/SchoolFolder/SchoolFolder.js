import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Menu, Row, Col, Select } from 'antd'
import CSSModules from 'react-css-modules';
import styles from './SchoolFolder.scss';
import classnames from 'classnames';
import { connect } from 'react-redux';
// import { fetchSchoolCourseGrade, fetchSchoolCourseSubject } from '../../../../../actions/yunBasic';
import * as actions from '../../../../../actions/yunBasic';
const Option = Select.Option;

class SubjectSelect extends Component {
    render () {
        const { subjectData } = this.props;
        return (
            <Select onChange={this.props.handleSelectChange} value={String(this.props.selectValue)} className='school-folder-select'>
                {
          subjectData.map((data, index) => {
              return <Option value={String(data.subjectId)} key={index} title={data.alias}>{data.alias}</Option>
          })
        }
            </Select>
        )
    }
}

SubjectSelect.propTypes = {
    subjectData: PropTypes.array,
    handleSelectChange: PropTypes.func,
    selectValue: PropTypes.string
}

class SchoolFolder extends Component {
    constructor (props) {
        super(props);
        this.textInput = [];
        this.state = {
            folderData: [],
            selectValue: null,
            subjectData: [],
            menuSelectedState: null
        }
        // this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    handleSelectChange (selectValue) {
        this.setState({
            selectValue: selectValue
        });
        this.props.handleSelect(selectValue)
    }

    componentWillMount () {
        const { dispatch, visitor } = this.props;
        dispatch(actions.fetchAllGrade(visitor.schoolId[0])).then((json) => {
            if (json.code === 0) {
                this.setState({
                    folderData: json.data.rows,
                    menuSelectedState: ['.$' + json.data.rows[0].gradeId]
                });
                this.props.handleMenuClick('.$' + json.data.rows[0].gradeId)
            }
        });
        dispatch(actions.fetchAllSubject(visitor.schoolId[0])).then((json) => {
            if (json.code === 0) {
                this.setState({
                    subjectData: json.data,
                    selectValue: json.data[0].subjectId
                })
                this.props.handleSelect(json.data[0].subjectId)
            }
        })
    }

    render () {
        const { menuSelected } = this.props;
        const { folderData, selectValue, subjectData } = this.state;
        return (
            <div className='school-folder' styleName='school-folder'>
                <Row className='title'>
                    <Col span={12}>按分类查找</Col>
                    <Col span={12}>
                        <SubjectSelect subjectData={subjectData} handleSelectChange={this.handleSelectChange} selectValue={selectValue} />
                    </Col>
                </Row>
                <Row className='folder-box'>
                    <Menu onClick={(e) => { this.props.handleMenuClick(e.key) }} selectedKeys={menuSelected}>
                        {
                  folderData.map((data, index) => {
                      return (
                          <Menu.Item key={data.gradeId} className={classnames({editoring: data.editor}, 'menu-item' + index)}>
                              <i className='icon iconfont icon-iconfont89' />
                              <span>{data.gradeName}</span>
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

SchoolFolder.propTypes = {
    title: PropTypes.string,
    type: PropTypes.number,
    subjectData: PropTypes.array,
    folderData: PropTypes.array,
    dispatch: PropTypes.func,
    folderSwitch: PropTypes.func,
    selectedKeys: PropTypes.array,
    menuSelected: PropTypes.array,
    handleMenuClick: PropTypes.func,
    handleSelect: PropTypes.func,
    visitor: PropTypes.object
}

const select = (store) => {
    const { account: {visitor} } = store;
    return {
        visitor: visitor
    }
}
export default connect(select)(CSSModules(SchoolFolder, styles));
