import readline from 'readline'
import crypto from 'crypto'
import Database from '../mongodb.js'
import { APP_KEY, NODE_ENV } from '../../config.js'

const DatabaseSeeders = async () => {
    if (NODE_ENV !== 'production') return seed()

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    rl.question('You are in production mode. Do you want to continue? (y/n) ', async (answer) => {
        if (answer.toLowerCase() !== 'y') {
            console.log('Exiting...')
            process.exit(0)
        }
        rl.close()

        seed()
    })
}

const seed = async () => {
    const db = await Database()
    const userCollection = db.collection('users')
    const usersData = [
        {
            email: 'super_admin@axleshift.com',
            password: '!N)Super-Admin?@33',
            role: 'super_admin',
            first_name: 'Super Admin',
            last_name: 'Axleshift',
        },
        {
            email: 'admin@axleshift.com',
            password: '!N)Admin?@33',
            role: 'admin',
            first_name: 'Admin',
            last_name: 'Axleshift',
        },
        {
            email: 'staff@axleshift.com',
            password: '!N)Staff?@33',
            role: 'staff',
            first_name: 'Staff',
            last_name: 'Axleshift',
        },
        {
            email: 'user@axleshift.com',
            password: '!N)User?@33',
            role: 'user',
            first_name: 'User',
            last_name: 'Axleshift',
        },
    ]

    const usersToInsert = usersData.map((user) => ({
        ...user,
        password: crypto.createHmac('sha256', user.password).update(APP_KEY).digest('hex'),
        registration_type: 'seeder',
        avatar: null,
        timezone: 'Asia/Manila',
        ref: crypto.randomBytes(4).toString('hex'),
        email_verify_at: Date.now(),
        created_at: Date.now(),
        updated_at: Date.now(),
    }))

    await userCollection.insertMany(usersToInsert)
    console.log('Database seeding completed.')
    process.exit(0)
}

DatabaseSeeders()
