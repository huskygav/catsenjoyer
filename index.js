let express = require('express');
let app = express();

let port = 3000;

app.listen(port,function(){
    console.log(`http://localhost:${port}`)
})

app.use(express.static(`public`));

let hbs = require(`hbs`);
app.set(`views`,`views`);
app.set(`view engine`,`hbs`);

app.use(express.urlencoded({extended:true}));

let {faker} = require(`@faker-js/faker`);

let items = [];

for (let i = 0; i<=20; i++){
    let sex = faker.name.sex();
    items.push({
        id: i,
        name: faker.name.firstName(sex),
        sex: sex,
        age: faker.datatype.number({max: 25}),
        image: faker.image.cats(400,400,true),
        breed: faker.animal.cat(),

        isActive: faker.datatype.boolean(),

        isWanted: false
    })
}

app.get('/admin',function(req,res){
    res.render('admin',
    {
        items:items
    }
    )
});

app.get('/', function(req, res){
    let array = [];
    for(let i = 0; i < items.length; i++){
        if(items[i].isActive) {
            array.push(items[i]);
        }
    }
    res.render('index', {
        items: array
    })
})

app.get('/home',function(req,res){
    let id = req.query.id;
    let item = items[id];
    if (item){
        item.isWanted = true;
        res.redirect('/');
    }
})

app.get('/admin-home',function(req,res){
    let id = req.query.id;
    let item = items[id];
    if (item){
        item.isWanted = false;
        item.isActive = false;
        res.redirect('/admin');
    }
    
})

app.get('/is-home', function(req, res){
    let array = [];
    for(let i = 0; i < items.length; i++){
        if(!items[i].isActive) {
            array.push(items[i]);
        }
    }
    res.render('index', {
        items: array
    })
})

app.post('/admin-add',function(req,res){
    let {name, age, breed, sex} = req.body;
    let item = {
        name: name,
        age: age,
        breed: breed,
        sex: sex,
        image: faker.image.cats(400,400,true),
        isActive: true,
        isWanted: false
    }
    items.push(item);
    res.redirect('/admin');
})