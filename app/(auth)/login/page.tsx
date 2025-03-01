'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { login, type LoginActionState } from '../actions';

const getTranslations = () => {
  const lang = typeof navigator !== 'undefined' ? navigator.language : 'en';
  const translations = {
    en: {
      signIn: 'Sign In',
      signInButton: 'Sign in',
      noAccount: "Don't have an account? ",
      signUp: 'Sign up',
      forFree: ' for free.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      agreeText: 'By signing in, you agree to our',
      conjunction: 'and',
      errors: {
        invalidCredentials: 'Invalid credentials!',
        failedValidation: 'Failed validating your submission!',
        failedPopup: 'Failed to open Google login popup.'
      }
    },
    zh: {
      signIn: navigator.language.startsWith('zh-CN') || navigator.language.startsWith('zh-Hans') ? '登录' : '登錄',
      signInButton: navigator.language.startsWith('zh-CN') || navigator.language.startsWith('zh-Hans') ? '登录' : '登錄',
      noAccount: navigator.language.startsWith('zh-CN') || navigator.language.startsWith('zh-Hans') ? '没有账户？' : '沒有帳戶？',
      signUp: navigator.language.startsWith('zh-CN') || navigator.language.startsWith('zh-Hans') ? '注册' : '註冊',
      forFree: ' 免费使用。',
      privacyPolicy: '隐私政策',
      termsOfService: '服务条款',
      agreeText: '登录即表示您同意我们的',
      conjunction: '和',
      errors: {
        invalidCredentials: '无效的凭证！',
        failedValidation: '提交验证失败！',
        failedPopup: '无法打开Google登录弹窗。'
      }
    },
    fr: {
      signIn: 'Connexion',
      signInButton: 'Se connecter',
      noAccount: 'Vous n\'avez pas de compte ? ',
      signUp: 'S\'inscrire',
      forFree: ' gratuitement.',
      privacyPolicy: 'Politique de confidentialité',
      termsOfService: 'Conditions d\'utilisation',
      agreeText: 'En vous connectant, vous acceptez notre',
      conjunction: 'et',
      errors: {
        invalidCredentials: 'Identifiants invalides !',
        failedValidation: 'Échec de la validation de votre soumission !',
        failedPopup: 'Échec de l\'ouverture de la fenêtre de connexion Google.'
      }
    },
    ru: {
      signIn: 'Войти',
      signInButton: 'Войти',
      noAccount: 'Нет аккаунта? ',
      signUp: 'Зарегистрироваться',
      forFree: ' бесплатно.',
      privacyPolicy: 'Политика конфиденциальности',
      termsOfService: 'Условия использования',
      agreeText: 'Входя в систему, вы соглашаетесь с нашей',
      conjunction: 'и',
      errors: {
        invalidCredentials: 'Неверные учетные данные!',
        failedValidation: 'Ошибка проверки вашей заявки!',
        failedPopup: 'Не удалось открыть всплывающее окно входа через Google.'
      }
    },
    de: {
      signIn: 'Anmelden',
      signInButton: 'Anmelden',
      noAccount: 'Kein Konto? ',
      signUp: 'Registrieren',
      forFree: ' kostenlos.',
      privacyPolicy: 'Datenschutzrichtlinie',
      termsOfService: 'Nutzungsbedingungen',
      agreeText: 'Mit der Anmeldung stimmen Sie unseren',
      conjunction: 'und',
      errors: {
        invalidCredentials: 'Ungültige Anmeldedaten!',
        failedValidation: 'Überprüfung Ihrer Eingabe fehlgeschlagen!',
        failedPopup: 'Öffnen des Google-Anmeldefensters fehlgeschlagen.'
      }
    },
    es: {
      signIn: 'Iniciar sesión',
      signInButton: 'Iniciar sesión',
      noAccount: '¿No tienes cuenta? ',
      signUp: 'Regístrate',
      forFree: ' gratis.',
      privacyPolicy: 'Política de privacidad',
      termsOfService: 'Términos de servicio',
      agreeText: 'Al iniciar sesión, aceptas nuestra',
      conjunction: 'y',
      errors: {
        invalidCredentials: '¡Credenciales inválidas!',
        failedValidation: '¡Error al validar tu envío!',
        failedPopup: 'Error al abrir la ventana de inicio de sesión de Google.'
      }
    },
    ja: {
      signIn: 'ログイン',
      signInButton: 'ログイン',
      noAccount: 'アカウントをお持ちでない場合 ',
      signUp: '登録',
      forFree: ' 無料で。',
      privacyPolicy: 'プライバシーポリシー',
      termsOfService: '利用規約',
      agreeText: 'ログインすることで、当社の',
      conjunction: 'および',
      errors: {
        invalidCredentials: '無効な資格情報！',
        failedValidation: '送信の検証に失敗しました！',
        failedPopup: 'Googleログインポップアップのオープンに失敗しました。'
      }
    },
    ko: {
      signIn: '로그인',
      signInButton: '로그인',
      noAccount: '계정이 없으신가요? ',
      signUp: '가입하기',
      forFree: ' 무료로.',
      privacyPolicy: '개인정보 보호정책',
      termsOfService: '이용 약관',
      agreeText: '로그인함으로써 당사의',
      conjunction: '및',
      errors: {
        invalidCredentials: '잘못된 자격 증명!',
        failedValidation: '제출물 검증 실패!',
        failedPopup: 'Google 로그인 팝업 열기 실패.'
      }
    },
    ar: {
      signIn: 'تسجيل الدخول',
      signInButton: 'تسجيل الدخول',
      noAccount: 'ليس لديك حساب؟ ',
      signUp: 'اشتراك',
      forFree: ' مجانًا.',
      privacyPolicy: 'سياسة الخصوصية',
      termsOfService: 'شروط الخدمة',
      agreeText: 'بالتسجيل، فإنك توافق على',
      conjunction: 'و',
      errors: {
        invalidCredentials: 'بيانات الاعتماد غير صالحة!',
        failedValidation: 'فشل التحقق من صحة تقديمك!',
        failedPopup: 'فشل في فتح نافذة تسجيل الدخول عبر Google.'
      }
    }
  };

  if (lang.startsWith('zh')) return translations.zh;
  if (lang.startsWith('fr')) return translations.fr;
  if (lang.startsWith('ru')) return translations.ru;
  if (lang.startsWith('de')) return translations.de;
  if (lang.startsWith('es')) return translations.es;
  if (lang.startsWith('ja')) return translations.ja;
  if (lang.startsWith('ko')) return translations.ko;
  if (lang.startsWith('ar')) return translations.ar;
  
  return translations.en;
};

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const translations = getTranslations();

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    { status: 'idle' },
  );

  useEffect(() => {
    if (state.status === 'failed') {
      toast.error(translations.errors.invalidCredentials);
    } else if (state.status === 'invalid_data') {
      toast.error(translations.errors.failedValidation);
    } else if (state.status === 'success') {
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state.status, router, translations]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  const privacyPolicyLink = process.env.NEXT_PUBLIC_PRIVACY_POLICY_LINK || '#';
  const termsOfServiceLink = process.env.NEXT_PUBLIC_TERM_OF_SERVICE_LINK || '#';
  
  const handleGoogleLogin = () => {
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?';
    const googleAuthWindow = window.open(
      googleAuthUrl,
      'Google Login',
      'width=500,height=600'
    );

    if (googleAuthWindow) {
      const interval = setInterval(() => {
        if (googleAuthWindow.closed) {
          clearInterval(interval);
          router.refresh();
        }
      }, 500);
    } else {
      toast.error(translations.errors.failedPopup);
    }
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">{translations.signIn}</h3>
        </div>
        <AuthForm action={handleSubmit} defaultEmail={email}>
          <SubmitButton isSuccessful={isSuccessful}>{translations.signInButton}</SubmitButton>

          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {translations.noAccount}
            <Link
              href="/register"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              {translations.signUp}
            </Link>
            {translations.forFree}
          </p>
        </AuthForm>
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          {translations.agreeText}{' '}
          <a
            href={privacyPolicyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-800 dark:text-gray-200"
          >
            {translations.privacyPolicy}
          </a>{' '}
          {translations.conjunction}{' '}
          <a
            href={termsOfServiceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-800 dark:text-gray-200"
          >
            {translations.termsOfService}
          </a>
        </div>
      </div>
    </div>
  );
}
