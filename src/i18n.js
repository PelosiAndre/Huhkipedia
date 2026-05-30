import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      header: {
        searchPlaceholder: "Search Wikipedia...",
        searchBtn: "Search",
        clearBtn: "Clear",
        login: "Log In",
        savedData: "Saved Data",
        logout: "Log Out"
      },
      sidebar: {
        saveState: "Save Current State",
        crazyMode: "Crazy Mode",
        hops: "Hops:",
        startCrazy: "Start Crazy Mode",
        stopCrazy: "Stop Crazy Mode",
        navPath: "Navigation Path",
        openWiki: "Open in Wikipedia"
      },
      help: {
        title: "About Huhkipedia",
        close: "Close",
        welcome: "Welcome to Huhkipedia! This is a \"for fun\" project built to give you a new, unpredictable way to explore Wikipedia.",
        gettingStartedTitle: "Getting Started:",
        gettingStartedText: "Type a topic in the search bar. We find the closest matching article, but we don't show it to you right away! Instead, we immediately jump to a random link found inside that first article to start your journey.",
        crazyModeTitle: "Crazy Mode",
        crazyModeP1: "Want to see how deep the rabbit hole goes? Activate Crazy Mode!",
        crazyModeP2: "Set the number of \"Hops\" and click any link in the article you are currently reading. Instead of taking you directly to that link, the app will randomly click a link on that next page, and then another link on the page after that, repeating for the number of hops you set.",
        crazyModeP3: "You will only be shown the final destination, but your entire chaotic route is recorded in your Navigation Path. Log in to save your favorite routes."
      },
      auth: {
        title: "Authentication",
        emailPlaceholder: "Email",
        passwordPlaceholder: "Password",
        loginBtn: "Log In",
        signupBtn: "Sign Up",
        closeBtn: "Close"
      },
      savedData: {
        title: "Saved Articles & Paths",
        pathHeader: "Path:",
        deleteBtn: "Delete",
        closeBtn: "Close",
        noData: "No saved articles found."
      },
      toasts: {
        signedUp: "Signed up successfully!",
        loggedIn: "Logged in successfully!",
        loggedOut: "Logged out successfully!",
        savedSuccess: "Article and path saved successfully!",
        deleted: "Item deleted.",
        invalidPage: "System or category pages are not supported.",
        fetchError: "Error fetching the article."
      }
    }
  },
  pt: {
    translation: {
      header: {
        searchPlaceholder: "Pesquisar na Wikipedia...",
        searchBtn: "Pesquisar",
        clearBtn: "Limpar",
        login: "Entrar",
        savedData: "Dados Salvos",
        logout: "Sair"
      },
      sidebar: {
        saveState: "Salvar Estado Atual",
        crazyMode: "Modo Loucura",
        hops: "Saltos:",
        startCrazy: "Iniciar Modo Loucura",
        stopCrazy: "Parar Modo Loucura",
        navPath: "Caminho de Navegação",
        openWiki: "Abrir na Wikipedia"
      },
      help: {
        title: "Sobre a Huhkipedia",
        close: "Fechar",
        welcome: "Bem-vindo(a) à Huhkipedia! Este é um projeto feito \"por diversão\" criado para lhe dar uma maneira nova e imprevisível de explorar a Wikipedia.",
        gettingStartedTitle: "Como Começar:",
        gettingStartedText: "Digite um tópico na barra de pesquisa. Nós encontramos o artigo correspondente mais próximo, mas não o mostramos imediatamente! Em vez disso, saltamos imediatamente para um link aleatório encontrado dentro desse primeiro artigo para começar a sua jornada.",
        crazyModeTitle: "Modo Loucura",
        crazyModeP1: "Quer ver a que profundidade vai a toca do coelho? Ative o Modo Loucura!",
        crazyModeP2: "Defina o número de \"Saltos\" (Hops) e clique em qualquer link no artigo que está lendo. Em vez de levá-lo diretamente para esse link, o aplicativo clicará aleatoriamente em um link na próxima página, e depois em outro na página seguinte, repetindo pelo número de saltos que você definiu.",
        crazyModeP3: "Você só verá o destino final, mas toda a sua rota caótica fica registrada no Caminho de Navegação. Faça login para salvar suas rotas favoritas."
      },
      auth: {
        title: "Autenticação",
        emailPlaceholder: "E-mail",
        passwordPlaceholder: "Senha",
        loginBtn: "Entrar",
        signupBtn: "Criar Conta",
        closeBtn: "Fechar"
      },
      savedData: {
        title: "Artigos e Caminhos Salvos",
        pathHeader: "Caminho:",
        deleteBtn: "Excluir",
        closeBtn: "Fechar",
        noData: "Nenhum artigo salvo encontrado."
      },
      toasts: {
        signedUp: "Conta criada com sucesso!",
        loggedIn: "Sessão iniciada com sucesso!",
        loggedOut: "Sessão encerrada com sucesso!",
        savedSuccess: "Artigo e caminho salvos com sucesso!",
        deleted: "Item excluído.",
        invalidPage: "Páginas de sistema ou categoria não são suportadas.",
        fetchError: "Erro ao carregar o artigo."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('huhkipedia_lang') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;