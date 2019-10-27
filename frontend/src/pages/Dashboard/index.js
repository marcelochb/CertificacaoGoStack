import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { MdHighlightOff, MdLoyalty } from 'react-icons/md';
import { toast } from 'react-toastify';

import pt from 'date-fns/locale/pt';
import api from '~/services/api';

import { Container, Content, Linha, Titulo } from './styles';
import {
  detailMeetupRequest,
  cancelMeetupRequest,
} from '~/store/modules/meetup/actions';

export default function Dasshboard() {
  const dispatch = useDispatch();
  const [meetups, setMeetups] = useState([]);

  useEffect(() => {
    async function loadMeetps() {
      const response = await api.get('organizing');

      const data = response.data.map(meetup => {
        return {
          ...meetup,
          dateFormated: format(
            parseISO(meetup.date),
            "dd 'de' MMMM ', às' HH'h'",
            {
              locale: pt,
            }
          ),
        };
      });

      setMeetups(data);
    }
    loadMeetps();
  }, [dispatch, meetups]);

  function handleDetail(meetup) {
    dispatch(detailMeetupRequest(meetup));
  }

  async function handleCancel({ id, past }) {
    if (past) {
      toast.error('Não é possível cancelar meetup que já passou');
    } else {
      dispatch(cancelMeetupRequest(id));
      setMeetups(meetups.filter(meetup => meetup.id !== id));
    }
  }

  return (
    <Container>
      <Content>
        <header>
          <strong>Meus meetups</strong>
          <Link to="/meetup/create">
            <button type="button">
              <MdLoyalty />
              Novo meetup
            </button>
          </Link>
        </header>
        <ul>
          {meetups.map(meetup => (
            <Linha key={meetup.id} past={meetup.past}>
              <Titulo onClick={() => handleDetail(meetup)}>
                {meetup.title}
              </Titulo>
              <span>
                {meetup.dateFormated}
                <MdHighlightOff onClick={() => handleCancel(meetup)} />
              </span>
            </Linha>
          ))}
        </ul>
      </Content>
    </Container>
  );
}
