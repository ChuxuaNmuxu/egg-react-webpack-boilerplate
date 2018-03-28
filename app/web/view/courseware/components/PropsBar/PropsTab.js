import React from 'react';
import {Form} from 'antd';
import PropTypes from 'prop-types';
import {Map} from 'immutable';
import {Scrollbars} from 'react-custom-scrollbars';
import {isEmpty} from 'lodash';

import {setBlockProps} from '../../../../actions/courseware';
import PropsList from '../../config/PropsList';
import {getTheBlock} from '../../../../reducers/courseware/helper'

let form = null;

class Tab extends React.Component {
    renderThumb ({ style, ...props }) {
        const thumbStyle = {
            // backgroundColor: '#4b5155',
            backgroundColor: 'currentColor',
            borderRadius: '3px'
        };
        return (
            <div
              style={{ ...style, ...thumbStyle }}
              {...props} />
        );
    }

    render () {
        form = this.props.form;
        return (
            <Scrollbars
              renderThumbVertical={this.renderThumb}
              autoHide
              autoHideDuration={200}
              autoHideTimeout={1000}>
                <div className='base-props props-content'>
                    <Form
                      hideRequiredMark
                    >
                        {
                            React.Children.map(this.props.children, (child) => {
                                return React.cloneElement(child, {
                                    form: this.props.form
                                })
                            })
                        }
                    </Form>
                </div>
            </Scrollbars>
        );
    }
}

const onFieldsChange = (props, fields) => {
    const {dispatch, courseware} = props;

    if (form && !isEmpty(fields)) {
        const values = Object.values(fields)[0];
        const {name, value, errors} = values;

        console.log(10, errors)
        if (!isEmpty(errors)) {
            console.log(11, /required/.test(errors[0].message))
            if (/required/.test(errors[0].message)) {
                dispatch(setBlockProps(Map({
                    prop: name,
                    value: 0
                })))
            } else {
                const propsValue = getTheBlock(courseware).get('props').getIn(name.split('.'))
                form.setFieldsValue({[name]: propsValue});
            }
        } else {
            dispatch(setBlockProps(Map({
                prop: name,
                value: value
            })))
        }
    }
}

const mapPropsToFields = (props) => {
    const propsKey = Object.keys(PropsList[props.type]);
    const fildProps = {}
    const {courseware} = props;
    if (courseware.getIn(['current', 'blocks']).size > 0) {
        const prop = getTheBlock(courseware).get('props');

        propsKey.forEach((key) => {
            fildProps[key] = {value: prop.getIn(key.split('.'))}
        })
    }
    return fildProps;
}

const PropsTab = Form.create({onFieldsChange, mapPropsToFields})(Tab);

// const mapStateToProps = (state) => {
//     const courseware = state.courseware.present;
//     return {
//         courseware
//     }
// }

Tab.propTypes = {
    form: PropTypes.any,
    children: PropTypes.any
}

export default PropsTab;
