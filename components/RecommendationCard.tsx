import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Recommendation } from '@/types/visits';
import {
  Stethoscope,
  HeartPulse,
  ScanEye,
  Eye,
  Bone,
  ChevronRight,
} from 'lucide-react-native';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onPress?: () => void;
}

export default function RecommendationCard({ recommendation, onPress }: RecommendationCardProps) {
  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'Alta':
        return '#FF3B30';
      case 'Media':
        return '#FF9500';
      case 'Bassa':
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };

  const getIcon = () => {
    const color = getPriorityColor();
    switch (recommendation.icon) {
      case 'stethoscope':
        return <Stethoscope size={28} color={color} />;
      case 'heart-pulse':
        return <HeartPulse size={28} color={color} />;
      case 'scan':
        return <ScanEye size={28} color={color} />;
      case 'eye':
        return <Eye size={28} color={color} />;
      case 'bone':
        return <Bone size={28} color={color} />;
      default:
        return <Stethoscope size={28} color={color} />;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.category}>{recommendation.category}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() + '20' }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor() }]}>
              {recommendation.priority}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>{recommendation.title}</Text>
        <Text style={styles.reason}>{recommendation.reason}</Text>

        <View style={styles.actionContainer}>
          <Text style={styles.actionText}>Prenota / Informazioni</Text>
          <ChevronRight size={18} color="#007AFF" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
  },
  reason: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#007AFF',
    marginRight: 4,
  },
});
