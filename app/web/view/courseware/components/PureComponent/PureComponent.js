// import React, { PureComponent } from 'react';
import React from 'react';
import { isEqual } from 'lodash';

class CJComponent extends React.Component {
    shouldComponentUpdate (nextProps = {}, nextState = {}) {
        const thisProps = this.props || {};
        const thisState = this.state || {};

        if (!isEqual(thisProps, nextProps)) {
            return true;
        }

        if (!isEqual(thisState, nextState)) {
            return true;
        }

        return false;
    }
}

export default CJComponent;
