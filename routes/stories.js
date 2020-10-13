const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Story = require('../models/Story')

// @desc  show all public stories
// @route GET /stories

router.get('/', ensureAuth, async(req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

        // console.log(stories);
        res.render('stories/index', { stories })
    } catch (err) {
        console.error(err);
    }
})

// @desc  show add page
// @route GET /stories/add

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

// @desc  add stories
// @route POST /stories/add

router.post('/', ensureAuth, async(req, res) => {

    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }

})

module.exports = router