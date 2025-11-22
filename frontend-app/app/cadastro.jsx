import { Text, TextInput, StyleSheet, View, Alert, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { userService, authService, candidateService } from "../services/api";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCadastrar() {
    if (!nome || !email || !senha || !confirmarSenha) {
        Alert.alert("Atenção", "Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    if (senha !== confirmarSenha) {
        Alert.alert("Erro", "As senhas não coincidem.");
        return;
    }

    if (senha.length < 8) {
        Alert.alert("Erro", "A senha deve ter pelo menos 8 caracteres.");
        return;
    }

    setLoading(true);
    
    try {
        const dadosUsuario = {
            name: nome.trim(),
            email: email.trim().toLowerCase(),
            password: senha,
            userRole: "CANDIDATE",
            city: cidade.trim() || "São Paulo",
            state: estado.trim() || "SP",
            phone: telefone.trim() || "11999999999"
        };

        console.log("Criando usuário:", dadosUsuario);

        
        const userResponse = await userService.criar(dadosUsuario);
        console.log("✅ Usuário criado:", userResponse.id);

        
        await authService.login(email.trim().toLowerCase(), senha);
        console.log("✅ Login realizado");

        
        const currentUser = await authService.getCurrentUser();
        console.log("✅ User atual:", currentUser);

        
        if (currentUser.userId) {
            try {
                const dadosCandidato = {
                    userId: parseInt(currentUser.userId),
                    disabilityType: "PHYSICAL",
                    skills: "A preencher",
                    experience: "A preencher",
                    requiredAcessibility: "A preencher"
                };

                console.log("Criando candidato:", dadosCandidato);
                const candidateResponse = await candidateService.criar(dadosCandidato);
                console.log("✅ Candidato criado:", candidateResponse.id);
                
                
                await authService.refreshUser();
            } catch (candidateError) {
                console.error("Erro ao criar candidato:", candidateError);
                
            }
        }

        Alert.alert(
            "Sucesso",
            "Conta criada com sucesso!",
            [
                {
                    text: "OK",
                    onPress: () => router.replace("/(tabs)/home")
                }
            ]
        );

    } catch (error) {
        console.error("Erro no cadastro:", error);
        let mensagemErro = "Não foi possível criar a conta.";
        
        if (error.response?.status === 401) {
            mensagemErro = "Erro de autenticação. Entre em contato com o suporte.";
        } else if (error.response?.status === 409) {
            mensagemErro = "Este e-mail já está cadastrado. Faça login.";
        } else if (error.response?.status === 400) {
            mensagemErro = error.response?.data?.message || "Dados inválidos.";
        } else if (error.message.includes('Network')) {
            mensagemErro = "Sem conexão com o servidor. Verifique sua internet.";
        }
        
        Alert.alert("Erro", mensagemErro);
        
    } finally {
        setLoading(false);
    }
}

  function voltarParaLogin() {
    router.replace("/");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.backgroundGradient}>
              <View style={styles.circle1} />
              <View style={styles.circle2} />
              <View style={styles.circle3} />
            </View>

            <TouchableOpacity style={styles.backButton} onPress={voltarParaLogin}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
              <Text style={styles.brandName}>Criar Conta</Text>
              <Text style={styles.subtitle}>
                Junte-se ao Acessly e encontre oportunidades inclusivas
              </Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Dados Pessoais</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={Colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  placeholderTextColor={Colors.textLight}
                  value={nome}
                  onChangeText={setNome}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={Colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor={Colors.textLight}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={Colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor={Colors.textLight}
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!senhaVisivel}
                />
                <TouchableOpacity
                  onPress={() => setSenhaVisivel(!senhaVisivel)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={senhaVisivel ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={Colors.textLight}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={Colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar senha"
                  placeholderTextColor={Colors.textLight}
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry={!confirmarSenhaVisivel}
                />
                <TouchableOpacity
                  onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={confirmarSenhaVisivel ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={Colors.textLight}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={Colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Telefone"
                  placeholderTextColor={Colors.textLight}
                  value={telefone}
                  onChangeText={setTelefone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputContainer, styles.inputHalf]}>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={Colors.textLight}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Cidade"
                    placeholderTextColor={Colors.textLight}
                    value={cidade}
                    onChangeText={setCidade}
                  />
                </View>

                <View style={[styles.inputContainer, styles.inputSmall]}>
                  <TextInput
                    style={styles.input}
                    placeholder="UF"
                    placeholderTextColor={Colors.textLight}
                    value={estado}
                    onChangeText={setEstado}
                    maxLength={2}
                    autoCapitalize="characters"
                  />
                </View>
              </View>
            </View>

            {loading ? (
              <View style={styles.botaoCadastrar}>
                <ActivityIndicator size="small" color={Colors.background} />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.botaoCadastrar}
                onPress={handleCadastrar}
                activeOpacity={0.8}
              >
                <Text style={styles.botaoTexto}>Criar minha conta</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={Colors.background}
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>
            )}

            <View style={styles.termos}>
              <Text style={styles.termosTexto}>
                Ao criar uma conta, você concorda com nossos{" "}
                <Text style={styles.termosLink}>Termos de Uso</Text>
              </Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Já tem uma conta?{" "}
                <Text style={styles.footerLink} onPress={voltarParaLogin}>
                  Faça login
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: Colors.primary,
    opacity: 0.12,
    top: -150,
    right: -100,
    transform: [{ scale: 1.5 }],
  },
  circle2: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: Colors.secondary,
    opacity: 0.1,
    bottom: -100,
    left: -80,
  },
  circle3: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.accent,
    opacity: 0.08,
    top: 250,
    right: -50,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 30,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  brandName: {
    fontSize: 36,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textLight,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  formCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 28,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
    marginBottom: 20,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  inputSmall: {
    width: 80,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.white,
  },
  eyeButton: {
    padding: 8,
  },
  botaoCadastrar: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  botaoTexto: {
    color: Colors.background,
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  arrowIcon: {
    marginLeft: 8,
  },
  termos: {
    marginTop: 16,
    alignItems: "center",
  },
  termosTexto: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 18,
  },
  termosLink: {
    color: Colors.primary,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    color: Colors.textLight,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  footerLink: {
    color: Colors.primary,
    fontWeight: "bold",
  },
});