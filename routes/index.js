const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const auth = require('http-auth');
const fs = require('fs');
const postDirectory = 'public/images/posts';
const profilePicDirectory = 'public/images/profile_pics';
const userBannerDirectory = 'public/images/user_banners';
const { body, validationResult } = require('express-validator');
const basic = auth.basic({
	file: path.join(__dirname, '../users.htpasswd'),
})
const postUpload = multer({ dest: 'public/images/posts'});
const profilePicUpload = multer({ dest: 'public/images/profile_pics' });
const profileBannerUpload = multer({ dest: 'public/images/user_banners' });

const router = express.Router();
const Registration = mongoose.model('Registration')
const Post = mongoose.model('Post')
const User = mongoose.model('User');

router.get("/raw-registrations", auth.connect(basic), (req, res) => {
	Registration.find().then((registrations) => {
		res.send(registrations);
	});
})

router.get('/registrations', auth.connect(basic), (req, res) => {
	User.find().then((users) => {
		res.render('index', { title: 'Listing registrations', registrations: users });
	}).catch((err) => {
		res.send(err+ '\nSorry! Something went wrong.');
	});
})

router.get('/', (req, res) => {
	res.render('form', { title: 'Sign Up' });
});

router.get('/home', (req, res) => {
	Post.find({ universalQuery: "uni-sec91" }, (err, posts) => {
		if(err) throw err;
		res.render('home', { title: "Home", posts: posts.reverse() })
	})
})

router.get('/settings/:userId', (req, res) => {
	User.findOne({ _id: req.params.userId }, (err, user) => {
		if(err) throw err;
		res.render('settings', { title: `${user.name}'s Settings'`, user })
	})
})

router.get('/new', (req, res) => {
	res.render('new-post', { title: 'New Post' });
});

router.post('/delete-all-posts', protectCid, (req, res) => {
	Post.deleteMany({universalQuery: 'uni-sec91'}, (err) => {
		if(err) throw err;
		fs.readdir(postDirectory, (err, files) => {
			if(err) throw err;
			for(const file of files) {
				fs.unlinkSync(path.join(postDirectory, file), err => {
					if (err) throw err;
				})
			}
		})
		if(req.body.message) {
			res.send(req.body.message);
		} else {
			res.send("Sanitized Post Database!")
		}
	})
})

router.post('/auth/user', [
	body('email').isLength({ min: 1 }).isEmail().withMessage('Enter a valid email'),
	body('password').isLength({ min: 1 }).withMessage('Enter a valid password')
], (req, res) => {
	const errors = validationResult(req)
	let errorArray = errors.array()
	User.findOne({ email: req.body.email }, (err, user) => {
		if(err) throw err
		console.log(req.body)
		console.log(user)
		if(user.password == req.body.password) {
			Post.find({ universalQuery: "uni-sec91" }, (err, posts) => {
				res.render('home', { title: `${user.name}'s Home`, errors: [], posts, user })
			})
		} else if(user.password != req.body.password) {
			errorArray.push({msg: "Incorrect Password."})
			res.render('login', { title: "Log In", errors: errorArray})
		}
	})
})

router.post('/new-raw', [
	body('userId').isLength({ min: 1 }).withMessage('Please signup before posting'),
	body('title').isLength({ min: 1 }).withMessage('Please enter a title'),
	body('subtitle').isLength({ min: 1 }).withMessage('Please enter a subtitle'),
	body('photo_url').isLength({ min: 1 }).withMessage('Enter a picture url')
], (req, res) => {
	const errors = validationResult(req);
	let currentUser;
	User.findOne({ _id: req.body.userId }, (err, user) => {
		if (err) throw err;
		currentUser = user;
		console.log(req.body)
		console.log(currentUser)
		if(errors.isEmpty()) {
			const post = new Post({
				universalQuery: "uni-sec91",
				title: req.body.title,
				body: req.body.subtitle,
				date: String(new Date()),
				photo: req.body.photo_url,
				tags: ["new", "post"],
				_author: currentUser,
				_authorName: currentUser.username
			});
			post.save().then((err, currentPost) => {
				// FIXME: Fix user object posts array (route: /new-raw)
				User.findOneAndUpdate({ _id: req.body.userId }, { $push: { posts:  currentPost }}, (err, success) => {
					if(err) throw err;
				})
				Post.find({ universalQuery: "uni-sec91" }, (err, posts) => {
					res.send(posts)
				})
			})
		} else {
			res.send({ errors: errors.array() })
		}
	})
})

router.post('/new', postUpload.single('photo'),(req, res) => {
	let currentUser;
	User.findOne({ _id: req.body.userId }, (err, user) => {
		if (err) throw err;
		currentUser = user;
		if(req.file) {
			const post = new Post({
				universalQuery: "uni-sec91",
				title: req.body.title,
				body: req.body.subtitle,
				date: String(new Date()),
				photo: "/images/posts/"+req.file.filename,
				tags: ["new", "post"],
				_author: currentUser,
				_authorName: currentUser.name
			});
			post.save().then((err, currentPost) => {
				// FIXME: Fix the posts array in user object (route: new)
				User.findOneAndUpdate({ _id: req.body.userId }, { $push: { posts:  currentPost }}, (err, success) => {
					if(err) throw err;
				})
				Post.find({ universalQuery: "uni-sec91" }, (err, posts) => {
					res.render('home', { title: `${currentUser.name}'s Home`, errors: [], posts })
				})
			})
		} else {
			let errorArray = errors.array()
			errorArray.push({msg: "Picture Require For Post"})
			res.render('new-post', { title: 'New Post', errors: errorArray, data: req.body });
		}
	})
})

router.post('/home',[
	body('bio').isLength({ max: 200 }).withMessage("Bio can't be more than 200 characters"),
	body('registerId').isLength({ min: 1 }).withMessage("Unknown Error: Please Try Again Later"),
	body('username').isLength({ min: 1 }).withMessage("Username is required")
], (req, res) => {
	const errors = validationResult(req);
	if(errors.isEmpty()) {
		const registerId = req.body.registerId
		let registeredUser;
		Registration.findOne({ _id: registerId }, (err, user) => {
			if(err) throw err;
			registeredUser = user
			console.log("Origin: ")
			console.log(user)
			console.log("Register: ")
			console.log(registeredUser)
			let bio = req.body.bio.length == 0 ? "Hello! I'm a new user!" : req.body.bio;
			console.log("Register Check: ")
			console.log(registeredUser)
			const currentUser = new User({
				name: registeredUser.name,
				photo: "https://idyllwildarts.org/wp-content/uploads/2016/09/blank-profile-picture.jpg",
				email: registeredUser.email,
				bio: bio,
				username: req.body.username,
				password: registeredUser.password,
				registerId: registerId
			})
			currentUser.save((err, user) => {
				if (err) throw err;
				console.log(user)
				Post.find({ universalQuery: "uni-sec91" }, (err, posts) => {
					if(err) throw err;
					res.render('home', { title: "Home", posts })
				})
			})
		})
	} else {
		console.log(errors.array())
		res.render('finish', { title: "Almost Done!", errorMsgs: errors.array(), data: req.body})
	}
})

router.get('/tos', (req, res) => {
	res.render('tos', { title: "Terms Of Service" });
})

router.get('/user/id/:userId', protectCid, (req, res) => {
	const userId = req.params.userId
	User.findOne({ _id: userId }, (err, user) => {
		if (err) res.send("User Not Found");
		res.send(user);
	})
})

router.get('/login', (req, res) => {
	res.render('login', { title: "Log In" })
})

router.get('/user/username/:userName', protectCid, (req, res) => {
	const userName = req.params.userName
	User.findOne({ username: userName }, (err, user) => {
		if (err) res.send("User Not Found");
		res.send(user);
	})
})

router.get('/user/profile/:userId', (req, res) => {
	const userId = req.params.userId;
	User.findOne({ _id: userId }, (err, user) => {
		if(err) throw err;
		// TODO: Finish the profile page in user-profile.pug
		res.render('user-profile', { title: `${user.name} Profile`, user });
	})
})

router.get('/user/registerId/:registerId', protectCid, (req, res) => {
	const registerId = req.params.registerId;
	User.findOne({ registerId: registerId }, (err, user) => {
		if (err) throw err;
		res.json(user)
	})
})

router.post('/',[
	body('name').isLength({ min: 1 }).withMessage('Please enter a name'),
	body('email').isLength({ min: 1 }).isEmail().withMessage('Please enter a valid email'),
	body('password').isLength({ min: 1 }).withMessage('Please enter a password')
], (req, res) => {
	const errors = validationResult(req);
	if(errors.isEmpty()) {
		const registration = new Registration(req.body);
		registration.save().then((err, registration) => {
			if(registration) {
				res.render('finish', { title: "Almost Done!", errorMsgs: [], data: {registerId: registration._id}});
			} else {
				if(err.errmsg.startsWith("E11000")) {
					res.render('form', { title: "Sign Up", errors: [{msg: "Email already exists"}], data: req.body });
				} else {
					res.render('finish', { title: "Failed", errorMsgs: ["Internal Server Error! Exit Immediately"]})
				}
			}
		})
	} else {
		res.render('form', {
			title: "Sign Up",
			errors: errors.array(),
			data: req.body,
		});
	}
})

function protectCid(req, res, next) {
	if (req.headers.authid == "_ax791") {
		next();
	} else {
		res.sendStatus(401);
	}
}

function addslashes(str) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

module.exports = router;
