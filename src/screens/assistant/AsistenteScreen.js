import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Input, Card } from '../../components/ui';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const AsistenteScreen = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: 'bot',
      message: '¡Hola! Soy tu asistente virtual de Glam. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);

  const quickQuestions = [
    {
      icon: 'time',
      text: '¿Cuáles son los horarios?',
      response: 'Nuestros horarios son de lunes a viernes de 10:00 a 18:00. Los fines de semana estamos cerrados.'
    },
    {
      icon: 'location',
      text: '¿Dónde están ubicados?',
      response: 'Tenemos 3 ubicaciones: Centro, Palermo y Belgrano. Puedes ver las direcciones exactas en la sección de reservas.'
    },
    {
      icon: 'card',
      text: '¿Qué servicios ofrecen?',
      response: 'Ofrecemos cortes de cabello, peinados, tratamientos capilares, coloración y servicios de barbería profesional.'
    },
    {
      icon: 'help-circle',
      text: '¿Cómo cancelo mi turno?',
      response: 'Puedes cancelar tu turno desde la sección "Mis Turnos" hasta 2 horas antes de tu cita programada.'
    }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: message.trim(),
      timestamp: new Date()
    };

    const botResponse = {
      id: Date.now() + 1,
      type: 'bot',
      message: 'Gracias por tu mensaje. Nuestro equipo te responderá pronto. ¿Hay algo más en lo que pueda ayudarte?',
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage, botResponse]);
    setMessage('');
  };

  const handleQuickQuestion = (question) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: question.text,
      timestamp: new Date()
    };

    const botResponse = {
      id: Date.now() + 1,
      type: 'bot',
      message: question.response,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage, botResponse]);
  };

  const renderMessage = (item) => (
    <View
      key={item.id}
      style={[
        styles.messageContainer,
        item.type === 'user' ? styles.userMessage : styles.botMessage
      ]}
    >
      {item.type === 'bot' && (
        <View style={styles.botAvatar}>
          <Ionicons name="chatbubble" size={16} color={theme.colors.text.inverse} />
        </View>
      )}
      
      <View
        style={[
          styles.messageBubble,
          item.type === 'user' ? styles.userBubble : styles.botBubble
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.type === 'user' ? styles.userText : styles.botText
          ]}
        >
          {item.message}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
      
      {item.type === 'user' && (
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={16} color={theme.colors.text.inverse} />
        </View>
      )}
    </View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.assistantIcon}>
              <Ionicons name="chatbubble-ellipses" size={24} color={theme.colors.accent} />
            </View>
            <View>
              <Text style={styles.title}>Asistente Virtual</Text>
              <Text style={styles.subtitle}>Estoy aquí para ayudarte</Text>
            </View>
          </View>
        </View>

        {/* Quick Questions */}
        <View style={styles.quickQuestionsContainer}>
          <Text style={styles.sectionTitle}>Preguntas frecuentes</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickQuestions}
          >
            {quickQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickQuestionCard}
                onPress={() => handleQuickQuestion(question)}
              >
                <Ionicons 
                  name={question.icon} 
                  size={20} 
                  color={theme.colors.accent}
                  style={styles.quickQuestionIcon}
                />
                <Text style={styles.quickQuestionText}>{question.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chat History */}
        <ScrollView 
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          ref={ref => {
            if (ref) {
              ref.scrollToEnd({ animated: true });
            }
          }}
        >
          {chatHistory.map(renderMessage)}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Input
              placeholder="Escribe tu mensaje..."
              value={message}
              onChangeText={setMessage}
              style={styles.messageInput}
              rightIcon="send"
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={message.trim() ? theme.colors.primary : theme.colors.text.muted} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assistantIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: `${theme.colors.accent}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  quickQuestionsContainer: {
    paddingVertical: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  quickQuestions: {
    paddingHorizontal: theme.spacing.lg,
  },
  quickQuestionCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.sm,
    minWidth: 160,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  quickQuestionIcon: {
    marginBottom: theme.spacing.sm,
  },
  quickQuestionText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.primary,
    textAlign: 'center',
    fontWeight: theme.typography.weights.medium,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  chatContent: {
    paddingVertical: theme.spacing.md,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: theme.borderRadius.sm,
  },
  botBubble: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: theme.borderRadius.sm,
  },
  messageText: {
    fontSize: theme.typography.sizes.md,
    lineHeight: 20,
  },
  userText: {
    color: theme.colors.text.inverse,
  },
  botText: {
    color: theme.colors.text.primary,
  },
  timestamp: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.xs,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    backgroundColor: theme.colors.background,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  messageInput: {
    flex: 1,
    marginBottom: 0,
  },
  sendButton: {
    position: 'absolute',
    right: theme.spacing.md,
    top: theme.spacing.md,
    padding: theme.spacing.sm,
  },
});

export default AsistenteScreen;