import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { checkAppointmentAvailability } from '../../services/firestore.service';
import { Button, Card } from '../../components/ui';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const SelectDateTimeScreen = ({ route, navigation }) => {
  const { barberId, barberName, locationId, locationName } = route.params;
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generar slots de tiempo (10:00 - 18:00, cada 40 minutos) - Memoizado
  const timeSlots = React.useMemo(() => {
    const slots = [];
    const startHour = 10;
    const endHour = 18;
    const intervalMinutes = 40;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        if (hour < endHour || (hour === endHour && minute === 0)) {
          slots.push(timeString);
        }
      }
    }
    return slots;
  }, []);

  useEffect(() => {
    if (selectedDate) {
      checkAvailability();
    }
  }, [selectedDate]);

  const checkAvailability = async () => {
    if (!selectedDate) return;
    
    setLoading(true);
    
    try {
      // Verificar disponibilidad en paralelo para mejor performance
      const availabilityPromises = timeSlots.map(async (slot) => {
        const isAvailable = await checkAppointmentAvailability(barberId, selectedDate, slot);
        return { slot, isAvailable };
      });
      
      const results = await Promise.all(availabilityPromises);
      const available = results
        .filter(result => result.isAvailable)
        .map(result => result.slot);
      
      setAvailableSlots(available);
    } catch (error) {
      console.error('Error checking availability:', error);
      Alert.alert('Error', 'No se pudo verificar la disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (day) => {
    const today = new Date();
    const selectedDay = new Date(day.dateString);
    const dayOfWeek = selectedDay.getDay();
    
    // Verificar que no sea fin de semana (0=domingo, 6=sábado)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      Alert.alert('Fecha no disponible', 'Las peluquerías solo abren de lunes a viernes');
      return;
    }

    // Verificar que sea al menos 2 horas en el futuro
    const twoHoursFromNow = new Date(today.getTime() + (2 * 60 * 60 * 1000));
    if (selectedDay < twoHoursFromNow.setHours(0, 0, 0, 0)) {
      Alert.alert('Fecha no disponible', 'Debe reservar con al menos 2 horas de anticipación');
      return;
    }

    setSelectedDate(day.dateString);
    setSelectedTime(''); // Reset time when date changes
  };

  const handleTimeSelect = (time) => {
    // Verificar si es el día de hoy y la hora ya pasó + 2 horas
    const today = new Date();
    const selectedDay = new Date(selectedDate);
    
    if (selectedDay.toDateString() === today.toDateString()) {
      const [hours, minutes] = time.split(':').map(Number);
      const selectedDateTime = new Date(today);
      selectedDateTime.setHours(hours, minutes, 0, 0);
      
      const twoHoursFromNow = new Date(today.getTime() + (2 * 60 * 60 * 1000));
      
      if (selectedDateTime < twoHoursFromNow) {
        Alert.alert('Hora no disponible', 'Debe reservar con al menos 2 horas de anticipación');
        return;
      }
    }

    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Por favor selecciona fecha y hora');
      return;
    }

    navigation.navigate('Confirmation', {
      barberId,
      barberName,
      locationId,
      locationName,
      date: selectedDate,
      time: selectedTime,
      appointmentData: {
        barberId,
        barberName,
        locationId,
        locationName,
        date: selectedDate,
        time: selectedTime,
        duration: 40,
        amount: 5000 // Precio fijo por ahora
      }
    });
  };

  const getMarkedDates = React.useMemo(() => {
    const marked = {};
    const today = new Date();
    
    // Marcar los próximos 30 días hábiles como disponibles
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();
      
      // Solo días laborales
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const dateString = date.toISOString().split('T')[0];
        marked[dateString] = { disabled: false };
      }
    }

    // Marcar fecha seleccionada
    if (selectedDate) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: theme.colors.primary,
        selectedTextColor: theme.colors.text.inverse
      };
    }

    return marked;
  }, [selectedDate]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Seleccionar Fecha y Hora</Text>
          <Text style={styles.subtitle}>con {barberName} en {locationName}</Text>
        </View>

        {/* Calendar */}
        <Card style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Ionicons name="calendar" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Elige una fecha</Text>
          </View>
          
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={getMarkedDates}
            minDate={new Date().toISOString().split('T')[0]}
            maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textSectionTitleColor: theme.colors.text.secondary,
              selectedDayBackgroundColor: theme.colors.primary,
              selectedDayTextColor: theme.colors.text.inverse,
              todayTextColor: theme.colors.primary,
              dayTextColor: theme.colors.text.primary,
              textDisabledColor: theme.colors.text.muted,
              arrowColor: theme.colors.primary,
              disabledArrowColor: theme.colors.text.muted,
              monthTextColor: theme.colors.text.primary,
              indicatorColor: theme.colors.primary,
              textDayFontWeight: theme.typography.weights.medium,
              textMonthFontWeight: theme.typography.weights.semiBold,
              textDayHeaderFontWeight: theme.typography.weights.medium,
              textDayFontSize: theme.typography.sizes.sm,
              textMonthFontSize: theme.typography.sizes.lg,
              textDayHeaderFontSize: theme.typography.sizes.xs
            }}
          />
        </Card>

        {/* Time Slots */}
        {selectedDate && (
          <Card style={styles.timeCard}>
            <View style={styles.timeHeader}>
              <Ionicons name="time" size={20} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Horarios Disponibles</Text>
            </View>
            
            <Text style={styles.selectedDateText}>
              {new Date(selectedDate).toLocaleDateString('es-ES', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </Text>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Verificando disponibilidad...</Text>
              </View>
            ) : (
              <View style={styles.timeSlotsContainer}>
                {availableSlots.length === 0 ? (
                  <View style={styles.noSlotsContainer}>
                    <Ionicons name="calendar-outline" size={32} color={theme.colors.text.muted} />
                    <Text style={styles.noSlotsText}>No hay horarios disponibles</Text>
                    <Text style={styles.noSlotsSubtext}>Intenta con otra fecha</Text>
                  </View>
                ) : (
                  availableSlots.map((slot) => (
                    <TouchableOpacity
                      key={slot}
                      style={[
                        styles.timeSlot,
                        selectedTime === slot && styles.selectedTimeSlot
                      ]}
                      onPress={() => handleTimeSelect(slot)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.timeSlotText,
                        selectedTime === slot && styles.selectedTimeSlotText
                      ]}>
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}
          </Card>
        )}

        {/* Summary */}
        {selectedDate && selectedTime && (
          <Card style={styles.summaryCard} variant="elevated">
            <View style={styles.summaryHeader}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.status.success} />
              <Text style={styles.summaryTitle}>Resumen de la Reserva</Text>
            </View>
            
            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Ionicons name="calendar" size={16} color={theme.colors.text.secondary} />
                <Text style={styles.summaryLabel}>Fecha:</Text>
                <Text style={styles.summaryValue}>
                  {new Date(selectedDate).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Ionicons name="time" size={16} color={theme.colors.text.secondary} />
                <Text style={styles.summaryLabel}>Hora:</Text>
                <Text style={styles.summaryValue}>{selectedTime}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Ionicons name="timer" size={16} color={theme.colors.text.secondary} />
                <Text style={styles.summaryLabel}>Duración:</Text>
                <Text style={styles.summaryValue}>40 minutos</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Ionicons name="cash" size={16} color={theme.colors.text.secondary} />
                <Text style={styles.summaryLabel}>Precio:</Text>
                <Text style={styles.summaryPrice}>$5.000</Text>
              </View>
            </View>
          </Card>
        )}

        <Button
          title="Confirmar y Continuar"
          onPress={handleConfirm}
          disabled={!selectedDate || !selectedTime}
          style={styles.confirmButton}
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
  calendarCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  timeCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  selectedDateText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textTransform: 'capitalize',
    marginBottom: theme.spacing.md,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.sm,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    minWidth: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
  },
  selectedTimeSlot: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  timeSlotText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.medium,
  },
  selectedTimeSlotText: {
    color: theme.colors.text.inverse,
  },
  noSlotsContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  noSlotsText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
    marginTop: theme.spacing.sm,
  },
  noSlotsSubtext: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.xs,
  },
  summaryCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  summaryTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  summaryContent: {
    gap: theme.spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  summaryLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    minWidth: 80,
  },
  summaryValue: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    flex: 1,
    textTransform: 'capitalize',
  },
  summaryPrice: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.status.success,
    flex: 1,
  },
  confirmButton: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});

export default SelectDateTimeScreen;