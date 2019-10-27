import produce from 'immer';

const INITIAL_STATE = {
  detail: null,
};

export default function meetup(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@meetup/DETAIL_REQUEST': {
        draft.detail = action.payload.meetup;
        break;
      }
      case '@meetup/UPDATE_SUCCESS': {
        draft.detail = action.payload.meetup;
        break;
      }
      default:
        break;
    }
  });
}
