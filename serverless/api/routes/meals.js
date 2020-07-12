const express = require('express');
const Meals = require('../models/Meals');

const router = express.Router();


router.get('/', (req, res) => {
   console.log('Esto es un plato')
   Meals.find().exec().then(x => res.status(200).send(x))
 })
 router.get('/:id', (req, res) => {
    Meals.findById(req.params.id)
      .exec()
      .then(x => res.status(200).send(x));

 });

 router.post('/', (req, res) => {
    console.log(req.body)
    Meals.create(req.body).then(x => res.status(201).send(x))
 });
 
 router.put('/:id', (req, res) => {
    Meals.findByIdAndUpdate(req.params.id, req.body)
      .then(
         () => res.sendStatus(204)
      )
 });

 router.delete('/:id', (req, res) => {
    Meals.findOneAndDelete(req.params.id).exec().then(
         x => res.sendStatus(204)
      )
 });
 
 module.exports = router;