import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Käännökset: FI, SV, EN, ET (Viro), AR (Arabia)
const translations = {
  fi: { title: "Pukuri", subtitle: "Älykäs apu aamun varustevalintoihin", search: "Hae kaupunki (esim. Salo)", layers: ["Aluskerros", "Lämmin välikerrasto", "Päällysvaatteet", "Kengät"] },
  sv: { title: "Pukuri", subtitle: "Smart hjälp för morgonens klädval", search: "Sök stad", layers: ["Underställ", "Varmt mellanlager", "Ytterkläder", "Skor"] },
  en: { title: "Pukuri", subtitle: "Smart help for morning clothing choices", search: "Search city", layers: ["Base layer", "Warm mid-layer", "Outerwear", "Shoes"] },
  et: { title: "Pukuri", subtitle: "Nutikas abi hommikusteks valikuteks", search: "Otsi linna", layers: ["Aluskiht", "Soe vahekiht", "Väliriided", "Jalanõud"] },
  ar: { title: "بوكوري", subtitle: "مساعدة ذكية لاختيار ملابس الصباح", search: "بحث عن مدينة", layers: ["الطبقة الأساسية", "طبقة متوسطة دافئة", "ملابس خارجية", "أحذية"] }
};

export default function App() {
  const [lang, setLang] = useState('fi');
  const [temp, setTemp] = useState(10);
  const [city, setCity] = useState('Salo');
  const t = translations[lang];

  return (
    <View style={[styles.container, lang === 'ar' && { direction: 'rtl' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
        </View>

        <View style={styles.langBar}>
          {['fi', 'sv', 'en', 'et', 'ar'].map(l => (
            <TouchableOpacity key={l} onPress={() => setLang(l)} style={styles.langBtn}>
              <Text style={lang === l ? styles.activeLang : styles.langText}>{l.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cityText}>{city}: {temp}°C</Text>
          <View style={styles.adviceList}>
            {t.layers.map((layer, index) => {
              if (index === 1 && temp > 5) return null; // Välikerrasto vain alle +5
              return (
                <View key={index} style={styles.layerItem}>
                  <Text style={styles.layerText}>{index + 1}. {layer}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { paddingTop: 60, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '900', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', paddingHorizontal: 20 },
  langBar: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20 },
  langBtn: { padding: 8 },
  activeLang: { fontWeight: 'bold', color: '#3B82F6', textDecorationLine: 'underline' },
  langText: { color: '#6B7280' },
  card: { backgroundColor: '#FFFFFF', margin: 20, padding: 25, borderRadius: 24, elevation: 4 },
  cityText: { fontSize: 22, fontWeight: '700', marginBottom: 15, textAlign: 'center' },
  adviceList: { gap: 12 },
  layerItem: { padding: 15, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  layerText: { fontSize: 16, color: '#374151', fontWeight: '600' }
});
