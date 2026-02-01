import { atom } from 'nanostores';

export const isEnglish = atom(false);
export let defaultLang = '';

export function getLangFromUrl(url) {
    const [, lang] = url.pathname.split('/');
    if (lang=="en") return 'en';
    return defaultLang;
  }

export async function getLangBoolean() {
   
    let pivote = isEnglish.value;

    return pivote;
  }

export const selectedCountry = atom(
  typeof window !== 'undefined' && localStorage.getItem('selectedCountry')
    ? localStorage.getItem('selectedCountry')
    : 'mex'
);

selectedCountry.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('selectedCountry', value);
  }
});
