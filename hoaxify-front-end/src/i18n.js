import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { register } from 'timeago.js';
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translations: {
          'Sign Up':'Sign Up',
          'Login':'Login',
          "Password mismatch":"Password mismatch",
          "UserName":"UserName",
          "DisplayName":"DisplayName",
          "password":"password",
          "passwordRepeat":"passwordRepeat",
          "Logout":"Logout",
          "Users":"Users",
          "Next":"Next",
          "Previous":"Previous",
          'Load Failure': 'Load Failure',
          'Loading...':'Loading...',
          'User Not Found':'User Not Found',
          'Edit':'Edit',
          'Cancel':'Cancel',
          'Save':'Save',
          'Change Display Name':'Change Display Name',
          'My Profile':'My Profile',
          'There are no Hoaxes':'There are no Hoaxes',
          "Load Old Hoaxes":"Load Old Hoaxes",
          "There are new Hoaxes":"There are new Hoaxes",
          "Delete Hoax":"Delete Hoax",
          "Are you sure to delete hoax?":"Are you sure to delete hoax ?"

      },
    },
    tr: {
      translations: {
        'Sign Up':'Kayıt Ol',
        'Login':'Giriş Yap',
        "Password mismatch":"Aynı Şifreyi Girin",
        "UserName":"Kullanıcı Adı",
        "DisplayName":"Tercih Edilen İsim",
        "password":"Şifre",
        "passwordRepeat":"Şifre Tekrarı",
        "Logout":"Çıkış Yap",
        "Users":"Kullanıcılar",
        "Next":"Sonraki",
        "Previous":"Önceki",
        'Load Failure': 'Liste alınamadı',
        'Loading...':'Yükleniyor...',
        'User Not Found':'Kullanıcı Bulunamadı',
        'Edit':'Düzenle',
        'Cancel':'İptal',
        'Save':'Kaydet',
        'Change Display Name':'Tercih Edilen İsimnizi Değiştirin',
        'My Profile':'Hesabım',
        'There are no Hoaxes':'Hoax Bulunamadı',
        "Load Old Hoaxes":"Geçmiş Hoaxları Getir",
        "There are new Hoaxes":"Yeni Hoaxları Getir",
        "Delete Hoax":"Hoax Sil",
        "Are you sure to delete hoax?":"Hoax Silmek İstediginize Eminmisniz ?"




      },
    },
  },
  fallbackLng:'en',
  ns:['translations'],
  defaultNS:'translations',
  keySeparator:false,
  interpolation:{
      escapeValue:false,
      formatSeparator:','
  },
  
  react:{
      wait:true
  }
});

const  timeageTr=(number,index)=>{
  return [
    ['az önce', 'şimdi'],
    ['%s saniye önce', '%s saniye içinde'],
    ['1 dakika önce', '1 dakika içinde'],
    ['%s dakika önce', '%s dakika içinde'],
    ['1 saat önce', '1 saat içinde'],
    ['%s saat önce', '%s saat içinde'],
    ['1 gün önce', '1 gün içinde'],
    ['%s gün önce', '%s gün içinde'],
    ['1 hafta önce', '1 hafta içinde'],
    ['%s hafta önce', '%s hafta içinde'],
    ['1 ay önce', '1 ay içinde'],
    ['%s ay önce', '%s ay içinde'],
    ['1 yıl önce', '1 yıl içinde'],
    ['%s yıl önce', '%s yıl içinde'],
  ][index];
}
register('tr',timeageTr);

export default i18n;