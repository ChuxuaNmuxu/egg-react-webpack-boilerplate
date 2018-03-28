import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import Tips from '../view/tips/tips'
import styles from './App.scss';
import authentication from '../components/Auth/authentication'

@authentication()
@CSSModules(styles)
class App extends Component {
    render () {
        let content = this.props.children;
        let roleTeacher = this.props.visitor.schoolRoleList.filter((x) => x === 'TEACHER');
        if (roleTeacher.length === 0) {
            content = <Tips />;
        }
        return (
            <div className='app' styleName='app'>
                {content}
            </div>
        );
    }
}

App.propTypes = {
    children: PropTypes.element,
    routing: PropTypes.object,
    visitor: PropTypes.object
};

function mapStateToProps (state) {
    const { routing, account: {visitor} } = state;
    return {
        routing,
        visitor
    };
}

export default connect(mapStateToProps)(App);
