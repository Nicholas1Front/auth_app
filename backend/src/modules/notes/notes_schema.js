const {z} = require('zod');

const optionalToNull = (schema) => schema.optional().transform(value => value ?? null);

const createNoteSchema = z.object({
    title : optionalToNull(z.string().optional()),
    content : z.string(),
    date_reference : optionalToNull(z.coerce.date().optional()),
})

const updateNoteSchema = z.object({
    title : optionalToNull(z.string().optional()),
    content : optionalToNull(z.string().optional()),
    date_reference : optionalToNull(z.coerce.date().optional()),
}).refine(
    data => Object.values(data).some(value => value !== undefined),
        {message: "At least one field must be provided for update"}
)

const findUserNotesSchema = z.object({
    includedDeleted : optionalToNull(z.boolean().optional()),
    title : optionalToNull(z.string().optional()),
    date_reference_start : optionalToNull(z.coerce.date().optional()),
    date_reference_end : optionalToNull(z.coerce.date().optional()),
}).refine(
    data => Object.values(data).some(value => value !== undefined),
        {message: "At least one field must be provided for update"}
)

module.exports = {
    createNoteSchema,
    updateNoteSchema,
    findUserNotesSchema
}