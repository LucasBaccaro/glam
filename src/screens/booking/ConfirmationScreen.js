
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { createAppointment } from '../../services/firestore.service';
import { processPayment } from '../../services/payment.service';
import { Button, Card } from '../../components/ui';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const ConfirmationScreen = ({ route, navigation }) => {
  const { appointmentData } = route.params;
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user || !userData) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    setLoading(true);

    try {
      // Procesar pago con el mock service
      const paymentResult = await processPayment({
        amount: appointmentData.amount,
        description: `Corte de cabello con ${appointmentData.barberName}`,
        userId: user.uid
      });

      if (paymentResult.success) {
        // Crear la cita en Firestore
        const appointmentToCreate = {
          userId: user.uid,
          locationId: appointmentData.locationId,
          locationName: appointmentData.locationName,
          barberId: appointmentData.barberId,
          barberName: appointmentData.barberName,
          date: appointmentData.date,
          time: appointmentData.time,
          duration: appointmentData.duration,
          amount: appointmentData.amount,
          paymentId: paymentResult.paymentId,
          paymentStatus: paymentResult.status,
          status: 'confirmed', // Estado inicial: confirmado (pagado)
          pointsEarned: 0, // Se otorgan cuando se completa el servicio
          rating: null
        };

        const appointmentResult = await createAppointment(appointmentToCreate);

        if (appointmentResult.success) {
          navigation.navigate('PaymentSuccess', {
            appointmentData: {
              ...appointmentData,
              appointmentId: appointmentResult.id,
              paymentId: paymentResult.paymentId
            }
          });
        } else {
          Alert.alert('Error', 'No se pudo crear la cita. Contacta soporte.');
        }
      } else {
        Alert.alert('Error de Pago', 'No se pudo procesar el pago. Inténtalo nuevamente.');
      }
    } catch (error) {
      console.error('Error in payment process:', error);
      Alert.alert('Error', 'Ocurrió un error durante el proceso. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Confirmar Reserva</Text>
          <Text style={styles.subtitle}>Revisa los detalles antes de continuar</Text>
        </View>
        
        {/* Appointment Details */}
        <Card style={styles.detailsCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Detalles de la Cita</Text>
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
              <Ionicons name="timer" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.detailLabel}>Duración:</Text>
              <Text style={styles.detailValue}>{appointmentData.duration} minutos</Text>
            </View>
          </View>
        </Card>

        {/* Payment Summary */}
        <Card style={styles.priceCard} variant="elevated">
          <View style={styles.cardHeader}>
            <Ionicons name="card" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Resumen de Pago</Text>
          </View>
          
          <View style={styles.priceContent}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Servicio de corte:</Text>
              <Text style={styles.priceValue}>${appointmentData.amount.toLocaleString()}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total a Pagar:</Text>
              <Text style={styles.totalValue}>${appointmentData.amount.toLocaleString()}</Text>
            </View>
          </View>
        </Card>

        {/* Rewards Info */}
        <Card style={styles.rewardsCard}>
          <View style={styles.rewardsHeader}>
            <Ionicons name="gift" size={20} color={theme.colors.status.success} />
            <Text style={styles.rewardsTitle}>¡Ganarás 20 puntos!</Text>
          </View>
          <Text style={styles.rewardsText}>
            Una vez que completes tu cita, ganarás 20 puntos que podrás usar para obtener descuentos y premios.
          </Text>
        </Card>

        {/* Terms */}
        <Card style={styles.termsCard}>
          <View style={styles.termsHeader}>
            <Ionicons name="information-circle" size={20} color={theme.colors.status.warning} />
            <Text style={styles.termsTitle}>Términos y Condiciones</Text>
          </View>
          <View style={styles.termsList}>
            <View style={styles.termItem}>
              <Ionicons name="checkmark" size={14} color={theme.colors.text.secondary} />
              <Text style={styles.termText}>El pago es obligatorio para confirmar la reserva</Text>
            </View>
            <View style={styles.termItem}>
              <Ionicons name="checkmark" size={14} color={theme.colors.text.secondary} />
              <Text style={styles.termText}>Puedes cancelar hasta 2 horas antes de la cita</Text>
            </View>
            <View style={styles.termItem}>
              <Ionicons name="checkmark" size={14} color={theme.colors.text.secondary} />
              <Text style={styles.termText}>Los puntos se otorgan al completar el servicio</Text>
            </View>
            <View style={styles.termItem}>
              <Ionicons name="checkmark" size={14} color={theme.colors.text.secondary} />
              <Text style={styles.termText}>Es necesario calificar al peluquero para recibir puntos</Text>
            </View>
          </View>
        </Card>

        {/* Payment Button */}
        <Button
          title={loading ? undefined : "Pagar con Mercado Pago"}
          onPress={handlePayment}
          disabled={loading}
          style={styles.payButton}
          loading={loading}
          loadingText="Procesando pago..."
        />

        {/* Cancel Button */}
        <Button
          title="Volver"
          variant="outline"
          onPress={() => navigation.goBack()}
          disabled={loading}
          style={styles.cancelButton}
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
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  detailsCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  priceCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  rewardsCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: `${theme.colors.status.success}08`,
  },
  termsCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: `${theme.colors.status.warning}08`,
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
  priceContent: {
    gap: theme.spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  priceValue: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.medium,
    marginVertical: theme.spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
  },
  totalLabel: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.status.success,
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  rewardsTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.status.success,
    marginLeft: theme.spacing.sm,
  },
  rewardsText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  termsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  termsTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.status.warning,
    marginLeft: theme.spacing.sm,
  },
  termsList: {
    gap: theme.spacing.sm,
  },
  termItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  termText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
    lineHeight: 20,
  },
  payButton: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  cancelButton: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});

export default ConfirmationScreen;
