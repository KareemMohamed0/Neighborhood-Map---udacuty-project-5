$(function (){
    $('#menu').on('click' , function(e){
    e.preventDefault();
       $('#nav').slideToggle('slow');
    });
});