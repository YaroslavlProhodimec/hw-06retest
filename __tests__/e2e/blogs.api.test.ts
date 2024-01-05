import {app} from "../../src/settings";
// @ts-ignore
import request from "supertest";


describe('/api/blogs', () => {
    // beforeAll(async () => {
    //     await request(app).delete('/data')
    // })

    it('should return 204 and array view model', async () => {
        await request(app)
            .get('/api/blogs')
            .expect(200, [
                {
                    id: 'xaxa',
                    name: 'xaxa',
                    description: 'xaxa',
                    websiteUrl: 'xaxa'
                }
            ])
    })

 // it('should return 204 and array empty', async () => {
 //        await request(app)
 //            .delete('/api/blogs/delete')
 //            .expect(204)
 //    })

    it('should return 204 and push array in the view model', async () => {
        await request(app)
            .post('/api/blogs')
            .send({
                id: 'xaxa',
                name: 'xaxa',
                description: 'xaxa',
                websiteUrl: 'xaxa'
            })
            .expect(204)
    })
})