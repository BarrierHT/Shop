// console.table(  [{name:"Hi", age:32},{name:"Hi2", age:17,hasHobbies:true}]    );




/*

function summarizeUser(userName, userAge, userHasHobbie = true){
    let str = `The name is : ${userName}, the age is : ${userAge} and `; 
    if(userHasHobbie) str+= 'has';
    else str+= "doesn't have";
    str+= ' Hobbies';
    return str;
};

console.log(summarizeUser('Ramon',18,false));
console.log(summarizeUser('Lucas',17,true));


const summarizeUser2 =  (userName, userAge, userHasHobbie) => {
    return summarizeUser(userName,userAge,userHasHobbie);
};

console.log(summarizeUser2('Ramon2',18,false));
console.log(summarizeUser2('Lucas2',17,true));

let key = ((1==1)? 'correct':'noCorrect');
console.log(key);

const obj = {
    name:'Ramon',
    age : 18
};

let {name,age,gender = 'Unknown'} = obj;
console.log(name+ " " +age+" "+gender);


const hobbies =  [ {name: 'Sports'} , {name : 'Videogames', } ];
hobbies.unshift({name:'Theather'});
hobbies.shift();

for(const prop in hobbies){
    let {name = 'Unknown'} = hobbies[prop];
    console.log(prop + ': ' + name);
}

console.log( ...[...[...hobbies]] );
*/






/*

async function tiempo(text){							//Async Function
   
    const promise = await new Promise((resolve,reject) =>{
        setTimeout( () => {
            resolve(text);
        },2000);
    });

    return promise;     
}

tiempo('Ey dude!')
.then( text =>{
    console.log(text);
    return tiempo('Ey dude x2!');
})
.then( text => {
    console.log(text);
});

*/
