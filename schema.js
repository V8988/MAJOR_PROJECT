const joi = require("joi");
// const review = require("./models/review");

const Listingschema = joi.object({
    title:joi.string().required(),
    description:joi.string().required(),
    image:joi.string().allow("",null),
    price:joi.number().required().min(100),
    location:joi.string().required(),
    country:joi.string().required()
});

const ReviewSchema = joi.object({
    rating:joi.number().required().min(1).max(5),
    comment:joi.string().required(),
});

module.exports = { Listingschema , ReviewSchema };