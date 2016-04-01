$(document).ready(function() {
  $(".btn").on({
    mouseenter: function() {
      $(this).css("font-weight", "bold");
    },
    mouseleave: function() {
      $(this).css("font-weight", "normal");
    }
  });
  $(".thumbnail").on({
    mouseenter: function() {
      $(this).css("opacity", "1.0");
    },
    mouseleave: function() {
      $(this).css("opacity", "0.8");
    }
  });
});