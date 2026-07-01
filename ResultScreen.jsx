import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { analyzeImage, PROMPTS } from './lib/gemini';

export default function ResultScreen({ route }) {
  const { base64Image, promptKey } = route.params;
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { runAnalysis(); }, []);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const prompt = PROMPTS[promptKey];
      if (!prompt) throw new Error(`No prompt found for key "${promptKey}"`);

      const result = await analyzeImage(base64Image, prompt);
      console.log('FULL GEMINI RESULT:', JSON.stringify(result, null, 2));

      if (result?.error) {
        throw new Error(result.error.message || 'Gemini API returned an error');
      }

      const candidate = result?.candidates?.[0];
      const finishReason = candidate?.finishReason;
      if (finishReason && finishReason !== 'STOP') {
        throw new Error(`Gemini stopped early: ${finishReason}. Try a different photo or persona.`);
      }

      let textPart = candidate?.content?.parts?.[0]?.text;
      if (!textPart) throw new Error('Empty response from Gemini — check terminal for full result');

      console.log('RAW GEMINI TEXT:', textPart);

      const jsonStart = textPart.indexOf('{');
      const jsonEnd = textPart.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error(`No JSON found. Gemini said: "${textPart.slice(0, 150)}"`);
      }
      textPart = textPart.slice(jsonStart, jsonEnd + 1);

      setAnalysis(JSON.parse(textPart));
    } catch (err) {
      setError(err.message || 'Could not analyze this image. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5B3FA3" />
        <Text style={styles.loadingText}>Analyzing image...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Objects</Text>
      {analysis.objects.map((obj, i) => (
        <Text key={i} style={styles.listItem}>• {obj}</Text>
      ))}
      <Text style={styles.sectionTitle}>Context</Text>
      <Text style={styles.bodyText}>{analysis.context}</Text>
      <Text style={styles.sectionTitle}>Activities</Text>
      <Text style={styles.bodyText}>{analysis.activities}</Text>
      <Text style={styles.sectionTitle}>Recommendations</Text>
      <Text style={styles.bodyText}>{analysis.recommendations}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, color: '#5A6472' },
  errorText: { color: '#B3261E', textAlign: 'center', fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, color: '#1F2A44' },
  listItem: { fontSize: 15, marginTop: 4 },
  bodyText: { fontSize: 15, marginTop: 4, color: '#2B2F38' },
});