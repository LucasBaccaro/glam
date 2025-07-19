
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import SelectLocationScreen from '../screens/booking/SelectLocationScreen';
import SelectBarberScreen from '../screens/booking/SelectBarberScreen';
import SelectDateTimeScreen from '../screens/booking/SelectDateTimeScreen';
import ConfirmationScreen from '../screens/booking/ConfirmationScreen';
import PaymentSuccessScreen from '../screens/booking/PaymentSuccessScreen';

const Stack = createStackNavigator();

const BookingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name="SelectLocation" 
        component={SelectLocationScreen} 
        options={{
        headerShown: false, // Oculta por completo la top bar
     }}
      />
      <Stack.Screen 
        name="SelectBarber" 
        component={SelectBarberScreen} 
        options={{ title: 'Seleccionar Peluquero' }} 
      />
      <Stack.Screen 
        name="SelectDateTime" 
        component={SelectDateTimeScreen} 
        options={{ title: 'Fecha y Hora' }} 
      />
      <Stack.Screen 
        name="Confirmation" 
        component={ConfirmationScreen} 
        options={{ title: 'Confirmar Reserva' }} 
      />
      <Stack.Screen 
        name="PaymentSuccess" 
        component={PaymentSuccessScreen} 
        options={{ 
          headerShown: false,
          gestureEnabled: false, // Prevenir swipe back
        }} 
      />
    </Stack.Navigator>
  );
};

export default BookingNavigator;
