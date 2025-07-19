import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  StatusBar,
  SafeAreaView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase.config';

const ProfileScreen = ({ navigation }) => {
  const { user, userData, logout, refreshUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    phone: userData?.phone || '',
    email: userData?.email || ''
  });

  const handleSave = async () => {
    try {
      if (!formData.name.trim()) {
        Alert.alert('Error', 'El nombre es requerido');
        return;
      }

      await updateDoc(doc(db, 'users', user.uid), {
        name: formData.name.trim(),
        phone: formData.phone.trim()
      });

      await refreshUserData();
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData?.name || '',
      phone: userData?.phone || '',
      email: userData?.email || ''
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity 
          onPress={isEditing ? handleCancel : () => setIsEditing(true)}
          style={styles.editButton}
        >
          <Ionicons 
            name={isEditing ? "close" : "pencil"} 
            size={20} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Info Card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color={theme.colors.text.inverse} />
            </View>
            <Text style={styles.userName}>{userData?.name || 'Usuario'}</Text>
            <Text style={styles.userEmail}>{userData?.email}</Text>
          </View>
        </Card>

        {/* Points Card */}
        <Card style={styles.pointsCard}>
          <View style={styles.pointsContent}>
            <View style={styles.pointsIcon}>
              <Ionicons name="star" size={24} color={theme.colors.status.warning} />
            </View>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsLabel}>Puntos acumulados</Text>
              <Text style={styles.pointsValue}>{userData?.points || 0}</Text>
            </View>
          </View>
        </Card>

        {/* Edit Form */}
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nombre completo</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              editable={isEditing}
              placeholder="Tu nombre completo"
              placeholderTextColor={theme.colors.text.muted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Teléfono</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
              editable={isEditing}
              placeholder="Tu número de teléfono"
              placeholderTextColor={theme.colors.text.muted}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={formData.email}
              editable={false}
              placeholder="Tu email"
              placeholderTextColor={theme.colors.text.muted}
            />
            <Text style={styles.helpText}>El email no se puede modificar</Text>
          </View>

          {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Account Actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
            <View style={styles.actionIcon}>
              <Ionicons name="log-out-outline" size={20} color={theme.colors.status.error} />
            </View>
            <Text style={[styles.actionText, { color: theme.colors.status.error }]}>
              Cerrar Sesión
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.muted} />
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
  },
  editButton: {
    padding: theme.spacing.sm,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  profileCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  userName: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  pointsCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  pointsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: `${theme.colors.status.warning}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  pointsValue: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  formCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
  },
  inputDisabled: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text.muted,
  },
  helpText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.xs,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  saveButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
  },
  actionsCard: {
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  actionText: {
    flex: 1,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
  },
});

export default ProfileScreen;