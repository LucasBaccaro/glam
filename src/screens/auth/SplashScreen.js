import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import { theme } from '../../constants/theme';

const SplashScreen = ({ navigation, onAnimationComplete }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animación de entrada
    const animation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    // Navegar después de 2 segundos
    const timer = setTimeout(() => {
      // Llamar al callback de finalización si existe
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 2000);

    return () => {
      animation.stop();
      clearTimeout(timer);
    };
  }, [fadeAnim, scaleAnim, navigation, onAnimationComplete]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require('../../assets/icon-glam.jpeg')}
          style={styles.image}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
});

export default SplashScreen;