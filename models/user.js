const getDb = require('../util/database').getDb;
const { ObjectId } = require('mongodb');

class User{
    constructor(name, email, password, cart, id){
        this.name = name;
        this.email = email;
        this.password = password;
        this.cart = cart;                                                               //* { items: [ {...product,quantity:1} ] }
        this._id = ObjectId(id);
    }

    save(){
        const db = getDb();
        return db.collection('users').insertOne(this)
                .then(result => result)
                .catch(err => console.log(err))
    }

    addToCart(product){
        const cartProductIndex = this.cart.items.findIndex(cartProduct => product._id.toString() === cartProduct.productId.toString() );
        const cartProduct = this.cart.items[cartProductIndex];
        let newQty = 1;
        
        const updatedCartItems = [...this.cart.items];
        
        if(cartProduct){
            newQty = this.cart.items[cartProductIndex].quantity + 1;
            // console.log('new quantity: ',newQty);
            updatedCartItems[cartProductIndex].quantity = newQty;
        } 
        else{
            updatedCartItems.push({
                productId: ObjectId(product._id),                               //save id of the product passed 
                quantity: newQty
            });
        }
        const updatedCart = {items: updatedCartItems};

        const db = getDb();
        return db.collection('users').updateOne({ _id: this._id },
                    { $set: { cart: updatedCart  }
                })
                .then(result => result )
                .catch(err => console.log(err));   
    }

    getCartProducts(){
        const db = getDb();
        let productsCart;
        return db.collection('products').find().toArray()
                .then(products => {
                    // console.log(this.cart.items);
                    productsCart = products;
                    const updatedCart =  this.cart.items.filter(productItem => 
                        products.find(product => product._id.toString() === productItem.productId.toString() ) !== undefined )
                    // console.log(updatedCart);
                  
                    return (updatedCart.length < this.cart.items.length) ? {items:updatedCart} : null;
                })
                .then( updatedCart => (updatedCart) ? db.collection('users').updateOne({ _id: this._id },{$set: {cart:updatedCart}}) : null )
                .then( result => this.cart.items.map(product => ObjectId(product.productId)) )
                .then( productsMapped => {
                    return productsCart.filter(p => productsMapped.find(prodMapped => prodMapped.toString() === p._id.toString()) !== undefined );
                })
                .then(productsCart => {
                    for (const index in productsCart) {
                        const product = productsCart[index];
                        let quantityProduct = this.cart.items.find(productItem => productItem.productId.toString() === product._id.toString()).quantity;
                        let newProduct = {...product,quantity: quantityProduct};
                        productsCart[index] = newProduct;
                    }
                    return productsCart;
                })
                .catch(err => console.log(err));
    }
    

    deleteCartItem(prodId){
        const updatedCartItemIndex = this.cart.items.findIndex(cartItem => cartItem.productId.toString() === prodId.toString());
        let updatedCartItem = this.cart.items[updatedCartItemIndex];
        
        let updatedCart = [...this.cart.items];
        
        if(updatedCartItem){
            if(updatedCartItem.quantity > 1) updatedCartItem.quantity--;
            else updatedCartItem = -1;
        }
        else return;

        updatedCartItem === -1 ? updatedCart.splice(updatedCartItemIndex,1) : updatedCart[updatedCartItemIndex] = updatedCartItem; 
    
        const db = getDb();
        return db.collection('users').updateOne({ _id: this._id },
                    { $set: { cart: {items:updatedCart}  }
                })
                    .then(result => result )
                    .catch(err => console.log(err));   
    }

    addOrder(){
        const db = getDb();

        return this.getCartProducts()
                .then(products => {
                    // console.log(products);  
                    const order = {
                        user: {
                            _id: this._id,
                            name: this.name
                        },
                        items: products
                    };
                    return db.collection('orders').insertOne(order);
                })
                .then(result => {
                    this.cart = {items:[]};
                    return db.collection('users').updateOne({ _id: this._id },
                        { $set: { cart: this.cart  }
                    });
                })
                .catch(err => console.log(err));
    }

    getOrders(){
        const db = getDb();
        return db.collection('orders').find({'user._id': this._id}).toArray()
    }

    static findById(userId){
        const db = getDb();
        return db.collection('users').findOne({_id: ObjectId(userId)})
    }

}

module.exports = User;
