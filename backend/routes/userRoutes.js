const router = require('express').Router()

router.post('/signup', (req, res) => {
    res.send('Signed up successfully')
})

module.exports = router