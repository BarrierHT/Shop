const getDb = require('../util/database').getDb;
const { ObjectId } = require('mongodb');

class Product {
	constructor(id,title,price,imageUrl,description, userId){
		this._id = ObjectId(id);											//? this._id = id? ObjectId(id) : null;
		this.title = title;
		this.price = Number(price);
		this.imageUrl = imageUrl;
		this.description = description;
		this.userId = ObjectId(userId);
	}

	save(){
		const db = getDb(); 
			console.log('updating or inserting One');
			return db.collection('products').updateOne({_id: this._id},{ $set: this },{ upsert:true })
					.then(result => result)
					.catch(err => console.log(err));
	}
	
	static fetchAll(cond = {}){
		// console.log('condition: ', cond);
		const db = getDb(); 
		// db.listCollections().toArray().then(res => console.log(res));
		return db.collection('products').find(cond).toArray()
				.then(products => products)
				.catch(err => console.log(err));
	}

	
	static deleteById(prodId){
		const db = getDb();
		return db.collection('products').deleteOne({ _id: ObjectId(prodId) })
				// .then(result => {
				// 	return db.collection('users').updateOne({_id: this._id},
				// 		{ $pull: { 'cart.items': { productId: ObjectId(prodId)} } }
				// 		);
				// })
				.then(result => result)
				.catch(err => console.log(err));
	}

	static fetchTest(){
		const db = getDb(); 
		return db.collection('products').aggregate([ 
				{ $project: { "price":1, "title":1, "_id":0 } },
				{ $limit: 4 },
				{ $skip: 1 },
				{ $sort: {price: 1, title: -1} } ])
				.toArray()
				.then(products => products)
				.catch(err => console.log(err));
	// return db.collection('products').updateMany({price:{$type: 'double'}},{$set: {
	// 			price: 5.99	
	// 		}})
	// 		.then(products => products)
	// 		.catch(err => console.log(err));
	}
}


module.exports = Product;
