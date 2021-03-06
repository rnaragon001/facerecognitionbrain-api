const handleSignin = (db, bcrypt) => (req, res)=> {
    const { email, password } = req.body;

    if (!email || !password) {
        return (res.status(400).json('incorrect form submission'));
    }
    // res.json('signin')
    // // Load hash from your password DB.
    // bcrypt.compare("apples", '$2a$10$A9aP584n2FUPU2x6WwSzJ.4PSDE.f1e1c8jyprrjG4ipjdvXPKjCa', function(err, res) {
    //     // res == true
    //     console.log('first guess', res);
    // });
    // bcrypt.compare("veggies", '$2a$10$A9aP584n2FUPU2x6WwSzJ.4PSDE.f1e1c8jyprrjG4ipjdvXPKjCa', function(err, res) {
    //     // res = false
    //     console.log('second guess', res);
    // });



    // if (req.body.email === database.users[0].email &&
    //     req.body.password === database.users[0].password) {
    //         // res.json('success');
    //         res.json(database.users[0]);
    //     } else {
    //         res.status(400).json('error logging in');
    //     }
    
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('login failed'))


}

module.exports = {
    handleSignin: handleSignin
}