import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';
import { MdLoyalty } from 'react-icons/md';
import { format, parseISO, isAfter } from 'date-fns';
import pt from 'date-fns/locale/pt';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import FileInput from '~/components/FileInput';

import { Container, Content } from './styles';
import { updateMeetupRequest } from '~/store/modules/meetup/actions';

const schema = Yup.object().shape({
  file_id: Yup.mixed(),
  title: Yup.string().required('O Titulo é obrigatório'),
  description: Yup.string().required('A Descrição é obrigatório'),
  date: Yup.string().required('A Data e Hora são obrigatórios'),
  location: Yup.string().required('A Localização é obrigatória'),
});

export default function Update() {
  const meetup = useSelector(state => state.meetup.detail);
  const dispatch = useDispatch();

  function handleUpdate({
    id = meetup.id,
    title,
    description,
    date,
    location,
    past,
    file_id,
  }) {
    if (past) {
      toast.warn('Não é possível editar meetup que já passou');
    } else {
      const [data, hora] = date.split(' ');
      const [dia, mes, ano] = data.split('/');
      const formatedData = parseISO(`${ano}-${mes}-${dia} ${hora}:00`);
      if (!isAfter(formatedData, new Date())) {
        toast.error('A Data e Hora inválida para o Meetup');
      } else {
        dispatch(
          updateMeetupRequest(
            id,
            title,
            description,
            formatedData,
            location,
            file_id
          )
        );
      }
    }
  }

  const initialData = {
    ...meetup,
    date: format(parseISO(meetup.date), 'dd/MM/yyyy HH:mm', { locale: pt }),
  };
  return (
    <Container>
      <Content>
        <Form schema={schema} onSubmit={handleUpdate} initialData={initialData}>
          <FileInput name="file_id" />
          <Input name="title" placeholder="Titulo do Meetup" />
          <Input
            multiline
            name="description"
            placeholder="Descrição completa"
          />
          <Input
            name="date"
            // type="date"
            placeholder="Data e hora (dd/mm/yyyy hh:mm)"
          />
          <Input name="location" placeholder="Localização" />
          <aside>
            <button type="submit">
              <MdLoyalty /> Salvar meetup
            </button>
          </aside>
        </Form>
      </Content>
    </Container>
  );
}
