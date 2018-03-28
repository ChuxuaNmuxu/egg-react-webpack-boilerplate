/**
 * Created by 万叙杰 on 2017/8/9.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../header';
import CommonFooter from '../footer';
import Navigation from './components/Navigation';

class CourseEntry extends Component {
    render () {
        return (
            <div>
                <Header />
                <Navigation props={this.props} />
                {this.props.children}
                <CommonFooter />
            </div>
        )
    }
}

CourseEntry.propTypes = {
    children: PropTypes.node
};

export default connect()(CourseEntry);
