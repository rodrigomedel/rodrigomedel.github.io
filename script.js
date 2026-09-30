'use strict';
(() => {
  const oldSections = {
    '#investigacion': 'investigacion.html', '#proyectos': 'investigacion.html#proyectos',
    '#publicaciones': 'publicaciones.html', '#docencia': 'docencia.html'
  };
  if ((location.pathname.endsWith('/') || location.pathname.endsWith('/index.html')) && oldSections[location.hash]) {
    location.replace(oldSections[location.hash]);
    return;
  }
  const translations = Array.from(document.querySelectorAll('[data-en]')).map(element => ({element,es:element.innerHTML,en:element.dataset.en}));
  const attributeTranslations = [];
  for (const [selector, attribute, dataKey] of [['[data-en-aria]','aria-label','enAria'],['[data-en-alt]','alt','enAlt']]) {
    document.querySelectorAll(selector).forEach(element => attributeTranslations.push({element,attribute,es:element.getAttribute(attribute),en:element.dataset[dataKey]}));
  }
  let language = 'es';
  let selectedFilter = 'all';
  const publications = Array.from(document.querySelectorAll('.publication'));
  const count = document.getElementById('publication-count');
  function updateCount() {
    if (!count) return;
    const visible = publications.filter(article => !article.hidden).length;
    count.textContent = language === 'en' ? `${visible} ${visible === 1 ? 'work' : 'works'}` : `${visible} ${visible === 1 ? 'trabajo' : 'trabajos'}`;
  }
  function setLanguage(nextLanguage) {
    language = nextLanguage === 'en' ? 'en' : 'es';
    document.documentElement.lang = language;
    translations.forEach(item => {item.element.innerHTML = item[language];});
    attributeTranslations.forEach(item => {item.element.setAttribute(item.attribute,item[language]);});
    document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.lang === language)));
    document.title = `${document.body.dataset[language === 'en' ? 'titleEn' : 'titleEs']} | Rodrigo M. Medel`;
    try {localStorage.setItem('rodrigo-medel-language',language);} catch (_) {}
    updateCount();
  }
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click',() => setLanguage(button.dataset.lang)));
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click',() => {
    selectedFilter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed',String(item.dataset.filter === selectedFilter)));
    publications.forEach(article => {article.hidden = selectedFilter !== 'all' && !article.dataset.topics.split(' ').includes(selectedFilter);});
    updateCount();
  }));
  try {if (localStorage.getItem('rodrigo-medel-language') === 'en') setLanguage('en');} catch (_) {}
  updateCount();
})();
