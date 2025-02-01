# SalamTECH Paramedic Response System

## Description
SalamTECH Paramedic Response System is a mobile application designed for emergency medical responders. The app provides real-time emergency case tracking, patient information management, and intelligent triage assessment. Paramedics can view emergency cases on an interactive map, access patient medical histories, and receive guided navigation to emergency locations.

## Features
- Real-time emergency case tracking with map visualization
- Automated triage assessment system (Red, Yellow, Green)
- Patient medical history access through QR code scanning
- Turn-by-turn navigation to emergency locations
- Patient list management with priority indicators
- Secure paramedic authentication system

## Installation

### Prerequisites
- Node.js (v14.0.0 or higher) - Download from https://nodejs.org
- Expo CLI (`npm install -g expo-cli`)
- Firebase account and project
- Expo Go mobile app (iOS/Android)

### Dependencies
    - npm install @expo/vector-icons
    - npm install expo-router
    - npm install react-native-maps
    - npm install react-native-safe-area-context
    - npm install react-native-screens  
    - npm install react-native-gesture-handler
    - npm install firebase
    - npm install @react-navigation/native


### Setup
1. Clone the repository:
    - git clone https://github.com/yourusername/salamtech-paramedic.git
    - cd salamtech-paramedic

2. Install dependencies:
    - npm install

3. Start the development server:
    - npm start

4. Create a `.env` file in the root directory with your Firebase configurations:
    - FIREBASE_API_KEY=your_api_key
    - FIREBASE_AUTH_DOMAIN=your_auth_domain
    - FIREBASE_PROJECT_ID=your_project_id
    - FIREBASE_STORAGE_BUCKET=your_storage_bucket
    - FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    - FIREBASE_APP_ID=your_app_id


### Mobile App Setup
1. Install Expo Go on your mobile device:
   - iOS: Download from App Store
   - Android: Download from Play Store

2. Start the development server:
    -npx expo start


3. Scan the QR code with your mobile device to open the app in Expo Go

## Testing
- Use the development server with `npx expo start`
- Test paramedic login with provided credentials
- Use test mode for emergency response simulation
- Verify map functionality and navigation features
- Test QR code scanning with sample patient codes

## Security Note
This application contains sensitive medical information and emergency response features. Always use secure credentials and follow proper authentication protocols.

## Credits
- Firebase for backend services and authentication
- Expo for mobile development framework
- React Native for application framework
- React Native Maps for navigation features
- OpenAI for triage assessment algorithms

## License
This project is licensed under the MIT License 

