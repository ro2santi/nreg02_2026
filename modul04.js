import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TouchableOpacity, 
  StatusBar, SafeAreaView, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView, Linking
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// KONFIGURASI OWNER (Untuk UTS Fitur WhatsApp)
const OWNER_PHONE = "6281220042270"; 

const SERVICES = [
  { id: '1', title: 'Gentleman Haircut', price: 'Rp 50.000', icon: 'content-cut' },
  { id: '2', title: 'Hair Treatment', price: 'Rp 35.000', icon: 'water' }, 
  { id: '3', title: 'Shaving & Massage', price: 'Rp 25.000', icon: 'face-man' },
  { id: '4', title: 'Hair Coloring', price: 'Rp 120.000', icon: 'palette' },
  { id: '5', title: 'Classic Shave', price: 'Rp 20.000', icon: 'razor-double-edge' },
];

export default function App() {
  const [currentView, setCurrentView] = useState('identity'); 
  const [selectedService, setSelectedService] = useState(null);
  
  // STATE INPUT PELANGGAN (MODUL 3 & UTS)
  const [customerName, setCustomerName] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [customerWA, setCustomerWA] = useState(''); // Fitur Tambahan UTS

  // STATE OWNER ACCESS (MODUL 4)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // LOGIKA BOOKING & WHATSAPP (MODUL 3 & UTS)
  const handleBooking = () => {
    if (!customerName || !bookingTime || !customerWA) {
      Alert.alert("Data Belum Lengkap", "Silakan isi Nama, Jam, dan Nomor WhatsApp.");
      return;
    }

    // Template Pesan UTS
    const message = `Halo Barber-Tech!\n\nSaya ingin booking layanan:\n` +
                    `- Jasa: ${selectedService.title}\n` +
                    `- Nama: ${customerName}\n` +
                    `- Jam: ${bookingTime}\n` +
                    `- WA: ${customerWA}\n\nMohon konfirmasinya.`;

    const url = `https://wa.me/62${customerWA}?text=${encodeURIComponent(message)}`;

    Alert.alert("Booking Berhasil!", `Konfirmasi dikirim ke WhatsApp Customer.`);
    
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Pastikan WhatsApp terinstal.");
    });

    // Reset State
    setSelectedService(null);
    setCustomerName('');
    setBookingTime('');
    setCustomerWA('');
    setCurrentView('identity'); // Kembali ke Utama setelah Booking
  };

  // LOGIKA LOGIN OWNER (MODUL 4)
  const handleLogin = () => {
    if (username === 'admin' && password === 'barber123') {
      setCurrentView('admin');
      Alert.alert("Login Berhasil", "Selamat datang, Owner!");
    } else {
      Alert.alert("Gagal", "Username atau Password salah!");
    }
  };

  // LOGIKA LOGOUT (PERBAIKAN: KEMBALI KE HALAMAN UTAMA)
  const handleLogout = () => {
    setUsername('');
    setPassword('');
    setCurrentView('identity'); // Reset ke tampilan awal
    Alert.alert("Logout", "Anda telah keluar dari sistem.");
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.cardCatalog} 
      onPress={() => {
        setSelectedService(item);
        setCurrentView('booking');
      }}
    >
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={item.icon} size={28} color="#fbbf24" />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.serviceTitle}>{item.title}</Text>
        <Text style={styles.servicePrice}>{item.price}</Text>
      </View>
      <MaterialCommunityIcons name="whatsapp" size={24} color="#25D366" />
    </TouchableOpacity>
  );

  // VIEW 1: IDENTITY (MODUL 1)
  if (currentView === 'identity') {
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
          
          <TouchableOpacity style={styles.buttonMain} onPress={() => setCurrentView('catalog')}>
            <Text style={styles.buttonText}>MASUK KE MODE PELANGGAN</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonOwnerLink} onPress={() => setCurrentView('login')}>
            <Text style={styles.buttonTextOwner}>LOGIN OWNER ACCESS</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // VIEW: LOGIN (MODUL 4)
  if (currentView === 'login') {
    return (
      <SafeAreaView style={styles.containerCatalog}>
        <View style={styles.headerCatalog}>
          <TouchableOpacity onPress={() => setCurrentView('identity')}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fbbf24" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {marginLeft: 15}]}>Owner Login</Text>
        </View>
        <View style={styles.formArea}>
          <Text style={styles.label}>Username:</Text>
          <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
          <Text style={styles.label}>Password:</Text>
          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <TouchableOpacity style={styles.buttonMain} onPress={handleLogin}>
            <Text style={styles.buttonText}>MASUK DASHBOARD</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // VIEW: DASHBOARD ADMIN (MODUL 4 & LOGOUT FIX)
  if (currentView === 'admin') {
    return (
      <SafeAreaView style={[styles.containerCatalog, {backgroundColor: '#0f172a'}]}>
        <View style={[styles.headerCatalog, {backgroundColor: '#1e293b', justifyContent: 'space-between'}]}>
          <Text style={styles.headerTitle}>Dashboard Admin</Text>
          <TouchableOpacity onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={26} color="#f87171" />
          </TouchableOpacity>
        </View>
        <View style={styles.formArea}>
          <View style={styles.adminCard}>
            <MaterialCommunityIcons name="view-dashboard" size={40} color="#fbbf24" />
            <Text style={styles.devName}>Selamat Datang, Admin</Text>
            <Text style={styles.devLabel}>Sistem Keamanan Owner Aktif</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // VIEW: BOOKING FORM (MODUL 3 & UTS FITUR WA)
  if (currentView === 'booking') {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.containerCatalog}>
        <View style={styles.headerCatalog}>
            <TouchableOpacity onPress={() => setCurrentView('catalog')}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#fbbf24" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, {marginLeft: 15}]}>Form Booking</Text>
        </View>
        <ScrollView style={styles.formArea}>
            <Text style={styles.formHeading}>Layanan: {selectedService?.title}</Text>
            
            <Text style={styles.label}>Nama Lengkap:</Text>
            <TextInput style={styles.input} placeholder="Nama Pelanggan" value={customerName} onChangeText={setCustomerName} />
            
            <Text style={styles.label}>Nomor WhatsApp (+62):</Text>
            <TextInput style={styles.input} placeholder="8xxx" keyboardType="phone-pad" value={customerWA} onChangeText={setCustomerWA} />
            
            <Text style={styles.label}>Jam Rencana:</Text>
            <TextInput style={styles.input} placeholder="Contoh 10:00" value={bookingTime} onChangeText={setBookingTime} />
            
            <TouchableOpacity style={styles.buttonWA} onPress={handleBooking}>
                <MaterialCommunityIcons name="whatsapp" size={20} color="#1e3a8a" style={{marginRight: 10}} />
                <Text style={styles.buttonText}>KONFIRMASI VIA WA</Text>
            </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // VIEW: CATALOG (MODUL 2)
  return (
    <SafeAreaView style={styles.containerCatalog}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerCatalog}>
        <TouchableOpacity onPress={() => setCurrentView('identity')}>
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
  devCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 20, borderRadius: 15, width: '100%', marginTop: 40, borderWidth: 1, borderColor: '#fbbf24' },
  devLabel: { color: '#fbbf24', fontSize: 10, fontWeight: 'bold' },
  devName: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 5 },
  devNim: { color: '#cbd5e1', fontSize: 16 },
  buttonMain: { backgroundColor: '#fbbf24', width: '100%', padding: 18, borderRadius: 12, marginTop: 40, alignItems: 'center' },
  buttonOwnerLink: { marginTop: 25 },
  buttonTextOwner: { color: '#fbbf24', textDecorationLine: 'underline', fontSize: 14 },
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
  formArea: { padding: 30, flex: 1 },
  formHeading: { fontSize: 18, color: '#fbbf24', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { color: '#fff', fontSize: 14, marginBottom: 8, marginTop: 10 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 15, fontSize: 16, color: '#1e3a8a' },
  adminCard: { backgroundColor: '#1e293b', padding: 25, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#fbbf24', width: '100%' },
  buttonWA: { backgroundColor: '#fbbf24', width: '100%', padding: 18, borderRadius: 12, marginTop: 30, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }
});