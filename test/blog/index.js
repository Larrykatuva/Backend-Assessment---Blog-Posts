import chai from 'chai'
import {createApp} from '../../src/lib/createApp'
import request from 'supertest'

const {expect} = chai


describe('Post tests', () => {
    let server;
    const BASE_URL = '/api';

    /**
     * runs once before the first test in this block
     */
    before(async() => {
        const app  = await createApp();
        server = app.listen(5000);
    });

    /**
     * runs once after the last test in this block
     * Closing the server method
     */
    after(async () => {
        await server.close();
    })

    /**
     * Tesitng api endpoints
     */
    describe('GET api/ping', () => {
        //tesing ping endpoint
        it('Should ping successfully with success value being true', async () => {
            const {status, body} = await request(server)
                .get(`${BASE_URL}/ping`);
            expect(body.success).to.equal(true)
            expect(status).to.equal(200)
        });

        //testing get lists endpoint
        it('Should return a list of posts', async () => {
            const {status, body} = await request(server)
                .get(`${BASE_URL}/posts?tags=history,tech&sortBy=id&direction=asc`);
            expect(body.length).to.not.equal(0)
            expect(status).to.equal(200)
        });

        //tesing tags query parameters in get posts endpoint
        it('Should not accept url without tags', async () => {
            const {status} = await request(server)
                .get(`${BASE_URL}/posts?sortBy=id&direction=asc`);
            expect(status).to.equal(400)
        });

        //tesing sortby query parameters in get posts endpoint
        it('Should not accept invalid sorting values', async () => {
            const {status} = await request(server)
                .get(`${BASE_URL}/posts?tags=history,tech&sortBy=idd&direction=asc`);
            expect(status).to.equal(400)
        });

        //tesing direction query parameters in get posts endpoint
        it('Should not accept invalid sort direction', async () => {
            const {status} = await request(server)
                .get(`${BASE_URL}/posts?tags=history,tech&sortBy=id&direction=ascs`);
            expect(status).to.equal(400)
        });
    });

});