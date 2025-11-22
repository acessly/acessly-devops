import { Text, StyleSheet, View, TouchableOpacity, ScrollView, StatusBar, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "../../constants/Colors";
import { vacancyService, candidacyService, authService } from "../../services/api";

export default function VagaDetalhes() {
  const { id, titulo, empresa } = useLocalSearchParams();
  const [vaga, setVaga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [candidatando, setCandidatando] = useState(false);

  useEffect(() => {
    carregarVaga();
  }, []);

  async function carregarVaga() {
    setLoading(true);
    try {
      const response = await vacancyService.buscarPorId(id);
      setVaga(response);
    } catch (error) {
      console.error("Erro ao carregar vaga:", error);
      
      setVaga({
        id: id,
        title: titulo || "Vaga",
        companyName: empresa || "Empresa",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleCandidatar() {
    const user = await authService.getCurrentUser();
    
    console.log("========== CANDIDATURA DEBUG ==========");
    console.log("User:", user);
    console.log("CandidateId:", user.candidateId);
    console.log("VacancyId:", id);
    
    if (!user.candidateId) {
      Alert.alert(
        "Perfil incompleto",
        "Você precisa completar seu perfil de candidato antes de se candidatar a vagas.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Ir para Perfil", onPress: () => router.push("/(tabs)/perfil") }
        ]
      );
      return;
    }

    Alert.alert(
      "Confirmar candidatura",
      `Deseja se candidatar para a vaga de ${vaga?.title || titulo}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Candidatar", 
          onPress: async () => {
            setCandidatando(true);
            try {
              console.log("Dados da candidatura:", {
                candidateId: parseInt(user.candidateId),
                vacancyId: parseInt(id),
                applicationDate: new Date().toISOString().split('T')[0]
              });
              
              const resultado = await candidacyService.criar({
                candidateId: parseInt(user.candidateId),
                vacancyId: parseInt(id),
                applicationDate: new Date().toISOString().split('T')[0]
              });

              console.log("Candidatura criada:", resultado);

            

              Alert.alert(
                "Sucesso",
                "Candidatura enviada com sucesso!",
                [{ text: "OK", onPress: () => router.back() }]
              );
            } catch (error) {
              console.error("Erro ao candidatar:", error);
              console.error("Response:", error.response?.data);
              if (error.response?.status === 400) {
                Alert.alert("Atenção", "Você já se candidatou a esta vaga.");
              } else {
                Alert.alert("Erro", "Não foi possível enviar a candidatura.");
              }
            } finally {
              setCandidatando(false);
            }
          }
        }
      ]
    );
  }

  function voltar() {
    router.back();
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando vaga...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dadosVaga = vaga || {
    id: id,
    title: titulo || "Vaga",
    companyName: empresa || "Empresa",
    city: "Não informado",
    state: "",
    vacancyType: "REMOTE",
    salary: 0,
    description: "Descrição não disponível",
    accessibilityOffered: "Não informado",
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={voltar}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Vaga</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        
        <View style={styles.mainCard}>
          <View style={styles.empresaIcon}>
            <Ionicons name="business" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.vagaTitulo}>{dadosVaga.title}</Text>
          <Text style={styles.vagaEmpresa}>{dadosVaga.companyName}</Text>
          
          <View style={styles.vagaDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={18} color={Colors.textLight} />
              <Text style={styles.detailText}>
                {dadosVaga.city}{dadosVaga.state ? `, ${dadosVaga.state}` : ""}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="briefcase-outline" size={18} color={Colors.textLight} />
              <Text style={styles.detailText}>{getTipoLabel(dadosVaga.vacancyType)}</Text>
            </View>
          </View>
          
          {dadosVaga.salary > 0 && (
            <Text style={styles.salario}>
              R$ {dadosVaga.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <View style={styles.sectionCard}>
            <Text style={styles.descriptionText}>{dadosVaga.description}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acessibilidade Oferecida</Text>
          <View style={styles.sectionCard}>
            <View style={styles.listItem}>
              <Ionicons name="accessibility" size={18} color={Colors.secondary} />
              <Text style={styles.listText}>{dadosVaga.accessibilityOffered}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.candidatarButton, candidatando && styles.candidatarButtonDisabled]} 
          onPress={handleCandidatar}
          disabled={candidatando}
        >
          {candidatando ? (
            <ActivityIndicator size="small" color={Colors.background} />
          ) : (
            <Ionicons name="send" size={20} color={Colors.background} />
          )}
          <Text style={styles.candidatarText}>
            {candidatando ? "Enviando..." : "Candidatar-se"}
          </Text>
        </TouchableOpacity>
      </View>
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
  scrollView: {
    flex: 1,
  },
  mainCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  empresaIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  vagaTitulo: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.white,
    textAlign: "center",
    marginBottom: 8,
  },
  vagaEmpresa: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: 16,
  },
  vagaDetails: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  salario: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    lineHeight: 22,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  listText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    flex: 1,
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 100,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  candidatarButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  candidatarButtonDisabled: {
    opacity: 0.7,
  },
  candidatarText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.background,
  },
});
