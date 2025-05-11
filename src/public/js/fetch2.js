const formularioPayment = document.getElementById('formularioPayment');
formularioPayment.addEventListener('submit',e=>{
	e.preventDefault();
	const correo =document.getElementById("correo").value;
	const nombreTitular=document.getElementById("nombreTitular").value;
	const cardNumber=document.getElementById("cardNumber").value;
	const expMonth =document.getElementById("expMonth").value;
	const expYear =document.getElementById("expYear").value; 
	const cvv = document.getElementById("cvv").value;
	const currency =document.getElementById("currency").value;
	const amount = document.getElementById('amount').value;

	fetch('/payment/add',{
		method:"POST",
		headers:{
			"Content-Type":"application/json"
		},
		body:JSON.stringify({correo,nombreTitular,cardNumber,expMonth,expYear,cvv,currency,amount})
	})
	.then(res=>res.json())
	.then(res=>{
		if(res.status){
        Swal.fire('¡Pago Realizado!').then(()=>{
        	window.location.href='/getPayment';
        })
		}else{
		Swal.fire('¡Por algun extraño motivo, no se pudo realizar el pago!');
		}
	})

});