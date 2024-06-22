import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

// controllers
import { mainAiFunction } from './controllers/aiController.js';
import * as CommentsController from './controllers/commentsController.js';
import * as PostsController from './controllers/postsController.js';
import * as TagsController from './controllers/tagsController.js';
import * as UserController from './controllers/userController.js';

const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

app.use(cors());

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

app.post('/ai', mainAiFunction);

// posts
app.post('/create-post', PostsController.create);
app.delete('/delete-post', PostsController.remove);
app.patch('/update-post', PostsController.update);
app.get('/all-posts', PostsController.getAllPosts);
app.get('/post-by-id', PostsController.getPostById);
app.get('/posts-by-tag', PostsController.getPostsByTag);

// user
app.post('/create-user', UserController.create);
app.delete('/remove-user', UserController.remove);
app.post('/login', UserController.login);
app.patch('/update-user', UserController.update);

// tags
app.post('/create-tag', TagsController.create);
app.delete('/remove-tag', TagsController.remove);
app.get('/get-user-tags', TagsController.getUserTags);
app.patch('/update-tag', TagsController.update);
app.patch('/all-tags', TagsController.getAllTags);

// comments
app.post('/create-comment', CommentsController.create);
app.delete('/remove-comment', CommentsController.remove);
