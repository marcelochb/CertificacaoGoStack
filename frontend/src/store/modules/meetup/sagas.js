import { takeLatest, all, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '~/services/api';
import history from '~/services/history';
import { updateMeetupSuccess } from './actions';

export function detail() {
  history.push('/meetup/detail');
}

export function* cancel({ payload }) {
  try {
    const { id } = payload;

    yield call(api.delete, `meetups/${id}`);
    history.push('/dashboard');
    toast.info('Meetup cancelado com sucesso');
  } catch (err) {
    toast.error('Erro ao cancelar');
  }
}

export function* create({ payload }) {
  try {
    const { title, description, date, location, file_id } = payload;

    yield call(api.post, 'meetups', {
      title,
      description,
      date,
      location,
      file_id,
    });

    history.push('/dashboard');

    toast.info('Meetup cadastrada com sucesso.');
  } catch (err) {
    toast.error('Erro ao cadastrar');
  }
}

export function* update({ payload }) {
  try {
    const { id, title, description, date, location, file_id } = payload;

    const response = yield call(api.put, `meetups/${id}`, {
      title,
      description,
      date,
      location,
      file_id,
    });
    yield put(updateMeetupSuccess(response.data));

    history.push('/meetup/detail');

    toast.success('Meetup alterada com sucesso.');
  } catch (err) {
    toast.error('Erro ao cadastrar');
  }
}

export default all([
  takeLatest('@meetup/DETAIL_REQUEST', detail),
  takeLatest('@meetup/CANCEL_REQUEST', cancel),
  takeLatest('@meetup/CREATE_REQUEST', create),
  takeLatest('@meetup/UPDATE_REQUEST', update),
]);
