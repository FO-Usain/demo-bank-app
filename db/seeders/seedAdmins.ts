import * as dotenv from 'dotenv';
dotenv.config();

import '../index';

import User from '../models/User';

const admins = [
    {
        firstName: 'Ad',
        lastName: 'Min1',
        email: 'admin1@admin.com',
        role: 'admin',
        password: process.env.ADMIN_DEFAULT_PASSWORD
    }
]

const clearAdmins = async () => {

}

const run = async () => {
    for (const admin of admins) {
        try {

            console.log('registering a new admin');

            const thisAdmin = await User.create(admin);

            console.log(`Successfully seeded an admin into the database: ${JSON.stringify(thisAdmin.getFields(thisAdmin))}`);
        } catch (error) {
            console.log(`could not seed database ${process.env.DB} with admins: ${error}`);
            process.exit(-1);
        }

    }
    
}

run();
