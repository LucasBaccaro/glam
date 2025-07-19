import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, StatusBar, ScrollView } from 'react-native';
import { getLocations } from '../../services/firestore.service';
import { Button, Card } from '../../components/ui';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const SelectLocationScreen = ({ navigation }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const locationsData = await getLocations();
      setLocations(locationsData);
    } catch (error) {
      console.error('Error loading locations:', error);
      Alert.alert('Error', 'No se pudieron cargar las ubicaciones. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderLocation = ({ item }) => (
    <TouchableOpacity
      style={styles.locationCard}
      onPress={() => navigation.navigate('SelectBarber', { 
        locationId: item.id,
        locationName: item.name 
      })}
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.locationIcon}>
            <Ionicons name="storefront" size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.cardTitle}>{item.name}</Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.cardAddress}>{item.address}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="call" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.cardPhone}>{item.phone}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="time" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.hoursText}>Lun-Vie: 10:00 - 18:00</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.availableBadge}>
            <Ionicons name="checkmark-circle" size={14} color={theme.colors.status.success} />
            <Text style={styles.availableText}>Disponible</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text.muted} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando ubicaciones...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Selecciona una Ubicación</Text>
          <Text style={styles.subtitle}>Elige la peluquería más conveniente para ti</Text>
        </View>
        
        {locations.length === 0 ? (
          <ScrollView contentContainerStyle={styles.emptyContainer}>
            <View style={styles.emptyContent}>
              <View style={styles.emptyIcon}>
                <Ionicons name="location-outline" size={48} color={theme.colors.text.muted} />
              </View>
              <Text style={styles.emptyTitle}>No hay ubicaciones disponibles</Text>
              <Text style={styles.emptyText}>
                Actualmente no tenemos peluquerías disponibles. Inténtalo más tarde.
              </Text>
              <Button
                title="Reintentar"
                onPress={loadLocations}
                style={styles.retryButton}
              />
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={locations}
            renderItem={renderLocation}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  locationCard: {
    marginBottom: theme.spacing.md,
  },
  card: {
    padding: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: `${theme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
    flex: 1,
  },
  cardContent: {
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardAddress: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  cardPhone: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  hoursText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.status.success}15`,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  availableText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.status.success,
    marginLeft: theme.spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  retryButton: {
    minWidth: 150,
  },
});

export default SelectLocationScreen;