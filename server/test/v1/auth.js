import request from 'supertest'
import { expect } from 'chai'
import app from '../../src/Server.js'

const TOKEN = 'af1b6864fa4280ec8f70ac01e5533e39b457c26fcef2b4e9ff53b240b451b94a'

const auth = () => {
    it('POST /api/v1/auth/register', (done) => {
        request(app)
            .post('/api/v1/auth/register')
            .expect(403)
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })

    it('POST /api/v1/auth/login', (done) => {
        request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'test@example.com', password: 'test', recaptcha_ref: 'test' })
            .expect(403)
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })

    it('POST /api/v1/auth/verify Internal', (done) => {
        request(app)
            .post('/api/v1/auth/verify')
            .set('Authorization', `Bearer ${TOKEN}`)
            .expect(401)
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })

    it('POST /api/v1/auth/verify External', (done) => {
        request(app)
            .post('/api/v1/auth/verify')
            .set('Authorization', `Bearer core1_${TOKEN}`)
            .expect(401)
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })

    it('POST /api/v1/auth/user', (done) => {
        request(app)
            .post('/api/v1/auth/user')
            .set('Authorization', `Bearer ${TOKEN}`)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })

    it('POST /api/v1/auth/logout', (done) => {
        request(app)
            .post('/api/v1/auth/logout')
            .set('Authorization', `Bearer ${TOKEN}`)
            .expect(401)
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })

    it('POST /api/v1/auth/otp/new', (done) => {
        request(app)
            .post('/api/v1/auth/otp/new')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send({ recaptcha_ref: 'test' })
            .expect(404)
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })

    it('POST /api/v1/auth/otp/', (done) => {
        request(app)
            .post('/api/v1/auth/otp/')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send({ recaptcha_ref: 'test' })
            .expect(404)
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })

    it('POST /api/v1/auth/token', (done) => {
        request(app)
            .post('/api/v1/auth/token', { page: 1})
            .set('Authorization', `Bearer ${TOKEN}`)
            .expect(401)
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })

    it('POST /api/v1/auth/token/new', (done) => {
        request(app)
            .post('/api/v1/auth/token/new')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send({ recaptcha_ref: 'test' })
            .expect(403)
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })
}

export default auth
