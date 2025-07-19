import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'md',
  style,
  ...props 
}) => {
  const cardStyles = [
    styles.base,
    styles[variant],
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    style
  ];

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm
  },
  
  // Variants
  default: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  elevated: {
    ...theme.shadows.md,
    borderWidth: 0,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Padding
  paddingSm: {
    padding: theme.spacing.sm,
  },
  paddingMd: {
    padding: theme.spacing.md,
  },
  paddingLg: {
    padding: theme.spacing.lg,
  },
  paddingXl: {
    padding: theme.spacing.xl,
  },
});

export default Card;