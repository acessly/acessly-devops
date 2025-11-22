import { Text, StyleSheet, View, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "../../constants/Colors";
import { vacancyService } from "../../services/api";

export default function Vagas() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarVagas();
  }, []);

  async function carregarVagas() {
    setLoading(true);
    try {
      const response = await vacancyService.listar(0, 20);
      setVagas(response.content || []);
    } catch (error) {
      console.error("Erro ao carregar vagas:", error);
    } finally {
      setLoading(false);
    }
  }

  function getTipoLabel(tipo) {
    const tipos = {
      REMOTE: "Remoto",
      HYBRID: "Híbrido",
      PRESENTIAL: "Presencial",
      IN_PERSON: "Presencial",
    };
    return tipos[tipo] || tipo;
  }

  function abrirVaga(vaga) {
    router.push({
      pathname: "/vaga/[id]",
      params: { 
        id: vaga.id, 
        titulo: vaga.title, 
        empresa: vaga.companyName
      },
    });
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando vagas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vagas Disponíveis</Text>
        <Text style={styles.headerSubtitle}>{vagas.length} oportunidades encontradas</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {vagas.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>Nenhuma vaga disponível</Text>
            <Text style={styles.emptyText}>
              No momento não há vagas cadastradas. Volte mais tarde!
            </Text>
          </View>
        ) : (
          vagas.map((vaga) => (
            <TouchableOpacity 
              key={vaga.id} 
              style={styles.vagaCard}
              onPress={() => abrirVaga(vaga)}
            >
              <View style={styles.vagaHeader}>
                <View style={styles.empresaIcon}>
                  <Ionicons name="business" size={24} color={Colors.primary} />
                </View>
                <View style={styles.vagaInfo}>
                  <Text style={styles.vagaTitulo}>{vaga.title}</Text>
                  <Text style={styles.vagaEmpresa}>{vaga.companyName}</Text>
                </View>
              </View>

              <View style={styles.vagaDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="location-outline" size={16} color={Colors.textLight} />
                  <Text style={styles.detailText}>
                    {vaga.city}{vaga.state ? `, ${vaga.state}` : ""}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="briefcase-outline" size={16} color={Colors.textLight} />
                  <Text style={styles.detailText}>{getTipoLabel(vaga.vacancyType)}</Text>
                </View>
              </View>

              {vaga.salary > 0 && (
                <Text style={styles.vagaSalario}>
                  R$ {vaga.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              )}

              {vaga.accessibilityOffered && (
                <View style={styles.acessibilidadeContainer}>
                  <View style={styles.acessibilidadeTag}>
                    <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                    <Text style={styles.acessibilidadeText} numberOfLines={1}>
                      {vaga.accessibilityOffered.length > 40 
                        ? vaga.accessibilityOffered.substring(0, 40) + "..." 
                        : vaga.accessibilityOffered}
                    </Text>
                  </View>
                </View>
              )}

            </TouchableOpacity>
          ))
        )}
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
    padding: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
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
  vagaCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  vagaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  empresaIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  vagaInfo: {
    flex: 1,
  },
  vagaTitulo: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  vagaEmpresa: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  vagaDetails: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  vagaSalario: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 12,
  },
  acessibilidadeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  acessibilidadeTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    flex: 1,
  },
  acessibilidadeText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    flex: 1,
  },
});