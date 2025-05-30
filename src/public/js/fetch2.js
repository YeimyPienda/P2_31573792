const formularioPayment = document.getElementById('formularioPayment');
formularioPayment.addEventListener('submit',e=>{
	e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
	fetch('/payment/add',{
		method:"POST",
		headers:{
			"Content-Type":"application/json"
		},
		body:JSON.stringify(data)
	})
	.then(res=>res.json())
	.then(res=>{
		if(res.status){
        Swal.fire(`¡Pago realizado!
                    transaction_id: ${res.transactionId}`).then(()=>{
        	window.location.href='/getPayment';
        })
		}else{
		Swal.fire('¡Por algun extraño motivo, no se pudo realizar el pago!');
		}
	})

});