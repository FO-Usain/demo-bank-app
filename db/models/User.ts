import { Schema, model, Document } from "mongoose";
import { GENDERS } from "../../config/constants";

var bcrypt = require('bcryptjs')

export interface IUser {
    email: string;
    role: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserModel extends IUser, Document {
    passwordMatches(doc: IUserModel, testPassowrd: string): Boolean

    getFields(doc: IUserModel): any
 }

const UserSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

UserSchema.pre('save', async function(this: IUserModel, next) {
    const salt = await bcrypt.genSaltSync(10);

    this.password = await bcrypt.hashSync(this.password, salt);

    next();
});

UserSchema.methods.passwordMatches = (doc: IUserModel, testPassword: string) => {
    return bcrypt.compareSync(testPassword, doc.password);
}

UserSchema.methods.getFields = (doc: IUserModel) => {

    return {
        id: doc._id,
        email: doc.email,
        role: doc.role,
    }
}

const User = model<IUserModel>('User', UserSchema);

export default User;