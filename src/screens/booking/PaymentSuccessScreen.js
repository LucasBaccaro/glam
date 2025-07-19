
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Animated } from 'react-native';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CommonActions } from '@react-navigation/native';
import { Button, Card } from '../../components/ui';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const PaymentSuccessScreen = ({ route, navigation }) => {
  const { appointmentData } = route.params;
  const { triggerRefresh } = useApp();
  const { refreshUserData } = useAuth();

  const [countdown, setCountdown] = React.useState(10);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Trigger refresh cuando se completa el pago
    triggerRefresh();
    refreshUserData();
    
    // Animaciones de entrada
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Countdown timer separado
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      handleGoHome();
    }
  }, [countdown]);

  const handleGoHome = () => {
    // Reset navigation stack y ir al Home
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { 
            name: 'Main', 
            state: {
              routes: [{ name: 'Home' }],
              index: 0,
            }
          }
        ],
      })
    );
  };

  const handleGoToAppointments = () => {
    // Reset navigation stack y ir a Mis Turnos
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { 
            name: 'Main', 
            state: {
              routes: [{ name: 'MisTurnos' }],
              index: 0,
            }
          }
        ],
      })
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Success Animation */}
        <Animated.View 
          style={[
            styles.successContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color={theme.colors.status.success} />
          </View>
          <Text style={styles.title}>¡Pago Exitoso!</Text>
          <Text style={styles.subtitle}>Tu cita ha sido confirmada</Text>
        </Animated.View>

        {/* Appointment Details */}
        <Card style={styles.detailsCard} variant="elevated">
          <View style={styles.cardHeader}>
            <Ionicons name="calendar" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Detalles de tu Cita</Text>
          </View>
          
          <View style={styles.detailsContent}>
            <View style={styles.detailRow}>
              <Ionicons name="storefront" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.detailLabel}>Peluquería:</Text>
              <Text style={styles.detailValue}>{appointmentData.locationName}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="person" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.detailLabel}>Peluquero:</Text>
              <Text style={styles.detailValue}>{appointmentData.barberName}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.detailLabel}>Fecha:</Text>
              <Text style={styles.detailValue}>
                {new Date(appointmentData.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="time" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.detailLabel}>Hora:</Text>
              <Text style={styles.detailValue}>{appointmentData.time}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="cash" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.detailLabel}>Pagado:</Text>
              <Text style={styles.detailValuePrice}>${appointmentData.amount.toLocaleString()}</Text>
            </View>
          </View>
        </Card>

        {/* Payment Status */}
        <Card style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <Ionicons name="card" size={20} color={theme.colors.status.success} />
            <Text style={styles.paymentTitle}>Información del Pago</Text>
          </View>
          <View style={styles.paymentContent}>
            <Text style={styles.paymentId}>ID: {appointmentData.paymentId}</Text>
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={14} color={theme.colors.status.success} />
              <Text style={styles.statusText}>Aprobado</Text>
            </View>
          </View>
        </Card>

        {/* Rewards */}
        <Card style={styles.rewardsCard}>
          <View style={styles.rewardsHeader}>
            <Ionicons name="gift" size={20} color={theme.colors.status.warning} />
            <Text style={styles.rewardsTitle}>¡Ganarás 20 puntos!</Text>
          </View>
          <Text style={styles.rewardsText}>
            Los puntos se otorgarán automáticamente cuando tu cita sea completada por el peluquero.
          </Text>
        </Card>

        {/* Reminders */}
        <Card style={styles.reminderCard}>
          <View style={styles.reminderHeader}>
            <Ionicons name="notifications" size={20} color={theme.colors.accent} />
            <Text style={styles.reminderTitle}>Recordatorios</Text>
          </View>
          <View style={styles.reminderList}>
            <View style={styles.reminderItem}>
              <Ionicons name="time" size={14} color={theme.colors.text.secondary} />
              <Text style={styles.reminderText}>Te enviaremos una notificación 2 horas antes</Text>
            </View>
            <View style={styles.reminderItem}>
              <Ionicons name="close-circle" size={14} color={theme.colors.text.secondary} />
              <Text style={styles.reminderText}>Puedes cancelar hasta 2 horas antes sin costo</Text>
            </View>
            <View style={styles.reminderItem}>
              <Ionicons name="walk" size={14} color={theme.colors.text.secondary} />
              <Text style={styles.reminderText}>Llega 5 minutos antes de tu hora programada</Text>
            </View>
          </View>
        </Card>

        {/* Countdown */}
        <View style={styles.countdownContainer}>
          <Ionicons name="time-outline" size={16} color={theme.colors.text.muted} />
          <Text style={styles.countdownText}>
            Regresando al inicio en {countdown} segundos...
          </Text>
        </View>

        {/* Action Buttons */}
        <Button
          title="Ir al Inicio Ahora"
          onPress={handleGoHome}
          style={styles.primaryButton}
        />

        <Button
          title="Ver Mis Turnos"
          variant="secondary"
          onPress={handleGoToAppointments}
          style={styles.secondaryButton}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  successContainer: {
    alignItems: 'center',
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  successIcon: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.hero,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.status.success,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  detailsCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  detailsContent: {
    gap: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  detailLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    minWidth: 80,
  },
  detailValue: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'right',
    textTransform: 'capitalize',
  },
  detailValuePrice: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.status.success,
    flex: 1,
    textAlign: 'right',
  },
  paymentCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  paymentTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.status.success,
    marginLeft: theme.spacing.sm,
  },
  paymentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentId: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.status.success}15`,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.status.success,
    marginLeft: theme.spacing.xs,
  },
  rewardsCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  rewardsTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.status.warning,
    marginLeft: theme.spacing.sm,
  },
  rewardsText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  reminderCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  reminderTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.accent,
    marginLeft: theme.spacing.sm,
  },
  reminderList: {
    gap: theme.spacing.sm,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reminderText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
    lineHeight: 20,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  countdownText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    marginLeft: theme.spacing.xs,
  },
  primaryButton: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  secondaryButton: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});

export default PaymentSuccessScreen;
