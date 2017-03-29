const express = require('express');
const app = express();
var mongoose = require('./db/mongoose');
// var {Category} = require('./models/Category');
var Category = require('./db/mongoose').Category;
var {Boutique} = require('./models/Boutique');
const port = process.env.PORT || 3000;
var category;
var links = [{link: 'home', linktitle: 'Главная'}, {link: 'news', linktitle: 'Новости'}, {link: 'rent', linktitle: 'Аренда'}, {link: 'salamat1-1', linktitle: 
'План'}, {link: 'company', linktitle: 'О нас'}, {link: 'contacts', linktitle: 'Контакты'}];
var floors = [
		{
			tcname: 'Саламат 1',
			floors: [
				{floor: '1 этаж', link: 'salamat1-1'},
				{floor: '2 этаж', link: 'salamat1-2'},
				{floor: '3 этаж', link: 'salamat1-3'},
				{floor: '4 этаж', link: 'salamat1-4'}
			]
		},
		{
			tcname: 'Саламат 2',
			floors: [
				{floor: '1 этаж', link: 'salamat2-1'},
				{floor: '2 этаж', link: 'salamat2-2'}
			]
		},
		{
			tcname: 'Саламат 3',
			floors: [
				{floor: '0 этаж', link: 'salamat3-0'},
				{floor: '1 этаж', link: 'salamat3-1'},
				{floor: '2 этаж', link: 'salamat3-2'},
				{floor: '3 этаж', link: 'salamat3-3'}
			]
		},
		{
			tcname: 'Саламат 4',
			floors: [
				{floor: '1 этаж', link: 'salamat4-1'},
				{floor: '2 этаж', link: 'salamat4-2'}
			]
		},
		{
			tcname: 'Саламат 5',
			floors: [
				{floor: '0 этаж', link: 'salamat5-0'},
				{floor: '1 этаж', link: 'salamat5-1'},
				{floor: '2 этаж', link: 'salamat5-2'},
				{floor: '3 этаж', link: 'salamat5-3'}
			]
		}
];


var _data = {lvl1: mongoose.lvl1, lvl2: mongoose.lvl2, lvl3: mongoose.lvl3, links: links};


app.set('view engine', 'pug');
app.use(express.static('public'));



// ****************************************     WRITE/READ DATA     ***********************************
app.get('/rw-boutiques', (req, res)=>{
	if (!req.query.name && !req.query.salamat && !req.query.salon && !req.query.phone && !req.query.total && !req.query.about && !req.query.logo && !req.query.picts && !req.query.site && !req.query.email && !req.query.son){
		Boutique.find().then(
			(boutiques)=>{
				res.send({
					boutiques
				})
			},
			(err)=>{
				res.status(400).send(err)
			}
		);
		return;
	}
	var boutique = new Boutique({
		name: req.query.name,
		salamat: req.query.salamat,
		salon: req.query.salon,
		phone: req.query.phone,
		total: req.query.total,
		about: req.query.about,
		logo: req.query.logo,
		picts: req.query.picts,
		son: req.query.son,
		email: req.query.email,
		site: req.query.site
	});
	boutique.save().then(
		(bot)=>{
			res.send('document has been saved');
		},
		(err)=>{
			res.status(400).send(err);
		}
	);
});


app.get('/rw-categories', (req, res)=>{
	if (!req.query.index && !req.query.id && !req.query.idparent && !req.query.name && !req.query.count && !req.query.idgrand){
		Category.find().then(
			(categories)=>{
				res.send({
					categories
				})
			},
			(err)=>{
				res.status(400).send(err)
			}
		);
		return;
	};
	var category = new Category({
		index: req.query.index,
		id: req.query.id,
		idparent: req.query.idparent,
		name: req.query.name,
		count: req.query.count,
		idgrand: req.query.idgrand
	});
	category.save().then(
		(doc)=>{
			res.send('document has been saved');
		},
		(err)=>{
			res.status(400).send(err);
		}
	);
});



app.get('/delbot', (req, res)=>{
	Boutique.remove({}).then((result)=>{
	res.send('Все удалено!')
	});
});

app.get('/delcat', (req, res)=>{
	Category.remove({}).then((result)=>{
	res.send('Все удалено!')
	});
});
// ****************************************     WRITE/READ DATA     ***********************************





// *************************************************************   R   O    U    T    E    S   ************************************************************
app.get('/search', (req, res)=>{
	res.send(mongoose.lvl3);
});


// *************************************************  MAP QUERIES  ********************************************
app.get('/getboutique', (req, res)=>{
	var boutique = req.query.boutique;
	var salamat = req.query.salamat;
	Boutique.find({salamat:salamat, salon:boutique})
	.then((docs)=>{
		res.send(docs);
	})
});
app.get('/boutiquelist', (req, res)=>{
	var boutique = req.query.boutique;
	var salamat = req.query.salamat;
	Boutique.find({salamat: salamat, salon: boutique}).then((docs)=>{
		var data = _data;
		data.docs = docs;
		res.render('boutiques', data);
	});
});
// *************************************************  MAP QUERIES  ********************************************

app.use('/category', (req, res)=>{
	category = req.query.dataid;
	Category.find({id: category}, (err, doc)=>{
		var categoryname = doc[0].name;
		if (doc[0].idparent != '@'){
			Category.find({id: doc[0].idparent}, (err, parent)=>{
				var parentname = parent[0].name;
				if (parent[0].idparent != '@'){
					Category.find({id: parent[0].idparent}, (err, grand)=>{
						var grandname = grand[0].name;
						Boutique.count({total: new RegExp(category, "i")}, (err, numb)=>{
							var numbofpages = (numb % 10)==0 ? (numb/10) : (Math.floor(numb/10)+1); 
							if (numbofpages == 1){
								numbofpages = false;
							};
							Boutique
							.find({total: new RegExp(category, "i")})
							.limit(10)
							.exec((err, docs)=>{
								var data = _data;
								data.docs = docs;
								data.pages = numbofpages;
								data.parent = parentname;
								data.grand = grandname;
								data.category = categoryname;
								res.render('boutiques', data);
							});
						});
					})
				}else{
					Boutique.count({total: new RegExp(category, "i")}, (err, numb)=>{
						var numbofpages = (numb % 10)==0 ? (numb/10) : (Math.floor(numb/10)+1); 
						if (numbofpages == 1){
							numbofpages = false;
						};
						Boutique
						.find({total: new RegExp(category, "i")})
						.limit(10)
						.exec((err, docs)=>{
							var data = _data;
							data.docs = docs;
							data.pages = numbofpages;
							data.parent = parentname;
							data.category = categoryname;
							res.render('boutiques', data);
						});
					});
				}
			})
		}else{
			Boutique.count({total: new RegExp(category, "i")}, (err, numb)=>{
				var numbofpages = (numb % 10)==0 ? (numb/10) : (Math.floor(numb/10)+1); 
				if (numbofpages == 1){
					numbofpages = false;
				};
				Boutique
				.find({total: new RegExp(category, "i")})
				.limit(10)
				.exec((err, docs)=>{
					var data = _data;
					data.docs = docs;
					data.pages = numbofpages;
					data.category = categoryname;
					res.render('boutiques', data);
				});
			});
		}
	});
});


app.use('/boutiques', (req, res)=>{
	var offset = (+req.query.pagenumber - 1) * 10;
	Boutique
		.find({total: new RegExp(category, "i")})
		.skip(offset)
		.limit(10)
		.exec((err, docs)=>{
			res.send(docs);
		});
});

app.use('/docedit', (req, res)=>{
	var obj = req.query, findQueries={}, updateQueries={};
	for(key in obj){
		if (key!='salamat' && key!='salon'){
			updateQueries[key] = obj[key];
		}else{
			findQueries[key]= obj[key];
		}
	}
	console.log(findQueries);
	res.send(findQueries);
});

app.use('/findboutique', (req, res)=>{
	Boutique.find({salamat: req.query.data_salamat, salon: req.query.data_salon}, (err, docs)=>{
		var boutique = docs[0], picts, data;
		var pictsjpg = [];
		if (boutique.picts != 'noimage'){
			pictsjpg = boutique.picts.split(',');
		}else{
			picts = boutique.son.split(',');
			for (i=0; i<picts.length; i++){
				pictsjpg[i] = picts[i] + '.jpg';
			};
		};
		data = _data;
		data.boutique = boutique;
		data.picts = pictsjpg;
		res.render('boutique', data);
	});
});

app.use('/:page?', (req, res, next)=>{
	var page = req.params.page, data = _data;
	if (!page){
		page = 'home';
	}else if (page.substr(0, 7) == 'salamat'){
		data.salamat = {salamat_numb: page.substr(7,1), floor: page.substr(9,1), floors: floors};
	}else if(page == 'rent'){
		data.rent_imgs = ['rent1.jpg', 'rent2.jpg', 'rent3.jpg', 'rent4.jpg', 'rent5.jpg']
	}else if(page == 'dbedit'){
		data = {};
	}
	res.render(page, data);
});
// *************************************************************   R   O    U    T    E    S   ************************************************************



app.listen(port, ()=>{
	console.log('Server is running...');
});
