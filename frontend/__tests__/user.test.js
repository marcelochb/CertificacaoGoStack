// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useSelector } from 'react-redux';
import { render } from '@testing-library/react';

import Teste from '~/routes';

jest.mock('react-redux');

describe('SignIn Page', () => {
  it('should render login', () => {
    useSelector.mockImplementation(cb =>
      cb({
        auth: { loading: true },
      })
    );
    const { getByText } = render(<Teste />);

    expect(getByText('Carregando...'));
  });
});
