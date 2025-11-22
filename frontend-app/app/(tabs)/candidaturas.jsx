import { Text, StyleSheet, View, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "../../constants/Colors";
import { candidacyService, authService } from "../../services/api";

export default function Candidaturas() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarCandidaturas();
    }, [])
  );

  async function carregarCandidaturas() {
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      
      if (user.candidateId) {
        const response = await candidacyService.listarPorCandidato(user.candidateId, 0, 50);
        setCandidaturas(response.content || []);
      } else {
        setCandidaturas([]);
      }
    } catch (error) {
      console.error("Erro ao carregar candidaturas:", error);
      setCandidaturas([]);
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await carregarCandidaturas();
    setRefreshing(false);
  }

  function getStatusInfo(status) {
    const infos = {
      UNDER_ANALYSIS: {
        label: "Em análise",
        icon: "time-outline",
        color: Colors.accent,
      },
      APPROVED: {
        label: "Aprovado",
        icon: "checkmark-circle-outline",
        color: Colors.success,
      },
      REJECTED: {
        label: "Rejeitado",
        icon: "close-circle-outline",
        color: Colors.error,
      },
    };
    return infos[status] || {
      label: status,
      icon: "help-outline",
      color: Colors.textLight,
    };
  }

  function abrirVaga(vagaId) {
    router.push({
      pathname: "/vaga/[id]",
      params: { id: vagaId },
    });
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando candidaturas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const estatisticas = {
    total: candidaturas.length,
    emAnalise: candidaturas.filter(c => c.status === 'UNDER_ANALYSIS').length,
    aprovadas: candidaturas.filter(c => c.status === 'APPROVED').length,
    rejeitadas: candidaturas.filter(c => c.status === 'REJECTED').length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Minhas Candidaturas</Text>
          <Text style={styles.headerSubtitle}>{estatisticas.total} candidatura(s)</Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {estatisticas.total > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Ionicons name="time-outline" size={20} color={Colors.accent} />
              <Text style={styles.statNumber}>{estatisticas.emAnalise}</Text>
              <Text style={styles.statLabel}>Em análise</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.statNumber}>{estatisticas.aprovadas}</Text>
              <Text style={styles.statLabel}>Aprovadas</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="close-circle" size={20} color={Colors.error} />
              <Text style={styles.statNumber}>{estatisticas.rejeitadas}</Text>
              <Text style={styles.statLabel}>Rejeitadas</Text>
            </View>
          </View>
        )}

        {candidaturas.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>Nenhuma candidatura</Text>
            <Text style={styles.emptyText}>
              Você ainda não se candidatou a nenhuma vaga. Explore as oportunidades disponíveis!
            </Text>
            <TouchableOpacity 
              style={styles.explorarButton}
              onPress={() => router.push("/(tabs)/vagas")}
            >
              <Text style={styles.explorarText}>Explorar vagas</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {candidaturas.map((candidatura) => {
              const statusInfo = getStatusInfo(candidatura.status);
              const data = new Date(candidatura.applicationDate);

              return (
                <TouchableOpacity 
                  key={candidatura.id} 
                  style={styles.candidaturaCard}
                  onPress={() => abrirVaga(candidatura.vacancyId)}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.empresaIcon}>
                      <Ionicons name="business" size={24} color={Colors.primary} />
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.vagaTitulo} numberOfLines={1}>
                        {candidatura.vacancyTitle}
                      </Text>
                      <Text style={styles.vagaEmpresa} numberOfLines={1}>
                        {candidatura.companyName}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
                      <Ionicons 
                        name={statusInfo.icon} 
                        size={16} 
                        color={statusInfo.color} 
                      />
                      <Text style={[styles.statusText, { color: statusInfo.color }]}>
                        {statusInfo.label}
                      </Text>
                    </View>
                    <Text style={styles.dataText}>
                      {data.toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginTop: 2,
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
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
    lineHeight: 20,
    marginBottom: 24,
  },
  explorarButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  explorarText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.background,
  },
  candidaturaCard: {
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
  cardInfo: {
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
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
  },
  dataText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
});