(function scrollReveal() {
    window.sr = ScrollReveal();
    
    sr.reveal('.user-profile-quote .card', {
      duration   : 600,
      distance   : '300px',
      easing     : 'ease-in-out',
      origin     : 'bottom',
      scale      : 1,
      viewFactor : 0,
    },50);
  })();