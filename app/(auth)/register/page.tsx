'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { register, type RegisterActionState } from '../actions';

const getTranslations = () => {
  const lang = typeof navigator !== 'undefined' ? navigator.language : 'en';
  const translations = {
    en: {
      signUp: 'Sign Up',
      description: 'Create an account with your email and create new password',
      signUpButton: 'Sign Up',
      alreadyHaveAccount: 'Already have an account? ',
      signIn: 'Sign in',
      instead: ' instead.',
      errors: {
        userExists: 'Account already exists',
        failedCreate: 'Failed to create account',
        failedValidation: 'Failed validating your submission!',
        success: 'Account created successfully'
      }
    },
    zh: {
      signUp: navigator.language.startsWith('zh-CN') ? '注册' : '註冊',
      description: navigator.language.startsWith('zh-CN')? '使用电子邮件创建账户并设置新密码' : '使用電子郵件創建帳戶並設置新密碼',
      signUpButton: navigator.language.startsWith('zh-CN')  ? '注册' : '註冊',
      alreadyHaveAccount: navigator.language.startsWith('zh-CN') ? '已有账户？' : '已有帳戶？',
      signIn: navigator.language.startsWith('zh-CN') ? '登录' : '登錄',
      instead: navigator.language.startsWith('zh-CN') ? '。' : '。',
      errors: {
        userExists: navigator.language.startsWith('zh-CN') ? '账户已存在' : '帳戶已存在',
        failedCreate: navigator.language.startsWith('zh-CN') ? '创建账户失败' : '創建帳戶失敗',
        failedValidation: navigator.language.startsWith('zh-CN') ? '提交验证失败！' : '提交驗證失敗！',
        success: navigator.language.startsWith('zh-CN') ? '账户创建成功' : '帳戶創建成功'
      }
    },
    fr: {
      signUp: 'Inscription',
      description: 'Créez un compte avec votre email et un nouveau mot de passe',
      signUpButton: 'S\'inscrire',
      alreadyHaveAccount: 'Vous avez déjà un compte ? ',
      signIn: 'Se connecter',
      instead: ' à la place.',
      errors: {
        userExists: 'Le compte existe déjà',
        failedCreate: 'Échec de la création du compte',
        failedValidation: 'Échec de la validation de votre soumission !',
        success: 'Compte créé avec succès'
      }
    },
    ru: {
      signUp: 'Регистрация',
      description: 'Создайте аккаунт с помощью электронной почты и нового пароля',
      signUpButton: 'Зарегистрироваться',
      alreadyHaveAccount: 'Уже есть аккаунт? ',
      signIn: 'Войти',
      instead: ' вместо.',
      errors: {
        userExists: 'Аккаунт уже существует',
        failedCreate: 'Не удалось создать аккаунт',
        failedValidation: 'Ошибка проверки вашей заявки!',
        success: 'Аккаунт успешно создан'
      }
    },
    de: {
      signUp: 'Registrierung',
      description: 'Erstellen Sie ein Konto mit Ihrer E-Mail und einem neuen Passwort',
      signUpButton: 'Registrieren',
      alreadyHaveAccount: 'Haben Sie bereits ein Konto? ',
      signIn: 'Anmelden',
      instead: ' stattdessen.',
      errors: {
        userExists: 'Konto existiert bereits',
        failedCreate: 'Kontoerstellung fehlgeschlagen',
        failedValidation: 'Überprüfung Ihrer Eingabe fehlgeschlagen!',
        success: 'Konto erfolgreich erstellt'
      }
    },
    es: {
      signUp: 'Registrarse',
      description: 'Crea una cuenta con tu correo electrónico y una nueva contraseña',
      signUpButton: 'Registrarse',
      alreadyHaveAccount: '¿Ya tienes una cuenta? ',
      signIn: 'Iniciar sesión',
      instead: ' en su lugar.',
      errors: {
        userExists: 'La cuenta ya existe',
        failedCreate: 'Error al crear la cuenta',
        failedValidation: '¡Error al validar tu envío!',
        success: 'Cuenta creada exitosamente'
      }
    },
    ja: {
      signUp: '登録',
      description: 'メールアドレスと新しいパスワードでアカウントを作成',
      signUpButton: '登録',
      alreadyHaveAccount: '既にアカウントをお持ちの場合 ',
      signIn: 'ログイン',
      instead: ' してください。',
      errors: {
        userExists: 'アカウントは既に存在します',
        failedCreate: 'アカウントの作成に失敗しました',
        failedValidation: '送信の検証に失敗しました！',
        success: 'アカウントが正常に作成されました'
      }
    },
    ko: {
      signUp: '가입하기',
      description: '이메일과 새 비밀번호로 계정 생성',
      signUpButton: '가입하기',
      alreadyHaveAccount: '이미 계정이 있으신가요? ',
      signIn: '로그인',
      instead: ' 하세요.',
      errors: {
        userExists: '계정이 이미 존재합니다',
        failedCreate: '계정 생성 실패',
        failedValidation: '제출물 검증 실패!',
        success: '계정이 성공적으로 생성되었습니다'
      }
    },
    ar: {
      signUp: 'اشتراك',
      description: 'أنشئ حسابًا باستخدام بريدك الإلكتروني وكلمة مرور جديدة',
      signUpButton: 'اشتراك',
      alreadyHaveAccount: 'هل لديك حساب بالفعل؟ ',
      signIn: 'تسجيل الدخول',
      instead: ' بدلاً من ذلك.',
      errors: {
        userExists: 'الحساب موجود بالفعل',
        failedCreate: 'فشل إنشاء الحساب',
        failedValidation: 'فشل التحقق من صحة تقديمك!',
        success: 'تم إنشاء الحساب بنجاح'
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

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    { status: 'idle' }
  );

  useEffect(() => {
    if (state.status === 'user_exists') {
      toast.error(translations.errors.userExists);
    } else if (state.status === 'failed') {
      toast.error(translations.errors.failedCreate);
    } else if (state.status === 'invalid_data') {
      toast.error(translations.errors.failedValidation);
    } else if (state.status === 'success') {
      toast.success(translations.errors.success);
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state, router, translations]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl gap-12 flex flex-col">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">{translations.signUp}</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {translations.description}
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultEmail={email}>
          <SubmitButton isSuccessful={isSuccessful}>{translations.signUpButton}</SubmitButton>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {translations.alreadyHaveAccount}
            <Link
              href="/login"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              {translations.signIn}
            </Link>
            {translations.instead}
          </p>
        </AuthForm>
      </div>
    </div>
  );
}
