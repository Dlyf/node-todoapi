const bcrypt = require('bcryptjs');

var password = 'abc123';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    }); 
});

var hashedPassword = '$2a$10$k3y405tFOexjfrd57iQcdO.xBJlA9RvjOJj6J87dF7zCw/12MDChS'
bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
    
})