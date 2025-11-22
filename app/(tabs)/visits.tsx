import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClipboardList, Lightbulb, TestTube } from 'lucide-react-native';
import RecommendationCard from '@/components/RecommendationCard';
import HealthCard from '@/components/HealthCard';
import { recommendations, analysisTests, preventionTips } from '@/data/visitsData';

export default function VisitsRecommendationsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ClipboardList size={32} color="#007AFF" />
          <Text style={styles.headerTitle}>Visite e Screening</Text>
          <Text style={styles.headerSubtitle}>Raccomandazioni personalizzate</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Visite Consigliate</Text>
            <Text style={styles.sectionDescription}>
              In base alla tua età, storia familiare e dati di salute
            </Text>
          </View>

          {recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onPress={() => {
                console.log('Pressed:', recommendation.title);
              }}
            />
          ))}

          <View style={styles.divider} />

          <View style={styles.section}>
            <Lightbulb size={24} color="#FF9500" />
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Prevenzione Generale</Text>
          </View>

          <HealthCard backgroundColor="#FFF8E1">
            {preventionTips.map((tip, index) => (
              <View key={index} style={styles.tipContainer}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </HealthCard>

          <View style={styles.divider} />

          <View style={styles.section}>
            <TestTube size={24} color="#34C759" />
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Analisi Suggerite</Text>
            <Text style={styles.sectionDescription}>
              Esami del sangue raccomandati per il check-up annuale
            </Text>
          </View>

          <HealthCard>
            {analysisTests.map((test, index) => (
              <View
                key={test.id}
                style={[
                  styles.analysisItem,
                  index !== analysisTests.length - 1 && styles.analysisItemBorder,
                ]}
              >
                <View style={styles.analysisIconContainer}>
                  <TestTube size={20} color="#34C759" />
                </View>
                <View style={styles.analysisContent}>
                  <Text style={styles.analysisName}>{test.name}</Text>
                  <Text style={styles.analysisDescription}>{test.description}</Text>
                </View>
              </View>
            ))}
          </HealthCard>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Consulta sempre il tuo medico prima di prenotare visite o esami.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginTop: 12,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 24,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF9500',
    marginTop: 8,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: '#5D4037',
    lineHeight: 22,
  },
  analysisItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  analysisItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  analysisIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  analysisContent: {
    flex: 1,
  },
  analysisName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  analysisDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  footer: {
    marginTop: 24,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
  },
  footerText: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
});
