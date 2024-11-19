import request from 'supertest'
import { expect } from 'chai'
import app from '../src/Server.js'
import { auth } from './v1/index.js'

describe('App Tests', async () => {
    it('GET /', (done) => {
        request(app)
            .get('/')
            .expect('Content-Type', /text/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })

    auth()
})
