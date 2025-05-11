const card = document.querySelectorAll('.service-card');

card.forEach(item=>{
	item.addEventListener('click',()=>{
		window.location.href='/payment';
	});
});
