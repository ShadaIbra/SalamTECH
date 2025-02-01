# SalamTECH Patient Interface

The patient interface is a mobile application that allows users to log in, register, or access as a guest. The home page prominently displays “SOS” and “Volunteer” buttons for quick access. Selecting SOS prompts the user to specify the type of crisis and whether it is for themselves or someone else. From there, an AI-powered chatbot, which users can either text or speak to, collects critical information. It tailors its questions based on stored health data for registered users, mimicking those that paramedics typically ask. The chatbot compiles this information into a patient profile and provides real-time first-aid guidance, such as analyzing breathing through audio or assessing injuries via the camera, while waiting for paramedics.

## Features
- AI-powered emergency chat assistance
- Family member management system
- User profile and medical history storage
- Emergency contact coordination
- Voice and text interaction options

## Installation/Setting up
(All dependancies are listed in a json file named as package in our code, these are the main ones)
- Firebase account and project setup
- First install Node.js from the link https:\ \nodejs.org\ 
- install React Native 
- install required dependencies 
    - npm install @expo/vector-icons
    - npm install expo-router
    - npm install react-native-maps
    - npm install react-native-safe-area-context
    - npm install react-native-screens
    - npm install react-native-gesture-handler
    - npm install firebase
    - npm install @react-navigation/native

### Mobile App Setup
1. Install Expo Go on your mobile device:
   - iOS: App Store
   - Android: Play Store

2. Clone the repository

3. Start the development server:
   - npx expo start


4. Scan the QR code with your mobile device to open the app in Expo Go

## Environment Variables
Create a `.env` file in the root directory with your Firebase and OpenAI configurations:
    - FIREBASE_API_KEY=your_api_key
    - FIREBASE_AUTH_DOMAIN=your_auth_domain
    - FIREBASE_PROJECT_ID=your_project_id
    - FIREBASE_STORAGE_BUCKET=your_storage_bucket
    - FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    - FIREBASE_APP_ID=your_app_id
    - OPENAI_API_KEY=your_openai_api_key

## Testing
- Run the development server using `npx expo start`
- Use Expo Go on your mobile device to test the app
- For testing emergency features, use the test mode to avoid triggering real emergency services

## Credits
- OpenAI GPT for AI assistance
- Firebase for backend services
- Expo for mobile development framework
- React Native for the application framework

## License
This project is licensed under the MIT License - see the LICENSE file for details.