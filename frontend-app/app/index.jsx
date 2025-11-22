import { Text, TextInput, StyleSheet, Image, View, Alert, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { authService } from "../services/api";

export default function Index() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);


  async function handleContinuar() {
    if (!email || !senha) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await authService.login(email, senha);
      
      router.replace({
        pathname: "/(tabs)/home",
        params: { email },
      });
      
    } catch (error) {
      console.error("Erro no login:", error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        Alert.alert(
          "Erro", 
          "Email ou senha incorretos."
        );
      } else if (error.response?.status === 404) {
        Alert.alert(
          "Usuário não encontrado", 
          "Você precisa criar uma conta primeiro.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Cadastrar", onPress: irParaCadastro }
          ]
        );
      } else {
        Alert.alert(
          "Erro", 
          "Não foi possível fazer login. Verifique sua conexão."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function irParaCadastro() {
    router.push("/cadastro");
  }

  function handleEsqueceuSenha() {
    Alert.alert(
      "Recuperar senha",
      "Digite seu e-mail no campo acima e entraremos em contato com instruções para redefinir sua senha.",
      [{ text: "OK" }]
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.backgroundGradient}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            
            <View style={styles.headerContainer}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../assets/icon.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              
              <Text style={styles.brandName}>Acessly</Text>
              <Text style={styles.tagline}>beyond barriers</Text>
              <Text style={styles.subtitle}>
                Conectando talentos a oportunidades inclusivas
              </Text>
            </View>

            <View style={styles.formCard}>
              
              <Text style={styles.formTitle}>Faça seu login</Text>

              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color={Colors.primary} style={styles.inputIcon} />
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

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color={Colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Sua senha"
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
                    name={senhaVisivel ? "eye" : "eye-off"} 
                    size={22} 
                    color={Colors.textLight} 
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.forgotPassword} onPress={handleEsqueceuSenha}>
                <Text style={styles.forgotText}>Esqueceu a senha?</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.botaoEntrar, loading && styles.botaoDisabled]} 
                onPress={handleContinuar}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={Colors.background} />
                ) : (
                  <>
                    <Text style={styles.botaoTexto}>Entrar</Text>
                    <Ionicons name="arrow-forward-circle" size={24} color={Colors.background} style={styles.arrowIcon} />
                  </>
                )}
              </TouchableOpacity>

            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Não tem uma conta?{" "}
                <Text style={styles.footerLink} onPress={irParaCadastro}>Cadastre-se</Text>
              </Text>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
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
    width: 450,
    height: 450,
    borderRadius: 225,
    backgroundColor: Colors.primary,
    opacity: 0.15,
    top: -180,
    right: -120,
    transform: [{ scale: 1.5 }],
  },
  circle2: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: Colors.secondary,
    opacity: 0.12,
    bottom: -150,
    left: -100,
  },
  circle3: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.accent,
    opacity: 0.1,
    top: 250,
    left: 120,
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
    paddingTop: 30,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
  },
  brandName: {
    fontSize: 48,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
    marginBottom: 4,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: Colors.primary,
    fontStyle: "italic",
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textLight,
    textAlign: "center",
    paddingHorizontal: 40,
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
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
    marginBottom: 24,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    color: Colors.primary,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  botaoEntrar: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  botaoDisabled: {
    opacity: 0.7,
  },
  botaoTexto: {
    color: Colors.background,
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  arrowIcon: {
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 30,
  },
  footerText: {
    color: Colors.textLight,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  footerLink: {
    color: Colors.primary,
    fontFamily: 'Inter_700Bold',
  },
});