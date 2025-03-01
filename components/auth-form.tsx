import Form from 'next/form';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

const getTranslations = () => {
  const lang = typeof navigator !== 'undefined' ? navigator.language : 'en';
  const translations = {
    en: {
      emailLabel: 'Email Address',
      passwordLabel: 'Password'
    },
    zh: {
      emailLabel: navigator.language.startsWith('zh-CN') ? '电子邮件地址' : '電子郵件地址',
      passwordLabel: navigator.language.startsWith('zh-CN') ? '密码' : '密碼'
    },
    fr: {
      emailLabel: 'Adresse e-mail',
      passwordLabel: 'Mot de passe'
    },
    ru: {
      emailLabel: 'Адрес электронной почты',
      passwordLabel: 'Пароль'
    },
    de: {
      emailLabel: 'E-Mail-Adresse',
      passwordLabel: 'Passwort'
    },
    es: {
      emailLabel: 'Correo electrónico',
      passwordLabel: 'Contraseña'
    },
    ja: {
      emailLabel: 'メールアドレス',
      passwordLabel: 'パスワード'
    },
    ko: {
      emailLabel: '이메일 주소',
      passwordLabel: '비밀번호'
    },
    ar: {
      emailLabel: 'عنوان البريد الإلكتروني',
      passwordLabel: 'كلمة المرور'
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

export function AuthForm({
  action,
  children,
  defaultEmail = '',
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  const [translations, setTranslations] = useState({ emailLabel: 'Email Address', passwordLabel: 'Password' });

  useEffect(() => {
    setTranslations(getTranslations());
  }, []);

  return (
    <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          {translations.emailLabel}
        </Label>

        <Input
          id="email"
          name="email"
          className="bg-muted text-md md:text-sm"
          type="email"
          placeholder="user@acme.com"
          autoComplete="email"
          required
          autoFocus
          defaultValue={defaultEmail}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          {translations.passwordLabel}
        </Label>

        <Input
          id="password"
          name="password"
          className="bg-muted text-md md:text-sm"
          type="password"
          required
        />
      </div>

      {children}
    </Form>
  );
}
