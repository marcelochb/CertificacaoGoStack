import { Alert } from 'react-native';
import { all, call, takeLatest } from 'redux-saga/effects';

import api from '~/services/api';

export function* createSubscription({ payload }) {
  try {
    const id = payload.data;

    yield call(api.post, `meetups/${id}/subscriptions`);

    Alert.alert('Sucesso', 'Inscrição realizada com sucesso');
  } catch (err) {
    Alert.alert(
      'Falha na inscrição',
      'Houve um erro na inscrição, tente mais tarde'
    );
  }
}

export function* cancelSubscription({ payload }) {
  try {
    const id = payload.data;

    yield call(api.delete, `meetups/${id}/subscriptions`);

    Alert.alert('Sucesso', 'Inscrição cancelada com sucesso');
  } catch (err) {
    Alert.alert(
      'Falha no cancelamento',
      'Houve um erro no cancelamento, tente mais tarde'
    );
  }
}

export default all([
  takeLatest('@subscription/CREATE_REQUEST', createSubscription),
  takeLatest('@subscription/CANCEL_REQUEST', cancelSubscription),
]);
