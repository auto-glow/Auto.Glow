document.addEventListener('DOMContentLoaded', ()=>{
  // mark active nav link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a=>{
    if(a.getAttribute('href') === path) a.classList.add('active');
  });

  // simple booking form handling
  const form = document.querySelector('form[data-booking]');
  if(form){
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const linkField = form.querySelector('[name="gmaps_link"]');
      const link = linkField ? linkField.value.trim() : '';

      // If user pasted a Google Maps link, save only that link (no external APIs)
      if(link){
        try{
          // basic validation
          if(link.length < 8){
            alert(getText('booking.fail'));
            return;
          }
          const key = 'autoGlow_saved_links';
          const existing = JSON.parse(localStorage.getItem(key) || '[]');
          existing.push({link, ts: new Date().toISOString()});
          localStorage.setItem(key, JSON.stringify(existing));

          // show success message and clear only the link field
          const msg = getText('booking.success') || 'Link saved.';
          const container = document.createElement('div');
          container.className = 'panel';
          container.style.marginTop = '12px';
          container.innerText = msg;
          form.parentNode.insertBefore(container, form.nextSibling);
          if(linkField) linkField.value = '';
          return;
        }catch(err){
          console.error(err);
          alert(getText('booking.fail'));
          return;
        }
      }

      // Fallback original behavior: require name, phone, date
      const name = form.querySelector('[name="name"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const date = form.querySelector('[name="date"]').value.trim();
      if(!name || !phone || !date){
        alert(getText('booking.fail'));
        return;
      }
      // show success message
      form.reset();
      const msg = getText('booking.success');
      const container = document.createElement('div');
      container.className = 'panel';
      container.style.marginTop = '12px';
      container.innerText = msg;
      form.parentNode.insertBefore(container, form.nextSibling);
    });
  }
});

function getText(key){
  const lang = document.documentElement.getAttribute('data-lang') || 'en';
  return (window.TRANSLATIONS && window.TRANSLATIONS[lang] && window.TRANSLATIONS[lang][key]) || '';
}
