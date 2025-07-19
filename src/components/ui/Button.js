import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../constants/theme';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  style,
  textStyle,
  ...props 
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? theme.colors.text.inverse : theme.colors.primary} 
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm
  },
  
  // Variants
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  
  // Sizes
  sm: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 36,
  },
  md: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 48,
  },
  lg: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    minHeight: 56,
  },
  
  // Text styles
  text: {
    fontWeight: theme.typography.weights.medium,
    textAlign: 'center',
  },
  primaryText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.md,
  },
  secondaryText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
  },
  outlineText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.md,
  },
  ghostText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.md,
  },
  
  // Size text
  smText: {
    fontSize: theme.typography.sizes.sm,
  },
  mdText: {
    fontSize: theme.typography.sizes.md,
  },
  lgText: {
    fontSize: theme.typography.sizes.lg,
  },
  
  // States
  disabled: {
    backgroundColor: theme.colors.border.light,
    borderColor: theme.colors.border.light,
  },
  disabledText: {
    color: theme.colors.text.muted,
  },
});

export default Button;