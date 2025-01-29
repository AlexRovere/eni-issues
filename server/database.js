"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('URI MongoDB non définie');
        }
        yield mongoose_1.default.connect(uri);
        console.log('Connecté à MongoDB');
    }
    catch (error) {
        console.error('Erreur de connexion à MongoDB:', error);
        process.exit(1);
    }
});
// Gestion des événements de connexion
mongoose_1.default.connection.on('disconnected', () => {
    console.log('MongoDB déconnecté');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('Erreur MongoDB:', err);
});
exports.default = connectDB;
