const router = require('express').Router();

const knex = require('knex')

const knexConfig = {
  client: 'sqlite3', // the npm module we installed
  useNullAsDefault: true, //Needed when working with sqlite
  connection: {
    filename: './data/rolex.db3' //Need to create the data folder and the database file.
  }
}

const db = knex(knexConfig);

router.get('/', (req, res) => {
  // get the roles from the database
 db('roles') // returns the promise
 .then(roles => {
   res.status(200).json(roles)
 })
 .catch(error => {
   res.status(500).json(error)
 })
});

router.get('/:id', (req, res) => {
  // retrieve a role by id
  db('roles')
  .where({ id: req.params.id })
  .first() // Grabs the first element of the returned array
  .then(role => {
    if(role) {
      res.status(200).json(role)
    } else {
      res.status(404).json({ message: 'Role not found!' })
    } 
  })
  .catch(error => {
    res.status(500).json(error)
  })
});

router.post('/', async (req, res) => {
  // add a role to the database
 try {
   const [id] = await db('roles').insert(req.body);
   const role = await db('roles')
   .where({ id })
   .first()
   res.status(201).json(role)
 } catch (error) {
 res.status(500).json(error)
 }
});

router.put('/:id', (req, res) => {
  // update roles
  db('roles')
  .where({ id: req.params.id })
  .update(req.body)
  .then(count => {
    if (count > 0) {
      db('roles')
      .where({ id: req.params.id })
      .first()
      .then(role => {
        res.status(200).json(role)
      })
    } else {
      res.status(404).json({ message: 'Role not found!'})
    }
  })
  .catch(error => {
    res.status(500).json(error)
  })
});

router.delete('/:id', (req, res) => {
  // remove roles (inactivate the role)
  db('roles')
  .where({ id: req.params.id })
  .del()
  .then(count => {
    if (count > 0) {
      db('roles')
      .where({ id: req.params.id })
      .first()
      .then(role => {
        res.status(200).json(role)
      })
    } else {
      res.status(404).json({ message: 'Role not found!'})
    }
  })
  .catch(error => {
    res.status(500).json(error)
  })
});


//Another way to write the .delete post
/*
router.delete('/:id', (req, res) => {
  db('roles')
  .where({ id: req.params.id })
  .del()
  .then(count => {
  if (count > 0) {
    res.status(204).end()
  } else {
    res.status(404).json({ message: 'Role not found!' })
  }
  })
  .catch(error => {
    res.status(500).json(error);
  })
});
*/


// Delete everything oin the database
/*
router.delete('/', (req, res) => {
  db('roles')
  .truncate()
  .then(count => res.status(204).end())
})
*/


module.exports = router;
