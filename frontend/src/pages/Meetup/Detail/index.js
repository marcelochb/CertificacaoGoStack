import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import pt from 'date-fns/locale/pt';
import { format, parseISO } from 'date-fns';
import { MdSystemUpdateAlt, MdReorder } from 'react-icons/md';
import history from '~/services/history';
import {
  Container,
  Content,
  Botoes,
  Editar,
  Cancelar,
  Data,
  Local,
} from './styles';
import { cancelMeetupRequest } from '~/store/modules/meetup/actions';

export default function Detail() {
  const meetup = useSelector(state => state.meetup.detail);
  const dispatch = useDispatch();
  async function handleCancel({ id, past }) {
    if (past) {
      toast.error('Não é possível cancelar meetup que já passou');
    } else {
      dispatch(cancelMeetupRequest(id));
    }
  }

  async function handleUpdate({ past }) {
    if (past) {
      toast.error('Não é possível cancelar meetup que já passou');
    } else {
      history.push('/meetup/update');
    }
  }

  const dateFormated = format(
    parseISO(meetup.date),
    "dd 'de' MMMM ', às' HH'h'",
    {
      locale: pt,
    }
  );

  return (
    <Container>
      <Content>
        <header>
          <strong>{meetup.title}</strong>
          <Botoes>
            <Editar type="button" onClick={() => handleUpdate(meetup)}>
              <MdReorder />
              Editar
            </Editar>
            <Cancelar type="button" onClick={() => handleCancel(meetup)}>
              <MdSystemUpdateAlt />
              Cancelar
            </Cancelar>
          </Botoes>
        </header>
        <img src={meetup.File.url} alt={meetup.id} />
        <p>{meetup.description}</p>
        <footer>
          <Data>{dateFormated}</Data>
          <Local>{meetup.location}</Local>
        </footer>
      </Content>
    </Container>
  );
}
