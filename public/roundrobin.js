$(document).ready(function () {

	for (let i = 0; i < 16; i++){

		$(`.player${i}`).change(function () {

			let val1 = $(`.player${i}`).prop('selectedIndex');

			if( val1 === 1){
				 $(`.player${i}x`).prop('selectedIndex', 2);
			}

			else if(val1 === 2){
				 $(`.player${i}x`).prop('selectedIndex', 1);
			}
		});

		$(`.player${i}x`).change(function () {

			let val2 = $(`.player${i}x`).prop('selectedIndex');

			if( val2 === 1){
				 $(`.player${i}`).prop('selectedIndex', 2);
			}

			else if(val2 === 2){
				 $(`.player${i}`).prop('selectedIndex', 1);
			}
		});
	}
});
