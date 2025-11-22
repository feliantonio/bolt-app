import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Profile, INITIAL_PROFILE } from '@/types/profile';
import { loadProfile, updateProfile, confirmProfile, getProfileStatus } from '@/services/profileService';
import { User, Edit2, CheckCircle, AlertTriangle } from 'lucide-react-native';

export default function DashboardScreen() {
    const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Profile>>({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        const data = await loadProfile();
        setProfile(data);
        setLoading(false);
    };

    const handleEdit = () => {
        setEditForm(profile);
        setEditModalVisible(true);
    };

    const handleSave = async () => {
        if (!editForm.age || !editForm.sex || !editForm.location) {
            Alert.alert('Errore', 'Età, Sesso e Località sono obbligatori.');
            return;
        }

        // Ensure numeric age
        const ageNum = typeof editForm.age === 'string' ? parseInt(editForm.age, 10) : editForm.age;

        const updated = await updateProfile({
            ...editForm,
            age: ageNum,
        });
        setProfile(updated);
        setEditModalVisible(false);
        Alert.alert('Salvato', 'Profilo aggiornato. Ricorda di confermare i dati.');
    };

    const handleConfirm = async () => {
        const confirmed = await confirmProfile();
        setProfile(confirmed);
        Alert.alert('Confermato', 'I tuoi dati sono stati confermati. Ora puoi procedere con l\'analisi in chat.');
    };

    const status = getProfileStatus(profile);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Il Tuo Profilo</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Status Card */}
                <View style={[styles.card, styles.statusCard]}>
                    <View style={styles.statusHeader}>
                        {status === 'CONFIRMED' ? (
                            <CheckCircle size={24} color="#34C759" />
                        ) : (
                            <AlertTriangle size={24} color="#FF9500" />
                        )}
                        <Text style={styles.statusTitle}>
                            {status === 'CONFIRMED' ? 'Profilo Confermato' : 'Conferma Richiesta'}
                        </Text>
                    </View>
                    <Text style={styles.statusText}>
                        {status === 'CONFIRMED'
                            ? 'I tuoi dati sono aggiornati e validati.'
                            : 'Per procedere con l\'analisi, verifica e conferma i tuoi dati.'}
                    </Text>
                    {status !== 'CONFIRMED' && (
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                            <Text style={styles.confirmButtonText}>Conferma Dati Profilo</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Profile Data Sections */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Dati Personali</Text>
                        <TouchableOpacity onPress={handleEdit}>
                            <Edit2 size={20} color="#007AFF" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.card}>
                        <InfoRow label="Età" value={profile.age?.toString() || '-'} />
                        <InfoRow label="Sesso" value={profile.sex || '-'} />
                        <InfoRow label="Località" value={profile.location || '-'} />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Salute e Stile di Vita</Text>
                    <View style={styles.card}>
                        <InfoRow label="Fumo" value={profile.lifestyle.smoking || '-'} />
                        <InfoRow label="Alcol" value={profile.lifestyle.alcohol || '-'} />
                        <InfoRow label="Attività" value={profile.lifestyle.physicalActivity || '-'} />
                        <InfoRow label="Dieta" value={profile.lifestyle.dietQuality || '-'} />
                        <InfoRow label="BMI" value={profile.lifestyle.bmi?.toString() || '-'} />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Note</Text>
                    <View style={styles.card}>
                        <InfoRow label="Storia Familiare" value={profile.familyHistory || '-'} />
                        <InfoRow label="Storia Medica" value={profile.medicalHistory || '-'} />
                        <InfoRow label="Esposizioni" value={profile.exposures || '-'} />
                    </View>
                </View>
            </ScrollView>

            {/* Edit Modal */}
            <Modal visible={editModalVisible} animationType="slide" presentationStyle="pageSheet">
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Modifica Profilo</Text>
                        <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                            <Text style={styles.closeButton}>Chiudi</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <Text style={styles.label}>Età *</Text>
                        <TextInput
                            style={styles.input}
                            value={editForm.age?.toString()}
                            onChangeText={(t) => setEditForm({ ...editForm, age: parseInt(t) || 0 })}
                            keyboardType="numeric"
                            placeholder="Es. 45"
                        />

                        <Text style={styles.label}>Sesso * (M/F)</Text>
                        <TextInput
                            style={styles.input}
                            value={editForm.sex || ''}
                            onChangeText={(t) => setEditForm({ ...editForm, sex: t as any })}
                            placeholder="M, F, Altro"
                        />

                        <Text style={styles.label}>Località *</Text>
                        <TextInput
                            style={styles.input}
                            value={editForm.location || ''}
                            onChangeText={(t) => setEditForm({ ...editForm, location: t })}
                            placeholder="Città"
                        />

                        <Text style={styles.sectionLabel}>Stile di Vita</Text>

                        <Text style={styles.label}>Fumo (no/ex/yes)</Text>
                        <TextInput
                            style={styles.input}
                            value={editForm.lifestyle?.smoking || ''}
                            onChangeText={(t) => setEditForm({ ...editForm, lifestyle: { ...(editForm.lifestyle || profile.lifestyle), smoking: t as any } })}
                        />

                        <Text style={styles.label}>Alcol (none/occasional/frequent)</Text>
                        <TextInput
                            style={styles.input}
                            value={editForm.lifestyle?.alcohol || ''}
                            onChangeText={(t) => setEditForm({ ...editForm, lifestyle: { ...(editForm.lifestyle || profile.lifestyle), alcohol: t as any } })}
                        />

                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Salva Modifiche</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    content: { padding: 20 },
    section: { marginBottom: 24 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#000', marginBottom: 8 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    statusCard: { marginBottom: 24, borderLeftWidth: 4, borderLeftColor: '#FF9500' }, // Default yellow
    statusHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    statusTitle: { fontSize: 18, fontWeight: '600', marginLeft: 8 },
    statusText: { fontSize: 14, color: '#666', marginBottom: 12 },
    confirmButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
    confirmButtonText: { color: '#fff', fontWeight: '600' },
    row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
    rowLabel: { color: '#666' },
    rowValue: { fontWeight: '500' },

    // Modal
    modalContainer: { flex: 1, backgroundColor: '#F2F2F7' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff' },
    modalTitle: { fontSize: 18, fontWeight: 'bold' },
    closeButton: { color: '#007AFF', fontSize: 16 },
    modalContent: { padding: 20 },
    label: { fontSize: 14, color: '#666', marginBottom: 4, marginTop: 12 },
    sectionLabel: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 8 },
    input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E5EA' },
    saveButton: { backgroundColor: '#34C759', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
    saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
