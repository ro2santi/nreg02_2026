import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TouchableOpacity, 
  StatusBar, SafeAreaView, TextInput, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SERVICES = [
  { id: '1', title: 'Gentleman Haircut', price: 'Rp 50.000', icon: 'content-cut' },
  { id: '2', title: 'Hair Treatment', price: 'Rp 35.000', icon: 'water' }, 
  { id: '3', title: 'Shaving & Massage', price: 'Rp 25.000', icon: 'face-man' },
  { id: '4', title: 'Hair Coloring', price: 'Rp 120.000', icon: 'palette' },
  { id: '5', title: 'Classic Shave', price: 'Rp 20.000', icon: 'razor-double-edge' },
];

export default function App() {
  const [showCatalog, setShowCatalog] = useState(false);
  
  // MODUL 3 LOGIC: Mengelola State Transaksi
  const [selectedService, setSelectedService] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  const handleBooking = () => {
    if (!customerName || !bookingTime) {
      Alert.alert("Data Belum Lengkap", "Silakan isi Nama dan Jam Booking.");
      return;
    }
    Alert.alert("Booking Berhasil!", `Konfirmasi: ${selectedService.title}\nAtas Nama: ${customerName}\nJam: ${bookingTime}`);
    setSelectedService(null); // Kembali ke Katalog
    setCustomerName('');
    setBookingTime('');
  };

  // UI Component: Item Katalog (Sama dengan Modul 2)
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.cardCatalog} 
      onPress={() => setSelectedService(item)} // Trigger Booking Logic
    >
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={item.icon} size={28} color="#fbbf24" />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.serviceTitle}>{item.title}</Text>
        <Text style={styles.servicePrice}>{item.price}</Text>
      </View>
      <MaterialCommunityIcons name="plus-circle" size={24} color="#1e3a8a" />
    </TouchableOpacity>
  );

  // VIEW 1: IDENTITY (Modul 1)
  if (!showCatalog) {
    return (
      <SafeAreaView style={styles.containerIdentity}>
        <View style={styles.contentIdentity}>
          <MaterialCommunityIcons name="content-cut" size={100} color="#fbbf24" />
          <Text style={styles.brandName}>BARBER-TECH</Text>
          <View style={styles.devCard}>
            <Text style={styles.devLabel}>DEVELOPER INFO:</Text>
            <Text style={styles.devName}>NAMA MAHASISWA</Text>
            <Text style={styles.devNim}>NIM: 220012345 (MI/BD)</Text>
          </View>
          <TouchableOpacity style={styles.buttonMain} onPress={() => setShowCatalog(true)}>
            <Text style={styles.buttonText}>MASUK KE MODE PELANGGAN</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // VIEW 3: FORM BOOKING (Modul 3 Baru)
  if (selectedService) {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.containerCatalog}>
        <View style={styles.headerCatalog}>
            <TouchableOpacity onPress={() => setSelectedService(null)}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#fbbf24" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, {marginLeft: 15}]}>Lengkapi Data</Text>
        </View>
        <View style={styles.formArea}>
            <Text style={styles.formHeading}>Anda Memilih: {selectedService.title}</Text>
            
            <Text style={styles.label}>Nama Lengkap:</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Masukkan Nama Anda" 
              placeholderTextColor="#94a3b8"
              value={customerName}
              onChangeText={setCustomerName} // Update State Nama
            />

            <Text style={styles.label}>Jam Rencana (Contoh: 10:00):</Text>
            <TextInput 
              style={styles.input} 
              placeholder="HH:mm" 
              placeholderTextColor="#94a3b8"
              value={bookingTime}
              onChangeText={setBookingTime} // Update State Jam
            />

            <TouchableOpacity style={styles.buttonMain} onPress={handleBooking}>
                <Text style={styles.buttonText}>KONFIRMASI BOOKING</Text>
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // VIEW 2: CATALOG (Modul 2)
  return (
    <SafeAreaView style={styles.containerCatalog}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerCatalog}>
        <TouchableOpacity onPress={() => setShowCatalog(false)}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fbbf24" />
        </TouchableOpacity>
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.headerTitle}>Layanan Kami</Text>
          <Text style={styles.headerSubtitle}>Pilih Jasa Untuk Booking</Text>
        </View>
      </View>

      <FlatList
        data={SERVICES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerIdentity: { flex: 1, backgroundColor: '#1e3a8a' },
  contentIdentity: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  brandName: { fontSize: 32, fontWeight: 'bold', color: '#fbbf24', marginTop: 10, letterSpacing: 2 },
  devCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 20, borderRadius: 15, width: '100%', marginTop: 40, borderSize: 1, borderColor: '#fbbf24' },
  devLabel: { color: '#fbbf24', fontSize: 10, fontWeight: 'bold' },
  devName: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 5 },
  devNim: { color: '#cbd5e1', fontSize: 16 },
  buttonMain: { backgroundColor: '#fbbf24', width: '100%', padding: 18, borderRadius: 12, marginTop: 40, alignItems: 'center' },
  buttonText: { color: '#1e3a8a', fontWeight: 'bold', fontSize: 16 },
  containerCatalog: { flex: 1, backgroundColor: '#1e3a8a' },
  headerCatalog: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e40af' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fbbf24' },
  headerSubtitle: { color: '#fff', fontSize: 14, opacity: 0.8 },
  listContainer: { padding: 20 },
  cardCatalog: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 15, marginBottom: 15 },
  iconBox: { width: 50, height: 50, backgroundColor: '#1e3a8a', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  infoBox: { flex: 1, marginLeft: 15 },
  serviceTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  servicePrice: { fontSize: 14, color: '#1e40af', fontWeight: '600' },
  
  // MODUL 3 STYLES
  formArea: { padding: 30, flex: 1 },
  formHeading: { fontSize: 18, color: '#fbbf24', fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  label: { color: '#fff', fontSize: 14, marginBottom: 10, marginTop: 10 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 15, fontSize: 16, color: '#1e3a8a' }
});