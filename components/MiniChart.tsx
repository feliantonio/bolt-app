import { View, Text, StyleSheet } from 'react-native';
import { HealthMetric } from '@/types/health';
import {
  Heart,
  Moon,
  Brain,
  Activity,
  Scale,
} from 'lucide-react-native';

interface MiniChartProps {
  metric: HealthMetric;
}

export default function MiniChart({ metric }: MiniChartProps) {
  const getIcon = () => {
    switch (metric.icon) {
      case 'heart':
        return <Heart size={24} color={metric.color} />;
      case 'moon':
        return <Moon size={24} color={metric.color} />;
      case 'brain':
        return <Brain size={24} color={metric.color} />;
      case 'activity':
        return <Activity size={24} color={metric.color} />;
      case 'scale':
        return <Scale size={24} color={metric.color} />;
      default:
        return <Activity size={24} color={metric.color} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{getIcon()}</View>
      <Text style={styles.name}>{metric.name}</Text>
      <Text style={styles.value}>
        {metric.value}
        {metric.unit && <Text style={styles.unit}> {metric.unit}</Text>}
      </Text>
      <View style={styles.chartPlaceholder}>
        <View style={[styles.bar, { backgroundColor: metric.color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainer: {
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  unit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8E8E93',
  },
  chartPlaceholder: {
    width: '100%',
    height: 40,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
});
