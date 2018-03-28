import {call, put} from 'redux-saga/effects';

import {hamster} from '../../actions/actionTypes';

export function* addBlock (action) {
    try {
        yield put({type: hamster.BLOCK_ADD, action})
    } catch (error) {
        
    }
}