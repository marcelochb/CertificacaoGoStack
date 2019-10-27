import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Dados, Titulo, Linha, Texto, SubmitButton } from './styles';

function Meetups({ data, onHandle, buttonText }) {
  return (
    <Dados>
      <Titulo>{data.title}</Titulo>
      <Linha>
        <Icon name="event" size={20} color={'#999'} />
        <Texto>{data.date}</Texto>
      </Linha>
      <Linha>
        <Icon name="place" size={20} color={'#999'} />
        <Texto>{data.location}</Texto>
      </Linha>
      <Linha>
        <Icon name="person" size={20} color={'#999'} />
        <Texto>Organizador: {data.User.name}</Texto>
      </Linha>
      <SubmitButton onPress={onHandle}>{buttonText}</SubmitButton>
    </Dados>
  );
}

export default Meetups;
