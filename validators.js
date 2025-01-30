import { checkSchema } from 'express-validator';
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

    },
    description: {
        in: ['body'],
        isLength: {
            errorMessage: 'La description de l\'issue doit contenir entre 3 et 500 caractères',
            options: { min: 3, max: 500 }
        }

    },
    date: {
        in: ['body'],
        isISO8601: {
            errorMessage: 'La date doit être au format ISO8601'
        }

    },


});
export default validationSchema;