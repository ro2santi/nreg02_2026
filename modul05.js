import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TouchableOpacity, 
  StatusBar, SafeAreaView, TextInput, Alert, KeyboardAvoidingView, 
  Platform, ScrollView, Linking 
} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- 1. KONFIGURASI SUPABASE ---
const supabaseUrl = 'gunakan url masing-masing';
const supabaseKey = 'gunakan API key masing-masing';
const supabase = createClient(supabaseUrl, supabaseKey);

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
  
  // States Pelanggan (Modul 3)
  const [customerName, setCustomerName] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [customerWA, setCustomerWA] = useState('');

  // States Owner & Database (Modul 4 & 5)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [queues, setQueues] = useState([]);
  const [session, setSession] = useState(null);

  // --- 2. LOGIKA DATABASE & AUTH ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setCurrentView('admin');
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setCurrentView('admin');
    });

    fetchQueues();
    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchQueues = async () => {
    const { data, error } = await supabase
      .from('queues')
      .select('*')
      .order('id', { ascending: false });
    if (data) setQueues(data);
  };

  // LOGIKA BOOKING SESUAI PERMINTAAN
  const handleBooking = async () => {
    if (!customerName || !bookingTime || !customerWA) {
      return Alert.alert("Error", "Lengkapi semua data!");
    }

    // Simpan ke Supabase (Modul 5)
    const { error } = await supabase.from('queues').insert([{ 
      name: customerName, 
      service: selectedService.title, 
      time: bookingTime, 
      wa_number: customerWA, 
      status: 'Menunggu' 
    }]);

    if (!error) {
        // Logika Pesan WhatsApp sesuai permintaan Anda
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

        // Reset State & Kembali ke Identity
        setSelectedService(null);
        setCustomerName('');
        setBookingTime('');
        setCustomerWA('');
        setCurrentView('identity'); 
        fetchQueues();
    } else {
      Alert.alert("Gagal Simpan", error.message);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Isi email & password!");
    const { error } = await supabase.auth.signInWithPassword({ 
      email: email.trim(), 
      password: password 
    });
    
    if (error) {
      Alert.alert("Login Gagal", error.message);
    } else {
      setCurrentView('admin');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentView('identity');
    setEmail('');
    setPassword('');
  };

  const updateStatus = async (id) => {
    await supabase.from('queues').update({ status: 'Selesai' }).eq('id', id);
    fetchQueues();
  };

  const deleteQueue = async (id) => {
    await supabase.from('queues').delete().eq('id', id);
    fetchQueues();
  };

  // --- 3. RENDERING VIEWS ---

  if (currentView === 'identity') {
    return (
      <SafeAreaView style={styles.containerBlue}>
        <View style={styles.center}>
          <MaterialCommunityIcons name="content-cut" size={100} color="#fbbf24" />
          <Text style={styles.brand}>BARBER-TECH</Text>
          <View style={styles.cardDev}>
            <Text style={styles.devLabel}>DEVELOPER INFO:</Text>
            <Text style={styles.devName}>NAMA MAHASISWA</Text>
            <Text style={styles.devNim}>2200XXXXX - MI/BD</Text>
          </View>
          <TouchableOpacity style={styles.btnGold} onPress={() => setCurrentView('catalog')}>
            <Text style={styles.btnText}>MODE PELANGGAN</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentView('login')} style={{marginTop: 25}}>
            <Text style={styles.ownerLink}>Owner Access (Login)</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (currentView === 'login') {
    return (
      <SafeAreaView style={styles.containerBlue}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentView('identity')}><MaterialCommunityIcons name="arrow-left" size={24} color="#fbbf24" /></TouchableOpacity>
          <Text style={styles.headerTitle}>Owner Login</Text>
        </View>
        <View style={{padding: 30}}>
          <TextInput style={styles.input} placeholder="Email Admin" value={email} onChangeText={setEmail} autoCapitalize="none"/>
          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword}/>
          <TouchableOpacity style={styles.btnGold} onPress={handleLogin}><Text style={styles.btnText}>MASUK DASHBOARD</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (currentView === 'admin' && session) {
    return (
      <SafeAreaView style={styles.containerAdmin}>
        <View style={styles.headerAdmin}>
          <Text style={styles.headerTitleAdmin}>Dashboard Antrean</Text>
          <TouchableOpacity onPress={handleLogout}><MaterialCommunityIcons name="logout" size={26} color="#f87171" /></TouchableOpacity>
        </View>
        <FlatList 
          data={queues} 
          keyExtractor={item => item.id.toString()} 
          renderItem={({item}) => (
            <View style={styles.cardQueue}>
              <View style={{flex: 1}}>
                <Text style={styles.qName}>{item.name}</Text>
                <Text style={styles.qDetail}>{item.service} • {item.time}</Text>
                <Text style={[styles.qStatus, {color: item.status === 'Selesai' ? '#4ad395' : '#fbbf24'}]}>{item.status}</Text>
              </View>
              <TouchableOpacity onPress={() => updateStatus(item.id)}><MaterialCommunityIcons name="check-circle" size={30} color={item.status === 'Selesai' ? '#4ad395' : '#4b5563'} /></TouchableOpacity>
              <TouchableOpacity onPress={() => deleteQueue(item.id)} style={{marginLeft: 15}}><MaterialCommunityIcons name="delete" size={30} color="#f87171" /></TouchableOpacity>
            </View>
          )} 
        />
      </SafeAreaView>
    );
  }

  if (currentView === 'booking') {
    return (
      <SafeAreaView style={styles.containerBlue}>
        <View style={styles.header}><TouchableOpacity onPress={() => setCurrentView('catalog')}><MaterialCommunityIcons name="arrow-left" size={24} color="#fbbf24" /></TouchableOpacity><Text style={styles.headerTitle}>Form Booking</Text></View>
        <ScrollView style={{padding: 30}}>
          <Text style={styles.formInfo}>Layanan: {selectedService?.title}</Text>
          <TextInput style={styles.input} placeholder="Nama Lengkap" value={customerName} onChangeText={setCustomerName} />
          <TextInput style={styles.input} placeholder="WA (8123xxx)" keyboardType="phone-pad" value={customerWA} onChangeText={setCustomerWA} />
          <TextInput style={styles.input} placeholder="Jam (10:00)" value={bookingTime} onChangeText={setBookingTime} />
          <TouchableOpacity style={styles.btnGold} onPress={handleBooking}><Text style={styles.btnText}>KONFIRMASI</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.containerBlue}>
      <View style={styles.header}><TouchableOpacity onPress={() => setCurrentView('identity')}><MaterialCommunityIcons name="arrow-left" size={24} color="#fbbf24" /></TouchableOpacity><Text style={styles.headerTitle}>Pilih Layanan</Text></View>
      <FlatList data={SERVICES} contentContainerStyle={{padding: 20}} renderItem={({item}) => (
        <TouchableOpacity style={styles.cardService} onPress={() => {setSelectedService(item); setCurrentView('booking');}}>
          <MaterialCommunityIcons name={item.icon} size={28} color="#1e3a8a" />
          <View style={{flex: 1, marginLeft: 15}}><Text style={styles.serviceTitle}>{item.title}</Text><Text>{item.price}</Text></View>
          <MaterialCommunityIcons name="plus-circle" size={24} color="#1e3a8a" />
        </TouchableOpacity>
      )} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerBlue: { flex: 1, backgroundColor: '#1e3a8a' },
  containerAdmin: { flex: 1, backgroundColor: '#0f172a' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  brand: { fontSize: 32, fontWeight: 'bold', color: '#fbbf24', marginTop: 10 },
  cardDev: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 25, borderRadius: 15, width: '100%', marginTop: 30, borderWidth: 1, borderColor: '#fbbf24' },
  devLabel: { color: '#fbbf24', fontSize: 10, fontWeight: 'bold' },
  devName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  btnGold: { backgroundColor: '#fbbf24', width: '100%', padding: 18, borderRadius: 12, marginTop: 40, alignItems: 'center' },
  btnText: { color: '#1e3a8a', fontWeight: 'bold' },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fbbf24', marginLeft: 15 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, color: '#1e3a8a' },
  cardService: { backgroundColor: '#fff', flexDirection: 'row', padding: 15, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
  serviceTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' },
  headerAdmin: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 25, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#1e293b' },
  headerTitleAdmin: { fontSize: 22, fontWeight: 'bold', color: '#fbbf24' },
  cardQueue: { backgroundColor: '#1e293b', padding: 20, borderRadius: 15, marginHorizontal: 20, marginTop: 15, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 5, borderLeftColor: '#fbbf24' },
  qName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  qDetail: { color: '#94a3b8' },
  qStatus: { fontSize: 12, fontWeight: 'bold', marginTop: 5 },
  ownerLink: { color: '#fbbf24', textDecorationLine: 'underline' },
  formInfo: { color: '#fbbf24', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }
});