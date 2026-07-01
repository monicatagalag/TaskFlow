import { View, Image, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { imageToBase64 } from './lib/gemini';

export default function PreviewScreen({ route, navigation }) {
  const { photoUri } = route.params;

  async function goAnalyze(personaKey) {
    try {
      const base64Image = await imageToBase64(photoUri);
      navigation.navigate('Result', { base64Image, promptKey: personaKey });
    } catch (err) {
      Alert.alert('Error converting photo', err.message);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.preview} />
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.retakeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.personaRow}>
        <TouchableOpacity style={styles.analyzeButton} onPress={() => goAnalyze('academic')}>
          <Text style={styles.buttonText}>Academic Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.analyzeButton} onPress={() => goAnalyze('safety')}>
          <Text style={styles.buttonText}>Safety Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.analyzeButton} onPress={() => goAnalyze('inventory')}>
          <Text style={styles.buttonText}>Inventory Analysis</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  preview: { flex: 1, resizeMode: 'contain' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 10 },
  personaRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, flexWrap: 'wrap' },
  retakeButton: { backgroundColor: '#5A6472', padding: 14, borderRadius: 8 },
  analyzeButton: { backgroundColor: '#5B3FA3', padding: 10, borderRadius: 8, margin: 4 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});