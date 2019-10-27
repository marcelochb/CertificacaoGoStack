export function detailMeetupRequest(meetup) {
  return {
    type: '@meetup/DETAIL_REQUEST',
    payload: { meetup },
  };
}

export function cancelMeetupRequest(id) {
  return {
    type: '@meetup/CANCEL_REQUEST',
    payload: { id },
  };
}

export function createMeetupRequest(
  title,
  description,
  date,
  location,
  file_id
) {
  return {
    type: '@meetup/CREATE_REQUEST',
    payload: { title, description, date, location, file_id },
  };
}

export function updateMeetupRequest(
  id,
  title,
  description,
  date,
  location,
  file_id
) {
  return {
    type: '@meetup/UPDATE_REQUEST',
    payload: { id, title, description, date, location, file_id },
  };
}

export function updateMeetupSuccess(meetup) {
  return {
    type: '@meetup/UPDATE_SUCCESS',
    payload: { meetup },
  };
}
