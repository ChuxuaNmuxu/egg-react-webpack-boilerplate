import React, {Component} from 'react';
import {connect} from 'react-redux';
import Course from '../course/course';
// import aaa from '../../../mock/aaa'

class Index extends Component {
    render () {
        return (
            <div>
                <Course />
            </div>
        )
    }
}
export default connect()(Index);
