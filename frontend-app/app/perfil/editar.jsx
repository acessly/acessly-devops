import { Text, TextInput, StyleSheet, View, TouchableOpacity, ScrollView, StatusBar, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import { Colors, Fonts } from "../../constants/Colors";
import { candidateService, userService, authService, candidacyService } from "../../services/api";

export default function EditarPerfil() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [tipoDeficiencia, setTipoDeficiencia] = useState("PHYSICAL");
  const [habilidades, setHabilidades] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [acessibilidadeNecessaria, setAcessibilidadeNecessaria] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [userId, setUserId] = useState(null);
  const [candidateId, setCandidateId] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoadingData(true);
    try {
      const user = await authService.getCurrentUser();
      console.log('Usuário atual:', user);
      
      setUserId(user.userId);
      setCandidateId(user.candidateId);

      if (user.userId) {
        const userData = await userService.buscarPorId(user.userId);
        setNome(userData.name || "");
        setEmail(userData.email || "");
        setTelefone(userData.phone || "");
        setCidade(userData.city || "");
        setEstado(userData.state || "");
      }

      if (user.candidateId) {
        try {
          const candidateData = await candidateService.buscarPorId(user.candidateId);
          setTipoDeficiencia(candidateData.disabilityType || "PHYSICAL");
          setHabilidades(candidateData.skills || "");
          setExperiencia(candidateData.experience || "");
          setAcessibilidadeNecessaria(candidateData.requiredAcessibility || "");
        } catch (error) {
          console.error("Erro ao carregar candidato:", error);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
    } finally {
      setLoadingData(false);
    }
  }

  async function handleSalvar() {
    if (!nome || !email || !telefone || !cidade) {
      Alert.alert("Atenção", "Por favor, preencha os campos obrigatórios.");
      return;
    }

    if (!senha) {
      Alert.alert("Atenção", "Por favor, digite sua senha para confirmar as alterações.");
      return;
    }

    setLoading(true);
    try {
      if (userId) {
        await userService.atualizar(userId, {
          name: nome.trim(),
          email: email.trim().toLowerCase(),
          password: senha,
          phone: telefone.trim(),
          city: cidade.trim(),
          state: estado.trim() || "SP",
          userRole: "CANDIDATE",
        });
        console.log('✅ Usuário atualizado');
      }

      const dadosCandidato = {
        userId: parseInt(userId),
        disabilityType: tipoDeficiencia || "PHYSICAL",
        skills: habilidades.trim() || "Não informado",
        experience: experiencia.trim() || "Não informado",
        requiredAcessibility: acessibilidadeNecessaria.trim() || "Não informado",
      };

      if (candidateId) {
        await candidateService.atualizar(candidateId, dadosCandidato);
        console.log('✅ Candidato atualizado');
      } else {
        if (userId) {
          const novoCandidato = {
            ...dadosCandidato,
            userId: parseInt(userId)
          };
          
          console.log('Criando candidato:', novoCandidato);
          const candidateResponse = await candidateService.criar(novoCandidato);
          setCandidateId(candidateResponse.id);
          console.log('✅ Candidato criado:', candidateResponse.id);
        }
      }

      await authService.refreshUser();

      Alert.alert(
        "Sucesso",
        "Perfil atualizado com sucesso!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      
      let mensagemErro = "Não foi possível atualizar o perfil.";
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        mensagemErro = "Senha incorreta. Tente novamente.";
      } else if (error.response?.status === 409) {
        mensagemErro = "Já existe um candidato para este usuário.";
      } else if (error.response?.status === 400) {
        mensagemErro = error.response?.data?.message || "Dados inválidos.";
      } else if (error.message?.includes('Network')) {
        mensagemErro = "Sem conexão com o servidor.";
      }
      
      Alert.alert("Erro", mensagemErro);
      
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletarConta() {
    try {
      if (candidateId) {
        const candidaturasResponse = await candidacyService.listarPorCandidato(candidateId);
        const candidaturasAtivas = candidaturasResponse.content || [];
        
        if (candidaturasAtivas.length > 0) {
          Alert.alert(
            "Candidaturas Ativas",
            `Você tem ${candidaturasAtivas.length} candidatura(s) ativa(s). Para deletar sua conta, você precisa primeiro cancelar todas as candidaturas.`,
            [
              { text: "Cancelar", style: "cancel" },
              { 
                text: "Ver Candidaturas", 
                onPress: () => mostrarCandidaturas(candidaturasAtivas)
              }
            ]
          );
          return;
        }
      }

      Alert.alert(
        "Deletar conta",
        "Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Deletar", 
            style: "destructive",
            onPress: confirmarDelecao
          }
        ]
      );

    } catch (error) {
      console.error("Erro ao verificar candidaturas:", error);
      Alert.alert("Erro", "Não foi possível verificar as candidaturas.");
    }
  }

  function mostrarCandidaturas(candidaturas) {
    const mensagem = candidaturas.map((c, i) => 
      `${i + 1}. Vaga ID: ${c.vacancyId} - Status: ${c.status}`
    ).join('\n');

    Alert.alert(
      "Suas Candidaturas",
      mensagem + "\n\nDeseja cancelar TODAS as candidaturas e deletar a conta?",
      [
        { text: "Não", style: "cancel" },
        { 
          text: "Sim, deletar tudo", 
          style: "destructive",
          onPress: () => deletarCandidaturasEConta(candidaturas)
        }
      ]
    );
  }

  async function deletarCandidaturasEConta(candidaturas) {
    try {
      setLoading(true);

      console.log('Deletando candidaturas...');
      for (const candidatura of candidaturas) {
        await candidacyService.deletar(candidatura.id);
        console.log(`Candidatura ${candidatura.id} deletada`);
      }

      if (candidateId) {
        await candidateService.deletar(candidateId);
        console.log('Candidato deletado');
      }

      if (userId) {
        await userService.deletar(userId);
        console.log('Usuário deletado');
      }

      await authService.logout();
      
      Alert.alert(
        "Conta deletada",
        "Sua conta e todas as candidaturas foram deletadas com sucesso.",
        [{ text: "OK", onPress: () => router.replace("/") }]
      );

    } catch (error) {
      console.error("Erro ao deletar:", error);
      Alert.alert("Erro", "Não foi possível deletar completamente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmarDelecao() {
    try {
      setLoading(true);

      if (candidateId) {
        await candidateService.deletar(candidateId);
      }

      if (userId) {
        await userService.deletar(userId);
      }

      await authService.logout();

      Alert.alert(
        "Sucesso",
        "Conta deletada com sucesso.",
        [{ text: "OK", onPress: () => router.replace("/") }]
      );

    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      Alert.alert("Erro", "Não foi possível deletar a conta.");
    } finally {
      setLoading(false);
    }
  }

  async function verMinhasCandidaturas() {
    try {
      if (!candidateId) {
        Alert.alert("Aviso", "Perfil de candidato não encontrado.");
        return;
      }

      setLoading(true);
      const response = await candidacyService.listarPorCandidato(candidateId);
      const candidaturas = response.content || [];

      if (candidaturas.length === 0) {
        Alert.alert("Suas Candidaturas", "Você ainda não se candidatou a nenhuma vaga.");
        return;
      }

      router.push("/candidaturas");

    } catch (error) {
      console.error("Erro ao buscar candidaturas:", error);
      Alert.alert("Erro", "Não foi possível carregar suas candidaturas.");
    } finally {
      setLoading(false);
    }
  }

  function voltar() {
    router.back();
  }

  if (loadingData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando dados...</Text>
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
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome completo *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Seu nome"
                placeholderTextColor={Colors.textLight}
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>E-mail *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Seu e-mail"
                placeholderTextColor={Colors.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Senha *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha para confirmar"
                placeholderTextColor={Colors.textLight}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!senhaVisivel}
              />
              <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
                <Ionicons 
                  name={senhaVisivel ? "eye" : "eye-off"} 
                  size={20} 
                  color={Colors.textLight} 
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>Digite sua senha atual para confirmar as alterações</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Telefone *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="(00) 00000-0000"
                placeholderTextColor={Colors.textLight}
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cidade *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Sua cidade"
                placeholderTextColor={Colors.textLight}
                value={cidade}
                onChangeText={setCidade}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Estado</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="map-outline" size={20} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Ex: SP"
                placeholderTextColor={Colors.textLight}
                value={estado}
                onChangeText={setEstado}
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Candidato</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tipo de Deficiência</Text>
            <View style={styles.pickerContainer}>
              <Ionicons name="accessibility-outline" size={20} color={Colors.textLight} />
              <Picker
                selectedValue={tipoDeficiencia}
                onValueChange={(itemValue) => setTipoDeficiencia(itemValue)}
                style={styles.picker}
                dropdownIconColor={Colors.textLight}
              >
                <Picker.Item label="Deficiência Física" value="PHYSICAL" />
                <Picker.Item label="Deficiência Visual" value="VISUAL" />
                <Picker.Item label="Deficiência Auditiva" value="AUDITORY" />
                <Picker.Item label="Deficiência Intelectual" value="COGNITIVE" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Habilidades</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="code-outline" size={20} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Ex: JavaScript, React, Python"
                placeholderTextColor={Colors.textLight}
                value={habilidades}
                onChangeText={setHabilidades}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Experiência Profissional</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva sua experiência profissional"
                placeholderTextColor={Colors.textLight}
                value={experiencia}
                onChangeText={setExperiencia}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Acessibilidade Necessária</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva os recursos de acessibilidade que você precisa"
                placeholderTextColor={Colors.textLight}
                value={acessibilidadeNecessaria}
                onChangeText={setAcessibilidadeNecessaria}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          {loading ? (
            <View style={styles.salvarButton}>
              <ActivityIndicator size="small" color={Colors.background} />
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.salvarButton} 
              onPress={handleSalvar}
            >
              <Ionicons name="checkmark-circle" size={24} color={Colors.background} />
              <Text style={styles.salvarText}>Salvar alterações</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.candidaturasButton} 
            onPress={verMinhasCandidaturas}
          >
            <Ionicons name="briefcase-outline" size={20} color={Colors.primary} />
            <Text style={styles.candidaturasText}>Minhas Candidaturas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deletarButton} onPress={handleDeletarConta}>
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
            <Text style={styles.deletarText}>Deletar minha conta</Text>
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
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginTop: 6,
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  picker: {
    flex: 1,
    color: Colors.white,
    marginLeft: 8,
  },
  textAreaContainer: {
    height: 110,
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.white,
  },
  textArea: {
    height: 86,
    textAlignVertical: "top",
  },
  salvarButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
    gap: 10,
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  salvarText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.background,
  },
  candidaturasButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 10,
    backgroundColor: Colors.backgroundCard,
    marginBottom: 12,
  },
  candidaturasText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  deletarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.error,
    gap: 10,
    backgroundColor: Colors.backgroundCard,
  },
  deletarText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.error,
  },
});
