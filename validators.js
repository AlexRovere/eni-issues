const { checkSchema } = require('express-validator');
const validationSchema = checkSchema({
    auteur: {
        in: ['body'],
        isLength: {
            errorMessage: 'Le nom de l\'auteur doit contenir entre 3 et 50 caractères',
            options: { min: 3, max: 50 }
        }

    },  
    titre: {
        in: ['body'],
        isLength: {
            errorMessage: 'Le titre de l\'issue doit contenir entre 3 et 50 caractères',
            options: { min: 3, max: 50 }
        }

    } 
});
module.exports = validationSchema;