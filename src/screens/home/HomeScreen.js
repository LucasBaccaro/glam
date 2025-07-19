import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Card } from '../../components/ui';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const { user, userData, logout, refreshUserData } = useAuth();
  const { refreshTrigger } = useApp();

  const handleLogout = async () => {
    await logout();
  };

  // Refrescar datos cuando la pantalla recibe foco
  useFocusEffect(
    React.useCallback(() => {
      refreshUserData();
    }, [refreshTrigger])
  );

  const quickActions = [
    {
      title: 'Reservar Turno',
      subtitle: 'Agenda tu próxima cita',
      icon: 'calendar',
      color: theme.colors.primary,
      onPress: () => navigation.navigate('Reservar'),
    },
    {
      title: 'Mis Turnos',
      subtitle: 'Ver tus citas programadas',
      icon: 'list',
      color: theme.colors.accent,
      onPress: () => navigation.navigate('MisTurnos'),
    },
    {
      title: 'Mis Puntos',
      subtitle: 'Canjear recompensas',
      icon: 'star',
      color: theme.colors.status.warning,
      onPress: () => navigation.navigate('Puntos'),
    },
    {
      title: 'Asistente Virtual',
      subtitle: 'Pregúntanos lo que necesites',
      icon: 'chatbubble',
      color: theme.colors.status.info,
      onPress: () => navigation.navigate('Asistente'),
    },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.greeting}>¡Hola!</Text>
            <Text style={styles.userName}>{userData?.name || 'Usuario'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color={theme.colors.text.muted} />
          </TouchableOpacity>
        </View>

        {/* Points Card */}
        <Card variant="elevated" style={styles.pointsCard}>
          <View style={styles.pointsContent}>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsLabel}>Tus puntos acumulados</Text>
              <Text style={styles.pointsValue}>{userData?.points || 0}</Text>
              <Text style={styles.pointsSubtext}>¡Sigue ganando para obtener descuentos!</Text>
            </View>
            <View style={styles.pointsIcon}>
              <Ionicons name="star" size={32} color={theme.colors.status.warning} />
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionItem}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <Card style={styles.actionCard}>
                  <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                    <Ionicons name={action.icon} size={24} color={action.color} />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Actividad reciente</Text>
          <Card>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.status.success} />
              </View>
              <View style={styles.activityText}>
                <Text style={styles.activityTitle}>Última visita completada</Text>
                <Text style={styles.activitySubtitle}>+20 puntos ganados</Text>
              </View>
            </View>
          </Card>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  welcomeContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.regular,
  },
  userName: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
  },
  logoutButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
  },
  pointsCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
  },
  pointsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.inverse,
    opacity: 0.8,
    marginBottom: theme.spacing.xs,
  },
  pointsValue: {
    fontSize: theme.typography.sizes.hero,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.xs,
  },
  pointsSubtext: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.inverse,
    opacity: 0.7,
  },
  pointsIcon: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '48%',
    marginBottom: theme.spacing.md,
  },
  actionCard: {
    padding: theme.spacing.md,
    alignItems: 'center',
    minHeight: 120,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  actionSubtitle: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  recentContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  activityText: {
    flex: 1,
  },
  activityTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  activitySubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
});

export default HomeScreen;