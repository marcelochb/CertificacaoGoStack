import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNavigationFocus } from 'react-navigation';
import { format, parseISO, addDays, subDays } from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '~/services/api';

import { createSubscritpionRequest } from '~/store/modules/subscription/actions';
import Background from '~/components/Background';
import Meetups from '~/components/Meetups';
import Logo from '~/components/Logo';

import { Container, Content, Header, Dia, List, Banner } from './styles';

import logo from '~/assets/logo.min.png';

function Dashboard({ isFocused }) {
  const dispatch = useDispatch();
  const [meetups, setMeetups] = useState([]);
  const [date, setDate] = useState(new Date());
  const formatedData = useMemo(() =>
    format(date, "dd' de 'MMMM", { locale: pt })
  );

  async function loadMeetups() {
    const response = await api.get('meetups', {
      params: { date },
    });

    const data = response.data.map(meetup => {
      return {
        ...meetup,
        date: format(parseISO(meetup.date), "dd 'de' MMMM ', às' HH'h'", {
          locale: pt,
        }),
      };
    });

    setMeetups(data);
  }

  useEffect(() => {
    if (isFocused) {
      loadMeetups();
    }
  }, [isFocused, date]);

  function handlePrevDay() {
    setDate(subDays(date, 1));
  }

  function handleNextDay() {
    setDate(addDays(date, 1));
  }

  function handleSubscription({ id }) {
    console.tron.log(id);
    dispatch(createSubscritpionRequest(id));
  }

  return (
    <Background>
      <Container>
        <Logo logo={logo} />
        <Header>
          <Icon
            name="chevron-left"
            size={35}
            color={'#fff'}
            onPress={handlePrevDay}
          />
          <Dia>{formatedData}</Dia>
          <Icon
            name="keyboard-arrow-right"
            size={35}
            color={'#fff'}
            onPress={handleNextDay}
          />
        </Header>
        <List
          data={meetups}
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
                onHandle={() => handleSubscription(item)}
                buttonText={'Realizar inscrição'}
              />
            </Content>
          )}
        />
      </Container>
    </Background>
  );
}
Dashboard.navigationOptions = {
  tabBarLabel: 'Meetups',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="format-list-bulleted" size={20} color={tintColor} />
  ),
};

export default withNavigationFocus(Dashboard);
