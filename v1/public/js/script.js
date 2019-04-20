(function scrollReveal() {
    window.sr = ScrollReveal();
    
    sr.reveal('.main .card', {
      duration   : 600,
      distance   : '300px',
      easing     : 'ease-in-out',
      origin     : 'bottom',
      scale      : 1,
      viewFactor : 0,
    }, 100);
  })();

  function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
  }
  