const formulario = document.getElementById('formulario');

formulario.addEventListener('submit',e=>{
	e.preventDefault();

	const nombre = document.getElementById('nombre').value;
	const email = document.getElementById('email').value;
	const comentario = document.getElementById('comentario').value;

	fetch('/contact/add',{
		method:'POST',
		headers:{
			"Content-Type":"application/json"
		},
		body:JSON.stringify({email,nombre,comentario})
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
