import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';
import { MdLoyalty } from 'react-icons/md';
import * as Yup from 'yup';

import { updateProfileRequest } from '~/store/modules/user/actions';

import { Container, Content } from './styles';

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é obrigatório'),
  oldPassword: Yup.string()
    .notRequired()
    .test('old_password', 'No mínimo 6 caracteres', value => {
      if (value) {
        const schemaOldPassword = Yup.string().min(6);
        return schemaOldPassword.isValidSync(value);
      }
      return true;
    }),
  password: Yup.string()
    .notRequired()
    .test('password', 'No mínimo 6 caracteres', value => {
      if (value) {
        const schemaPassword = Yup.string().min(6);
        return schemaPassword.isValidSync(value);
      }
      return true;
    }),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'As senhas não coincidem'
  ),
});

export default function Profile() {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.user.profile);

  function handleSubmit(data) {
    if (
      data.name !== profile.name ||
      data.email !== profile.email ||
      data.oldPassword
    ) {
      dispatch(updateProfileRequest(data));
    }
  }

  return (
    <Container>
      <Content>
        <Form initialData={profile} onSubmit={handleSubmit} schema={schema}>
          <Input name="name" placeholder="Nome Completo" />
          <Input
            name="email"
            type="email"
            placeholder="Seu endereço de e-mail"
          />

          <hr />

          <Input
            type="password"
            name="oldPassword"
            placeholder="Sua senha atual"
          />
          <Input type="password" name="password" placeholder="Nova senha" />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirmação de senha"
          />

          <button type="submit">
            <MdLoyalty />
            Salvar perfil
          </button>
        </Form>
      </Content>
    </Container>
  );
}
