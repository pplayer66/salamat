var boutiqueShow = document.querySelector('.boutique-show');


boutiqueShow.onclick = (e)=>{
	var item = e.target;
	var data_salamat = item.getAttribute('data-salamat');
	var data_salon = item.getAttribute('data-salon');
	window.location.href = `/findboutique?data_salamat=${data_salamat}&data_salon=${data_salon}`;
};