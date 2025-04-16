import database from '../models/mongodb.js'

const newsletter = async (email) => {
    const db = await database()
    const newsletterCollection = db.collection('newsletter')
    const existingSubscriber = await newsletterCollection.findOne({ email: email })
    if (existingSubscriber) return true

    const dateNow = Date.now()
    await newsletterCollection.insertOne({
        email: email,
        is_subsribe: true,
        created_at: dateNow,
        updated_at: dateNow,
    })
    return false
}

export default newsletter
