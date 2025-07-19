
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase.config';
import { collection, getDocs } from 'firebase/firestore';

const PuntosScreen = () => {
  const { userData, updateUserPoints } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      const rewardsCollection = await getDocs(collection(db, 'rewards'));
      const rewardsData = rewardsCollection.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRewards(rewardsData);
    } catch (error) {
      console.error('Error loading rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = async (reward) => {
    if (!userData || userData.points < reward.pointsCost) {
      Alert.alert('Puntos Insuficientes', `Necesitas ${reward.pointsCost} puntos para canjear este premio.`);
      return;
    }

    Alert.alert(
      'Confirmar Canje',
      `¿Deseas canjear "${reward.title}" por ${reward.pointsCost} puntos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Canjear',
          onPress: async () => {
            const newPoints = userData.points - reward.pointsCost;
            const result = await updateUserPoints(newPoints);
            
            if (result.success) {
              Alert.alert('¡Canjeado!', `Has canjeado ${reward.title} exitosamente.`);
            } else {
              Alert.alert('Error', 'No se pudo procesar el canje.');
            }
          }
        }
      ]
    );
  };

  const renderReward = ({ item }) => (
    <View style={styles.rewardCard}>
      <Text style={styles.rewardTitle}>{item.title}</Text>
      <Text style={styles.rewardDescription}>{item.description}</Text>
      <Text style={styles.rewardCost}>{item.pointsCost} puntos</Text>
      <TouchableOpacity
        style={[
          styles.redeemButton,
          userData?.points < item.pointsCost && styles.disabledButton
        ]}
        onPress={() => handleRedeemReward(item)}
        disabled={!userData || userData.points < item.pointsCost}
      >
        <Text style={styles.redeemButtonText}>
          {userData?.points >= item.pointsCost ? 'Canjear' : 'Puntos Insuficientes'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Puntos</Text>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsLabel}>Balance actual:</Text>
          <Text style={styles.pointsValue}>{userData?.points || 0}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Premios Disponibles</Text>
      
      {loading ? (
        <Text style={styles.loadingText}>Cargando premios...</Text>
      ) : (
        <FlatList
          data={rewards}
          renderItem={renderReward}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  pointsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 16,
    color: '#666',
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
  rewardCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  rewardCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  redeemButton: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  redeemButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PuntosScreen;
