import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Activity,
  Users,
  Clock,
  ChevronRight,
  AlertCircle,
} from 'lucide-react-native';
import HealthCard from '@/components/HealthCard';
import MiniChart from '@/components/MiniChart';
import {
  healthStatus,
  healthMetrics,
  dailySuggestion,
  familyRisk,
  lastSync,
} from '@/data/healthData';

export default function HealthDashboardScreen() {
  const router = useRouter();

  const getRiskColor = () => {
    switch (healthStatus.riskLevel) {
      case 'low':
        return '#34C759';
      case 'medium':
        return '#FF9500';
      case 'high':
        return '#FF3B30';
      default:
        return '#34C759';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard Salute</Text>
          <Text style={styles.headerSubtitle}>Monitora il tuo benessere</Text>
        </View>

        <View style={styles.content}>
          <HealthCard>
            <View style={styles.riskHeader}>
              <Activity size={28} color={getRiskColor()} />
              <Text style={styles.riskTitle}>Stato di Salute</Text>
            </View>
            <View style={styles.riskIndicator}>
              <View style={[styles.riskDot, { backgroundColor: getRiskColor() }]} />
              <Text style={styles.riskText}>{healthStatus.riskText}</Text>
            </View>
            <Text style={styles.riskPercentage}>{healthStatus.wellnessIndex}%</Text>
            <View style={styles.riskBar}>
              <View
                style={[
                  styles.riskBarFill,
                  {
                    width: `${healthStatus.wellnessIndex}%`,
                    backgroundColor: getRiskColor(),
                  },
                ]}
              />
            </View>
          </HealthCard>

          <HealthCard title="Parametri Vitali">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.metricsContainer}
            >
              {healthMetrics.map((metric) => (
                <MiniChart key={metric.id} metric={metric} />
              ))}
            </ScrollView>
          </HealthCard>

          <HealthCard backgroundColor="#E8F5E9">
            <View style={styles.suggestionHeader}>
              <AlertCircle size={24} color="#34C759" />
              <Text style={styles.suggestionCategory}>{dailySuggestion.category}</Text>
            </View>
            <Text style={styles.suggestionTitle}>Suggerimento del Giorno</Text>
            <Text style={styles.suggestionText}>{dailySuggestion.text}</Text>
          </HealthCard>

          <HealthCard>
            <View style={styles.syncHeader}>
              <Clock size={20} color="#8E8E93" />
              <Text style={styles.syncText}>
                Ultima sincronizzazione {lastSync.minutesAgo} minuti fa
              </Text>
            </View>
            <Text style={styles.syncDevice}>Apple Watch Series 9</Text>
          </HealthCard>

          <TouchableOpacity activeOpacity={0.8}>
            <HealthCard backgroundColor="#F0F9FF">
              <View style={styles.familyHeader}>
                <Users size={24} color="#007AFF" />
                <Text style={styles.familyTitle}>{familyRisk.description}</Text>
              </View>
              <Text style={styles.familyCount}>
                {familyRisk.sharedRisks} fattori di rischio condivisi
              </Text>
              <View style={styles.familyAction}>
                <Text style={styles.familyActionText}>Vedi dettagli</Text>
                <ChevronRight size={20} color="#007AFF" />
              </View>
            </HealthCard>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/(tabs)/visits')}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaButtonText}>Mostra suggerimenti visite</Text>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
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
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  content: {
    padding: 20,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  riskTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 12,
  },
  riskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  riskText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  riskPercentage: {
    fontSize: 48,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  riskBar: {
    height: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  riskBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricsContainer: {
    paddingVertical: 8,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34C759',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 15,
    color: '#1B5E20',
    lineHeight: 22,
  },
  syncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  syncText: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 8,
  },
  syncDevice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginTop: 4,
  },
  familyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  familyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 12,
  },
  familyCount: {
    fontSize: 15,
    color: '#000000',
    marginBottom: 12,
  },
  familyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  familyActionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#007AFF',
  },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
});
