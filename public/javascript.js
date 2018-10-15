  $('#competition').val(function(){
    if($('#select').is('#roundrobin')){
        $('#select').prop('disabled', 'disabled')
    } else if ($(this).is('#singles')) {
        $('#select').prop('disabled', false)    
    }  else {
        $('#select').attr('disabled', 'disabled')
    }
});


