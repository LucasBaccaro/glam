export const theme = {
  colors: {
    primary: '#000000',
    primaryLight: '#333333',
    secondary: '#F5F5F5',
    accent: '#007AFF',
    
    background: '#FFFFFF',
    surface: '#FAFAFA',
    card: '#FFFFFF',
    
    text: {
      primary: '#000000',
      secondary: '#666666',
      muted: '#999999',
      inverse: '#FFFFFF'
    },
    
    border: {
      light: '#F0F0F0',
      medium: '#E0E0E0',
      dark: '#CCCCCC'
    },
    
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    }
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      title: 28,
      hero: 32
    },
    weights: {
      light: '300',
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700'
    }
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 999
  },
  
  shadows: {
    sm: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1
    },
    md: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    lg: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5
    }
  }
};