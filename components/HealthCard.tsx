import { View, Text, StyleSheet } from 'react-native';
import { ReactNode } from 'react';

interface HealthCardProps {
  title?: string;
  children: ReactNode;
  backgroundColor?: string;
}

export default function HealthCard({ title, children, backgroundColor = '#FFFFFF' }: HealthCardProps) {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
});
