import { Text, StyleSheet, View, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "../constants/Colors";
import { candidacyService, authService } from "../services/api";

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarNotificacoes();
    
  }, []);

  async function carregarNotificacoes() {
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (user.candidateId) {
        const response = await candidacyService.listarPorCandidato(user.candidateId, 0, 20);
        
        const candidaturas = response?.content || [];
        
        const notifs = candidaturas.map(c => ({
          id: c.id,
          tipo: c.status === 'UNDER_ANALYSIS' ? 'candidatura' : 'status',
          titulo: c.status === 'UNDER_ANALYSIS' 
            ? 'Candidatura enviada' 
            : c.status === 'APPROVED' 
              ? 'Candidatura aprovada!' 
              : 'Candidatura não aprovada',
          mensagem: c.status === 'UNDER_ANALYSIS'
            ? `Você se candidatou para ${c.vacancyTitle || 'vaga'} na empresa ${c.companyName || 'empresa'}`
            : c.status === 'APPROVED'
              ? `Parabéns! Sua candidatura para ${c.vacancyTitle || 'vaga'} foi aprovada`
              : `Sua candidatura para ${c.vacancyTitle || 'vaga'} não foi aprovada desta vez`,
          data: new Date(c.applicationDate),
          status: c.status,
          vacancyId: c.vacancyId,
        }));
        
        setNotificacoes(notifs);
      }
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
      setNotificacoes([]);
    } finally {
      setLoading(false);
    }
  }

  function voltar() {
    router.back();
  }

  function verVaga(vacancyId) {
    router.push({
      pathname: "/vaga/[id]",
      params: { id: vacancyId },
    });
  }

  function getIcone(status) {
    switch (status) {
      case 'UNDER_ANALYSIS':
        return { name: 'time-outline', color: Colors.accent };
      case 'APPROVED':
        return { name: 'checkmark-circle', color: Colors.success };
      case 'REJECTED':
        return { name: 'close-circle', color: Colors.error };
      default:
        return { name: 'notifications-outline', color: Colors.textLight };
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando notificações...</Text>
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
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {notificacoes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
            <Text style={styles.emptyText}>
              Você será notificado quando se candidatar a vagas ou quando houver atualizações
            </Text>
          </View>
        ) : (
          notificacoes.map((notif) => {
            const icone = getIcone(notif.status);
            return (
              <TouchableOpacity 
                key={notif.id} 
                style={styles.notifCard}
                onPress={() => verVaga(notif.vacancyId)}
              >
                <View style={[styles.iconContainer, { backgroundColor: icone.color + '20' }]}>
                  <Ionicons name={icone.name} size={24} color={icone.color} />
                </View>
                <View style={styles.notifContent}>
                  <Text style={styles.notifTitulo}>{notif.titulo}</Text>
                  <Text style={styles.notifMensagem}>{notif.mensagem}</Text>
                  <Text style={styles.notifData}>
                    {notif.data.toLocaleDateString('pt-BR')} às {notif.data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
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
  notifCard: {
    flexDirection: "row",
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notifContent: {
    flex: 1,
  },
  notifTitulo: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  notifMensagem: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: 8,
    lineHeight: 20,
  },
  notifData: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
});
