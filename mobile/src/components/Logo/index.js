import React from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import { Container } from './styles';

export default function Logo({ logo }) {
  return (
    <Container>
      <Image source={logo} />
    </Container>
  );
}

Logo.propTypes = {
  logo: PropTypes.string.isRequired,
};
