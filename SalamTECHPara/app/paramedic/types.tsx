export interface Patient {
  id: string;
  name: string;
  age: number;
  distance: number;
  status: "critical" | "needAssist" | "stable";
  coordinates: {
    latitude: number;
    longitude: number;
  };
  info: PatientInfo;
  assessment: Assessment;
}

export interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  allergies: string[];
  emergencyContact: string;
  medicalHistory: string[];
}

export interface Assessment {
  consciousness: string;
  breathing: string;
  circulation: string;
  disability: string;
  exposure: string;
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    oxygenSaturation: number;
  };
} 