import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';
import SplashScreen from '../screens/auth/SplashScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { View, ActivityIndicator, SafeAreaView, StatusBar, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const AppContent = () => {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [appInitialized, setAppInitialized] = useState(false);

  const onSplashComplete = useCallback(async () => {
    try {
      setShowSplash(false);
      setAppInitialized(true);
    } catch (error) {
      console.error('Error setting splash status:', error);
    }
  }, []);

  // Solo mostrar splash al inicio de la app (antes de inicializar)
  if (!appInitialized && showSplash) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <StatusBar 
          barStyle="dark-content"
          backgroundColor={Platform.OS === 'android' ? '#ffffff' : undefined}
          translucent={false}
        />
        <SplashScreen 
          onAnimationComplete={onSplashComplete}
        />
      </SafeAreaView>
    );
  }

  // Mostrar loading solo durante login/logout (después del splash inicial)
  if (appInitialized && loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <StatusBar 
          barStyle="dark-content"
          backgroundColor={Platform.OS === 'android' ? '#ffffff' : undefined}
          translucent={false}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor={Platform.OS === 'android' ? '#ffffff' : undefined}
        translucent={false}
      />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          ) : (
            <Stack.Screen name="Main" component={MainNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const AppNavigator = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppProvider>
  );
};

export default AppNavigator;
