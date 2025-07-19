
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/home/HomeScreen';
import BookingWrapper from '../screens/booking/BookingWrapper';
import MisTurnosScreen from '../screens/appointments/MisTurnosScreen';
import PuntosScreen from '../screens/rewards/PuntosScreen';
import AsistenteScreen from '../screens/assistant/AsistenteScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#eee',
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen 
  name="Home" 
  component={HomeScreen} 
  options={{
    headerShown: false,  // ← Quita la topbar
    title: 'Inicio',     // ← Mantiene el título en bottombar
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="home" size={size} color={color} />
    ),
  }}
/>
      <Tab.Screen 
        name="Reservar" 
        component={BookingWrapper} 
        options={{ 
          headerShown: false,
          title: 'Reservar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="MisTurnos" 
        component={MisTurnosScreen} 
        options={{
          headerShown: false,
          title: 'Mis Turnos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Puntos" 
        component={PuntosScreen} 
        options={{
          headerShown: false,
          title: 'Puntos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Asistente" 
        component={AsistenteScreen} 
        options={{
          headerShown: false,
          title: 'Asistente',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
