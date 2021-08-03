/**
 * Drawing Board - user.ts
 * MongoDB schema for user data.
 * 
 * Note from Carl:
 * PLEASE TRY NOT TO CHANGE THIS AT ALL. I DONT WANT TO FIX MORE SHIT IF SOMETHING GOES WRONG.
 * 
 * Maintainer: Carl Voller
 */

import { Schema, model, Model, Document } from 'mongoose';
import { hashSync, compareSync, genSaltSync } from 'bcrypt';

export interface UserModel extends Document {
    username: string;
    email: string;
    password: string;
    generateHash: (pass: string) => string;
    validatePass: (pass: string) => boolean;
    keys: [{
        token: string;
        expiresOn: number;
    }];
}

// User object structure. - Try not to change this unless absolutely necessary.
// If its only minor, store the new param as a JSON Object in { metaData }.
let userSchema: Schema<UserModel> = new Schema<UserModel>({
    username: String,
    email: String,
    password: String,
    keys: [{
        token: String,
        expiresOn: Number
    }]
});

// Password Hashing and verification methods.
userSchema.methods.generateHash = (pass: string): string => hashSync(pass, genSaltSync(8));
userSchema.methods.validatePass = function(pass: string): boolean { return this.password ? compareSync(pass, this.password) : false }

export const User: Model<UserModel> = model<UserModel>('user', userSchema);