import axios from 'axios'


/**
 * Post functions for PostsController
 */

export default  class Post{

    /**
     * Get posts by specific tag and sort them either asc or desc by given value
     * @param {string} tag 
     * @param {string} sortBy 
     * @param {string} direction 
     * @returns {list} a list of posts matching the tag
     */
    static async getResultByTag(tag, sortBy, direction){
        let url = '';
        if(sortBy){
            if(direction){
                url = `https://api.hatchways.io/assessment/solution/posts?tags=${tag}&sortBy=${sortBy}&direction=${direction}`;
            }else{
                url = `https://api.hatchways.io/assessment/solution/posts?tags=${tag}&sortBy=${sortBy}&direction=asc`;
            }
        }else{
            url = `https://api.hatchways.io/assessment/solution/posts?tags=${tag}`
        }
        try {
            const response = await axios.get(url)
            if(response.status === 200){
                return response.data.posts;
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * Get posts by tags and sort them either asc or desc by given value
     * @param {string} tags 
     * @param {string} sortBy 
     * @param {string} direction 
     * @returns {list} a list of posts matching the tags
     */
    static async getPostByTag(tags, sortBy, direction){
        const tag = tags.split(',')
        const promises = tag.map( async item => {
            const response = await this.getResultByTag(item, sortBy, direction);
            return response
        })
        const result = await Promise.all(promises);
        return [...new Set(result[0])];
    }
}