# MASAA Mobile Strategy - React Native Implementation

## Overview
MASAA will support iOS and Android through React Native, sharing business logic with the web version while maintaining platform-specific UI optimizations.

---

## Architecture Strategy

### Shared Codebase Approach
```
masaa/
├── packages/
│   ├── core/                    # Shared business logic
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── store/              # Zustand state management
│   │   └── types/
│   ├── web/                    # Web React app
│   │   └── src/
│   ├── mobile/                 # React Native app
│   │   ├── ios/
│   │   ├── android/
│   │   └── src/
│   └── shared-components/      # Reusable components
```

### Tech Stack

| Technology | Purpose |
|-----------|---------|
| React Native | Mobile Framework |
| React Navigation | Routing & Navigation |
| Redux/Zustand | State Management |
| Firebase | Push Notifications, Auth |
| AsyncStorage | Local Data Persistence |
| NativeBase/React Native Paper | UI Components |
| TypeScript | Type Safety |
| Jest | Testing |
| Xcode | iOS Development |
| Android Studio | Android Development |

---

## Setup Instructions

### Prerequisites
```bash
# Install Node.js (v18+)
# Install Xcode (for iOS)
# Install Android Studio (for Android)
# Install Ruby (for iOS dependencies)
```

### Create Project

```bash
# Install React Native CLI
npm install -g react-native-cli

# Create new project
npx react-native init MASAAApp --template typescript

# Navigate to project
cd MASAAApp

# Install dependencies
npm install

# Install additional packages
npm install @react-navigation/native @react-navigation/stack
npm install @react-navigation/bottom-tabs
npm install @react-native-async-storage/async-storage
npm install firebase
npm install react-native-gesture-handler
npm install zustand
npm install axios
npm install date-fns
```

### Install Dependencies for iOS

```bash
cd ios
pod install
cd ..
```

---

## Core Mobile Components

### 1. Navigation Structure

**Tab Navigator (Bottom Tabs)**
```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens
import DashboardScreen from './screens/DashboardScreen';
import CalendarScreen from './screens/CalendarScreen';
import BookingScreen from './screens/BookingScreen';
import TasksScreen from './screens/TasksScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'home';
          else if (route.name === 'Calendar') iconName = 'calendar';
          else if (route.name === 'Booking') iconName = 'share-variant';
          else if (route.name === 'Tasks') iconName = 'checkbox-marked-circle';
          else if (route.name === 'Profile') iconName = 'account';
          
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#3B82F6',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen}
        options={{ title: 'Calendar' }}
      />
      <Tab.Screen 
        name="Booking" 
        component={BookingScreen}
        options={{ title: 'Booking' }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TasksScreen}
        options={{ title: 'Tasks' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}
```

### 2. Calendar Screen (Mobile)

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCalendarStore } from '../store/calendarStore';

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { events } = useCalendarStore();

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const getEventsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Month Navigation */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#3B82F6" />
          </TouchableOpacity>
          
          <Text style={styles.monthYear}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
          
          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <View key={day} style={styles.dayHeader}>
              <Text style={styles.dayHeaderText}>{day}</Text>
            </View>
          ))}
          
          {Array.from({ length: firstDay }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.dayCell} />
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDate(day);
            
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayCell,
                  dayEvents.length > 0 && styles.dayCellWithEvents
                ]}
              >
                <Text style={styles.dayNumber}>{day}</Text>
                {dayEvents.length > 0 && (
                  <View style={styles.eventDot}>
                    <Text style={styles.eventDotText}>{dayEvents.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Add Event Button */}
        <TouchableOpacity style={styles.addButton}>
          <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Event</Text>
        </TouchableOpacity>

        {/* Events List */}
        <View style={styles.eventsList}>
          <Text style={styles.eventsTitle}>Upcoming Events</Text>
          <FlatList
            scrollEnabled={false}
            data={events.filter(e => e.date >= currentDate.toISOString().split('T')[0])}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.eventItem}>
                <View style={styles.eventDot} />
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventTime}>{item.startTime} - {item.endTime}</Text>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    padding: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    marginBottom: 20,
  },
  dayHeader: {
    width: '14.28%',
    padding: 12,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontWeight: '600',
    color: '#6B7280',
    fontSize: 12,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 4,
  },
  dayCellWithEvents: {
    backgroundColor: '#EFF6FF',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  eventDot: {
    width: 20,
    height: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  eventDotText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  eventsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2937',
  },
  eventItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  eventContent: {
    marginLeft: 12,
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  eventTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});
```

### 3. State Management (Zustand)

```javascript
// store/calendarStore.js
import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCalendarStore = create((set, get) => ({
  events: [],
  tasks: [],
  
  addEvent: async (event) => {
    const newEvent = { ...event, id: Date.now().toString() };
    set(state => ({
      events: [...state.events, newEvent]
    }));
    await saveToStorage();
  },
  
  deleteEvent: async (id) => {
    set(state => ({
      events: state.events.filter(e => e.id !== id)
    }));
    await saveToStorage();
  },
  
  updateEvent: async (id, updated) => {
    set(state => ({
      events: state.events.map(e => e.id === id ? { ...e, ...updated } : e)
    }));
    await saveToStorage();
  },
  
  addTask: async (task) => {
    const newTask = { ...task, id: Date.now().toString() };
    set(state => ({
      tasks: [...state.tasks, newTask]
    }));
    await saveToStorage();
  },
  
  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem('masaa_data');
      if (data) {
        const parsed = JSON.parse(data);
        set({
          events: parsed.events || [],
          tasks: parsed.tasks || []
        });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }
}));

const saveToStorage = async () => {
  try {
    const state = useCalendarStore.getState();
    await AsyncStorage.setItem('masaa_data', JSON.stringify({
      events: state.events,
      tasks: state.tasks
    }));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};
```

### 4. Push Notifications (Firebase)

```javascript
// services/notificationService.js
import * as firebase from 'firebase/app';
import * as messaging from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = firebase.initializeApp(firebaseConfig);
const fcmMessaging = messaging.getMessaging(app);

export const initNotifications = async () => {
  try {
    const permission = await messaging.getToken(fcmMessaging, {
      vapidKey: process.env.FIREBASE_VAPID_KEY
    });
    console.log('FCM Token:', permission);
    
    // Send token to backend
    await saveTokenToBackend(permission);
  } catch (error) {
    console.error('Failed to get FCM token:', error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(fcmMessaging, (payload) => {
      resolve(payload);
    });
  });

const saveTokenToBackend = async (token) => {
  // API call to save token
};
```

---

## Platform-Specific Considerations

### iOS
- Use Xcode for development
- Requires Apple Developer account
- Permissions: Calendar, Contacts
- Handle App Lifecycle events
- Keychain for secure token storage

### Android
- Use Android Studio
- Requires Google Play account
- Permissions: READ_CALENDAR, WRITE_CALENDAR
- Handle Android lifecycle
- SharedPreferences for encrypted storage

---

## Performance Optimization

### Mobile-Specific
- Lazy load calendar months
- Virtual scrolling for large lists
- Image optimization for thumbnails
- Reduce bundle size with tree-shaking
- Implement offline-first synchronization
- Use React Native Fast Image for caching

### Memory Management
```javascript
// Prevent memory leaks
useEffect(() => {
  const unsubscribe = messageListener();
  
  return () => {
    unsubscribe();
  };
}, []);
```

---

## Testing Strategy

### Unit Tests (Jest)
```bash
npm test
```

### Integration Tests
```javascript
// __tests__/calendar.test.js
describe('Calendar functionality', () => {
  it('should add event', () => {
    // Test logic
  });
  
  it('should delete event', () => {
    // Test logic
  });
});
```

### E2E Tests (Detox)
```bash
npm install --save-dev detox-cli detox
detox init -r ios
```

---

## Deployment

### iOS
```bash
cd ios
xcodebuild -workspace MASAAApp.xcworkspace -scheme MASAAApp -configuration Release
```

### Android
```bash
cd android
./gradlew assembleRelease
# Upload to Google Play Console
```

---

## Development Workflow

```bash
# Development server
npm start

# Run on iOS Simulator
npm run ios

# Run on Android Emulator
npm run android

# Build for production
npm run build:ios
npm run build:android
```

---

## Future Enhancements

- Apple Watch integration
- Siri Shortcuts for voice commands
- Widgets on home screen
- Calendar sync with device calendar
- Local notifications
- Offline-first architecture
- Biometric authentication

---

## Resources

- React Native Docs: https://reactnative.dev
- React Navigation: https://reactnavigation.org
- Firebase for React Native: https://rnfirebase.io
- Expo: https://expo.dev
- React Native Paper: https://reactnativepaper.com

---

**MASAA Mobile — Intelligent Scheduling On The Go**
