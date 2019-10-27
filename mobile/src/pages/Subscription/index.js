import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNavigationFocus } from 'react-navigation';
import { format, parseISO, addDays, subDays } from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '~/services/api';

import { cancelSubscritpionRequest } from '~/store/modules/subscription/actions';
import Background from '~/components/Background';
import Meetups from '~/components/Meetups';
import Logo from '~/components/Logo';

import { Container, Content, List, Banner } from './styles';

import logo from '~/assets/logo.min.png';

function Subscription({ isFocused }) {
  const dispatch = useDispatch();
  const [subscriptions, setSubscriptions] = useState([]);

  async function loadSubscriptions() {
    const response = await api.get('subscriptions');

    const data = response.data.map(subscription => {
      return {
        ...subscription,
        date: format(parseISO(subscription.date), "dd 'de' MMMM ', às' HH'h'", {
          locale: pt,
        }),
      };
    });

    setSubscriptions(data);
  }

  useEffect(() => {
    if (isFocused) {
      loadSubscriptions();
    }
  }, [isFocused, subscriptions]);

  function handleSubscription([{ id }]) {
    dispatch(cancelSubscritpionRequest(id));
  }

  return (
    <Background>
      <Container>
        <Logo logo={logo} />
        <List
          data={subscriptions}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Content>
              <Banner
                source={{
                  uri: item.File.url,
                }}
              />
              <Meetups
                data={item}
                onHandle={() => handleSubscription(item.Subscriptions)}
                buttonText={'Cancelar inscrição'}
              />
            </Content>
          )}
        />
      </Container>
    </Background>
  );
}
Subscription.navigationOptions = {
  tabBarLabel: 'Inscrições',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="local-offer" size={20} color={tintColor} />
  ),
};

export default withNavigationFocus(Subscription);
