(function scrollReveal() {
    window.sr = ScrollReveal();
    
    sr.reveal('.main .card', {
      duration   : 600,
      distance   : '300px',
      easing     : 'ease-in-out',
      origin     : 'bottom',
      scale      : 1,
      viewFactor : 0,
    },50);
  })();

// ===== Scroll to Top ==== 
$(window).scroll(function() {
  if ($(this).scrollTop() >= 500) {        // If page is scrolled more than 50px
      $('#return-to-top').fadeIn(500);    // Fade in the arrow
  } else {
      $('#return-to-top').fadeOut(500);   // Else fade out the arrow
  }
});
$('#return-to-top').click(function() {      // When arrow is clicked
  $('body,html').animate({
      scrollTop : 0                       // Scroll to top of body
  }, 500);
});