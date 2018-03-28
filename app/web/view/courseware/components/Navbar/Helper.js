import {Map, List, fromJS} from 'immutable'

export default {
    fromJS: (data) => {
        return Map.isMap(data) || List.isList(data) ? data : fromJS(data);
    }
}
