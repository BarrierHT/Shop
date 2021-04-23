const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Order = require('./orders');

const userSchema = new Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    cart: {
        items: [{ 
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required:true
            },
            quantity: {
                type:Number,
                required:true,
                default: 0
        }}]
    }
});

userSchema.methods.addToCart = function (prodId) {
    const cartProductIndex = this.cart.items.findIndex(cartProduct => prodId.toString() === cartProduct.productId.toString() );
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
                    productId: prodId,                               //save id of the product passed 
                    quantity: newQty
                });
            }
            const updatedCart = {items: updatedCartItems};
            
        // this.cart = updatedCart;
        return this.updateOne({$set: {cart: updatedCart}});
}

userSchema.methods.deleteCartItem = function (prodId) {
    
    const updatedCartItemIndex = this.cart.items.findIndex(cartItem => cartItem.productId.toString() === prodId.toString());
        let updatedCartItem = this.cart.items[updatedCartItemIndex];
    console.log('test: ', prodId);
        let updatedCart = [...this.cart.items];
        
        if(updatedCartItem){
            if(updatedCartItem.quantity > 1) updatedCartItem.quantity--;
            else updatedCartItem = -1;
        }
        else return Promise.resolve();
       
        updatedCartItem === -1 ? updatedCart.splice(updatedCartItemIndex,1) : updatedCart[updatedCartItemIndex] = updatedCartItem; 
       
        return this.updateOne( {$set: { cart: {items:updatedCart} } });
}

userSchema.methods.addOrder = function(){

    return this
            .populate('cart.items.productId', '-imageUrl')
            .execPopulate()
            .then(cartUser =>{
                let products = cartUser.cart.items;            
                
                products = products.map(product => {
                    return {
                        quantity: product.quantity,
                        price: product.productId.price,
                        title: product.productId.title,
                        productId: product.productId._id
                    };
                })

                return products;
            })
            .then( products => {
                // console.log(products);  
                const order = {
                    user: {
                        _id: this._id,
                        name: this.name
                    },
                    items: products
                };
                return Order.insertMany([order]);                                                   //*Insert a new Order
            })
            .then(order => {
                // console.log('order: ', order);
                this.cart = {items:[]};
                return this.updateOne( { $set: { cart: this.cart  } });
            })
            .catch(err => console.log(err));

}


module.exports = mongoose.model('User', userSchema);

