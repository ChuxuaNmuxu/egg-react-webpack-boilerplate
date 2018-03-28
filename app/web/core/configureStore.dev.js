import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';
import {Iterable} from 'immutable';
import createSagaMiddleware from 'redux-saga'

import rootReducer from '../reducers';
import rootSaga from '../sagas';

// 调试工具
const composeEnhancers = composeWithDevTools({
  // 后续如需配置参数，可在这里配置
});

// 日志
const logger = createLogger({
    duration: true,
    collapsed: true,
    stateTransformer: (state) => {
        let newState = {};

        for (var i of Object.keys(state)) {
            if (Iterable.isIterable(state[i])) {
                newState[i] = state[i].toJS();
            } else {
                newState[i] = state[i];
            }
        };

        return newState;
    },
    actionTransformer: (action) => {
        let newAction = Object.assign({}, action);

        if (newAction.payload) {
            if (Iterable.isIterable(newAction.payload)) {
                newAction.payload = newAction.toJS();
            } else {
                for (var i of Object.keys(newAction.payload)) {
                    if (Iterable.isIterable(newAction.payload[i])) {
                        newAction.payload[i] = newAction.payload[i].toJS();
                    }
                }
            }
        }

        return newAction;
    }
});

const saga = createSagaMiddleware()

const middleware = [saga, thunk, logger];

const configureStore = (preloadedState = {}) => {
    const store = createStore(
        rootReducer,
        preloadedState,
        composeEnhancers(
            applyMiddleware(...middleware)
        )
    )

    saga.run(rootSaga);

    if (module.hot) {
        module.hot.accept('../reducers', () => {
            store.replaceReducer(rootReducer);
        });
    }

    return store;
}

export default configureStore;
