import { Text, StyleSheet, View, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "../../constants/Colors";
import { vacancyService, candidacyService, authService } from "../../services/api";

export default function Home() {
  const { email } = useLocalSearchParams();
  const [totalVagas, setTotalVagas] = useState(0);
  const [totalCandidaturas, setTotalCandidaturas] = useState(0);
  const [userName, setUserName] = useState("");
  const [notificacoesNovas, setNotificacoesNovas] = useState(0);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
      verificarNotificacoes();
    }, [])
  );

  async function carregarDados() {
    try {
      const user = await authService.getCurrentUser();
      setUserName(user.name || email || "usuário");

      const vagasResponse = await vacancyService.listar(0, 1);
      setTotalVagas(vagasResponse.totalElements || 0);

      if (user.candidateId) {
        const candidaturasResponse = await candidacyService.listarPorCandidato(user.candidateId, 0, 1);
        setTotalCandidaturas(candidaturasResponse.totalElements || 0);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }

  async function verificarNotificacoes() {
    try {
      const user = await authService.getCurrentUser();
      if (user.candidateId) {
        const candidaturasResponse = await candidacyService.listarPorCandidato(user.candidateId, 0, 20);
        
        if (!candidaturasResponse || !candidaturasResponse.content) {
          setNotificacoesNovas(0);
          return;
        }

        
        const novas = candidaturasResponse.content.filter(c => c.status !== 'UNDER_ANALYSIS');
        setNotificacoesNovas(novas.length);
      }
    } catch (error) {
      console.error("Erro ao verificar notificações:", error);
      setNotificacoesNovas(0);
    }
  }

  function irParaVagas() {
    router.push("/(tabs)/vagas");
  }

  function irParaPerfil() {
    router.push("/(tabs)/perfil");
  }

  function irParaEmpresas() {
    router.push("/empresas");
  }

  function irParaNotificacoes() {
    router.push("/notificacoes");
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, seja bem-vindo!</Text>
            <Text style={styles.email}>{userName}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={irParaNotificacoes}>
            <Ionicons name="notifications-outline" size={24} color={Colors.white} />
            {notificacoesNovas > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificacoesNovas}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="briefcase" size={32} color={Colors.primary} />
            <Text style={styles.statNumber}>{totalVagas}</Text>
            <Text style={styles.statLabel}>Vagas Disponíveis</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="send" size={32} color={Colors.secondary} />
            <Text style={styles.statNumber}>{totalCandidaturas}</Text>
            <Text style={styles.statLabel}>Candidaturas</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={irParaVagas}>
            <View style={styles.actionIcon}>
              <Ionicons name="search" size={24} color={Colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Buscar Vagas</Text>
              <Text style={styles.actionSubtitle}>Encontre oportunidades inclusivas</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={irParaPerfil}>
            <View style={styles.actionIcon}>
              <Ionicons name="person" size={24} color={Colors.secondary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Completar Perfil</Text>
              <Text style={styles.actionSubtitle}>Aumente suas chances</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={irParaEmpresas}>
            <View style={styles.actionIcon}>
              <Ionicons name="business" size={24} color={Colors.accent} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Empresas Parceiras</Text>
              <Text style={styles.actionSubtitle}>Conheça quem está contratando</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.banner}>
          <Ionicons name="information-circle" size={24} color={Colors.primary} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Dica do dia</Text>
            <Text style={styles.bannerText}>
              Mantenha seu perfil atualizado para receber oportunidades personalizadas!
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: 4,
  },
  email: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.error,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNumber: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginTop: 4,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  banner: {
    flexDirection: "row",
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  bannerContent: {
    flex: 1,
    marginLeft: 16,
  },
  bannerTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 6,
  },
  bannerText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    lineHeight: 20,
  },
});