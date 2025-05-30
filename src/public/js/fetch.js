const formulario = document.getElementById('formulario');

formulario.addEventListener('submit',e=>{
	e.preventDefault();
	const token = grecaptcha.getResponse();
	if (!token) {
		Swal.fire("Por favor, completa el reCAPTCHA.");
		return;
	}
	const formData = new FormData(e.target);
	const data = Object.fromEntries(formData.entries());
    data['g-recaptcha-response'] = token;
    fetch('/contact/add',{
    	method:'POST',
    	headers:{
    		"Content-Type":"application/json"
    	},
    	body:JSON.stringify(data)
    })
    .then(res=>res.json())
    .then(res=>{
    	if(res.status==true){
    		Swal.fire('¡Datos de Contacto creados Correctamente!').then(()=>{
    			window.location.href='/admin/contacts';
    		})
    	}else{
    		Swal.fire('¡Los Datos no se pudieron crear correctamente!');
    	}
    })

});
