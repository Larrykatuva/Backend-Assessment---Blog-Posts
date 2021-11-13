import createError from "http-errors";
import {handlePostErrors} from '../errors/post'
import post from '../helpers/post'
import redis from 'redis';


// make a connection to the local instance of redis
const client = redis.createClient(6379);
client.on("error", (error) => {
    console.error(error);
});


/**
 * This controller is incharge of post routes.
 */
export class PostController{


    /**
     * Ping
     * @param {Request} req
     * @param {Response} res
     * @param {Next} next
     * @returns {object} res a json response with success value
     */
    static async ping(req, res, next){
        return res
            .status(200)
            .send({
                "success": true
            })
    }

    /**
     * Get a list of all posts by tag
     * @param {Request} req
     * @param {Response} res
     * @param {Next} next
     * @returns {list} res a json of list of posts
     */
    static async getPosts(req, res, next){
        const {
            query: {
                tags, sortBy, direction
            }
        } = req;
        
        //check if tag value is null
        if(!tags){
            return res
                .status(400)
                .send(handlePostErrors('POS_01'));
        }
        
        const sortValues = ['id','reads', 'likes', 'popularity']
        //Check if sort value is valid
        if(sortBy && !sortValues.includes(sortBy)){
            return res
                .status(400)
                .send(handlePostErrors('POS_02'));
        }
        const directions =  ['desc', 'asc']
        //check if the order by value is valid
        if(direction && !directions.includes(direction)){
            return res
                .status(400)
                .send(handlePostErrors('POS_02'));
        }
        try {
            //Check data from the cache
            client.get(tags, async (err, posts) => {
                //return data if its available
                if(posts){
                    return res
                        .status(200)
                        .send(JSON.parse(posts))
                }else{
                    //if data is not available save it and return it
                    const posts = await post.getPostByTag(tags.toLowerCase(), sortBy, direction);
                    await client.setex(tags, 1440, JSON.stringify(posts));
                    return res
                        .status(200)
                        .send(posts)
                }
            })
        } catch (error) {
        console.log(error)
            next({
                data: createError(
                    error.status,
                    error.message
                )
            });
        }
    }
}
