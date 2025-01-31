import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Tab, TabView } from '@rneui/themed';

export default function MoreInfo() {
  const { id } = useLocalSearchParams();
  const [index, setIndex] = useState(0);
  const [emergency, setEmergency] = useState<any>(null);

  useEffect(() => {
    const fetchEmergency = async () => {
      if (!id) return;
      const docRef = doc(db, 'emergencies', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEmergency({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchEmergency();
  }, [id]);

  const renderSubjectiveData = () => {
    if (!emergency?.medicalAssessment) return null;
    const ma = emergency.medicalAssessment;

    const conditions = [
      { label: 'Breathing', value: ma.breathing },
      { label: 'Seizure', value: ma.seizure },
      { label: 'Burn', value: ma.burn },
      { label: 'Cardiac Arrest', value: ma.cardiacArrest },
      { label: 'Fever', value: ma.fever },
      { label: 'Dislocation', value: ma.dislocation },
      { label: 'Fracture', value: ma.fracture },
      { label: 'Haemorrhage', value: ma.haemorrhage },
      { label: 'Vomiting Blood', value: ma.vomitingBlood },
      { label: 'Persistent Vomiting', value: ma.vomitingPersistent },
      { label: 'Coughing Blood', value: ma.coughingBlood },
      { label: 'Some Unconsciousness', value: ma.someOfUnconsciousness },
      { label: 'Stabbed Neck', value: ma.stabbedNeck },
      { label: 'Facial Dropping', value: ma.facialDropping },
      { label: 'Aggression', value: ma.aggression },
      { label: 'Eye Injury', value: ma.eyeInjury },
      { label: 'Poisoning/Overdose', value: ma.poisoningOverdose },
      { label: 'Limb Cyanosis', value: ma.limbCyanosis },
      { label: 'Pregnant', value: ma.pregnant },
      { label: 'Scale of Pain', value: ma.scaleOfPain },
    ];

    return (
      <ScrollView style={styles.tabContent}>
        {conditions.map((condition, index) => (
          condition.value && (
            <View key={index} style={styles.dataRow}>
              <Text style={styles.label}>{condition.label}:</Text>
              <Text style={styles.value}>{condition.value.toString()}</Text>
            </View>
          )
        ))}
      </ScrollView>
    );
  };

  const renderObjectiveData = () => {
    return (
      <ScrollView style={styles.tabContent}>
        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{emergency?.name || 'N/A'}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{emergency?.age || 'N/A'}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{emergency?.gender || 'N/A'}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Blood Type:</Text>
            <Text style={styles.value}>{emergency?.bloodType || 'N/A'}</Text>
          </View>
        </View>

        {/* Vitals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vitals</Text>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Mobility:</Text>
            <Text style={styles.value}>--</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>RR:</Text>
            <Text style={styles.value}>--</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>HR:</Text>
            <Text style={styles.value}>--</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>SBP:</Text>
            <Text style={styles.value}>--</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Temp:</Text>
            <Text style={styles.value}>--</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>AVPU:</Text>
            <Text style={styles.value}>--</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Trauma:</Text>
            <Text style={styles.value}>--</Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Tab
        value={index}
        onChange={setIndex}
        indicatorStyle={styles.tabIndicator}
      >
        <Tab.Item title="Objective" titleStyle={styles.tabTitle} />
        <Tab.Item title="Subjective" titleStyle={styles.tabTitle} />
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={styles.tabViewItem}>
          {renderSubjectiveData()}
        </TabView.Item>
        <TabView.Item style={styles.tabViewItem}>
          {renderObjectiveData()}
        </TabView.Item>
      </TabView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabIndicator: {
    backgroundColor: '#FF3B30',
    height: 3,
  },
  tabTitle: {
    fontSize: 16,
    color: '#FF3B30',
  },
  tabViewItem: {
    width: '100%',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FF3B30',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
}); 