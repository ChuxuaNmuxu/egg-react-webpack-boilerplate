import {all} from 'redux-saga/effects';

export default function* root () {
    console.log('hello saga');
    yield all([])
}
