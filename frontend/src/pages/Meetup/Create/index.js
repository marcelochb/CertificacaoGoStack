import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';
import { MdLoyalty } from 'react-icons/md';
import { parseISO, isAfter } from 'date-fns';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import FileInput from '~/components/FileInput';

import { Container, Content } from './styles';
import { createMeetupRequest } from '~/store/modules/meetup/actions';

const schema = Yup.object().shape({
  file_id: Yup.mixed(),
  title: Yup.string().required('O Titulo é obrigatório'),
  description: Yup.string().required('A Descrição é obrigatório'),
  date: Yup.string().required('A Data é obrigatória'),
  location: Yup.string().required('A Localização é obrigatória'),
});

export default function Create() {
  const dispatch = useDispatch();

  function handleCreate({ title, description, date, location, file_id }) {
    const [data, hora] = date.split(' ');
    const [dia, mes, ano] = data.split('/');
    const formatedData = parseISO(`${ano}-${mes}-${dia} ${hora}:00`);
    if (!isAfter(formatedData, new Date())) {
      toast.error('A Data e Hora inválida para o Meetup');
    } else {
      dispatch(
        createMeetupRequest(title, description, formatedData, location, file_id)
      );
    }
  }

  return (
    <Container>
      <Content>
        <Form schema={schema} onSubmit={handleCreate}>
          <FileInput name="file_id" />
          <Input name="title" placeholder="Titulo do Meetup" />
          <Input
            multiline
            name="description"
            placeholder="Descrição completa"
          />
          <Input name="date" placeholder="Data e hora (dd/mm/yyyy hh:mm)" />
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
