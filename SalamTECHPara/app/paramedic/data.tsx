import { Patient } from './types';

export const patients: Patient[] = [
  {
    id: "1",
    name: "Yusuf Qahtani",
    age: 45,
    distance: 0.8,
    status: "critical",
    coordinates: {
      latitude: 25.2875,
      longitude: 51.5358
    },
    info: {
      id: "1",
      name: "Yusuf Qahtani",
      age: 45,
      gender: "Male",
      bloodType: "O+",
      allergies: ["Penicillin"],
      emergencyContact: "+974 5555 1234",
      medicalHistory: ["Diabetes", "Hypertension"]
    },
    assessment: {
      consciousness: "Alert",
      breathing: "Labored",
      circulation: "Weak pulse",
      disability: "None",
      exposure: "None",
      vitals: {
        bloodPressure: "160/95",
        heartRate: 95,
        temperature: 37.8,
        oxygenSaturation: 94
      }
    }
  }
];