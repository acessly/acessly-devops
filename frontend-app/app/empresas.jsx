import { Text, StyleSheet, View, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "../constants/Colors";
import { companyService } from "../services/api";

export default function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEmpresas();
  }, []);

  async function carregarEmpresas() {
    setLoading(true);
    try {
      const response = await companyService.listar(0, 20);
      setEmpresas(response.content || []);
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
    } finally {
      setLoading(false);
    }
  }

  function voltar() {
    router.back();
  }

  function verVagasEmpresa(empresaNome) {
    router.push({
      pathname: "/(tabs)/vagas",
    });
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando empresas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={voltar}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Empresas Parceiras</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>
          {empresas.length} empresa(s) comprometida(s) com a inclusão
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {empresas.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="business-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>Nenhuma empresa cadastrada</Text>
            <Text style={styles.emptyText}>
              No momento não há empresas parceiras cadastradas. Volte mais tarde!
            </Text>
          </View>
        ) : (
          empresas.map((empresa) => (
            <View key={empresa.id} style={styles.empresaCard}>
              <View style={styles.cardHeader}>
                <View style={styles.empresaIcon}>
                  <Ionicons name="business" size={28} color={Colors.primary} />
                </View>
                <View style={styles.empresaInfo}>
                  <Text style={styles.empresaNome}>{empresa.name}</Text>
                  <Text style={styles.empresaSetor}>{empresa.sector}</Text>
                </View>
              </View>

              {empresa.website && (
                <View style={styles.locationContainer}>
                  <Ionicons name="globe-outline" size={16} color={Colors.textLight} />
                  <Text style={styles.locationText}>{empresa.website}</Text>
                </View>
              )}

              {empresa.description && (
                <Text style={styles.descriptionText}>{empresa.description}</Text>
              )}

              <View style={styles.accessibilitySection}>
                <Text style={styles.accessibilityTitle}>Nível de acessibilidade:</Text>
                <View style={styles.accessibilityContainer}>
                  <View style={styles.accessibilityTag}>
                    <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
                    <Text style={styles.accessibilityText}>
                      {empresa.acessibilityType === 'LOW' && 'Básico'}
                      {empresa.acessibilityType === 'MEDIUM' && 'Intermediário'}
                      {empresa.acessibilityType === 'HIGH' && 'Avançado'}
                      {!empresa.acessibilityType && 'Não informado'}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.verVagasButton}
                onPress={() => verVagasEmpresa(empresa.name)}
              >
                <Text style={styles.verVagasText}>Ver vagas disponíveis</Text>
                <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  placeholder: {
    width: 40,
  },
  subHeader: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  subHeaderText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  empresaCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  empresaIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  empresaInfo: {
    flex: 1,
  },
  empresaNome: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  empresaSetor: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    lineHeight: 20,
    marginBottom: 16,
  },
  accessibilitySection: {
    marginBottom: 16,
  },
  accessibilityTitle: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: Colors.textLight,
    marginBottom: 8,
  },
  accessibilityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  accessibilityTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  accessibilityText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  verVagasButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  verVagasText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  bottomSpacing: {
    height: 24,
  },
});