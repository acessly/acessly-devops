import { Text, StyleSheet, View, TouchableOpacity, ScrollView, StatusBar, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "../../constants/Colors";
import { candidateService, userService, authService } from "../../services/api";

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      carregarPerfil();
    }, [])
  );

  async function carregarPerfil() {
    setLoading(true);
    try {
      const user = await authService.refreshUser();
      
      console.log('=== CARREGANDO PERFIL ===');
      console.log('User:', user);
      
      if (user.userId) {
        const userResponse = await userService.buscarPorId(user.userId);
        console.log('UserData:', userResponse);
        setUserData(userResponse);
      }
      
      if (user.candidateId) {
        const response = await candidateService.buscarPorId(user.candidateId);
        console.log('Perfil candidato:', response);
        setPerfil(response);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      Alert.alert("Erro", "Não foi possível carregar o perfil.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive",
          onPress: async () => {
            try {
              await authService.logout();
              router.replace("/");
            } catch (error) {
              console.error("Erro ao fazer logout:", error);
            }
          }
        }
      ]
    );
  }

  function handleEditarPerfil() {
    router.push("/perfil/editar");
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dadosPerfil = {
    name: userData?.name || "Usuário",
    email: userData?.email || "",
    phone: userData?.phone || "Não informado",
    city: userData?.city || "Não informado",
    state: userData?.state || "",
    disabilityType: perfil?.disabilityType || "Não informado",
    skills: perfil?.skills || "",
    experience: perfil?.experience || "Não informado",
    requiredAcessibility: perfil?.requiredAcessibility || "Não informado",
  };

  const skillsArray = dadosPerfil.skills && dadosPerfil.skills !== "Não informado"
    ? dadosPerfil.skills.split(',').map(s => s.trim()).filter(s => s)
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.editButton} onPress={carregarPerfil}>
              <Ionicons name="refresh-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={handleEditarPerfil}>
              <Ionicons name="create-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.profileName}>{dadosPerfil.name}</Text>
          <Text style={styles.profileEmail}>{dadosPerfil.email}</Text>
          
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Ionicons name="accessibility" size={16} color={Colors.success} />
              <Text style={styles.badgeText}>{dadosPerfil.disabilityType}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={20} color={Colors.textLight} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoValue}>{dadosPerfil.phone}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color={Colors.textLight} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Localização</Text>
                <Text style={styles.infoValue}>
                  {dadosPerfil.city}{dadosPerfil.state ? `, ${dadosPerfil.state}` : ""}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          
          {skillsArray.length > 0 ? (
            <View style={styles.skillsContainer}>
              {skillsArray.map((skill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.infoCard}>
              <Text style={styles.emptyText}>Nenhuma habilidade cadastrada</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiência</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.experienceText}>{dadosPerfil.experience}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acessibilidade Necessária</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.experienceText}>{dadosPerfil.requiredAcessibility}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={Colors.error} />
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
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
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  profileName: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: 16,
  },
  badgeContainer: {
    flexDirection: "row",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: Colors.success,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillTag: {
    backgroundColor: Colors.backgroundCard,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  skillText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.primary,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  experienceText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    lineHeight: 22,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.backgroundCard,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.error,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.error,
  },
});
