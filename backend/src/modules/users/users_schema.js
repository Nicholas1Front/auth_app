const {z} = require('zod');

const findUserSchema = z.object({
    id : z.coerce.number().positive().int().optional(),
    email : z.string().email().optional(),
    name : z.string().optional()
}).refine(
    data => Object.keys(data).length > 0,
    {message: "At least one field must be provided for searching"}
)

const registerUserSchema = z.object({
    name : z.string(),
    email : z.string().email(),
    address : z.string().optional(),
    password : z.string()
}).refine(
    data => Object.keys(data).length > 0,
    {message: "At least one field must be provided for registration"}
)

const updateUserSchema = z.object({
    name : z.string().optional(),
    email : z.string().email().optional(),
    password : z.string().optional(),
    address : z.string().optional()
}).refine(
    data => Object.keys(data).length > 0,
    {message: "At least one field must be provided for update"}
)

module.exports = {
    findUserSchema,
    registerUserSchema,
    updateUserSchema
}