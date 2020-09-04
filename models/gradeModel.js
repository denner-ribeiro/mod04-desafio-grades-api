import mongoose from 'mongoose';

const gradeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
    //Valida se a nota inserida e' menor que zero
    validate(value) {
      if (value < 0) throw new Error('Valor negativo para nota');
    },
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

// método para converter _id para o id que será reconhecido pelo frontend
// com esse método eu altero a estrutura do objeto, mudando _id para id
gradeSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();

  object.id = _id;

  return object;
});

const gradeModel = mongoose.model('grade', gradeSchema);

export { gradeModel };
