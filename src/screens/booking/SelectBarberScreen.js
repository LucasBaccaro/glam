import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, StatusBar, ScrollView } from 'react-native';
import { getBarbersByLocation } from '../../services/firestore.service';
import { Button, Card } from '../../components/ui';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const SelectBarberScreen = ({ route, navigation }) => {
  const { locationId, locationName } = route.params;
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBarbers();
  }, [locationId]);

  const loadBarbers = async () => {
    try {
      setLoading(true);
      const barbersData = await getBarbersByLocation(locationId);
      setBarbers(barbersData);
    } catch (error) {
      console.error('Error loading barbers:', error);
      Alert.alert('Error', 'No se pudieron cargar los peluqueros. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={12} color={theme.colors.status.warning} />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color={theme.colors.status.warning} />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={12} color={theme.colors.text.muted} />
      );
    }
    
    return stars;
  };

  const renderBarber = ({ item }) => (
    <TouchableOpacity
      style={styles.barberCard}
      onPress={() => navigation.navigate('SelectDateTime', { 
        barberId: item.id,
        barberName: item.name,
        locationId: locationId,
        locationName: locationName
      })}
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
        <View style={styles.barberAvatar}>
          <Ionicons name="person" size={32} color={theme.colors.primary} />
        </View>
        
        <Text style={styles.barberName}>{item.name}</Text>
        
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {renderStars(item.rating || 5.0)}
          </View>
          <Text style={styles.ratingText}>{(item.rating || 5.0).toFixed(1)}</Text>
        </View>
        
        <Text style={styles.reviewsCount}>
          {item.totalRatings || 0} reseñas
        </Text>
        
        <View style={styles.specialtyContainer}>
          <Ionicons name="cut" size={14} color={theme.colors.accent} />
          <Text style={styles.specialtyText}>Especialista</Text>
        </View>
        
        <View style={styles.availableBadge}>
          <Ionicons name="checkmark-circle" size={12} color={theme.colors.status.success} />
          <Text style={styles.availableText}>Disponible</Text>
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
          <Text style={styles.loadingText}>Cargando peluqueros...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Selecciona un Peluquero</Text>
          <Text style={styles.subtitle}>en {locationName}</Text>
        </View>
        
        {barbers.length === 0 ? (
          <ScrollView contentContainerStyle={styles.emptyContainer}>
            <View style={styles.emptyContent}>
              <View style={styles.emptyIcon}>
                <Ionicons name="people-outline" size={48} color={theme.colors.text.muted} />
              </View>
              <Text style={styles.emptyTitle}>No hay peluqueros disponibles</Text>
              <Text style={styles.emptyText}>
                Actualmente no tenemos peluqueros disponibles en esta ubicación. 
                Inténtalo más tarde o elige otra ubicación.
              </Text>
              <Button
                title="Reintentar"
                onPress={loadBarbers}
                style={styles.retryButton}
              />
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={barbers}
            renderItem={renderBarber}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={styles.row}
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
  row: {
    justifyContent: 'space-between',
  },
  barberCard: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  card: {
    padding: theme.spacing.md,
    alignItems: 'center',
    minHeight: 180,
  },
  barberAvatar: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
    backgroundColor: `${theme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  barberName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: theme.spacing.xs,
  },
  ratingText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  reviewsCount: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.sm,
  },
  specialtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.accent}15`,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.sm,
  },
  specialtyText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.accent,
    marginLeft: theme.spacing.xs,
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

export default SelectBarberScreen;