import express from 'express';
import bp from 'body-parser';
import createError from 'http-errors';
import postRoutes from '../routes/postRoutes'
import cors from 'cors'
import YAML from 'yamljs'


//Swagger documentation setup
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
const swaggerDocument = YAML.load('docs/swagger.yaml');


/**
 * 
 * @returns instance of the  application
 */
export const createApp = async () => {
    const app = express();
    app.use(bp.json());
    app.use(cors())
    app.use(cors());
    app.use(helmet());

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    /**
     * Cors policy configurations 
     */
    var corsOptions = {
        origin: ['http://localhost:3000','*'],
        optionsSuccessStatus: 200 
    }

    /**
     * Routes goes here.
     */
    app.use('/api', cors(corsOptions), postRoutes);



    //Function to catch all unfound URL endpoints
    app.use((req, res, next) => {
        next(createError(404, 'Not found'));
    });

    app.use((err, req, res, next) => {
        console.log(err)
        res.status(err.status || 500)
        res.send({
            data: {
                status: err.status || 500,
                message: err.message
            }
        })
    })

    return app;
}