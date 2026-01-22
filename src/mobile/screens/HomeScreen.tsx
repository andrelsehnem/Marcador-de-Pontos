import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Marcador de baralho</Text>
        <Text style={styles.subtitle}>
          Acompanhe suas mãos e jogadas com facilidade!
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Novo Jogo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.buttonTextSecondary}>Histórico</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.buttonTextSecondary}>Configurações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#6C5CE7',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#6C5CE7',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
