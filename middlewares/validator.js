const checkObjectId = require('mongoose').Types.ObjectId.isValid;

const { body, param, validationResult } = require('express-validator');

exports.userValidationRules = (...fields) => {                                              //Need to be logged
	const errors = []; 
	console.log('fields: ', fields);

	fields.forEach(field => {
	
		if(field == 'body--email'){
			errors.push(
				body('email','Email Format is not valid, length needed : [3-100]')
				.exists()
				.trim()
				.isEmail()
				.bail()
				.isLength({min:3, max: 100})
				.bail()
				.normalizeEmail()															//*Sanitazing Data
			);
		}
		else if(field == 'body--name'){
			errors.push(
				body('name','Name format not valid, length needed : [2-100]')
				.exists()
				.trim()
				.bail()
				.isLength({min:2, max: 100})
				.bail()
				.custom(value => new RegExp(/^[a-zA-Z0-9_ñÑ\s]+$/).test(value))
			);
		} 
		else if(field == 'body--password') {
			errors.push(
				body('password',"Password format is not valid, length needed : [5-30]. \n It has to contain at least 1 Capital letter [A-Z], 1 lower letter [a-z] and 1 digit [0-9]")
				.exists()
				.trim()
				.isLength({min: 5, max: 30})
				.bail()
				.isAlphanumeric()
				.bail()
				.custom(value => new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/g).test(value) )
			);
		}
		else if(field == 'body--confirmPassword'){
			errors.push(
				body('confirmPassword','Passwords dont match')
				.exists()
				.trim()
				.custom((value, { req }) => value === req.body.password)
			);
		}
		else if(field == 'body--title'){
			errors.push(
				body('title','Title format is not valid, length needed: [2-60]')
				.exists()
				.trim()
				.bail()
				.isLength({min:2, max: 60})
				.bail()
				.custom(value => new RegExp(/^[a-zA-Z0-9_ñÑ\s]+$/).test(value))
			);
		}
		else if(field == 'body--price'){
			errors.push(
				body('price','Price format is not valid, it has to be a number and less than 1,000,000,000,000')
				.exists()
				.trim()
				.isNumeric()
				.bail()
				.custom(value => Number(value) < 1e12)
			);
		}
		else if(field == 'body--description'){
			errors.push(
				body('description','Description format is not valid, length needed: [2-600]')
				.exists()
				.trim()
				.isLength({min:2, max: 600})
			);
		}
		else if(field == 'body--imageUrl'){
			errors.push(
				body('imageUrl','Image Url format not valid, length needed: [2-600]')
				.exists()
				.trim()
				.isLength({min:2, max: 600})
				.bail()
				.isURL()
			);
		}
		else if(field.split('_')[0] == 'body--objectId'){
			field = field.split('_')[1];
			errors.push(
				body(field,`${field} format is not valid`)
					.exists()
					.trim()
					.custom(value => checkObjectId(value))
			);
		}
		else if(field.split('_')[0] == 'param--objectId'){
			field = field.split('_')[1];
			errors.push(
				param(field,`${field} format is not valid`)
					.exists()
					.trim()
					.custom(value => checkObjectId(value))
			);
		}
		
	});
	

	/*
		! --- Waiting for Error Handling Module ---
		ToDo - Check methods in models (userSchema and productSchema)
		ToDo - Use TryCatch to handle error Exceptions (Like using an invalid Id or an inexistent field)
	*/
	
	return errors;
}


exports.validate = (req) => {
	const errors = validationResult(req);
	// console.log('Validation Errors(req): ', errors);
	const extractedErrors = {};
	
	errors.array().map(err => extractedErrors[err.param] = err.msg );

	return extractedErrors;
}
