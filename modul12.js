import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  StatusBar, 
  SafeAreaView 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// 1. Data Layanan (Gunakan icon yang pasti ada di MaterialCommunityIcons)
const SERVICES = [
  { id: '1', title: 'Gentleman Haircut', price: 'Rp 50.000', icon: 'content-cut' },
  { id: '2', title: 'Hair Treatment', price: 'Rp 35.000', icon: 'water' }, 
  { id: '3', title: 'Shaving & Massage', price: 'Rp 25.000', icon: 'face-man' },
  { id: '4', title: 'Hair Coloring', price: 'Rp 120.000', icon: 'palette' },
  { id: '5', title: 'Classic Shave', price: 'Rp 20.000', icon: 'razor-double-edge' },
];

export default function App() {
  const [showCatalog, setShowCatalog] = useState(false);

  // Render Item (Tanpa TypeScript Annotation agar tidak error)
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.cardCatalog} activeOpacity={0.7}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={item.icon} size={28} color="#fbbf24" />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.serviceTitle}>{item.title}</Text>
        <Text style={styles.servicePrice}>{item.price}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#1e3a8a" />
    </TouchableOpacity>
  );

  if (!showCatalog) {
    return (
      <SafeAreaView style={styles.containerIdentity}>
        <StatusBar barStyle="light-content" />
        <View style={styles.contentIdentity}>
          <MaterialCommunityIcons name="content-cut" size={100} color="#fbbf24" />
          <Text style={styles.brandName}>BARBER-TECH</Text>

          <View style={styles.devCard}>
            <Text style={styles.devLabel}>DEVELOPER INFO:</Text>
            <Text style={styles.devName}>NAMA MAHASISWA</Text>
            <Text style={styles.devNim}>NIM: 220012345 (MI/BD)</Text>
          </View>

          <TouchableOpacity 
            style={styles.buttonMain} 
            onPress={() => setShowCatalog(true)}
          >
            <Text style={styles.buttonText}>MASUK KE MODE PELANGGAN</Text>
          </TouchableOpacity>
          <Text style={styles.cloudInfo}>☁️ Connected via Expo Cloud</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.containerCatalog}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerCatalog}>
        <TouchableOpacity onPress={() => setShowCatalog(false)}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fbbf24" />
        </TouchableOpacity>
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.headerTitle}>Layanan Kami</Text>
          <Text style={styles.headerSubtitle}>Gentleman Barber & Grooming</Text>
        </View>
      </View>

      <FlatList
        data={SERVICES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Developer: [NAMA] - [NIM] - MI/BD</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerIdentity: { flex: 1, backgroundColor: '#1e3a8a' },
  contentIdentity: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  brandName: { fontSize: 32, fontWeight: 'bold', color: '#fbbf24', marginTop: 10, letterSpacing: 2 },
  devCard: { 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    padding: 20, 
    borderRadius: 15, 
    width: '100%', 
    marginTop: 40,
    borderWidth: 1,
    borderColor: '#fbbf24'
  },
  devLabel: { color: '#fbbf24', fontSize: 10, fontWeight: 'bold' },
  devName: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 5 },
  devNim: { color: '#cbd5e1', fontSize: 16 },
  buttonMain: { 
    backgroundColor: '#fbbf24', 
    width: '100%', 
    padding: 18, 
    borderRadius: 12, 
    marginTop: 40, 
    alignItems: 'center'
  },
  buttonText: { color: '#1e3a8a', fontWeight: 'bold', fontSize: 16 },
  cloudInfo: { color: '#94a3b8', fontSize: 12, marginTop: 20 },
  containerCatalog: { flex: 1, backgroundColor: '#1e3a8a' },
  headerCatalog: { 
    paddingTop: 50, // Agar tidak tertutup Notch
    paddingBottom: 20,
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1e40af' 
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fbbf24' },
  headerSubtitle: { color: '#fff', fontSize: 14, opacity: 0.8 },
  listContainer: { padding: 20 },
  cardCatalog: { 
    backgroundColor: '#fff', 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 15 
  },
  iconBox: { 
    width: 50, 
    height: 50, 
    backgroundColor: '#1e3a8a', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  infoBox: { flex: 1, marginLeft: 15 },
  serviceTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  servicePrice: { fontSize: 14, color: '#1e40af', fontWeight: '600' },
  footer: { padding: 15, alignItems: 'center' },
  footerText: { color: '#fff', fontSize: 10, opacity: 0.5 }
});